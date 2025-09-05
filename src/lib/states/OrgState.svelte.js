import { page } from "$app/state";
import { getContext, setContext } from "svelte";

export class OrgState {
	org = $derived(page.data.org || {});
	constructor() {}
}

const KEY = Symbol("OrgState");

/**
 * @returns {OrgState} - A new instance of `State` which is stored in the context.
 */
export function setOrgState(stateKey = null) {
	return setContext(stateKey || KEY, new OrgState());
}

/**
 * Retrieves the current state from the context.
 * @returns {ReturnType<typeof OrgState>} - The current state.
 */
export function getOrgState(stateKey = null) {
	return getContext(stateKey || KEY);
}
