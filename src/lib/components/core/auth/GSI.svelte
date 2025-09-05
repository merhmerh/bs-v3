<script>
import { dev } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import { getThemeState } from "$comp/StateComponent/Preferences/ThemeState.svelte.js";
import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID } from "$env/static/public";
import { onMount } from "svelte";

let mounted = false;
let GSI_ready = $state(false);
const t = getThemeState();
const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
const encoder = new TextEncoder();
const encodedNonce = encoder.encode(nonce);
let gsiTheme = $state(null);

onMount(() => {
	const scheme = t.theme.scheme == "dark" ? "filled_black" : "filled_white";
	gsiTheme = scheme;
	window.handleSignInWithGoogle = handleSignInWithGoogle;
	mounted = true;
	initGoogleSignIn();
});

async function handleSignInWithGoogle(response) {
	const { supabase } = page.data;
	const { data, error } = await supabase.auth.signInWithIdToken({
		provider: "google",
		token: response.credential,
		nonce: nonce,
	});

	invalidateAll();
}

async function initGoogleSignIn() {
	if (!GSI_ready) return;
	if (!mounted) return;

	const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

	google.accounts.id.initialize({
		client_id: PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
		callback: handleSignInWithGoogle,
		nonce: hashedNonce,
		use_fedcm_for_prompt: true,
	});

	if (!dev) {
		google.accounts.id.prompt();
	}

	const el = document.querySelector(".googleSignIn");

	google.accounts.id.renderButton(el, {
		theme: t.theme.scheme == "dark" ? "filled_black" : "filled_white",
		text: "continue_with",
		width: 350,
	});
}

$effect(() => {
	t.theme.scheme;
	if (!GSI_ready || !mounted) return;

	const el = document.querySelector(".googleSignIn");
	if (el) {
		el.innerHTML = "";
		google.accounts.id.renderButton(el, {
			theme: t.theme.scheme == "dark" ? "filled_black" : "filled_white",
			text: "continue_with",
			width: 350,
		});
	}
});
</script>

<svelte:head>
	<script
		src="https://accounts.google.com/gsi/client"
		async
		onload={() => {
			GSI_ready = true;
			initGoogleSignIn();
		}}></script>
</svelte:head>

<div class="googleSignIn flex justify-center"></div>

<style lang="scss">
.googleSignIn {
	color-scheme: light;
}
</style>
