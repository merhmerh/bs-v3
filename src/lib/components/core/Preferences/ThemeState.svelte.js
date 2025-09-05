import { getContext, setContext } from "svelte";

export class ThemeState {
	theme = $state({
		theme: "Default",
		scheme: "dark",
	});

	constructor() {}

	initTheme() {
		const ls = localStorage.getItem("themeData");
		if (ls) {
			try {
				const raw = JSON.parse(ls);
				this.theme.theme = raw.theme || "Default";
				this.theme.scheme = raw.scheme || "light";
			} catch (e) {
				console.error("Failed to parse theme data from localStorage", e);
			}
		}
		this.update();
	}

	async update() {
		this.setTheme(this.theme.theme);
		this.setScheme(this.theme.scheme);
		localStorage.setItem("themeData", JSON.stringify(this.theme));
	}

	setScheme(scheme) {
		document.documentElement.setAttribute("data-theme-scheme", scheme);
		//set color-scheme of input to light or dark
		document.documentElement.style.colorScheme = scheme;
	}

	setTheme(theme) {
		document.documentElement.setAttribute("data-theme", theme);
	}
}

const KEY = Symbol("ThemeState");

/**
 * @returns {ThemeState} - A new instance of `State` which is stored in the context.
 */
export function setThemeState() {
	return setContext(KEY, new ThemeState());
}

/**
 * Retrieves the current state from the context.
 * @returns {ReturnType<typeof ThemeState>} - The current state.
 */
export function getThemeState() {
	return getContext(KEY);
}
