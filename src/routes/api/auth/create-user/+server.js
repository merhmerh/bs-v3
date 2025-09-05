import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	const body = await request.json();

	const { email, password } = body;

	const { data, error } = await supabase.auth.admin.createUser({
		email: email,
		password: password,
		email_confirm: false,
	});

	if (error) {
		const code = error.code;

		return json({
			success: false,
			error: code.replace(/_/g, " "),
			data: error,
		});
	}

	return json({ success: true });
}
