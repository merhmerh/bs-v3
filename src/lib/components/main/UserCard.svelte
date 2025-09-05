<script>
import Avatar from "$common/Avatar.svelte";
import { theme } from "$common/theme.store.js";
import { matchEnums } from "$data/fieldsEnum.js";
import { titleCase } from "$fn/helper.js";
let { data: dataProp, onclick = () => {}, type = "user" } = $props();
let data = $derived.by(() => {
	return {
		...dataProp,
		handle: dataProp?.username || dataProp?.handle,
	};
});
</script>

{#snippet userData(data)}
	{#if data.occupation}
		<span class="text-xs text-soft">{titleCase(data.occupation)}</span>
	{/if}

	{#if data.bio}
		<p class="bio">{data.bio}</p>
	{/if}
{/snippet}

{#snippet companyData(data)}
	{#if data.category}
		<span class="categories text-soft">
			{#each data.category as category, i}
				<span>
					{matchEnums(category)}{#if i < data.category.length - 1},{/if}
				</span>
			{/each}
		</span>
	{/if}

	{#if data.country}
		<span class="text-light text-xs mt-auto">{titleCase(data.country)}</span>
	{/if}
{/snippet}

<a
	href="/@{data.handle}"
	class="none button"
	onclick={(e) => {
		e.preventDefault();
		onclick(data);
	}}>
	<div class="card" class:shadow={$theme == "light"} class:company={type == "company"}>
		<div class="avatar-container">
			{#key data}
				<Avatar --height="100%" rounded={false} src={data.avatar} fallback={data.display_name} />
			{/key}
		</div>
		<div class="info">
			<span class="name">{data.display_name}</span>
			{#if type == "user"}
				{@render userData(data)}
			{:else if type == "company"}
				{@render companyData(data)}
			{/if}
		</div>
	</div>
</a>

<style lang="scss">
a.button {
	padding: 0;
	width: 100%;
	height: 100%;
	scroll-snap-align: center;
	background-color: transparent;
	&:hover {
		background-color: transparent;
	}

	.card {
		background-color: var(--bg-200);
		padding: 0.5rem;
		border-radius: 1.375rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		height: 100%;
		--shadow: 4px 4px 0 rgba(0, 0, 0, 0.12);
		&.shadow {
			box-shadow: var(--shadow);
		}
		.avatar-container {
			flex-shrink: 0;
			width: 112px;
			height: 112px;
			border-radius: 1rem;
			overflow: hidden;
		}
		.info {
			display: flex;
			flex-direction: column;
			font-size: 0.875rem;
			height: 100%;
			padding-block: 0.5rem;
			width: 100%;

			.name {
				font-weight: 600;
			}
			p.bio {
				margin: 0;
				font-size: 0.75rem;
				font-style: italic;
				margin-top: auto;

				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.categories {
				display: flex;
				flex-direction: column;
			}
		}
	}
}
</style>
