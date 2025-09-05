<script>
import { timeout } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

/**
 * @typedef {Object} Props
 * @property {"default" | "outlined" | "warning" | "mono" | "none"} [buttonStyle]
 * @property {boolean} [disabled]
 * @property {boolean} [persist]
 * @property {boolean} [small]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let {
	children,
	buttonStyle = "",
	disabled = false,
	persist = false,
	small = true,
	smaller = false,
	md = false,
	lg = false,
	outlined = false,
	minWidth = 60,
	primary = false,
	secondary = false,
	warning = false,
	lightWarning = false,
	button,
	rounded = false,
	onclick = () => {},
	autoWidth = false,
} = $props();

if (small && (smaller || md || lg)) {
	small = false;
}
let width = $state(0);
let isAwaiting = $state(false);

export async function handleButtonClick() {
	if (disabled) return;
	if (isAwaiting) return;
	isAwaiting = true;
	await onclick();
	if (persist) return;
	isAwaiting = false;
}

onMount(async () => {
	await timeout(50);
	if (!autoWidth) return;
	width = button.getBoundingClientRect().width + "px";
	if (!button.style.getPropertyValue("--width")) {
		button.style.setProperty("--width", width);
	}
});
</script>

<button
	bind:this={button}
	onclick={handleButtonClick}
	class:small
	class:smaller
	class:md
	class:lg
	class:primary
	class:isAwaiting
	class:disabled
	class:secondary
	class:rounded
	class:warning
	class:lightWarning
	class:outlined
	class:mono={buttonStyle == "mono"}
	class:none={buttonStyle == "none"}
	class:unstyle={buttonStyle == "unstyle"}
	style="width:var(--width, fit-content); --min-width:{minWidth ?? 0}px">
	{#if isAwaiting}
		<div class="icon">
			<Icon icon="svg-spinners:3-dots-bounce" height="24" />
		</div>
	{/if}
	<span class:hide={isAwaiting}>
		{@render children?.()}
	</span>
</button>

<style lang="scss">
button {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	margin-top: var(--mt, 0);
	padding-inline: var(--px, 1rem);
	font-size: var(--font-size, 1rem);
	padding-block: var(--py, 0.5rem);
	min-width: var(--min-width, 0);
	// --button-bg: var(--bg-100);
	&.rounded {
		aspect-ratio: unset;
		border-radius: 10rem !important;
	}
	&.outlined {
		--button-bg: transparent;
	}
	&.mono {
		--button-bg: color-mix(in srgb, var(--mono), 75% transparent);
		color: var(--text);
	}
	&.md {
		height: 2rem;
		border-radius: var(--border-radius, 0.5rem);
		padding-block: var(--py, 0.375rem);
		padding-inline: var(--px, 0.75rem);
		font-size: var(--font-size, 1rem);
		.icon {
			bottom: -4px;
		}
	}
	&.lg {
		padding-block: var(--py, 0.5rem);
	}
	&.small {
		border-radius: 0.375rem;
		padding-block: var(--py, 0.375rem);
		padding-inline: var(--px, 0.625rem);
		font-size: var(--font-size, 0.875rem);
		.icon {
			bottom: -4px;
		}
	}
	&.smaller {
		font-size: var(--font-size, 0.875rem);
		padding-block: var(--py, 0.25rem);
		padding-inline: var(--px, 0.5rem);
		border-radius: 0.25rem;
	}
	&.lightWarning {
		--button-bg: color-mix(in srgb, var(--red) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--red), 50% transparent);
		&:hover {
			background-color: color-mix(in srgb, var(--red) 20%, transparent);
		}
	}
	&.primary {
		border: 0;
	}
	.icon {
		display: block;
		position: absolute;
		bottom: 0;
		color: var(--primary-contrast);
	}

	&.isAwaiting {
		cursor: default;
		filter: grayscale(0.7);
		&:hover {
			background-color: var(--button-bg, var(--primary));
		}
		&.outlined {
			.icon {
				color: var(--mono);
			}
			filter: grayscale(0.4);
			--border-color: var(--border);
			--button-bg: var(--input-disabled);
			--text-color: var(--primary);
		}
		&.mono .icon {
			color: var(--mono);
		}
		&.warning {
			filter: grayscale(0.4);
			--button-bg: var(--red);
			&.mono {
				.icon {
					color: var(--mono);
				}
			}
		}
		&.lightWarning {
			filter: grayscale(0.4);
			.icon {
				color: color-mix(in srgb, var(--red), 25% transparent);
			}
		}

		span.hide {
			visibility: hidden;
		}
	}
}
</style>
