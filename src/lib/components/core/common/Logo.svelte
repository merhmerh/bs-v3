<script>
import AppIcon from "$common/AppIcon.svelte";
import { getThemeState } from "$comp/StateComponent/Preferences/ThemeState.svelte.js";

import logo_light from "$lib/assets/builtsearch_logo.svg";
import logo_dark from "$lib/assets/builtsearch_logo_dark.svg";
/**
 * @typedef {Object} Props
 * @property {string} [glyph]
 * @property {string} [appName]
 * @property {string} [themeOverride]
 * @property {string} [height]
 * @property {boolean} [responsive]
 * @property {string} [href]
 */

/** @type {Props} */
let {
	glyph = $bindable("B"),
	appName = "",
	themeOverride = "",
	height = "48px",
	responsive = false,
	href = "/",
} = $props();

let t = getThemeState();

$effect.pre(() => {
	glyph = glyph.toUpperCase();
});

function setScheme() {
	let lt = "";
	if (themeOverride) {
		lt = themeOverride;
	} else {
		lt = t.theme.scheme;
	}
	return lt == "light" ? logo_light : logo_dark;
}
</script>

<a class="button none no-hover" {href}>
	{#if glyph}
		<AppIcon {glyph} --height={height} />
	{/if}
	<div class="name" class:hide={responsive}>
		<img class="logo" src={setScheme()} alt="logo" draggable="false" />
		{#if appName}
			<span class:light={t == "light"}>{appName}</span>
		{/if}
	</div>
</a>

<style lang="scss">
a {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: none;
	background-color: transparent;
	cursor: pointer;
	gap: 0.5rem;
	flex-shrink: 0;
	width: 200px;
	@media screen and (max-width: 768px) {
		width: auto;
	}
	img,
	span {
		user-select: none;
		pointer-events: none;
	}
	.name {
		display: flex;
		align-items: baseline;
		&.hide {
			@media screen and (max-width: 768px) {
				display: none;
			}
		}
		span {
			margin-left: 4px;
			font-family: "Montserrat", sans-serif;
			font-weight: 600;
			color: #dcdfed;
			font-size: 24px;
			line-height: 0px;
			&.light {
				color: #303941;
			}
		}
	}

	.logo {
		margin-top: -4px;
		height: 24px;
	}
}
</style>
