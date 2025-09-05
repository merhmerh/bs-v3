<script>
import { page } from "$app/state";
import { titleCase } from "$fn/helper.js";
import { match, minimatch } from "minimatch";

const fallback = {
	image: "https://db.builtsearch.com/storage/v1/object/public/static/og-main.png",
};
const pageMap = {
	posts: {
		match: "/posts",
		title: (data, page) => {
			if (page.url.searchParams.has("q")) {
				const query = page.url.searchParams.get("q");
				return `${query} • Posts`;
			}
			return "Posts";
		},
		description: "Discover posts from the built community.",
		image: fallback.image,
	},
	post: {
		match: "/post/**",
		title: (data) => {
			const title = data?.postData?.title || "";
			return title;
		},
		description: (data) => {
			const description = data?.postData?.description || "";
			if (!description) return "Discover posts from the built community.";
			return description.length > 160
				? description.replace(/\n/g, " ").slice(0, 160).split(" ").slice(0, -1).join(" ") + " ..."
				: description.replace(/\n/g, " ");
		},
		image: (data) => {
			const media = data?.postData?.media || "";
			if (!media) return "";

			const id = media[0].id;
			const type = media[0].type;
			const { pid, user_id } = data.postData;
			const base_url = "https://db.builtsearch.com/storage/v1/object/public/posts";
			if (type == "video") {
				return media[0]?.url || `${base_url}/${user_id}/${pid}/${id}.mp4`;
			}
			return media[0]?.url || `${base_url}/${user_id}/${pid}/${id}-opt.webp`;
		},
	},
	profile: {
		route_id: "/(main)/@[handle]",
		title: (data) => {
			if (data.type == "company") {
				return data?.profileData?.display_name || "";
			}
			return data?.profileData?.display_name || "";
		},
		description: (data) => {
			let description = "";
			if (data.type == "company") {
				description =
					data?.profileData?.description ||
					"Explore the company's work, services, and projects in one place.";
			} else {
				description =
					data?.profileData?.description ||
					"Explore my portfolio to see what I bring to the table.";
			}
			if (description.length > 160) {
				description =
					description
						.replace(/\n/g, " ")
						.replace(/\s\s+/, " ")
						.slice(0, 160)
						.split(" ")
						.slice(0, -1)
						.join(" ") + " ...";
			}
			return description;
		},
		image: (data) => {
			const avatar = data?.profileData?.avatar || fallback.image;
			return avatar;
		},
	},
	people: {
		match: ["/people", "/meet-people"],
		title: "People",
		description: "Discover and connect with people in the built community.",
	},
	company: {
		match: ["/discover-company", "/company"],
		title: "Company",
		description: "Discover and connect with companies in the built community.",
	},
	settings: {
		match: "/settings{,/**}",
		title: "Settings",
		description: "Manage your account settings.",
	},
	dashboard: {
		match: "/dashboard/**",
		title: "Dashboard",
		description: "Manage your content",
	},
};

let metadata = $derived.by(() => {
	return getMetaData(page);
});

function evalValue(value, data) {
	if (typeof value === "function") {
		return value(data, page);
	}
	return value;
}

function getMetaData(page) {
	const path = page.url.pathname;
	const data = page.data;

	const matchedPage = Object.values(pageMap).find((p) => {
		if (p.match) {
			if (Array.isArray(p.match)) {
				return p.match.some((m) => minimatch(path, m));
			}
			return minimatch(path, p.match);
		}
		if (p.route_id) {
			if (Array.isArray(p.route_id)) {
				return p.route_id.some((r) => match(r, path));
			}
			return page.route.id === p.route_id;
		}
	});

	if (!matchedPage) {
		return {
			title: "BuiltSearch",
			description:
				"BuiltSearch is a search engine for developers to find resources, tools, and libraries.",
			image: fallback.image,
		};
	}

	const title = titleCase(evalValue(matchedPage.title, data), { toSpace: false });

	const description = evalValue(matchedPage.description, data);

	const { image, video } = (() => {
		const media = evalValue(matchedPage.image, data) || fallback.image;

		return media.endsWith(".mp4") ? { video: media } : { image: media };
	})();

	return {
		title: title + " • BuiltSearch",
		description: description,
		image: image,
		video: video,
	};
}
</script>

<meta name="robots" content="index, follow" />

<title>{metadata.title}</title>
<meta property="og:title" content={metadata.title} />
<meta name="twitter:title" content={metadata.title} />

<meta name="description" content={metadata.description} />
<meta property="og:description" content={metadata.description} />
<meta name="twitter:description" content={metadata.description} />

{#if metadata.video}
	<meta property="og:video" content={metadata.video} />
	<meta name="twitter:player" content={metadata.video} />
{:else}
	<meta property="og:image" content={metadata.image} />
	<meta name="twitter:image" content={metadata.image} />
	<meta name="twitter:card" content="summary_large_image" />
{/if}

<meta property="og:type" content="website" />
<meta property="og:url" content={page.url.href} />
<meta property="og:site_name" content="BuiltSearch" />
