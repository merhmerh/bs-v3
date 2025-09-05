import { jsonError } from "$fn/helper.server.js";
import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals: { getSession } }) {
	const { user } = await getSession();
	if (!user) {
		return jsonError(401, "Unauthorized");
	}

	const { type, value } = await request.json();
	if (!type || !value) return jsonError(400, "Invalid request");

	if (type === "display_name") {
		const { display_name, error } = validateDisplayName(value);
		if (error) return jsonError(400, error);

		const { error: updateError } = await supabase
			.from("users")
			.update({ display_name })
			.eq("user_id", user.id);

		if (updateError) return jsonError(400, updateError);
		return json({ success: "OK", display_name });
	}

	if (type === "username") {
		const { username, error } = await validateUsername(value);
		if (error) return jsonError(400, error);

		const { error: updateError } = await supabase
			.from("users")
			.update({ username })
			.eq("user_id", user.id);

		if (updateError) return jsonError(400, updateError);
		return json({ success: "OK", username });
	}

	return jsonError(400, "Invalid field type specified");
}

function validateDisplayName(display_name) {
	display_name = display_name.trim();
	const regex = /^[a-zA-Z\s]{3,30}$/;
	if (regex.test(display_name)) {
		return { display_name, error: null };
	}

	return {
		display_name,
		error: "Display name must be between 3 and 20 characters long and contain only letters and spaces",
	};
}

async function validateUsername(username) {
	username = username.trim();
	const regex = /^[a-zA-Z0-9-_]{4,24}$/;
	if (!regex.test(username)) {
		return {
			username,
			error: "Username must be between 4 and 16 characters long and contain only letters, numbers, underscores, and dashes",
		};
	}

	//check if exists
	const { count } = await supabase
		.from("unique_handles")
		.select("*", { count: "exact" })
		.eq("handle", username);

	if (count > 0) {
		return {
			username,
			error: "Username is already taken",
		};
	}

	return { username, error: null };
}
