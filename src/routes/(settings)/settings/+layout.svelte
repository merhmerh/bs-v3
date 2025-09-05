<script>
import { page } from "$app/state";
import SidebarMenu from "$comp/layout/SidebarMenu.svelte";
/**
 * @typedef {Object} Props
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { children } = $props();
let isFullWidth = $derived.by(() => {
	const currentPath = page.url.pathname;

	const fullWidthPath = ["/settings/organizations/"];

	if (fullWidthPath.some((path) => currentPath.startsWith(path))) {
		return true;
	}
});

const nav = [
	{
		name: "Account",
		path: "/settings/account",
		icon: "lucide:circle-user-round",
	},
	{ name: "divider" },
	{
		name: "Organizations",
		path: "/settings/organizations",
		icon: "mingcute:building-4-line",
	},
];
</script>

<div class="sidebar">
	<SidebarMenu {nav} />
</div>
<div class="content-container" class:fullWidth={isFullWidth}>
	{@render children?.()}
</div>

<style lang="scss">
.content-container {
	margin-inline: auto;
	width: min(100%, 900px);
	margin-block: 2rem;
	&.fullWidth {
		width: 100%;
		margin-block: 0;
	}
	@media screen and (max-width: 978px) {
		padding: 0;
	}
	& :global {
		h1 {
			font-size: 2rem;
			margin-bottom: 1rem;
		}
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>
