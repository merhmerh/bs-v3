import { jsonError } from "$fn/helper.server.js";
import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";

export async function POST({ params, locals: { getSession } }) {
	const { user } = await getSession();

	if (!user) {
		return jsonError(401, "You must be logged in to like a post");
	}

	const { post_id } = params;

	const { data: postData } = await supabase
		.from("posts")
		.select("id")
		.eq("pid", post_id)
		.single();

	const { data, error } = await supabase.rpc("toggle_post_like", {
		arg_post_id: postData.id,
		arg_user_id: user.id,
	});

	if (error) {
		return jsonError(400, error);
	}

	return json({ status: "success", data });
}
