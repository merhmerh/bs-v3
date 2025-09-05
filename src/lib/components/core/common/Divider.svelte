<script>
/**
 * @typedef {Object} Props
 * @property {string} [text]
 */

/** @type {Props} */
let {
	text = "",
	light,
	children,
	vertical = false,
	padding_block = 0,
	padding_inline = 0,
	opacity = 1,
	...props
} = $props();

padding_block = props?.paddingBlock || props?.py || padding_block;
padding_inline = props?.paddingInline || props?.px || padding_inline;
</script>

{#if vertical}
	<div
		class="divider-component vertical"
		class:light
		style="--padding-block: {padding_block}; --padding-inline: {padding_inline}; opacity: {opacity}">
		<div class="line"></div>
	</div>
{:else}
	<div
		class="divider-component horizontal"
		class:light
		style="--padding-block: {padding_block}; --padding-inline: {padding_inline}; opacity: {opacity}">
		<div class="line"></div>
		{#if text}
			<span>{text}</span>
		{:else}
			{@render children?.()}
		{/if}
		<div class="line"></div>
	</div>
{/if}

<style lang="scss">
.divider-component {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-block: var(--padding-block, 0);
	padding-inline: var(--padding-inline, 0);
	padding-left: var(--padding-left, 0);
	&.horizontal {
		span {
			font-size: 0.875rem;
			padding-inline: var(--px, 0.5rem);
			color: var(--c, var(--text-base));
			text-align: center;
			text-wrap: nowrap;
		}
		.line {
			height: 1px;
			width: 100%;
			background-color: var(--border);
		}
	}
	&.vertical {
		width: 1px;
		height: 100%;
		min-height: 1.5rem;
		position: relative;
		.line {
			position: absolute;
			width: 1px;
			height: 100%;
			background-color: var(--border);
		}
	}
	&.light {
		.line {
			opacity: 0.25;
			background-color: color-mix(in srgb, var(--primary), 50% var(--border));
		}
	}
}
</style>
