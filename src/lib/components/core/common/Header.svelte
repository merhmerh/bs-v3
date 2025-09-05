<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script>
import Logo from "$common/Logo.svelte";
export let glyph = "B";
export let appName = "";
export let height = "36px";
export let background = "";
export let responsive = false;
export let icon = true;
</script>

<header class:bg-transparent={background == "transparent"} class:responsive>
	<div class="header-content">
		{#if icon}
			<Logo {glyph} {appName} {height} {responsive} />
		{:else}
			<slot name="icon" />
		{/if}

		<div class="slot">
			<slot name="content" />
		</div>
	</div>

	<div class="nav">
		<slot name="nav" />
	</div>
</header>

<style lang="scss">
header {
	z-index: 100;
	display: flex;
	align-items: center;
	padding-inline: 1rem;
	padding-block-start: 12px;
	padding-block-end: 12px;
	border-bottom: 1px solid var(--mono-light);
	position: sticky;
	top: 0;
	width: 100%;
	flex-direction: column;
	background: color-mix(
		in srgb,
		var(--bg-100),
		var(--transparency, 24%) transparent
	);
	backdrop-filter: blur(6px);
	&.bg-transparent {
		background-color: transparent !important;
		padding-block-end: 12px;
		border-bottom: 0;
	}
	.header-content {
		display: flex;
		width: 100%;
	}
	.slot,
	.nav {
		width: 100%;
	}
}
</style>
