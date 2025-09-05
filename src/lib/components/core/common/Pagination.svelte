<script>
import Icon from "@iconify/svelte";
let {
	currentPage = $bindable(1),
	count = $bindable(1),
	perPage = $bindable(10),
	constructAnchor = null,
	onchange = () => {},
} = $props();

let totalPage = $derived(Math.ceil(count / perPage));
let useAnchor = $derived(constructAnchor !== null);

let numberToShow = $derived.by(() => {
	if (totalPage <= 5) {
		return Array.from({ length: totalPage }, (_, i) => i + 1);
	}

	if (currentPage <= 3) {
		return [1, 2, 3, 4, "...", totalPage];
	}
	if (currentPage >= totalPage - 2) {
		return [1, "...", totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
	}

	return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPage];
});

function gotoPage(page) {
	if (page < 1) page = 1;
	if (page > totalPage) page = totalPage;
	currentPage = page;
	onchange(page);
}

function setAnchor(page) {
	if (page == "...") {
		return null;
	}
	if (page == "next") {
		page = currentPage + 1;
		if (page > totalPage) {
			return null;
		}
	}
	if (page == "prev") {
		page = currentPage - 1;
		if (page < 1) {
			return null;
		}
	}
	return constructAnchor(page);
}
</script>

{#snippet icon(flip)}
	<div class="icon">
		<Icon icon="ic:round-navigate-next" width="20" hFlip={flip} />
	</div>
{/snippet}

{#snippet prevButton()}
	{#if useAnchor}
		<a class="nav" href={setAnchor("prev")} class:disabled={currentPage == 1}>
			{@render icon(true)}
		</a>
	{:else}
		<button class="nav" disabled={currentPage == 1} onclick={() => gotoPage(currentPage - 1)}>
			{@render icon(true)}
		</button>
	{/if}
{/snippet}

{#snippet nextButton()}
	{#if useAnchor}
		<a class="nav" href={setAnchor("next")} class:disabled={currentPage == totalPage}>
			{@render icon()}
		</a>
	{:else}
		<button
			class="nav"
			disabled={currentPage == totalPage}
			onclick={() => gotoPage(currentPage + 1)}>
			{@render icon()}
		</button>
	{/if}
{/snippet}

<div class="pagination-container">
	<div class="pagination-row">
		{@render prevButton()}

		{#each numberToShow as n}
			{#if useAnchor}
				<a
					class="page"
					href={setAnchor(n)}
					class:disabled={n == "..."}
					class:selected={currentPage == n}>
					{n}
				</a>
			{:else}
				<button
					class="page"
					class:selected={currentPage == n}
					disabled={n == "..."}
					class:intermediate={n == "..."}
					onclick={() => gotoPage(n)}>{n}</button>
			{/if}
		{/each}

		{@render nextButton()}
	</div>
</div>

<style lang="scss">
.pagination-container {
	width: fit-content;
	.pagination-row {
		display: flex;
		gap: 0.25rem;

		a,
		button {
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.5rem;
			padding-inline: 0.75rem;

			background-color: transparent;
			border: none;
			color: var(--text);
			&:hover {
				background-color: color-mix(in srgb, var(--accent-100) 12%, transparent);
				&.disabled {
					background-color: unset;
				}
			}

			&.page {
				width: 36px;
				aspect-ratio: 1;
				padding: 0.25rem;
				&.selected {
					background-color: color-mix(in srgb, var(--primary) 6%, transparent);
					border: 1px solid var(--primary);
				}
				&:disabled,
				&.disabled {
					padding: 0;
					padding-inline: 0.125rem;
					border: none;
					background-color: transparent;
					width: fit-content;
					letter-spacing: 1px;
				}
			}
			&.nav {
				padding-inline: 0.75rem;
				.icon {
					color: inherit;
				}
				&:disabled,
				&.disabled {
					color: var(--text-disabled);
				}
			}
		}
	}
}
</style>
