<script>
import Background from "$core/auth/Background.svelte";
import Theme from "$comp/StateComponent/Preferences/Theme.svelte";
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

<div class="header">
	<Theme />
</div>
{#if ready}
	<main>
		<div class="content">
			{@render children?.()}
		</div>
		<Background />
	</main>
{/if}

<style lang="scss">
.header {
	position: absolute;
	z-index: 1000;
	top: 1rem;
	right: 1rem;
}
main {
	min-height: calc(100vh - 60px);
	@media screen and (max-width: 768px) {
		padding-inline: 1rem;
	}
	.content {
		padding-top: 4rem;
		position: relative;
		z-index: 1;
	}
}
</style>
