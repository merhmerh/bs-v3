import { json } from "@sveltejs/kit";
import { getPost, getQueryPosts } from "./getPosts.js";

export async function POST({ request, locals: { getSession } }) {
	const { user } = await getSession("/api/posts");

	const body = await request.json();

	const { query, offset, limit } = body;

	if (query) {
		const posts = await getQueryPosts(query, offset, limit);
		return json({ posts });
	}

	const posts = await getPost(offset, limit, user);
	return json({ posts });
}
