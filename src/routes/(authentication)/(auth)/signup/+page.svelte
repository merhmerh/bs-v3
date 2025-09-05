<script>
import AsyncButton from "$common/AsyncButton.svelte";
import Email from "$core/auth/Email.svelte";
import Password from "$core/auth/Password.svelte";
import { showVerifyEmail } from "../auth.store.js";

let { data } = $props();
const { supabase } = data;
let signUpError = $state();

let email = $state(),
	password = $state();

async function signUp() {
	if (!email.validate()) return;
	if (!password.validate(true)) return;

	//to do check if email is already sign up.
	//if not verified yet, show modal to verify email

	const { data, error } = await supabase.auth.signUp({
		email: email.value(),
		password: password.getValue(),
		options: {
			emailRedirectTo: `${window.location.origin}/email-verified`,
		},
	});

	console.log(data, error);
	if (error) {
		signUpError = error.message;
		return;
	}

	$showVerifyEmail = email.value();
}
</script>

{#if signUpError}
	<div class="info-box error">
		{signUpError}
	</div>
{/if}

<Email bind:this={email} />
<Password bind:this={password} validatePassword showPasswordHintAuto={true} />

<AsyncButton primary lg --width="100%" --mt="1rem" onclick={signUp}>Sign Up</AsyncButton>
