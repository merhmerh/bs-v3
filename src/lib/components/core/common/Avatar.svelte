<script>
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import { fade } from "svelte/transition";

/**
 * @typedef {Object} Props
 * @property {any} [src] - Source of image, url, blob or base64
 * @property {string} [fallback] - Fallback value if src is not available, this will be used to generate initial
 * @property {boolean} [rounded] - Rounded avatar
 * @property {boolean} [autoFontSize] - Automatically set font size based on width for initial only
 * @property {string} [background] - Background color for avatar, css variable can also be use
 */

/** @type {Props} */
let {
	src = null,
	fallback = null,
	autoFontSize = true,
	rounded = true,
	outlined = false,
	background = false,
} = $props();
let avatarElement = $state();

let [avatar, initial] = $derived(init(src, fallback));
let imageLoaded = $state(false);
let readyToShowPlaceholder = $state(false);
let placeholderInitialSize = $state(0);

function init(src, fallback) {
	let initial = null;
	if (fallback) {
		initial = fallback.toString().charAt(0).toUpperCase() || "?";
	}

	if (src) {
		//if src is a blob
		if (src instanceof Blob) {
			return [URL.createObjectURL(src), fallback];
		}

		if (
			src.startsWith("http") ||
			src.startsWith("/") ||
			src.startsWith("data:") ||
			src.startsWith("blob:")
		) {
			return [src, initial];
		} else {
			initial = src.toString().charAt(0).toUpperCase() || "?";
		}
	}

	return [null, initial];
}

onMount(() => {
	if (autoFontSize && avatarElement) {
		const size = avatarElement.getBoundingClientRect().width;
		const map = {
			32: "1rem",
			48: "1.5rem",
			64: "2rem",
			96: "3rem",
			128: "4rem",
			192: "6rem",
			256: "8rem",
		};

		const nearestSize = Object.keys(map).reduce((prev, curr) => {
			return Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev;
		});

		const fontSize = map[nearestSize] || "1rem";
		placeholderInitialSize = fontSize;
		avatarElement.style.setProperty("--font-size", fontSize);
	}

	setTimeout(() => {
		readyToShowPlaceholder = true;
	}, 150);
});
</script>

{#snippet placeholderIcon()}
	<div class="placeholder icon">
		<Icon icon="lucide:circle-user-round" width={placeholderInitialSize} />
	</div>
{/snippet}

<div
	class="avatar"
	class:rounded
	bind:this={avatarElement}
	class:background={background !== false}
	class:outlined
	style="--background:{background}">
	{#if avatar}
		{#if readyToShowPlaceholder && !imageLoaded}
			<div class="while-loading" out:fade>
				{#if initial}
					<div class="initial">{initial}</div>
				{:else}
					{@render placeholderIcon()}
				{/if}
			</div>
		{/if}

		<img draggable="false" src={avatar} alt="avatar" onload={() => (imageLoaded = true)} />
	{:else if initial}
		<div class="initial">{initial}</div>
	{:else}
		{@render placeholderIcon()}
	{/if}
</div>

<style lang="scss">
.avatar {
	height: var(--height, 30px);
	width: var(--height, 30px);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: clip;
	flex-shrink: 0;
	position: relative;
	--placeholder-icon-color: var(--mono-soft);
	background-color: var(--bg-100);
	position: relative;

	&.background {
		background-color: var(--background);
	}

	&.rounded {
		border-radius: 50%;
		img {
			border-radius: 50%;
		}
	}
	&.outlined {
		border: calc(var(--font-size) / 16) solid var(--primary);
		img {
			width: calc(100% - var(--font-size) / 8);
			height: calc(100% - var(--font-size) / 8);
		}
		.initial {
			border-radius: 50%;

			width: calc(100% - var(--font-size) / 8);
			height: calc(100% - var(--font-size) / 8);
		}
	}
	.placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		color: var(--placeholder-icon-color);
	}

	.initial {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--padding, 6px);
		font-size: var(--font-size, 1rem);
		font-weight: var(--font-weight, 500);
		color: var(--white);
		background-color: #65a2d4;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.while-loading {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
