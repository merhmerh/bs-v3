<script>
import Icon from "@iconify/svelte";
let {
	buttonText = "Select",
	fallbackOptionValue = $bindable([]),
	children,
	absolute = false,
	onAddOption = () => {},
} = $props();
let screenWidth = $state("");
let showOptions = $state(false);

export function closeDropdown() {
	showOptions = false;
}
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="container">
	<button
		class="mono"
		onclick={() => {
			showOptions = !showOptions;
		}}>
		{buttonText}
		<div class="icon">
			<Icon icon="ic:round-expand-more" height="20" />
		</div>
	</button>

	{#if showOptions}
		<div class="dropdown" class:absolute>
			{@render children()}
		</div>
	{/if}
</div>

<style lang="scss">
.container {
	position: relative;
	width: 100%;
	button {
		display: flex;
		justify-content: center;
		font-size: inherit;
		padding-block: 0.375rem;
		width: 100%;
		position: relative;
		.icon {
			position: absolute;
			right: 0.5rem;
		}
	}
	.dropdown {
		margin-top: 0.5rem;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0rem;
		background-color: var(--bg-100);
		border: 1px solid var(--border-base);
		border-radius: 0.5rem;
		z-index: 1;
		&.absolute {
			position: absolute;
		}
	}
	// select {
	// 	@media screen and (max-width: 768px) {
	// 		display: block;
	// 		cursor: pointer;
	// 		position: absolute;
	// 		top: 0;
	// 		width: 100%;
	// 		height: 100%;
	// 		opacity: 0;
	// 		// opacity: 0;
	// 		// position: absolute;
	// 	}
	// }
}
</style>
