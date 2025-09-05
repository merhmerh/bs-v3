import { supabase } from "$fn/supabase.server.js";
import seedrandom from "seedrandom";
import { openai } from "$fn/openai.server.js";

const keys = [
	"id",
	"pid",
	"title",
	"description",
	"tags",
	"media",
	"category",
	"repost",
	"attribution",
	"published_as_company",
	"post_company_id",
	"created_at",
	"updated_at",
	"country",
	"ai_assisted",
	"status",
	"user_id",
	"user_username",
	"user_display_name",
	"user_avatar",
];
export async function getPost(offset, limit, user) {
	const { data: posts, error } = await supabase
		.from("posts_combined_view")
		.select(keys.join(", "))
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1)
		.not("user_id", "is", null)
		.eq("status", "public");

	if (error) {
		console.log(error);
	}

	const pids = posts.map((post) => post.id);

	if (user) {
		const { data: likes } = await supabase.rpc("check_user_likes", {
			post_ids: [pids], // replace with the actual post IDs
			arg_user_id: user.id, // replace with the actual user ID
		});

		if (likes) {
			const liked_id = likes.map((x) => x.post_key_id);
			posts.forEach((post) => {
				post.liked = liked_id.includes(post.id);
			});
		}
	}

	//shuffle post order
	const seed = posts.map((post) => post.id).join("");
	const rng = seedrandom(seed);
	const sortedPosts = posts
		.map((post) => ({ post, sort: rng() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ post }) => post);

	return sortedPosts;
}

function escapeTsQueryToken(token) {
	return token.replace(/([!&|:'*()\\])/g, "\\$1");
}

export async function getQueryPosts(query, offset, limit) {
	const embedding = await findEmbeddingElseSet(query);
	const tokens = query.trim().split(/\s+/);
	const escapedTokens = tokens.map(escapeTsQueryToken);
	const sanitizedQuery = escapedTokens.join(" & ");

	const { data: searchData, error } = await supabase.rpc("match_posts_query", {
		query_string: sanitizedQuery,
		query_embedding: embedding,
		match_threshold: 0.2,
		match_count: limit,
		match_offset: offset,
	});

	if (error) {
		console.log(">", error.message);
		return { error };
	}

	const totalCount = searchData[0]?.total_count || 0;
	const ids = searchData.map((post) => post.id);
	const { data: posts } = await supabase
		.from("posts_combined_view")
		.select(keys.join(", "))
		.not("user_id", "is", null)
		.eq("status", "public")
		.in("id", ids);

	const missing = ids.filter((id) => !posts.map((post) => post.id).includes(id));
	// console.log(posts.length);
	// console.log(posts.map((x) => x.id));
	const orderedPosts = ids.map((id) => posts.find((post) => post.id === id));

	return { posts: orderedPosts, totalCount };
}

export async function findEmbeddingElseSet(searchTerm) {
	const { data: searchCache } = await supabase.rpc("get_search_embedding", {
		search_term_value: searchTerm,
	});

	if (searchCache) {
		return searchCache.embedding;
	}

	console.log("creating new embedding for", searchTerm);
	const embedding = await getEmbedding(searchTerm);
	const { error } = await supabase.from("search_cache").insert({
		search_term: searchTerm.toLowerCase().trim(),
		embedding: embedding,
	});

	if (error) {
		console.log("Error inserting data:", error.message);
	}
	return embedding;
}

export async function getEmbedding(input) {
	const embedding = await openai.embeddings.create({
		model: "text-embedding-3-small",
		input: input,
		encoding_format: "float",
	});
	return embedding.data[0].embedding;
}
