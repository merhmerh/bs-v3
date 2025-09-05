<script>
import Icon from "@iconify/svelte";
import Popover from "$common/Popover.svelte";
import AppIcon from "$common/AppIcon.svelte";
import { onMount } from "svelte";
import { apps } from "$data/apps.js";

/**
 * @typedef {Object} Props
 * @property {string} [icon]
 * @property {string} [target]
 */

/** @type {Props} */
let { icon = "material-symbols:apps", target = "_blank" } = $props();
let iconHeight = $state("2.5rem");
let isOpen = $state(false);

onMount(() => {
	updateIconHeight();
});

function updateIconHeight() {
	if (window.innerWidth > 768) {
		iconHeight = "2.5rem";
	} else {
		iconHeight = "1.5rem";
	}
}
</script>

<svelte:window onresize={updateIconHeight} />

<Popover bind:showPopup={isOpen}>
	{#snippet button()}
		<button class="none" class:open={isOpen}>
			<Icon {icon} width="24" />
		</button>
	{/snippet}

	{#snippet popup()}
		<div class="menu">
			<div class="grid">
				{#each apps as app}
					<a href={app.url} class="button none href" {target}>
						<div class="icon">
							<AppIcon glyph={app.glyph} --height={iconHeight} />
						</div>
						<span>{app.appName}</span>
					</a>
				{/each}
			</div>
			<p class="note">Learn more about <a href="/about">BuiltSearch</a></p>
		</div>
	{/snippet}
</Popover>

<style lang="scss">
button {
	outline: none;
	border: 0;
	padding: 0;
	height: 32px;
	width: 32px;
	aspect-ratio: 1;
	border-radius: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	&.open {
		background-color: var(--mono-light);
	}
}

.menu {
	border: 1px solid var(--border-base);
	border-radius: 0.5rem;
	padding: 0.5rem;
	row-gap: 1rem;
	column-gap: 0.5rem;
	--bx-shadow: color-mix(in srgb, var(--mono-dark) 12%, transparent);
	box-shadow: 0 2px 8px 0 var(--bx-shadow);
	position: relative;
	background-color: color-mix(in srgb, var(--bg-200), 25% var(--bg-100));
	margin-top: 0.5rem;
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
	@media screen and (max-width: 768px) {
		.grid {
			display: flex;
			flex-direction: column;
			gap: 0rem;
			padding-inline: 0;
			border-radius: 0.5rem;
			padding: 0;
		}
	}

	a.button {
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		padding: 0.5rem;
		padding-block: 0.75rem;
		border-radius: 0.5rem;
		width: 100%;
		gap: 0.5rem;
		transition: border-radius 0.2s;
		@media screen and (max-width: 768px) {
			flex-direction: row;
			justify-content: flex-start;
			padding-block: 0.5rem;
			border-radius: 0.5rem;
		}
	}
	p {
		margin: 0;
		margin-top: 0.5rem;
		text-align: left;
		padding-inline: 0.5rem;
		color: var(--text-soft);
		font-size: 0.75rem;

		a {
			font-size: 0.75rem;
			color: var(--text-soft);
			text-decoration: underline;
		}
	}
}
</style>
