<script>
import { onMount } from "svelte";
import { fly } from "svelte/transition";

let {
	content,
	children,
	tooltip,
	tooltipSnippet,
	position = "bottom",
	offsetX = 0,
	offsetY = 0,
	maxWidth = 300,
	delay = 300,
	clickToOpen = false,
	kbd,
} = $props();
let container = $state(null);
let showTooltip = $state(false);
let timeout = null;
let transitionOffset = (() => {
	if (position.includes("top")) {
		return 10;
	} else if (position.includes("bottom")) {
		return -10;
	}
})();
if (kbd && !Array.isArray(kbd)) {
	kbd = kbd.split("+");
}
onMount(() => {
	let button = container.querySelector("button");
	if (!button) {
		button = container.firstElementChild;
	}

	if (clickToOpen) {
		button.addEventListener("click", () => {
			showTooltip = !showTooltip;
			if (showTooltip) {
				setTimeout(() => {
					showTooltip = false;
				}, 1000);
			}
		});
		return;
	}

	button.addEventListener("mouseenter", () => {
		timeout = setTimeout(() => {
			showTooltip = true;
		}, delay);
	});

	button.addEventListener("mouseleave", () => {
		showTooltip = false;
		clearTimeout(timeout);
	});

	button.addEventListener("click", () => {
		showTooltip = false;
		if (timeout) clearTimeout(timeout);
	});
});
</script>

<div class="tooltip-container" bind:this={container}>
	{#if showTooltip}
		<div
			class="tooltip-content {position}"
			style="--max-width:{maxWidth}px; --offset-x:{offsetX}; --offset-y:{offsetY};"
			transition:fly={{ y: transitionOffset, duration: 200 }}>
			{#if tooltipSnippet}
				{@render tooltipSnippet?.()}
			{:else}
				<div class="tooltip-text">
					{tooltip}
					{#if kbd}
						{#each kbd as key}
							<kbd class="small">{key}</kbd>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
	{#if content}
		{@render content?.()}
	{:else}
		{@render children?.()}
	{/if}
</div>

<style lang="scss">
.tooltip-container {
	position: relative;
	width: fit-content;
	.tooltip-content {
		position: absolute;
		background-color: var(--mono-light);
		border-radius: 0.375rem;
		padding: 4px;
		z-index: 200;
		padding-inline: 0.5rem;
		color: var(--text-alt);
		width: max-content;
		max-width: var(--max-width);
		text-align: center;
		overflow-wrap: normal;
		display: inline-flex;
		border: 1px solid var(--border-base);
		margin-top: var(--offset-y);
		margin-left: var(--offset-x);
		.tooltip-text {
			line-height: 175%;
			font-size: 0.75rem;
			white-space: nowrap;
			width: 100%;
			color: var(--text);
			kbd {
				background-color: var(--bg-150);
				padding-block: 2px;
				margin-inline: 2px;
				font-size: 0.75rem;
				@media screen and (max-width: 500px) {
					display: none;
				}
			}
		}
		&.bottom-left {
			left: 0;
			top: 100%;
			transform: translate(-6px, 6px);
		}
		&.bottom {
			left: 50%;
			top: 100%;
			transform: translate(-50%, 6px);
		}
		&.bottom-center {
			left: 50%;
			top: 100%;
			transform: translate(-50%, 6px);
		}
		&.bottom-right {
			right: 0;
			top: 100%;
			transform: translate(0, 6px);
		}
		&.top {
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);
		}
		&.top-left {
			bottom: 100%;
			left: 0;
			transform: translate(-6px, 0%);
		}
		&.top-center {
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);
		}
		&.left {
			top: 50%;
			left: 0;
			transform: translate(-6px, -50%);
		}
	}
}
</style>
