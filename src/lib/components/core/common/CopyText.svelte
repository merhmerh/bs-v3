<script>
import IconButton from "$common/IconButton.svelte";
import { fly } from "svelte/transition";
let { text, mono = false, maxWidth, hideIcon } = $props();
let showIcon = $state(false);
</script>

<button
	class:mono
	class="copy-text outlined small"
	style={`max-width: ${maxWidth}px`}
	class:noIcon={hideIcon}
	onclick={() => {
		navigator.clipboard.writeText(text);
		showIcon = true;
		setTimeout(() => {
			showIcon = false;
		}, 1000);
	}}>
	<span>{text}</span>
	{#if !hideIcon}
		<IconButton icon="tabler:copy" width="12" />
	{:else if showIcon}
		<div class="overlay" transition:fly={{ duration: 200 }}>
			<IconButton icon="lucide:check" width="12" />
		</div>
	{/if}
</button>

<style lang="scss">
button.copy-text {
	padding-inline: 0.25rem 0.5rem;
	padding-block: 0.125rem;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: fit-content;
	gap: 0.25rem;
	color: var(--text);
	border-color: color-mix(in srgb, var(--text), 50% transparent);
	font-size: 0.875rem;
	border: 0;
	position: relative;
	&.noIcon {
		padding-inline: 0.25rem !important;
	}
	.overlay {
		position: absolute;
		right: 0.125rem;
		padding: 3px;
		border-radius: 4px;
		background-color: var(--bg-100);
	}
	span {
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
		width: fit-content;
		max-width: 300px;
	}
	&.mono {
		font-size: 0.8125rem;
		font-family: var(--font-mono);
	}
}
</style>
