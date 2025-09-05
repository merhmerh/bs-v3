export async function load({ depends, params, locals: { getHono } }) {
	depends("org:licenses");
	// const { data, error } = await supabase.from("licenses").select("*").eq("org_id", params.org_id);
	const hono = await getHono();
	const org_id = params.org_id;
	const resp = await hono.org[params.org_id].licenses.$get();
	const { data: licenses, error } = await resp.json();

	const respUsers = await hono.org[params.org_id].members.$get();
	const { data: members } = await respUsers.json();

	return { licenses: licenses, members: members };
	// console.log(data);
}
