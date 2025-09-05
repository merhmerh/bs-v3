<script>
import Header from "$common/Header.svelte";
import Theme from "$common/Theme.svelte";
import Background from "$core/auth/Background.svelte";
import { onMount } from "svelte";
/**
 * @typedef {Object} Props
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { children } = $props();

let ready = $state(false);
onMount(() => {
	ready = true;
});
</script>

{#if ready}
	<Header background="transparent" icon={false}>
		{#snippet content()}
			<div class="header-menu">
				<Theme />
			</div>
		{/snippet}
	</Header>

	<main>
		<div class="content">
			{@render children?.()}
		</div>
		<Background />
	</main>
{/if}

<style lang="scss">
.header-menu {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
main {
	min-height: calc(100vh - 60px);
	@media screen and (max-width: 768px) {
		padding-inline: 1rem;
	}
	.content {
		position: relative;
		z-index: 1;
	}
}
</style>
