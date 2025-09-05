<script>
import Icon from "@iconify/svelte";

/**
 * @typedef {Object} Props
 * @property {any} [options]
 * @property {any} [selected]
 * @property {boolean} [evenWidth]
 * @property {boolean} [accented]
 * @property {boolean} [ignoreSameOption]
 */

/** @type {Props} */
let {
	options = $bindable([]),
	selected = $bindable(options[0].value),
	evenWidth = false,
	accented = false,
	ignoreSameOption = true,
	navigateWithPath = false,
	divider = false,
	small = false,
	onchange,
} = $props();

options = initOptions();

function initOptions() {
	const arr = [];
	for (const item of options) {
		if (typeof item === "string") {
			arr.push({ value: item });
		} else {
			arr.push(item);
		}
	}
	return arr;
}

export async function change(value) {
	if (onchange) {
		onchange(value);
	}
}

function handleOnClick(option) {
	if (option.value == selected && ignoreSameOption == true) return;
	selected = option.value;
	change(selected);
}
</script>

{#snippet content(option)}
	{#if option.icon}
		<div class="icon">
			<Icon icon={option.icon} width="16" height="16" />
		</div>
	{/if}
	{#if option.displayValue}
		{option.displayValue}
	{:else}
		{option.value}
	{/if}
{/snippet}

<div
	class="segmented-control-container"
	class:grid={evenWidth}
	class:accented
	class:small
	style="--count:{options.length}">
	{#each options as option}
		{#if option.name == "divider"}
			<div class="v-divider"></div>
		{:else if navigateWithPath}
			<a
				href={option.path}
				class="segment-button"
				class:selected={option.value == selected}
				onclick={() => handleOnClick(option)}>
				{@render content(option)}
			</a>
		{:else}
			<button
				class="segment-button none"
				class:selected={option.value == selected}
				onclick={() => handleOnClick(option)}>
				{@render content(option)}
			</button>
		{/if}

		{#if divider}
			<div class="v-divider"></div>
		{/if}
	{/each}
</div>

<style lang="scss">
.v-divider {
	height: auto;
	width: 1px;
	border-radius: 1px;
	background-color: color-mix(in srgb, var(--mono), 50% transparent);
	&:last-child {
		display: none;
	}
}
.segmented-control-container {
	display: flex;
	border-radius: 0.5rem;
	padding: 0.25rem;
	width: fit-content;
	background-color: var(--border-base);
	display: flex;
	gap: var(--gap, 0.25rem);
	width: var(--width, fit-content);

	&.grid {
		display: grid;
		grid-template-columns: repeat(var(--count), 1fr);
	}

	&.accented {
		.segment-button {
			&.selected {
				background-color: var(--primary);
				color: var(--text-alt);
			}
		}
	}
	&.small {
		.segment-button {
			font-size: 0.875rem;
		}
	}
	.segment-button {
		text-wrap: nowrap;

		-webkit-tap-highlight-color: transparent;
		width: var(--button-width, auto);
		position: relative;
		padding-inline: 1rem;
		padding-block: 0.25rem;
		color: var(--inactive-color, var(--text));
		font-size: var(--font-size, 1rem);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		border-radius: 0.25rem;
		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--text-soft);
		}
		&.selected {
			color: var(--text);
			background-color: var(--bg-100);
		}
	}
}
</style>
