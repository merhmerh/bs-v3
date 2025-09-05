<script>
import { dev } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import { theme } from "$common/theme.store.js";
import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID } from "$env/static/public";
import { onMount } from "svelte";

let gsi_container = $state();
let mounted = false;
let GSI_ready = $state(false);
const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
const encoder = new TextEncoder();
const encodedNonce = encoder.encode(nonce);

onMount(() => {
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

	const width = gsi_container.getBoundingClientRect().width;
	google.accounts.id.renderButton(el, {
		theme: $theme == "dark" ? "filled_black" : "filled_white",
		text: "continue_with",
		width: width,
	});
}
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

<div class="googleSignIn flex justify-center" bind:this={gsi_container}></div>
