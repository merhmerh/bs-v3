<script>
import { goto, invalidateAll } from "$app/navigation";
import AsyncButton from "$common/AsyncButton.svelte";
import AuthCommonWrapper from "$core/auth/AuthCommonWrapper.svelte";
import Password from "$core/auth/Password.svelte";
let { data } = $props();
const { supabase } = data;
let errorMessage = $state(null);
let password = $state();

//todo - add validation to password reset, ensure password reset link is valid

async function updatePassword() {
	const newPassword = password.getValue();

	if (!password.validate(true)) {
		return;
	}

	const { error } = await supabase.auth.updateUser({ password: newPassword });
	if (error) {
		console.log(error);
		errorMessage = error.message;
		return;
	}

	await invalidateAll();
	await goto("/");
}
</script>

<AuthCommonWrapper>
	{#snippet header()}
		<h1>Reset your Password</h1>
		<span>Type in a new secure password.</span>
	{/snippet}

	{#snippet content()}
		<div class="content">
			{#if errorMessage}
				<div class="info-box warning" style="margin-bottom:-1rem;">
					{errorMessage}
				</div>
			{/if}
			<Password bind:this={password} validatePassword />

			<AsyncButton primary lg --width="100%" onclick={updatePassword}
				>Save New Password</AsyncButton>
		</div>
	{/snippet}

	{#snippet footer()}
		<p class="my-0">
			Already have an account? <a class="underline" href="/signin">Sign In</a>
		</p>
	{/snippet}
</AuthCommonWrapper>

<style lang="scss">
.content {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
</style>
