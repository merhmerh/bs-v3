<script>
import { randomBetween, timeout } from "$fn/helper.js";
import { onMount } from "svelte";
import { fade } from "svelte/transition";

let {
	base,
	targetUrl,
	duration = 500,
	wrapperWidth = "100%",
	wrapperHeight = "100%",
	randomTimeout = false,
} = $props();

let baseElem = $state();
let targetElem = $state();
let isImageLoaded = $state(false);

onMount(async () => {
	const img = new Image();
	img.src = targetUrl;
	await timeout(50);

	if (img.complete || isImageLoaded) {
		duration = 0;
		if (!targetElem) return;
		targetElem.classList.add("show");
		targetElem.classList.remove("transition");
		createTargetElement();
		isImageLoaded = true;
		return;
	}

	img.onload = async () => {
		createTargetElement();
		duration = 500;
		if (randomTimeout) {
			await timeout(randomBetween(300, 800));
		}
		if (!baseElem || !targetElem) return;
		baseElem.classList.add("fade");
		targetElem.classList.add("transition");
		targetElem.classList.add("show");
		isImageLoaded = true;
	};
});

function createTargetElement() {
	if (!baseElem || !targetElem) return;
	const targetImage = baseElem.querySelector("img").cloneNode(true);
	targetImage.src = targetUrl;
	targetElem.appendChild(targetImage);
}
</script>

<div
	class="img-wrapper"
	data-imageLoaded={isImageLoaded}
	style="--wrapperWidth:{wrapperWidth}; --wrapperHeight:{wrapperHeight}">
	{#if !isImageLoaded}
		<div
			class="base blur"
			bind:this={baseElem}
			out:fade={{ duration: duration }}>
			{@render base()}
		</div>
	{/if}
	<div bind:this={targetElem} class="target"></div>
</div>

<style lang="scss">
.img-wrapper {
	display: grid;
	width: var(--wrapperWidth);
	height: var(--wrapperHeight);
	position: relative;
}
div {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	&.base {
		z-index: 1;
		filter: blur(20px);
		transition: opacity 0.5s ease;
		&:global(.fade) {
			opacity: 0;
		}
	}
	&.target {
		opacity: 0;
		z-index: 0;
		&:global(.transition) {
			transition: opacity 1s ease;
		}
		&:global(.show) {
			opacity: 1;
		}
	}
}
</style>
