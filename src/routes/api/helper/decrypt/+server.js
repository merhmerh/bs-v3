import { AUTH_SECRET_KEY } from "$env/static/private";
import { decrypt } from "$fn/helper.node.js";
import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";
import dayjs from "dayjs";

export const config = {
	runtime: "nodejs22.x",
};

export async function POST({ request }) {
	const { key } = await request.json();

	if (!key) {
		return jsonError(400, "Missing key");
	}

	const now = dayjs().toISOString();

	const { data, error } = await supabase
		.from("auth_session")
		.select("encrypted_token")
		.eq("id", key)
		.gt("expired_at", now)
		.single();

	if (error) {
		return jsonError(400, error.message);
	}

	if (!data) {
		return jsonError(400, "Invalid key");
	}

	const decrypted = decrypt(data.encrypted_token, AUTH_SECRET_KEY);

	if (!decrypted) {
		return jsonError(400, "Invalid key");
	}

	const [access_token, refresh_token] = decrypted.split(":");

	return json({
		access_token,
		refresh_token,
	});
}
