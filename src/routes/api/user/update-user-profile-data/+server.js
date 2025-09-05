import { validateSocialUrl } from "$data/social_links.js";
import { jsonError } from "$fn/helper.server.js";
import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals: { getSession } }) {
	const { user } = await getSession();
	if (!user) {
		return jsonError(401, "Unauthorized");
	}

	//for testing: just returning the request body
	const profileData = await request.json();

	let errorData = {};

	if (profileData.bio) {
		if (profileData.bio.length > 160) {
			errorData.bio = "Cannot be longer than 160 characters";
		}
	}

	if (profileData.description) {
		if (profileData.description.length > 5000) {
			errorData.description = "Cannot be longer than 5000 characters";
		}
	}

	if (profileData.industry) {
		if (profileData.industry.length > 3) {
			errorData.industry = "You can select up to 3 industries only";
		}
		profileData.industry = profileData.industry.map((x) => x.toLowerCase());
	}

	if (profileData.job_title) {
		if (profileData.job_title.length > 3) {
			errorData.job_title = "You can select up to 3 job titles only";
		}
	}

	if (profileData.skills) {
		if (profileData.skills.length > 10) {
			errorData.skills = "You can select up to 10 skillls only";
		}
	}

	// Validate licenses array
	if (profileData.licenses) {
		if (!Array.isArray(profileData.licenses)) {
			errorData.licenses = "Licenses must be an array";
		} else {
			// Filter out licenses where both type and license fields are empty
			profileData.licenses = profileData.licenses.filter(
				(license) =>
					(license.type && license.type.trim() !== "") ||
					(license.license && license.license.trim() !== ""),
			);

			// Validate each license entry for required fields after filtering
			const invalidLicense = profileData.licenses.some(
				(license) =>
					!license.type ||
					!license.license ||
					license.type.trim() === "" ||
					license.license.trim() === "",
			);

			if (invalidLicense) {
				errorData.licenses =
					"Please provide both a qualification type and license number for each entry";
			}
		}
	}

	// Validate socials links
	if (profileData.socials) {
		const socials = profileData.socials;
		for (const [k, v] of Object.entries(socials)) {
			if (!v) continue;
			const { value, error } = validateSocialUrl(k, v);
			if (error) {
				if (!errorData.socials) {
					errorData.socials = {};
				}
				errorData.socials[k] = error;
			}
		}
		profileData.socials = Object.fromEntries(
			Object.entries(socials).filter(([_, value]) => value !== null && value !== ""),
		);
	}

	if (profileData.country) {
		profileData.country = profileData.country.toLowerCase();
	}

	//if there are more than 1 error, return the error
	if (Object.keys(errorData).length > 0) {
		return json({ error: errorData });
	}

	try {
		const { error: updateError } = await supabase
			.from("user_profiles")
			.update(profileData)
			.eq("user_id", user.id);

		if (updateError) {
			throw new Error(updateError);
		}

		return json({
			success: "OK",
		});
	} catch (e) {
		return jsonError(400, e.message);
	}
}
