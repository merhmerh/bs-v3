import { jsonError } from "$fn/helper.server.js";
import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	const body = await request.json();

	const { id, type, limit } = body;

	if (!id) {
		return jsonError(400, "id of user or company is required");
	}

	let eqField = "user_id";
	if (type == "company") {
		eqField = "company_id";
	}

	const query = supabase
		.from("posts_combined_view")
		.select("*", { count: "exact" })
		.order("created_at", { ascending: false })
		.eq(eqField, id);

	if (limit) {
		query.limit(limit);
	}

	const { count, data, error } = await query;

	if (error) {
		return jsonError(400, error);
	}
	console.log(count, data);
	return json({ posts: data, count });
}
