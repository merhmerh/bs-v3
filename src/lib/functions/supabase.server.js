import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SECRET_KEY } from "$env/static/private";

export const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
});

export async function getUserRoleAndPermissions(org_id, user_id, member_id) {
	const query = supabase
		.schema("enterprise")
		.from("members")
		.select("user_id, role:roles!inner(role_name,role_key,permissions)")
		.eq("org_id", org_id);

	if (!user_id && !member_id) {
		throw new Error("Either user_id or member_id must be provided");
	}

	if (user_id) {
		query.eq("user_id", user_id);
	}

	if (member_id) {
		query.eq("id", member_id);
	}

	const { data, error } = await query.single();

	if (!data || error) {
		return null;
	}

	return data.role;
}
