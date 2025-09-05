import { supabase } from "$fn/supabase.server.js";

export async function load({ depends, params }) {
	depends("org:users");
	const { data } = await supabase
		.from("org_members")
		.select("*, userData:users(*)")
		.eq("org_id", params.org_id)
		.order("id", { ascending: true });

	const { data: roles } = await supabase
		.from("org_roles")
		.select("id, role_name,role_key, permissions")
		.or(`org_id.is.null,org_id.eq.${params.org_id}`)
		.order("id");

	//sort by role (owner, admin, member)
	const sorted = data
		.map((x) => {
			const role = roles.find((r) => r.id === x.role_id);
			return { ...x, org_roles: role };
		})
		.sort((a, b) => {
			const roleOrder = { owner: 1, admin: 2, member: 3 };
			return (roleOrder[a.org_roles.role_key] || 4) - (roleOrder[b.org_roles.role_key] || 4);
		});

	return { org_members: sorted || [], roles: roles || [] };
}
