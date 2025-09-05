<script>
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

let { showType = false, contain, cover, src, data, width, height } = $props();
let image_src = $state(src);
let type = $state("");
onMount(async () => {
	await setSrc();
});

function getContentFromData(data) {
	/* If data is like a post with media */
	if (data?.media) {
		return data.media[0];
	}

	/* If data is an array of media */
	if (Array.isArray(data)) {
		return data[0];
	}

	/* If data is a single media */
	if (data?.id && data?.type) {
		return data;
	}
}

async function setSrc() {
	let content = getContentFromData(data);

	if (content.src) {
		type = content.type;
		if (type == "image") {
			image_src = content.src;
		}
		if (type == "video") {
			image_src = URL.createObjectURL(content.thumbnail);
		}

		return;
	}

	if (content.type == "image") {
		type = "image";
		const img = content;
		image_src = img.url;
		resize(image_src);
		return;
	}

	if (content.type == "video") {
		type = "video";
		image_src = content.thumbnail;
		resize(image_src);
		return;
	}

	if (content.type == "youtube" || content.type == "shorts") {
		type = "youtube";
		image_src = `https://img.youtube.com/vi/${content.youtube_id}/0.jpg`;
		return;
	}

	function resize(url) {
		if (width || height) {
			const opt = {};
			if (width) opt.width = width;
			if (height) opt.height = height;
			if (url.startsWith("https://cdn.builtsearch.com")) {
				let opt_string = Object.entries(opt)
					.map(([key, value]) => `${key}=${value}`)
					.join(",");

				const path = url.split("https://cdn.builtsearch.com/").pop();
				image_src = `https://cdn.builtsearch.com/cdn-cgi/image/${opt_string}/${path}`;
			}
		}
	}
}
</script>

<div class="img-container">
	<img
		src={image_src}
		class={type}
		class:contain
		class:cover
		alt="thumbnail"
		onerror={(e) => {
			e.target.src = getContentFromData(data).url;
		}} />
	{#if type == "video"}
		<div class="video-bg">
			<img src={image_src} alt="" />
		</div>
	{/if}
	{#if showType}
		<div class="type-icon">
			{#if type == "image"}
				<Icon icon="lucide:image" width="16" />
			{:else if type == "video"}
				<Icon icon="lucide:circle-play" width="16" />
			{:else if type == "youtube" || type == "shorts"}
				<Icon icon="lucide:youtube" width="16" />
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
.img-container {
	width: 100%;
	height: 100%;
	position: relative;
	img {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 1;
		&.contain {
			object-fit: contain;
		}
		&.video {
			object-fit: contain;
		}
		&.youtube {
			object-fit: cover;
		}
	}
	.video-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 0;
		overflow: hidden;
		img {
			object-fit: cover;
			transform: scale(1.5);
			filter: brightness(0.35);
		}
	}
	.type-icon {
		position: absolute;
		bottom: 0.375rem;
		left: 0.375rem;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.25rem;
		border-radius: 0.25rem;
		background-color: color-mix(in srgb, white, 25% transparent);
		color: #344856;
	}
}
</style>
