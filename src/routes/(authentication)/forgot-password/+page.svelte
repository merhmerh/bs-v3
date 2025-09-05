<script>
import AsyncButton from "$common/AsyncButton.svelte";
import AuthCommonWrapper from "$core/auth/AuthCommonWrapper.svelte";
import Email from "$core/auth/Email.svelte";
import { page } from "$app/state";
import Icon from "@iconify/svelte";

let { data } = $props();
const { supabase } = data;
let email = $state();
let sentResetPasswordLink = $state(false);
let errorMessage = $state(null);

async function resetPassword() {
	if (!email.validate()) return;

	const emailValue = email.getValue();
	const { data, error } = await supabase.auth.resetPasswordForEmail(emailValue, {
		redirectTo: page.url.origin + "/reset-password",
	});
	if (error) return console.log(error);
	sentResetPasswordLink = true;
}
</script>

<AuthCommonWrapper>
	<div slot="page-header">
		<h1>Forgot your Password</h1>
		<span>Reset your password</span>
	</div>

	<div slot="page-content" class="content">
		<p class="note">Enter your email and we will send you a link to reset your password.</p>
		{#if errorMessage}
			<div class="info-box warning" style="margin-bottom:-1rem;">
				You need to be signed in to update your password. If you have forgotten your password, click <a
					href="/forgot-password">here</a> to continue.
			</div>
		{/if}
		<Email bind:this={email} />
		{#if sentResetPasswordLink}
			<button class="sent" disabled>
				<div class="icon">
					<Icon icon="material-symbols:check-circle-outline-rounded" height="24" />
				</div>
				Password reset link sent
			</button>
		{:else}
			<AsyncButton --width="100%" onclick={resetPassword}>Send</AsyncButton>
		{/if}
	</div>

	<!-- @migration-task: migrate this slot by hand, `page-footer` is an invalid identifier -->
	<div slot="page-footer">
		<p class="my-0">
			Already have an account? <a class="underline" href="/signin">Sign In</a>
		</p>
	</div>
</AuthCommonWrapper>

<style lang="scss">
.content {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	.note {
		font-size: 0.875rem;
		margin: 0;
		padding: 0;
		margin-bottom: -1rem;
	}
	button.sent {
		display: flex;
		justify-content: center;
		align-items: center;
		--button-bg: color-mix(in srgb, var(--green), 75% transparent);
		color: var(--green);
		font-weight: 500;
		gap: 1rem;
		text-align: center;
		.icon {
			color: var(--green);
		}
	}
}
</style>
