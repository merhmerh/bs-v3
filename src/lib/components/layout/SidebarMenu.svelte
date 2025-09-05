<script>
import { dev } from "$app/environment";
import { page } from "$app/state";
import Divider from "$common/Divider.svelte";
import SegmentedControl from "$common/SegmentedControl.svelte";
import Icon from "@iconify/svelte";

let { nav = [], children } = $props();
let windowWidth = $state(0);
let navOption = nav
	.filter((x) => {
		if (x.dev && !dev) return false;
		if (x.disabled) return false;
		return true;
	})
	.map((x) => ({ ...x, value: x.name }));

let selectedNav = $derived.by(() => {
	if (page.url.pathname.match(/^\/settings/)) {
		const thisPage = page.url.pathname;
		return navOption.find((x) => thisPage.startsWith(x.path)).name;
	}
});

function matchSelected(path) {
	let pathname = page.url.pathname;
	const companyHandle = page.params?.companyHandle;
	if (companyHandle) {
		pathname = pathname.replace(`/${companyHandle}`, "");
	}
	return pathname.match(`^${path}`);
}

function updateHref(path) {
	if (path.endsWith("/companies")) {
		return path;
	}

	if (path.startsWith("/dashboard")) {
		path = path.replace(/^\/dashboard\//, "");
		const companyHandle = page.params?.companyHandle;
		if (companyHandle) {
			return `/dashboard/${companyHandle}/${path}`;
		}
		return `/dashboard/${path}`;
	}
	return path;
}
</script>

<svelte:window bind:innerWidth={windowWidth} />
{#if windowWidth > 978}
	<nav>
		{@render children?.()}

		{#each nav as item}
			{#if item.name === "divider"}
				<Divider paddingBlock=".5rem" />
			{:else if (item.dev && dev) || item.dev === undefined}
				<a
					href={updateHref(item.path)}
					tabindex={item.disabled == true ? -1 : 0}
					class:selected={matchSelected(item.path)}
					class:disabled={item.disabled}>
					<div class="icon">
						<Icon icon={item.icon} height="20" />
					</div>
					<span>{item.name}</span>
				</a>
			{/if}
		{/each}
	</nav>
{:else}
	<div class="segmented-control-container">
		<SegmentedControl navigateWithPath options={navOption} selected={selectedNav} />
	</div>
{/if}

<style lang="scss">
nav {
	position: sticky;
	top: 68px;
	display: flex;
	flex-direction: column;
	padding: 0.5rem;
	min-height: calc(100dvh - 68px);
	border-right: 1px solid var(--border-base);
	@media screen and (max-width: 978px) {
		position: relative;
		flex-direction: row;
		top: unset;
		min-height: unset;
	}
	a {
		color: var(--text);
		font-size: 0.875rem;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		position: relative;
		&.disabled {
			pointer-events: none;
			filter: opacity(0.25);
		}
		&:hover {
			background-color: color-mix(in srgb, var(--mono) 12%, transparent);
		}
		&.selected {
			background-color: color-mix(in srgb, var(--primary) 12%, transparent);
			.icon {
				color: var(--primary);
			}
			&:before {
				content: "";
				position: absolute;
				left: -0rem;
				top: 50%;
				width: 4px;
				height: 60%;
				border-radius: 0.5rem;
				transform: translateY(-50%);
				background-color: var(--primary);
			}
		}
		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--text-soft);
		}
	}
}
.segmented-control-container {
	width: 100%;
	overflow: auto;
	padding-bottom: 0.25rem;
	&::-webkit-scrollbar {
		height: 4px;
	}
}
</style>
