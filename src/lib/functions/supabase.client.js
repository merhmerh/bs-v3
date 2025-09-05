import { page } from "$app/state";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";

export async function signOut() {
	const { supabase } = page.data;

	const { error } = await supabase.auth.signOut({ scope: "global" });
	if (!error) {
		location.reload();
	} else {
		document.cookie.split(";").forEach((cookie) => {
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
			if (name.startsWith("sb-db-auth-token")) {
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
			}
		});
		location.reload();
	}
}

export async function uploadFile(file, storage, path) {
	const { user, supabase } = page.data;

	const { data, error } = await supabase.storage.from(storage).upload(`${path}`, file);

	if (error) {
		console.log(">>>", error);
		throw new Error(error.message);
	}

	return true;
}

export function getStoragePublicUrl(path) {
	return PUBLIC_SUPABASE_URL + `/storage/v1/object/public/` + path;
}
