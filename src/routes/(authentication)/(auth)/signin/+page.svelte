<script>
import { invalidateAll } from "$app/navigation";
import AsyncButton from "$common/AsyncButton.svelte";
import Email from "$core/auth/Email.svelte";
import Password from "$core/auth/Password.svelte";
import { showVerifyEmail } from "../auth.store.js";

let { data } = $props();
const { supabase } = data;
let signInButton = $state(null);

let email = $state(),
	password = $state(),
	toResendEmailVerification = $state(false);

async function signInWithEmail() {
	if (!email.validate()) return;

	const { data, error } = await supabase.auth.signInWithPassword({
		email: email.value(),
		password: password.getValue(),
	});

	if (error) {
		const code = error.code;
		if (code == "email_not_confirmed") {
			email.setError("Please verify your email to continue");
			toResendEmailVerification = true;
		} else if (code == "invalid_credentials") {
			email.setError("Invalid email or password");
		} else {
			email.setError(error.message);
		}

		return;
	}

	if (data) {
		invalidateAll();
	}
}

async function sendVerification() {
	const { data, error } = await supabase.auth.signInWithOtp({
		email: email.value(),
		options: {
			emailRedirectTo: `${window.location.origin}/email-verified`,
		},
	});

	$showVerifyEmail = email.value();
	toResendEmailVerification = false;
}
</script>

<Email bind:this={email} />
{#if toResendEmailVerification}
	<AsyncButton primary mono small --width="100%" onclick={sendVerification}>
		Resend Email Verification Link
	</AsyncButton>
{/if}
<Password bind:this={password} showForgetPassword onenter={() => signInButton.click()} />

<AsyncButton
	lg
	primary
	bind:this={signInButton}
	--width="100%"
	--mt="1rem"
	onclick={signInWithEmail}>Sign In</AsyncButton>
