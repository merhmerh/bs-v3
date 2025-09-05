<script>
import Divider from "$common/Divider.svelte";
import Icon from "@iconify/svelte";
import { flip } from "svelte/animate";
import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
import { fade, fly } from "svelte/transition";
import { cubicIn } from "svelte/easing";
import { debounce, genId } from "$fn/helper.js";
import { convertBlobToBase64, generateVideoThumbnail } from "$fn/helper.client.js";
import Image from "$common/Image.svelte";

/**
 * @typedef {Object} Props
 * @property {any} [media]
 * @property {any} [postData]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let {
	media = $bindable([]),
	postData = null,
	children,
	required = false,
	onchange = () => {},
} = $props();

let flipDurationMs = 200;
let dropShadowCount = $state(0);
let mediaFocus = $state();
let actionMessage = $state("");

const killActionMessage = debounce(() => {
	if (!actionMessage) return;
	setTimeout(() => {
		actionMessage = "";
	}, 1500);
});

async function browseFile() {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*,video/*";
	input.multiple = true;
	input.onchange = async (e) => {
		const files = e.target.files;

		const normalizedItems = Array.from(files).map((file) => ({
			kind: "file",
			type: file.type,
			getAsFile: () => file,
		}));
		handleFiles(normalizedItems);
	};
	input.click();
}

async function handlePaste(e) {
	if (!mediaFocus) return;
	const items = e.clipboardData.items;
	handleFiles(items);
}

async function handleDrop(e) {
	dropShadowCount = 0;
	e.preventDefault();
	// const items = e.dataTransfer.items;
	handleFiles(e.dataTransfer.items);
}

async function handleFiles(items) {
	const promises = Array.from(items).map(async (item) => {
		// console.log(`Processing item of kind: ${item.kind}, type: ${item.type}`);

		if (item.kind === "html" || item.type === "text/uri-list") {
			return;
		}

		if (item.kind === "string") {
			const str = await new Promise((resolve) => {
				item.getAsString((text) => resolve(text));
			});
			const data = parseString(str);
			if (!data) return;
			return data;
		}

		if (item.kind === "file") {
			const file = item.getAsFile();
			const type = file.type.split("/")[0];
			const base64 = await convertBlobToBase64(file);

			const data = {
				type: type,
				src: base64,
				file: file,
			};

			if (type == "video") {
				//thumbnail is base64
				const thumbnail = await generateVideoThumbnail(file);
				data.thumbnail = thumbnail;
			}
			return data;
		}
	});

	const toBeAdded = (await Promise.all(promises)).filter(Boolean);

	//check if the media is already in the list
	const toBeAddedFiltered = toBeAdded
		.filter((item) => {
			const found = media.find((m) => m.src === item.src);
			if (found) {
				actionMessage = "One or more of the media you added is already in the list.";
			}
			return !found;
		})
		.map((item) => ({ ...item, id: genId(9) }));

	media = [...media, ...toBeAddedFiltered];
	// dispatch("change", { media });
	onchange(media);

	function parseString(str) {
		str = str.trim();

		//if shorts
		// https://youtube.com/shorts/TRka_Y0tR1Y?si=ujimOsBcRJ2XAlfv
		const shorts_regex = /^(https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]+/;
		if (shorts_regex.test(str)) {
			const video_id = str.split("/").pop();
			return {
				type: "shorts",
				youtube_id: video_id,
				src: str.replace("shorts", "embed"),
				thumbnail: `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`,
			};
		}

		//if video
		const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;
		if (regex.test(str)) {
			const video_id = (() => {
				const url = new URL(str);
				if (str.includes("youtu.be")) {
					return url.pathname.replace("/", "");
				}
				return url.searchParams.get("v");
			})();

			return {
				type: "youtube",
				youtube_id: video_id,
				src: `https://www.youtube.com/watch?v=${video_id}`,
				thumbnail: `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`,
			};
		}
		actionMessage = "Unable to parse your pasted content.";
	}
}

function removeItem(id) {
	media = media.filter((m) => m.id !== id);
	// dispatch("change", { media });
	onchange(media);
}

function handleSort(e) {
	media = e.detail.items;
}

$effect.pre(() => {
	actionMessage, killActionMessage();
});

// [
// 	{ id: "ee6dxUXSXhPCANSd", type: "image" },
// 	{ id: "cTACWWiPwjJde3vV", type: "image" },
// 	{ id: "QmUyZ7fyr", type: "video" },
// 	{ id: "xHHgIirfy", type: "youtube" },
// ];
</script>

<svelte:window
	onclick={(e) => {
		if (e.target.closest(".media-container") == null) {
			mediaFocus = false;
		}
	}}
	onpaste={handlePaste} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="media-container mb-2"
	onclick={() => (mediaFocus = true)}
	class:focus={mediaFocus}
	ondragover={(e) => {
		e.preventDefault();
		dropShadowCount = 1;
	}}
	ondragleave={(e) => {
		if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
			dropShadowCount = 0;
		}
	}}
	ondragend={() => (dropShadowCount = 0)}
	ondrop={handleDrop}>
	<div class="media-header flex items-center gap-2">
		<h3 class:required>Media</h3>
		{#if actionMessage}
			<div class="message" in:fly={{ y: -5 }} out:fly={{ y: 5 }}>
				<span>{actionMessage}</span>
			</div>
		{/if}
	</div>
	{#if media.length}
		<p class="m-0">Drag and drop to reorder.</p>
	{/if}

	<div
		class="media"
		use:dndzone={{ items: media, flipDurationMs, dropTargetStyle: {} }}
		onconsider={handleSort}
		onfinalize={handleSort}>
		{#each media as obj, i (obj.id)}
			<div class="slot-container" animate:flip={{ duration: flipDurationMs }} id={obj.id}>
				<span class="order">{i == 0 ? "Main" : `${i + 1}`}</span>
				<div class="card">
					<!-- {#if obj.type == "image"} -->
					<!-- <img draggable="false" src={getSrc(obj)} alt="media" /> -->
					<Image data={obj} showType width="600" height="600" />
					<!-- {:else if obj.type == "video"}
						<video draggable="false">
							<source src={getSrc(obj)} />
							<track kind="captions" />
						</video> -->
					<!-- {:else if obj.type == "youtube" || obj.type == "shorts"}
						<img draggable="false" src={getSrc(obj)} alt="media" />
					{/if} -->

					<div class="overlay">
						<button class="none icon" onclick={() => removeItem(obj.id)}>
							<Icon icon="lucide:trash-2" />
						</button>
					</div>
				</div>
				{#if obj[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
					<div in:fade={{ duration: flipDurationMs, easing: cubicIn }} class="shadow"></div>
				{/if}
			</div>
		{/each}
		{#each Array(dropShadowCount) as _}
			<div in:fade={{ duration: 100 }} class="shadow-card"></div>
		{/each}
	</div>
	<div class="upload-message info-box">
		<span class="text-center">
			Click on this Box then drag and drop or <br /> <kbd>Ctrl</kbd>
			<kbd>V</kbd>
			to paste<br /> Images, Videos, or Youtube Links
		</span>
		<Divider text="or" --c="var(--mono)" />
		<button class="small mt-2 px-4 w-fit" onclick={browseFile}>Browse Files</button>
	</div>
</div>
{@render children?.()}

<style lang="scss">
.media-header {
	h3 {
		color: var(--text-soft);
		font-weight: 600;
		font-size: 1rem;
		&.required {
			&:after {
				margin-left: 2px;
				content: "*";
				font-weight: 400;
				color: var(--orange);
			}
		}
	}
	.message {
		margin-left: 1rem;
		--c: var(--text-light);
		color: var(--c);
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		opacity: 0.75;
		&:before {
			display: flex;
			content: "";
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background-color: var(--c);
		}
	}
}
.media-container {
	display: flex;
	flex-direction: column;
	border-radius: 1rem;
	border: 2px dashed var(--border-base);
	padding: 1rem;
	padding-top: 0.5rem;
	gap: 0.5rem;
	transition: all 0.15s;
	overflow: clip;
	&.focus {
		border-color: var(--primary);
		background-color: color-mix(in srgb, var(--accent-100) 5%, transparent);
	}
	.upload-message {
		padding-block: 1rem;
		width: fit-content;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.25rem;
		border-radius: 0.5rem;
		padding-inline: 2rem;
		margin-inline: auto;
		margin-top: 0.5rem;
		kbd {
			padding-block: 1px;
		}
	}
	p {
		font-size: 0.75rem;
		color: var(--text-light);
	}
	.media {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, minmax(250px, 1fr));
		grid-row: repeat(auto, 200px);
		gap: 1rem;
		position: relative;
		user-select: none;
	}
	.shadow-card {
		background-color: var(--bg-200);
		border: 2px dashed var(--orange);
		border-radius: 0.5rem;
		height: 200px;
		width: 100%;
	}
}

.slot-container {
	position: relative;
	border-radius: 0.5rem;

	height: 200px;
	overflow: clip;
	span.order {
		pointer-events: none;
		position: absolute;
		z-index: 2;
		top: 0.5rem;
		left: 0.5rem;
		color: var(--text-alt);
		background-color: color-mix(in srgb, #000 60%, transparent);
		font-size: 0.875rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.card {
		width: 100%;
		height: 100%;
		background-color: var(--mono-light);
		border-radius: 0.5rem;
		overflow: clip;
		position: relative;
		cursor: pointer;
		img,
		video {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		&:hover {
			.overlay {
				opacity: 1;
			}
		}
		.overlay {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			z-index: 1;
			opacity: 0;
			transition: all 0.15s;
			button {
				color: var(--red);
				background-color: color-mix(in srgb, #000 60%, transparent);
				&:hover {
					background-color: #000;
				}
			}
		}
	}
}
.shadow {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	visibility: visible;
	background-color: var(--bg-200);
	background: linear-gradient(180deg, var(--bg-200) 0%, var(--bg-300) 100%);
	border: 2px dashed var(--orange);
	border-radius: 0.5rem;
	margin: 0;
}
</style>
