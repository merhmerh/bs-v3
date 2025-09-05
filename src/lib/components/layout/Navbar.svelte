<script>
import AvatarMenu from "$common/AvatarMenu.svelte";
import Logo from "$common/Logo.svelte";
import { page } from "$app/state";
import Apps from "$common/Apps.svelte";
import { signOut } from "$fn/supabase.client.js";
import Theme from "$comp/StateComponent/Preferences/Theme.svelte";

let { data } = $props();
let header = $state();
let showMenu = $state(true);
let innerWidth = $state(0);

const links = [
	{ href: "/about", text: "About", short: "About" },
	{ href: "/privacy", text: "Privacy Policy", short: "Privacy" },
	{ href: "/terms", text: "Terms of Service", short: "Terms" },
];
</script>

<svelte:window bind:innerWidth />

<header bind:this={header} class:showMenu>
	<div class="header-content">
		<Logo glyph="B" height="2.25rem" responsive />

		<div class="menu">
			{#if page.route.id.startsWith("/(public)/")}
				<div class="legal-links">
					{#each links as link}
						<a href={link.href} class:selected={page.url.pathname == link.href}
							>{innerWidth > 520 ? link.text : link.short}</a>
					{/each}
				</div>
			{/if}
			<Apps />
			<Theme />
			{#if data.userData}
				<AvatarMenu src={data.userData.avatar} fallback={data.userData.display_name}>
					<a class="menu-item" href="/settings">Account Settings</a>
					<div class="divider"></div>
					<a class="menu-item" href="/terms">Terms</a>
					<a class="menu-item" href="/privacy">Privacy</a>
					<div class="divider"></div>
					<button class="menu-item none" onclick={signOut}> Sign Out</button>
				</AvatarMenu>
			{:else}
				<a class="button outlined" href="/signin">Sign In</a>
				<a class="button primary signup" href="/signup">Get Started</a>
			{/if}
		</div>
	</div>
</header>

<style lang="scss">
header {
	display: flex;
	flex-direction: column;
	padding-inline: 1rem;
	padding-block-start: 12px;
	padding-block-end: 12px;
	border-bottom: 1px solid var(--border);
	position: sticky;
	top: 0;
	width: 100%;
	z-index: 100;
	height: var(--height, auto);
	transition: height 0.3s;
	background-color: color-mix(in srgb, var(--bg-100), 12% transparent);
	backdrop-filter: blur(6px);

	@media screen and (max-width: 768px) {
		&.showMenu {
			padding-block-end: 0.25rem;
		}
	}

	.header-content {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		align-items: center;
		@media screen and (max-width: 768px) {
			gap: 0.5rem;
		}

		.menu {
			margin-left: auto;
			display: flex;
			align-items: center;
			gap: 0.25rem;
			.menu-item {
				flex-wrap: nowrap;
				text-wrap: nowrap;
				font-size: 0.875rem;
				border-radius: 0.5rem;
				flex-shrink: 0;
				border-radius: 0;
				&:hover {
					background-color: var(--bg-200);
				}
			}
			.legal-links {
				margin-right: 1.5rem;
				display: flex;
				font-size: 0.875rem;
				gap: 2rem;
				a {
					color: Var(--text);
					&:hover {
						color: var(--url);
					}
				}
				@media screen and (max-width: 768px) {
					gap: 1rem;
					margin-right: 1.5rem;
				}
			}
		}
	}
}
</style>
