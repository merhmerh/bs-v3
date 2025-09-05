<script>
import Avatar from "./Avatar.svelte";
import Popover from "$common/Popover.svelte";

/**
 * @typedef {Object} Props
 * @property {any} [src]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { src = null, children, fallback = null } = $props();
</script>

<Popover>
	{#snippet button()}
		<span style="display:flex">
			<button class="none no-hover avatar">
				<Avatar {src} {fallback} --height="28px" />
			</button>
		</span>
	{/snippet}

	{#snippet popup()}
		<span class="avatar-menu">
			{@render children?.()}
		</span>
	{/snippet}
</Popover>

<style lang="scss">
button.avatar {
	border-radius: 50%;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	margin-left: 0.25rem;
}
.avatar-menu {
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	background-color: var(--bg-100);
	padding: 0rem;
	align-items: flex-start;
	overflow: hidden;
	margin-top: 0.25rem;
}
:global(.avatar-menu button, .avatar-menu a) {
	text-wrap: nowrap;
	font-size: 0.875rem;
	background-color: transparent;
	padding-block: 0.5rem;
	padding-inline: 0.75rem 1rem;
	min-width: 140px;
	border-radius: 0;
	width: 100%;
	font-size: 0.875rem;
	text-align: left;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--color, var(--mono-700));
}
:global(.avatar-menu button:hover, .avatar-menu a:hover) {
	background-color: var(--bg-200);
}
</style>
