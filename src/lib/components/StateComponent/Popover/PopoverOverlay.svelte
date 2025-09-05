<script>
import { fly } from "svelte/transition";
import { getPopoverState } from "$comp/StateComponent/Popover/PopoverState.svelte.js";

let { key } = $props();
const ps = getPopoverState(key || null);

let resizeTimeout;

function calcPosition() {
	ps.setPosition();

	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		ps.setPosition();
	}, 250);
}
</script>

<svelte:window
	onresize={calcPosition}
	onclick={(e) => ps.clickOutsideClose(e)}
	onkeydown={(e) => ps.handleKeydown(e)} />

{#if ps.popover?.snippet && ps.isOpen}
	<div
		class="popover"
		on={calcPosition}
		bind:this={ps.popover.container}
		class:open={ps.isOpening == false}>
		{@render ps.popover?.snippet(ps.popover?.props)}
	</div>
	<div
		class="popover-background"
		transition:fly={{ duration: ps.transitionDuration }}
		style="--blur:{ps?.popover?.blur};--bg:{ps?.popover?.bg}">
	</div>
{/if}

<div bind:this={ps.mountTarget}></div>

<style lang="scss">
.popover-background {
	position: fixed;
	z-index: 99;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	@media screen and (max-width: 520px) {
		background-color: var(--bg, transparent);
		backdrop-filter: var(--blur);
	}
}
.popover {
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	opacity: 0;

	&.open {
		opacity: 1;
	}
	@media screen and (max-height: 600px) {
		top: 0 !important;
		left: 0 !important;
		height: 100dvh !important;
		width: 100dvw !important;
	}
}
</style>
