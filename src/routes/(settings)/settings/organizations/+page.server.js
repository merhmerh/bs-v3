import { supabase } from "$fn/supabase.server.js";

export async function load({ depends, locals: { getSession } }) {
	depends("settings:orgs");
	const { user } = await getSession();
	const { data: db_data, error } = await supabase
		.from("org_members")
		.select("*, org:organizations!inner(*)")
		.eq("user_id", user.id)
		.order("org(name)", { ascending: true });
	//transform data
	const orgs = [];
	for (const item of db_data) {
		if (item.status === "rejected") continue;
		const org = { ...item.org, accepted: item.accepted };
		orgs.push(org);
	}

	return { orgs: orgs };
}
