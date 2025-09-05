import { s3 } from "$fn/cloudflare.server.js";
import { jsonError } from "$fn/helper.server.js";
import { getUserRoleAndPermissions } from "$fn/supabase.server.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { json, text } from "@sveltejs/kit";

export async function POST({ request, locals }) {
	const { user } = await locals.getSession();
	if (!user) return jsonError(401, "Unauthorized");

	const body = await request.json();

	const { type, output } = body;

	if (type == "user-avatar") {
		const { key } = body;
		const path = `c/users/${user.id}/avatar/${key}`;
		const data = await getUploadUrls(path);

		if (output == "url") {
			return text(data[0].url);
		}

		return json(data);
	}

	if (type == "enterprise-avatar") {
		const { org_id } = body;

		const userRole = await getUserRoleAndPermissions(org_id, user.id);
		if (!userRole || !userRole.permissions?.manage) {
			return json({ error: "Unauthorized" }, { status: 403 });
		}
		const path = `c/enterprise/${org_id}/avatar`;
		const data = await getUploadUrls(path);

		if (output == "url") {
			return text(data[0].url);
		}

		return json(data);
	}

	if (type == "company-avatar") {
		const { key, company_id } = body;
		const path = `c/companies/${company_id}/avatar/${key}`;
		const data = await getUploadUrls(path);

		if (output == "url") {
			return text(data[0].url);
		}

		return json(data);
	}

	if (type == "post") {
		const { post_id, key, keys } = body;

		if (key) {
			const path = `c/posts/${post_id}/${key}`;
			const data = await getUploadUrls(path);

			if (output == "url") {
				return text(data[0].url);
			}
		}

		if (keys) {
			const paths = keys.map((key) => `c/posts/${post_id}/${key}`);
			const data = await getUploadUrls(paths);
			return json(data);
		}

		return json({ error: "No key provided" });
	}
}

async function getUploadUrls(paths, subpath) {
	const Bucket = "builtsearch-public";

	if (typeof paths === "string") {
		paths = [paths];
	} else {
		paths = paths.map((path) => path.replace(/^\//g, ""));
	}

	return Promise.all(
		paths.map(async (file_path) => {
			const Key = `${subpath ? subpath + "/" : ""}${file_path}`;
			const command = new PutObjectCommand({ Bucket, Key });
			const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
			return {
				id: file_path,
				key: Key,
				url: url,
			};
		}),
	);
}
