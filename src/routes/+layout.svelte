<script>
import { invalidate, invalidateAll, onNavigate } from "$app/navigation";
import PageProgressBar from "$common/PageProgressBar.svelte";

import "$src/app.css";
import "$style/main.scss";
import "$style/theme.scss";

import { onMount } from "svelte";
import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";
import Seo from "$common/SEO.svelte";
import Dialog from "$comp/StateComponent/Dialog/Dialog.svelte";
import { setDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { setPopoverState } from "$comp/StateComponent/Popover/PopoverState.svelte.js";
import PopoverOverlay from "$comp/StateComponent/Popover/PopoverOverlay.svelte";
import Navbar from "$comp/layout/Navbar.svelte";
import Footer from "$common/Footer.svelte";
import { setThemeState } from "$comp/StateComponent/Preferences/ThemeState.svelte.js";
import { setOrgState } from "$lib/states/OrgState.svelte.js";
import { page } from "$app/state";
import { updateClient } from "$fn/hono.js";
import { setOverlayPanelState } from "$comp/StateComponent/OverlayPanelState/OverlayPanelState.svelte.js";
import OverlayPanel from "$comp/StateComponent/OverlayPanelState/OverlayPanel.svelte";
import { setToastState } from "$comp/StateComponent/Toasts/ToastState.svelte.js";
import Toast from "$comp/StateComponent/Toasts/Toast.svelte";

let { data, children } = $props();
let { session, supabase } = $derived(data);
let mounted = $state(false);
let alreadySignedIn = $state(false);

const t = setThemeState();
setToastState();
setPopoverState();
setDialogState();
setOrgState();
setOverlayPanelState();

if (!dev) {
	inject({ mode: dev ? "development" : "production" });
}

/** live reloading causing page to refresh while modal is open, causing overflow to be hidden. this unset whenever page is reloaded */
// $effect(() => {
// if (dev && mounted && data) {
// 	document.documentElement.style.overflow = "unset";
// 	document.documentElement.classList.remove("scrollbar-gutter");
// }
// });

onNavigate(() => {
	document.documentElement.style.overflow = "unset";
	document.documentElement.classList.remove("scrollbar-gutter");
});

$effect(() => {
	const token = page.data?.session?.access_token;
	updateClient(token);
});

onMount(async () => {
	t.initTheme();
	document.body.style.visibility = "visible";
	mounted = true;
	const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
		if (alreadySignedIn == false && event === "SIGNED_IN") {
			invalidate("supabase:auth");
			alreadySignedIn = true;
			await invalidateAll();
			console.log("invalidate all");
			return;
		}

		if (newSession) {
			alreadySignedIn = true;
		}

		if (newSession?.expires_at !== session?.expires_at) {
			invalidate("supabase:auth");
		}
	});
	return () => data.subscription.unsubscribe();
});
</script>

<svelte:head>
	<Seo />
</svelte:head>

<Toast small />
<PopoverOverlay />
<PageProgressBar />
<OverlayPanel />
<Dialog />

{#if !page.route.id.startsWith("/(authentication)/")}
	<Navbar {data} />
{/if}

<main>
	{@render children?.()}
</main>
{#if !page.route.id.startsWith("/(authentication)/")}
	<Footer />
{/if}

<style lang="scss">
main {
	position: relative;
	min-height: calc(100vh - 68px);
	margin-inline: auto;
}
</style>
