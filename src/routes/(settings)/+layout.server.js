import { supabase } from "$fn/supabase.server.js";
import { redirect, error } from "@sveltejs/kit";

export async function load({ locals: { getSession } }) {
	const { user } = await getSession();
	if (!user) {
		return redirect("307", "/signin");
	}

	const { data: userData, error: err } = await supabase
		.from("users")
		.select(`*`)
		.eq("user_id", user.id)
		.single();

	if (err) {
		return error(400, "Unable to fetch user data");
	}

	return { userData };
}
