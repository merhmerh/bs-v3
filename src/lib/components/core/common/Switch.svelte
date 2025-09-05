<script>
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
/**
 * @typedef {Object} Props
 * @property {boolean} [checked]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { checked = $bindable(false), onchecked = () => {}, children } = $props();

// const dispatch = createEventDispatcher();

function toggleCheck() {
	checked = !checked;
	onchecked(checked);

	// if (checked) {
	//     dispatch("checked");
	// } else {
	//     dispatch("unchecked");
	// }
}
</script>

<div class="switch-container">
	<button onclick={toggleCheck} class:checked>
		<div class="ball">
			{#if !checked}
				<Icon icon="mingcute:close-fill" width="12" />
			{:else}
				<Icon icon="mingcute:check-fill" width="12" />
			{/if}
		</div>
	</button>
	{@render children?.()}
</div>

<style lang="scss">
.switch-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	button {
		--switch-on-bg: #38ae48;
		--switch-off-bg: #535353;
		--switch-ball: #fff;
		border: none;
		outline: none;
		color: inherit;
		width: fit-content;
		height: fit-content;
		padding: 0;
		border-radius: 0;
		font-weight: inherit;

		width: 2.5rem;
		height: 1.5rem;
		background-color: var(--switch-off-bg);
		border-radius: 1rem;
		padding-inline: 0.25rem;
		justify-content: flex-start;
		transition: all 0.3s ease;
		&:hover,
		&:focus {
			box-shadow: none;
		}
		.ball {
			left: 0;
			width: 18px;
			height: 18px;
			border-radius: 100%;
			background-color: var(--switch-ball);
			color: var(--switch-off-bg);
			transition: all 0.3s ease;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&.checked {
			background-color: var(--switch-on-bg);

			.ball {
				transform: translateX(14px);
				color: var(--switch-on-bg);
			}
		}
	}
}
</style>
