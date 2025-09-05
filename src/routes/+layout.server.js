import { supabase } from "$fn/supabase.server.js";

export async function load({ locals: { getUser }, cookies }) {
	const { user } = await getUser();

	return {
		user,
		userData: await getUserData(user),
		cookies: cookies.getAll(),
	};
}

async function getUserData(user) {
	if (!user) return null;
	const { data } = await supabase.from("users").select("*").eq("user_id", user.id).single();
	return data;
}
