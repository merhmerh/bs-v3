import { jsonError } from "$fn/helper.server.js";
import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals: { getSession } }) {
	const { user } = await getSession();
	if (!user) return jsonError(401, "Unauthorized");

	const { publicUrl } = await request.json();

	//remove others avatar
	const { data: list } = await supabase.storage.from("users_public").list(user.id);
	const currentAvatarFileName = publicUrl.split("/").pop();
	const toBeRemoved = list
		.filter((x) => {
			if (x.name !== currentAvatarFileName && x.name.startsWith("avatar")) {
				return true;
			}
		})
		.map((x) => {
			return `${user.id}/${x.name}`;
		});

	await supabase.storage.from("users_public").remove(toBeRemoved);

	const { error: updateError } = await supabase
		.from("users")
		.update({
			avatar: publicUrl,
		})
		.eq("user_id", user.id);

	if (updateError) {
		return jsonError(400, updateError.message);
	}

	return json({ success: "OK", publicUrl: publicUrl });
}

export async function DELETE({ locals: { getSession } }) {
	const { user } = await getSession();
	if (!user) return jsonError(401, "Unauthorized");

	const path = `${user.id}/avatar`;
	const { error } = await supabase.storage.from("users_public").remove([path]);

	if (error) {
		console.log(error);
		return jsonError(error.message);
	}

	const { error: updateError } = await supabase
		.from("users")
		.update({
			avatar: null,
		})
		.eq("user_id", user.id);

	if (updateError) {
		return jsonError(400, updateError.message);
	}

	return json({ success: "OK" });
}
