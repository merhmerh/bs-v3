import { page } from "$app/state";
import { PUBLIC_BUILTSEARCH_API } from "$env/static/public";
import { hc } from "hono/client";

export async function updateClient(token) {
	//verify token is valid
	const supabase = page.data.supabase;
	if (!token) return;
	const {
		data: { user },
	} = await supabase.auth.getUser(token);
	if (!user) return location.reload();

	hono = hc(PUBLIC_BUILTSEARCH_API, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export let hono = hc(PUBLIC_BUILTSEARCH_API, {
	headers: {},
});
