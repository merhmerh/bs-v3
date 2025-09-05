import { AUTH_SECRET_KEY } from "$env/static/private";
import { encrypt } from "$fn/helper.node.js";
import { supabase } from "$fn/supabase.server.js";
import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";

export const config = {
	runtime: "nodejs22.x",
};

export async function load({ url, locals: { supabase: localSupabase, getSession } }) {
	const { user } = await getSession();

	const {
		data: { session },
	} = await localSupabase.auth.getSession();

	if (user) {
		if (url.searchParams.has("dir")) {
			const redirectUrl = url.searchParams.get("dir");
			const r_url = new URL(redirectUrl);

			const access_token = session.access_token;
			const refresh_token = session.refresh_token;

			const token = access_token + ":" + refresh_token;
			const encrypted = encrypt(token, AUTH_SECRET_KEY);
			const { data } = await supabase
				.from("auth_session")
				.insert({
					encrypted_token: encrypted,
					expired_at: dayjs().add(1, "hour").toISOString(),
				})
				.select()
				.single();
			r_url.searchParams.set("key", data.id);

			return redirect(307, r_url.toString());
		}

		if (url.searchParams.has("redirect")) {
			const redirectUrl = url.searchParams.get("redirect");
			return redirect(307, redirectUrl);
		}

		return redirect(307, "/");
	}

	return;
}
