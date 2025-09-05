<script>
import { goto } from "$app/navigation";
import { page } from "$app/state";
import Icon from "@iconify/svelte";
import { getSearchState } from "./GlobalSearchState.svelte.js";
import { minimatch } from "minimatch";

let { placeholder = "Search..." } = $props();
let searchInput = $state("");
let hasInitialized = $state(false); // Flag to ensure effect runs only once
let isSearching = $state(false);
const searchState = getSearchState();

$effect.pre(() => {
	const q = page.url.searchParams.get("q");
	if (!hasInitialized && q) {
		hasInitialized = true; // Set flag to prevent future updates
		searchState.set(q);
	}

	if (!q && !isSearching) {
		searchState.set("");
		return;
	}

	if (!q) return;
	searchState.value = q;
});

function handleKeydown(e) {
	if (e.ctrlKey && (e.key === "k" || e.key == "K")) {
		e.preventDefault();
		searchInput?.focus();
		// searchInput?.select();
	}
}

function handleSearchKeydown(e) {
	if (e.key == "Enter") {
		search();
	}
}

async function search() {
	isSearching = true;
	const pages = [
		{ pathname: "/posts", matches: ["/posts"] },
		{
			pathname: "/people",
			matches: ["/meet-people", "/people"],
			route_id: ["/(main)/@[handle]"],
		},
		{ pathname: "/company", matches: ["/discover-company", "/company"] },
	];

	const currentUrlPathname = page.url.pathname;

	let url = "";
	for (const p of pages) {
		const matches = p.matches;
		if (matches.some((match) => minimatch(currentUrlPathname, match))) {
			//if same path, example searching at /people page
			if (currentUrlPathname === p.pathname) {
				const currentQueryParams = page.url.searchParams;
				if (searchState.value) {
					currentQueryParams.set("q", searchState.value);
				} else {
					currentQueryParams.delete("q");
				}
				url = `${p.pathname}?${currentQueryParams.toString()}`;

				break;
			}

			//if different path, example searching at /meet-people page
			if (searchState.value) {
				url = `${p.pathname}?q=${encodeURIComponent(searchState.value)}`;
			} else {
				url = p.pathname;
			}
			break;
		} else if (searchState.value && p.route_id && p.route_id.includes(page.route.id)) {
			url = `${p.pathname}?q=${encodeURIComponent(searchState.value)}`;
			break;
		} else {
			url = `/posts?q=${encodeURIComponent(searchState.value)}`;
		}
	}
	await goto(url, {
		invalidateAll: true,
		keepFocus: true,
	});

	isSearching = false;
}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="none search-button">
	<input
		id="globalSearchInput"
		class="search"
		type="text"
		{placeholder}
		bind:this={searchInput}
		bind:value={searchState.value}
		onkeydown={handleSearchKeydown} />
	{#if searchState.value}
		<button
			tabindex="-1"
			class="icon close"
			onclick={() => {
				searchState.value = "";
				searchInput.focus();
			}}>
			<Icon icon="lucide:x" width="18" />
		</button>
	{/if}
	<button class="icon none search" onclick={search}>
		<Icon icon="icon-park-outline:search" width="18" />
	</button>
	<div class="kbd-container">
		<kbd>Ctrl</kbd> <kbd>K</kbd>
	</div>
</div>

<style lang="scss">
.search-button {
	width: 100%;
	border-radius: 100px;
	background-color: var(--input-light);
	border: 1px solid var(--border-base);
	cursor: text;
	display: flex;
	align-items: center;
	padding-block: 0.125rem;
	padding-inline: 1rem;
	@media screen and (max-width: 768px) {
		width: 100%;
	}
	button.search {
		margin-right: 0.25rem;
		border-radius: 0.25rem;
		color: var(--mono-base);
		padding: 0.125rem;
		&:hover {
			background-color: transparent;
		}
		&:focus-visible {
			--focus-visible-outline: 2px solid var(--text-soft);
		}

		@media screen and (max-width: 768px) {
			margin: 0;
		}
	}
	.close {
		margin-right: 0.25rem;
		cursor: pointer;
		padding: 0.125rem;
		border-radius: 50%;
		z-index: 100;
		background-color: transparent;
		&:hover {
			color: var(--text);
		}
	}
	&:hover {
		background-color: var(--input-light);
	}
	&:focus-within {
		border: 1px solid transparent;
		outline: 1px solid var(--accent-200);
	}
	input {
		border: 0;
		// pointer-events: none;
		background-color: transparent;
		width: 100%;
		padding-block: 0.25rem;
		padding-inline: 0.5rem;
		font-size: 0.875rem;
		&:focus {
			outline: none;
			border: none;
		}
		@media screen and (max-width: 768px) {
			padding-inline: 0.5rem;
		}
	}
	.kbd-container {
		@media screen and (max-width: 768px) {
			display: none;
		}
	}
}
</style>
