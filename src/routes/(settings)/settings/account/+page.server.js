import { supabase } from "$fn/supabase.server.js";

export async function load({ parent }) {
	const { user } = await parent();

	const { data: hasPassword, err: hasErr } = await supabase.rpc("user_has_password", {
		user_id: user.id,
	});

	return { user, hasPassword };
}
