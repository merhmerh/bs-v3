import { writable } from "svelte/store";

/**
 * Theme store, can be either 'dark' or 'light'.
 * @type {import('svelte/store').Writable<'dark' | 'light'>}
 */
export const theme = writable("dark");
