import { redirect } from "@sveltejs/kit";

export async function load({ url, parent }) {
	const { user } = await parent();

	if (user && url.searchParams.has("redirect")) {
		const redirectURl = url.searchParams.get("redirect");
		console.log(redirectURl);
		return redirect(307, redirectURl);
	}

	return {};
}
