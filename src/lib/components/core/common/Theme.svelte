<script>
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import { theme } from "$common/theme.store.js";
/**
 * @typedef {Object} Props
 * @property {boolean} [hover]
 */

/** @type {Props} */
let { hover = true } = $props();
let rotate = $state(0);
onMount(() => {
	const systemIsDark = window.matchMedia("(prefers-color-scheme: dark").matches;

	$theme = localStorage.getItem("theme");
	if ($theme == null) {
		const systemTheme = systemIsDark ? "dark" : "light";
		localStorage.setItem("theme", systemTheme);
		$theme = systemTheme;
	}

	updateTheme();
});

function updateTheme() {
	if ($theme == "light") {
		document.body.classList.add("light");
		document.body.classList.remove("dark");

		document.documentElement.classList.add("bg-light");
		document.documentElement.classList.remove("bg-dark");
	} else {
		document.body.classList.remove("light");
		document.body.classList.add("dark");

		document.documentElement.classList.remove("bg-light");
		document.documentElement.classList.add("bg-dark");
	}
}

export function changeTheme(t) {
	if (t) {
		$theme = t;
	}
	console.log($theme);
	document.body.classList.add("transitionEffect");

	const newTheme = $theme == "light" ? "dark" : "light";
	$theme = newTheme;
	updateTheme();

	setTimeout(() => {
		document.body.classList.remove("transitionEffect");
	}, 500);

	rotate += 180;
	localStorage.setItem("theme", $theme);
}
</script>

<button
	id="theme_button"
	style="transform:rotateZ({rotate}deg)"
	class="none"
	class:no-hover={!hover}
	data-theme={$theme}
	onclick={() => changeTheme()}>
	{#if $theme == "light"}
		<Icon icon="material-symbols:brightness-7" width="24" />
	{:else}
		<Icon icon="material-symbols:brightness-4" width="24" />
	{/if}
</button>

<style lang="scss">
#theme_button {
	outline: none;
	border: none;
	padding: 0;
	height: 32px;
	width: 32px;
	aspect-ratio: 1;
	border-radius: 100px;
	transition: transform 0.5s;
	transform: rotateZ(0deg);
	color: var(--text-base);
	box-shadow: none;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
}
</style>
