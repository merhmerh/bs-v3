<script>
import { timeout } from "$fn/helper.js";
import { onMount } from "svelte";

let { src } = $props();
let showVideo = $state(false);
let videoElement = $state();

onMount(async () => {
	await timeout(50);
	showVideo = true;
});
</script>

{#if showVideo}
	<video
		bind:this={videoElement}
		preload
		muted
		autoplay
		controls
		height="100%"
		width="100%"
		{src}
		onplay={async () => {
			// videoElement.controls = false;
		}}>
		<!-- <source {src} /> -->
	</video>
{/if}
