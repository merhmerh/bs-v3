import { error } from "@sveltejs/kit";

export async function load({ locals: { getSession } }) {
	// const { user } = await getSession();
	// if (!user) {
	// 	return error(
	// 		401,
	// 		`
	//         You need to be signed in to update your password. If you have forgotten your password, please click forget password in the sign in page.`,
	// 	);
	// }
}
