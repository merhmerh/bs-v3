import { supabase } from "$fn/supabase.server.js";
import { jsonError } from "$fn/helper.server.js";
import { json } from "@sveltejs/kit";

export async function GET({ request }) {
	const url = new URL(request.url);
	const params = url.searchParams;
	const countryValues = params.get("country") ? params.get("country").split(",") : null;
	const industryValues = params.get("industry") ? params.get("industry").split(",") : null;
	const skillsValues = params.get("skills") ? params.get("skills").split(",") : null;
	const professionValues = params.get("profession") ? params.get("profession").split(",") : null;
	const q = params.get("q");
	const limit = params.get("limit") ? parseInt(params.get("limit")) : 36;
	const page = params.get("page") ? parseInt(params.get("page")) : 1;

	try {
		let query = supabase
			.from("users")
			.select(`*, profile:user_profiles(*)`, { count: "exact" }) // Include count
			.not("profile", "is", null);

		if (q) {
			query = query.ilike("profile.fts", `%${q}%`);
		}

		if (countryValues) {
			query = query.in("profile.country", countryValues);
		}

		if (industryValues) {
			query = query.contains("profile.industry", industryValues);
		}

		if (skillsValues) {
			query = query.contains("profile.skills", skillsValues);
		}

		if (professionValues) {
			if (
				professionValues.includes("student") &&
				professionValues.includes("working professional")
			) {
				// do nothing, return all users
			} else if (professionValues.includes("student")) {
				query = query.eq("profile.is_student", true);
			} else if (professionValues.includes("working professional")) {
				query = query.or([
					{ "profile.is_student": { eq: false } },
					{ "profile.is_student": { is: null } },
				]);
			}
		}

		const {
			data: users,
			error,
			count,
		} = await query.range((page - 1) * limit, page * limit - 1);

		if (error) {
			throw new Error(error.message);
		}

		const totalPages = Math.ceil(count / limit);

		return json({
			users,
			pagination: {
				total: count,
				pages: totalPages,
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		return jsonError(400, { error: error.message });
	}
}
