import { supabase } from "$fn/supabase.server.js";
import { json } from "@sveltejs/kit";
import { dayjs, timeout } from "$fn/helper.js";
import { CLOUDFLARE_ZONE_ID } from "$env/static/private";
import { cloudflare } from "$fn/cloudflare.server.js";
import { error } from "@sveltejs/kit";

export async function POST({ request, locals: { getSession } }) {
	const { user } = await getSession();

	const body = await request.json();
	const { reference, type } = body;

	let profile_id = null;

	if (type === "user") {
		profile_id = user.id;
	} else if (type === "company") {
		//
	} else {
		return json({ error: "Invalid type" });
	}

	const license_data = {
		user_id: user.id,
		end_date: dayjs().add(36, "month").toISOString(),
		license: "custom-domain-add-on",
		reference: reference || "",
		data: {
			profile_id: profile_id,
			type: type,
		},
	};

	//check if exists already
	const { data: exist, error: existError } = await supabase
		.from("user_license")
		.select("*")
		.eq("user_id", user.id)
		.eq("license", "custom-domain-add-on")
		.gt("end_date", dayjs().toISOString())
		.maybeSingle();

	if (exist || existError) {
		return json({ error: existError || "add-on already exist" });
	}

	const { data, error } = await supabase.from("user_license").insert(license_data);

	if (error) {
		return json({ error: error });
	}

	return json({ data: data });
}

export async function PUT({ fetch, request, locals: { getSession } }) {
	const { user } = await getSession();

	const body = await request.json();
	const { uuid, domain } = body;

	const { data: license, error: fetchError } = await supabase
		.from("user_license")
		.select("*")
		.eq("user_id", user.id)
		.eq("uuid", uuid)
		.maybeSingle();

	if (fetchError || !license) {
		return { error: fetchError || "Custom Domain license not found" };
	}

	const customHostname = await cloudflare.customHostnames.create({
		zone_id: CLOUDFLARE_ZONE_ID,
		hostname: domain,
		ssl: {
			method: "txt",
			type: "dv",
		},
	});

	console.log("------------");
	console.log(customHostname);
	console.log("------------");

	const licenseData = {
		...license.data,
		domain: domain,
		customHostnameId: customHostname.id,
		status: "initializing",
		txt_name: customHostname.ownership_verification.name,
		txt_value: customHostname.ownership_verification.value,
	};

	//save custom hostname id to db
	const { data, error } = await supabase
		.from("user_license")
		.update({
			data: licenseData,
		})
		.eq("uuid", uuid)
		.select("*")
		.single();

	if (error) {
		return json({ error: error });
	}

	return json({
		data: data.data,
	});
}

export async function GET({ url }) {
	console.log("get");
	try {
		const customHostnameId = url.searchParams.get("id");

		const customHostnameData = await cloudflare.customHostnames.get(customHostnameId, {
			zone_id: CLOUDFLARE_ZONE_ID,
		});

		const { data: license, error } = await supabase
			.from("user_license")
			.select("*")
			.eq("data->>customHostnameId", customHostnameId)
			.maybeSingle();

		let licenseData = license.data;

		if (customHostnameData.ssl.status === "pending_validation") {
			licenseData = {
				...licenseData,
				status: customHostnameData.status,
				ssl_txt_name: customHostnameData.ssl.txt_name,
				ssl_txt_value: customHostnameData.ssl.txt_value,
			};
			const { error: updateError } = await supabase
				.from("user_license")
				.update({ data: licenseData })
				.eq("uuid", license.uuid);
		}

		//update db if status is active
		if (customHostnameData.ssl.status === "active") {
			if ((!license, error)) {
				return json({ error: error || "Custom Domain license not found" });
			}

			if (!license.validated) {
				licenseData = {
					...licenseData,
					status: "active",
					validated: true,
				};

				const { error: updateError } = await supabase
					.from("user_license")
					.update({ data: licenseData })
					.eq("uuid", license.uuid);

				if (updateError) {
					console.log("Error updating license", updateError);
					return json({ error: updateError });
				}
				return json({ data: licenseData });
			}
		}

		return json({ data: licenseData });
	} catch (err) {
		console.log(err.message);
		return json({ error: err.message });
	}
}

export async function DELETE({ request, locals: { getSession } }) {
	const { user } = await getSession();
	if (!user) return json({ error: "Unauthorized" });

	const { uuid, customHostnameId } = await request.json();

	try {
		const deleteHostname = await cloudflare.customHostnames.delete(customHostnameId, {
			zone_id: CLOUDFLARE_ZONE_ID,
		});
		console.log(deleteHostname);
	} catch (err) {
		console.log(err.message);
	}

	await supabase.from("user_license").delete().eq("uuid", uuid);

	return json({});
}
