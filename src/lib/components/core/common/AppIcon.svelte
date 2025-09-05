<script>
import glyphJSON from "$common/glyph.json";
import { theme } from "$common/theme.store.js";

/**
 * @typedef {Object} Props
 * @property {string} [glyph]
 * @property {string} [themeOverride]
 */

/** @type {Props} */
let { glyph = $bindable("B") } = $props();
let url = createImage();

function createImage() {
	const glyphData = glyphJSON[glyph];
	const base64Svg = btoa(glyphData);
	return `data:image/svg+xml;base64,${base64Svg}`;
}

let t;
</script>

<img src={url} alt="glyph_icon" draggable="false" />

<style lang="scss">
img {
	aspect-ratio: 1;
	height: var(--height);
}
</style>
