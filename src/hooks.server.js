import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_BUILTSEARCH_API,
} from "$env/static/public";
import { supabase } from "$fn/supabase.server.js";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { hc } from "hono/client";

/** @type {import('@sveltejs/kit').Handle} */
async function main({ event, resolve }) {
	if (event.url.pathname.startsWith("/api/helper")) {
		if (event.request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "*",
				},
			});
		}
	}

	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, {
							...options,
							path: "/",
						});
					});
				},
			},
		},
	);

	event.locals.getSession = async (e) => {
		const { data, error } = await event.locals.supabase.auth.getClaims();

		if (error || !data) {
			return { user: null };
		}
		const user = { ...data.claims, id: data.claims.sub };
		return { user };
	};

	event.locals.getUser = async (e) => {
		const {
			data: { user },
		} = await event.locals.supabase.auth.getUser();
		return { user };
	};

	event.locals.getHono = async () => {
		const { data } = await event.locals.supabase.auth.getSession();
		const token = data.session.access_token;
		return hc(PUBLIC_BUILTSEARCH_API, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" || name === "x-supabase-api-version";
		},
	});

	deleteOldCookies(event.request, response);

	return response;
}

/** @type {import('@sveltejs/kit').Handle} */
async function authGuard({ event, resolve }) {
	const { user } = await event.locals.getSession();

	const pathname = event.url.pathname;
	const org_id = event.params.org_id;
	const errorMessage =
		"Unauthorized: You must be a user of this organization to access this page.";

	if (event.url.pathname.startsWith("/dashboard") && !user) {
		return redirect(307, "/");
	}

	if (org_id) {
		//check if user is member of org for org routes
		const { data } = await supabase
			.from("org_members")
			.select("id")
			.eq("org_id", org_id)
			.eq("user_id", user?.id)
			.eq("accepted", true)
			.single();
		if (!data) {
			return redirect(307, `/settings/organizations`);
		}
	}

	return resolve(event);
}

export const handle = sequence(main, authGuard);

function deleteOldCookies(request, response) {
	const cookieHeader = request.headers.get("cookie") || "";

	const cookies = cookieHeader
		.split(";")
		.map((c) => c.trim())
		.filter((c) => c.length > 0);

	const targetCookies = cookies
		.map((cookie) => cookie.split("=")[0])
		.filter((name) => name.startsWith("sb-db-auth-token"));

	targetCookies.forEach((name) => {
		response.headers.append(
			"set-cookie",
			`${name}=; Max-Age=0; Path=/; Domain=.builtsearch.com; SameSite=lax`,
		);
	});
}

export function handleValidationError({ issues }) {
	console.log(issues);
	if (issues) {
		return {
			error: {
				issues,
			},
		};
	}

	return {
		error: {
			message: "No thank you",
		},
	};
}
