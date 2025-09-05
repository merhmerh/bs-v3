import { redirect } from "@sveltejs/kit";

export async function load({ locals: { getSession } }) {
	const { user } = await getSession();
	if (user) {
		return redirect(307, "/dashboard");
	}
}
