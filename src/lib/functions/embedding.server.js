import { openai } from "./openai.server.js";

export function formatPostsEmbeddingData(data) {
	const fields = ["title", "description", "tags", "category", "country"];
	const inputStringArr = [];

	for (const key of fields) {
		const value = data[key];
		if (!value) continue;

		let formattedValue = value;
		if (Array.isArray(value)) {
			formattedValue = value.join(", ");
		} else {
			formattedValue = value
				.replace(/\n|\r+/g, " ")
				.replace(/\s+/g, " ")
				.replace(/([.!?])(\S)/g, "$1 $2")
				.trim();
		}

		inputStringArr.push(`${key.toUpperCase()}: ${formattedValue}`);
	}

	const inputString = inputStringArr.join(" || ");
	return inputString;
}

export async function createEmbedding(input) {
	try {
		const embedding = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: input,
			encoding_format: "float",
		});
		return embedding.data[0].embedding;
	} catch (error) {
		console.log(error);
		return {
			error: error.message,
		};
	}
}
