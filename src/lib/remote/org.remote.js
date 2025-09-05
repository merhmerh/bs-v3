import { command, getRequestEvent } from "$app/server";
import { supabase } from "$fn/supabase.server.js";
import * as v from "valibot";

const OrgUserSchema = v.object({
	org_id: v.pipe(v.string(), v.uuid()),
	email: v.string(),
	role: v.object({
		role_key: v.enum(["owner", "admin", "member"]),
		role_id: v.number(),
	}),
	notes: v.nullish(v.string()),
});

const RoleUpdateSchema = v.object({
	org_id: v.pipe(v.string(), v.uuid()),
	user_id: v.pipe(v.string(), v.uuid()),
	role: v.object({
		role_id: v.number(),
	}),
	notes: v.nullish(v.string()),
});

const acceptSchema = v.object({
	org_id: v.pipe(v.string(), v.uuid()),
	to_accept: v.boolean(),
});

const RemoveUserSchema = v.object({
	org_id: v.pipe(v.string(), v.uuid()),
	id: v.number(),
});

export const remoteCreateOrg = command(v.string(), async (org_name) => {
	org_name = org_name.trim();
	const user = await getUser();

	// check how many org this user has created
	const { count } = await supabase
		.from("org_members")
		.select("id, org_roles!inner(role_key)", { count: "exact", head: true })
		.eq("user_id", user.id)
		.eq("org_roles.role_key", "owner");

	if (count >= 3) {
		return {
			error: "You can only create up to 3 organizations. Please contact our support team to request more.",
		};
	}
	const { data: org, error: orgError } = await supabase
		.from("organizations")
		.insert({
			name: org_name,
			owner_user_id: user.id,
		})
		.select()
		.single();

	console.log(org);
	if (!org || orgError) return { error: orgError.message };
	const { error: memberError } = await supabase.from("org_members").insert({
		org_id: org.org_id,
		user_id: user.id,
		email: user.email,
		role_id: 1, //owner
		accepted: true,
	});
	if (memberError) return { error: memberError.message };

	return {};
});

export const remoteInviteUser = command(OrgUserSchema, async (data) => {
	const { org_id, email, role, notes } = data;
	const { role_key, role_id } = role;

	const user = await checkRole(org_id, ["owner", "admin"]);
	if (!user) return { error: { message: "You do not have permission to invite users" } };

	//check if user have an account
	const { data: extgUser } = await supabase.from("users").select("*").eq("email", email).single();

	const memberData = {
		org_id,
		role_id: role_id,
		notes: notes || null,
		email: email,
		user_id: extgUser ? extgUser.user_id : null,
	};

	console.log(memberData);
	const { data: member, error } = await supabase.from("org_members").insert(memberData).select();

	console.log(error);
	if (error && error.message.includes("duplicate key value")) {
		return { error: { message: "User is already invited to this organization" } };
	}

	return { member };
});

export const remoteUpdateUserRole = command(RoleUpdateSchema, async (data) => {
	const { org_id, user_id, role, notes } = data;
	const { role_key, role_id } = role;
	const user = await checkRole(org_id, ["owner", "admin"]);
	if (!user) return { error: "You do not have permission to update user roles" };

	const { error } = await supabase
		.from("org_members")
		.update({
			role_id: role_id,
			notes: notes || null,
		})
		.eq("org_id", org_id)
		.eq("user_id", user_id);
	return { error };
});

export const remoteRemoveUser = command(RemoveUserSchema, async (data) => {
	const { org_id, id } = data;
	const user = await checkRole(org_id, ["owner", "admin"]);
	if (!user) return { error: "You do not have permission to remove users" };

	//check targetUserRole to prevent removing owner
	const { data: targetUser } = await supabase
		.from("org_members")
		.select("org_roles!inner(*)")
		.eq("id", id)
		.single();
	const roleKey = targetUser?.org_roles?.role_key;
	if (roleKey === "owner") return { error: "Cannot remove owner of the organization" };

	const { error } = await supabase.from("org_members").delete().eq("id", id);

	return { error };
});

export const remoteAcceptOrgInvite = command(acceptSchema, async ({ org_id, to_accept }) => {
	const user = await getUser();

	const { data, error } = await supabase
		.from("org_members")
		.update({
			user_id: user.id,
			email: user.email,
			accepted: to_accept,
			status: to_accept ? null : "rejected",
		})
		.eq("org_id", org_id)
		.or(`and(user_id.is.null,email.eq.${user.email}),user_id.eq.${user.id}`);

	console.log(data, error);
});

export const remoteDeleteOrg = command(v.pipe(v.string(), v.uuid()), async (org_id) => {
	const user = await checkRole(org_id, ["owner"]);
	if (!user) return { error: "Only the owner can perform this action" };

	//check if org have any active licenses
	const { count } = await supabase
		.from("licenses")
		.select("license_id", { count: "exact", head: true })
		.eq("org_id", org_id)
		.gte("end_date", new Date().toISOString());

	if (count > 0) {
		return {
			error: "Your organization have active licenses. Please contact support to continue.",
		};
	}

	const { error } = await supabase.from("organizations").delete().eq("org_id", org_id);

	return { error };
});

async function checkRole(org_id, allowedRoles = []) {
	if (allowedRoles.length === 0) {
		throw new Error("Allowed roles cannot be empty");
	}
	const {
		locals: { getSession },
	} = getRequestEvent();
	const { user } = await getSession();

	//get user role in org
	const { data, error } = await supabase
		.from("org_members")
		.select("user_id, org_roles!inner(*)")
		.eq("org_id", org_id)
		.eq("user_id", user.id)
		.single();

	const userRole = data?.org_roles?.role_key;

	if (allowedRoles.includes(userRole)) {
		return user;
	}

	return false;
}

async function getUser() {
	const {
		locals: { getSession },
	} = getRequestEvent();
	const { user } = await getSession();

	if (!user) throw new Error("User not logged in");
	return user;
}
