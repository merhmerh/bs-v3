<script>
import { timeout } from "$fn/helper.js";
import { onMount } from "svelte";
import { getThemeState } from "./ThemeState.svelte.js";
import Icon from "@iconify/svelte";
let { interactive = true, ...props } = $props();

const ts = getThemeState();
let button = $state(null);
let rotation = $state(0);
let currentScheme = $derived(ts.theme.scheme);

export async function updateTheme() {
	const scheme = ts.theme.scheme;
	if (scheme == "light") {
		ts.theme.scheme = "dark";
	} else {
		ts.theme.scheme = "light";
	}

	document.body.classList.add("disable-transition");
	ts.update();

	rotation += 360;
	button.style.transform = `rotate(${rotation}deg)`;
	await timeout(250);
	currentScheme = ts.theme.scheme;

	document.body.classList.remove("disable-transition");
}
onMount(async () => {
	await timeout(250);
	if (!button) return;
});
</script>

<button
	class="icon theme-toggle-button"
	onclick={() => {
		if (!interactive) return;
		updateTheme();
	}}
	bind:this={button}
	disabled={!interactive}
	{...props}>
	<div class="icon" class:hide={currentScheme == "light"}>
		<Icon icon="solar:moon-line-duotone" width="20" />
	</div>
	<div class="icon" class:hide={currentScheme == "dark"}>
		<Icon icon="solar:sun-linear" width="20" />
	</div>
</button>

<style lang="scss">
button.icon {
	position: relative;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	outline: 2px solid transparent;
	transition: all 0.5s !important;
	.icon {
		position: absolute;
		color: var(--text);
		// transition: all 0.5s !important;
		&.hide {
			opacity: 0;
		}
	}
}
</style>
