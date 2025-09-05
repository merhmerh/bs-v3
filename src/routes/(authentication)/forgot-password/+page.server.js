import { redirect } from "@sveltejs/kit";

export async function load({ locals: { getSession } }) {
	const { user } = await getSession();

	if (user) {
		redirect(307, "/");
	}
}
