<script>
import Avatar from "$common/Avatar.svelte";
import Icon from "@iconify/svelte";
import Popover from "$common/Popover.svelte";
import { page } from "$app/state";
import VirtualList from "@sveltejs/svelte-virtual-list";
import { debounce } from "$fn/helper.js";

let { data } = $props();
let companies = $state(data.companies);
let visibleCompanies = $state(data.companies);
let isOpenState = $state(false);

let currentProfile = $derived.by(() => {
	if (page.params.companyHandle) {
		const thisCompany = companies.find((c) => c.handle === page.params.companyHandle);
		return {
			type: "company",
			avatar: thisCompany.avatar,
			display_name: thisCompany.display_name,
			handle: thisCompany.handle,
		};
	} else {
		return {
			type: "user",
			avatar: data.avatar,
			display_name: data.display_name,
			handle: data.username,
		};
	}
});

function updateHref(c) {
	let pathname = page.url.pathname;

	const companyHandle = page.params?.companyHandle;
	if (companyHandle) {
		pathname = pathname.replace(`/${companyHandle}`, "");
	}

	let path = pathname.replace(/^\/dashboard\//, "");
	if (!c) {
		return `/dashboard/${path}`;
	}

	if (pathname.endsWith("/companies")) {
		return `/dashboard/${c.handle}/posts`;
	}

	return `/dashboard/${c.handle}/${path}`;
}

const debouncedFilter = debounce((e) => {
	const value = e.target.value;

	if (!value) {
		visibleCompanies = companies;
	}

	const visible = [];
	for (const item of companies) {
		const fts = [item.display_name, item.handle].join(" ").toLowerCase();
		if (fts.includes(value.toLowerCase())) {
			visible.push(item);
		}
	}
	visibleCompanies = visible;
});
</script>

{#snippet profile(data)}
	<div class="profile">
		<Avatar src={data.avatar} fallback={data.handle} --height="32px" />
		<div class="info">
			<div class="name">{data.display_name}</div>
			<div class="username">@{data.handle}</div>
		</div>
	</div>
{/snippet}

<Popover
	--width="100%"
	sameWidthAsParent
	bind:showPopup={isOpenState}
	onopen={() => {
		visibleCompanies = companies;
	}}>
	{#snippet button()}
		<button class="mono none" class:open={isOpenState}>
			{@render profile(currentProfile)}
			<div class="icon">
				<Icon icon="ic:round-expand-more" width="24" />
			</div>
		</button>
	{/snippet}

	{#snippet popup()}
		<div class="menu">
			{#if currentProfile.type == "company"}
				<div class="category">My Profile</div>
				<a href={updateHref()}>
					{@render profile({
						type: "user",
						avatar: data.avatar,
						display_name: data.display_name,
						handle: data.username,
					})}
				</a>
			{/if}

			<div class="category">Companies</div>
			{#if companies && companies.length}
				{#if companies.length >= 5}
					<input
						class="search small"
						type="search"
						placeholder="Search Company"
						oninput={(e) => debouncedFilter(e)} />
				{/if}
				<div class="v-list">
					<VirtualList items={visibleCompanies} let:item={c}>
						<a
							href={updateHref(c)}
							onclick={() => {
								isOpenState = false;
							}}>
							{@render profile({
								type: "company",
								avatar: c.avatar,
								display_name: c.display_name,
								handle: c.handle,
							})}
						</a>
					</VirtualList>
				</div>
			{:else}
				<div class="info-box">
					<span>
						No companies have been created yet. Click
						<a class="none" href="/dashboard/companies/new">here</a> to create one.
					</span>
				</div>
			{/if}
		</div>
	{/snippet}
</Popover>
<div class="mt-4"></div>

<style lang="scss">
button {
	padding-left: 0.5rem;
	align-items: center;
	display: grid;
	grid-template-columns: 1fr auto;
	border-radius: 0.5rem;
	width: 100%;
	&.open {
		border-radius: 0.5rem 0.5rem 0 0;
	}
	.icon {
		width: fit-content;
	}
}
.profile {
	overflow: hidden;
	gap: 0.5rem;
	display: flex;
	align-items: center;
	width: 100%;
	.info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		overflow: hidden;
		.name {
			width: 100%;
			font-size: 0.875rem;
			@include text-overflow-1;
		}
		.username {
			font-size: 0.75rem;
			color: var(--text-soft);
		}
	}
}
.menu {
	background-color: var(--bg-200);
	width: 100%;
	border-radius: 0 0 0.5rem 0.5rem;
	border: 1px solid var(--mono-soft);
	border-top: 0;
	padding-inline: 0.25rem;
	padding-bottom: 0.25rem;
	max-height: 600px;
	overflow-y: auto;

	.search {
		padding-block: 0.25rem;
		padding-inline: 0.5rem;
		margin-block: 0.25rem;
		margin-left: 0.5rem;
		width: calc(100% - 1rem);
		font-size: 0.875rem;
	}
	.v-list {
		height: 400px;
		a {
			color: unset;
			display: flex;
			border-radius: 0.25rem;
			padding: 0.5rem;

			&:hover {
				background-color: var(--mono-light);
			}
		}
	}

	.info-box {
		margin: 0.25rem;
		font-size: 0.8125rem;
	}

	.category {
		font-size: 0.875rem;
		color: var(--text-soft);
		padding-inline: 0.5rem;
		padding-top: 0.375rem;
		&:not(:first-child) {
			margin-top: 0.25rem;
			border-top: 1px solid var(--mono-soft);
		}
	}
}
</style>
