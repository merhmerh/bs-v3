<script>
import { afterNavigate } from "$app/navigation";
import { page } from "$app/state";
import Divider from "$common/Divider.svelte";
import { getOrgState } from "$lib/states/OrgState.svelte.js";
import Icon from "@iconify/svelte";

let { data, children } = $props();
const orgState = getOrgState();

const org_id = $derived(page.params.org_id);
const navs = [
	{
		name: "Organization Profile",
		path: `/profile`,
		icon: "streamline:user-identifier-card",
		route_id: "/(management)/settings/organizations/[org_id]/profile",
		width: "900px",
	},
	{
		name: "Manage Users",
		path: `/users`,
		icon: "grommet-icons:group",
		route_id: "/(management)/settings/organizations/[org_id]/users",
	},
	{
		name: "Licenses",
		path: `/licenses`,
		icon: "material-symbols:license-outline-rounded",
		route_id: "/(management)/settings/organizations/[org_id]/licenses",
	},
];
</script>

<div class="inner-layout">
	<div class="nav">
		{#each navs as nav}
			{#if nav.name === "divider"}
				<Divider />
			{:else}
				<a
					href={`/settings/organizations/${org_id}${nav.path}`}
					class="nav-item"
					class:selected={page.route.id.startsWith(nav.route_id)}>
					<div class="icon">
						<Icon icon={nav.icon} width="20" />
					</div>
					<span>{nav.name}</span>
				</a>
			{/if}
		{/each}
	</div>
	<div class="inner-content">
		<div class="scrollable">
			{@render children?.()}
		</div>
	</div>
</div>

<style lang="scss">
.inner-layout {
	width: 100%;
	height: 100%;
	display: flex;
	.nav {
		padding: 0.5rem;
		height: 100%;
		width: 250px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		// gap: 0.5rem;
		border-right: 1px solid var(--border);
		a {
			color: var(--text);
			font-size: 0.875rem;
			padding: 0.5rem;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			border-radius: 0.5rem;
			&.selected {
				background-color: color-mix(in srgb, var(--primary) 12%, transparent);
				.icon {
					color: var(--primary);
				}
			}
		}
	}
	.inner-content {
		width: 100%;
		height: 100%;
		padding: 1rem;
		.scrollable {
			max-height: calc(100dvh - 70px - 2rem);
			height: 100%;
			overflow-y: auto;
			margin-inline: auto;
			width: min(100%, 1200px);
		}
	}
}
</style>
