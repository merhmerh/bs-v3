import { supabase } from "$fn/supabase.server.js";

export async function load({ depends, params }) {
	depends("org:root");
	const org_id = params.org_id;

	const { data: org } = await supabase
		.from("organizations")
		.select("*")
		.eq("org_id", org_id)
		.single();

	return { org };
}
