import { jsonError } from "$fn/helper.server.js";
import { openai } from "$fn/openai.server.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals: { getSession } }) {
	const { user } = await getSession();
	if (!user) return jsonError(401, "Unauthorized");

	const { media } = await request.json();

	if (!media) return jsonError(400, "No images provided");

	const content = media
		.map((url) => {
			if (url.endsWith("-opt.webp")) {
				return url.replace("-opt.webp", "-600.webp");
			}
			return url;
		})
		.map((url) => ({ type: "image_url", image_url: { url } }));

	console.log(content);
	// return json({});
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4.1-mini",
			messages: [
				{
					role: "developer",
					content: [
						{
							type: "text",
							text: `Describe the following images in a SEO friendly manner within 1 paragraph. Do not start with "This image shows" or "This image depicts", just describe the image straight away. Example: A interior of a modern kitchen with a large island and stainless steel appliances.`,
						},
					],
				},
				{
					role: "user",
					content: content,
				},
			],
		});

		const message = response.choices[0].message.content;
		console.log(message);
		return json({ response: message });
	} catch (e) {
		console.log(e);
		return jsonError(400, e.message);
	}
}
