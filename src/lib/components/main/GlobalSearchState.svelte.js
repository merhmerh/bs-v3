import { getContext, setContext } from "svelte";

export class SearchState {
	value = $state("");

	set(search) {
		this.value = search;
	}

	getValue() {
		return this.value;
	}
}

const SEARCH_KEY = Symbol("search");

/**
 * @returns {SearchState} - A new instance of `SearchState` which is stored in the context.
 */
export function setSearchState() {
	return setContext(SEARCH_KEY, new SearchState());
}

/**
 * Retrieves the current search state from the context.
 * @returns {ReturnType<typeof setSearchState>} - The current state, typed as the return type of `setSearchState`.
 */
export function getSearchState() {
	return getContext(SEARCH_KEY);
}
