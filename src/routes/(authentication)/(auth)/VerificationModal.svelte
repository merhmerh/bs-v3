<script>
import Modal from "$common/Modal.svelte";
import Icon from "@iconify/svelte";
import AsyncButton from "$common/AsyncButton.svelte";
import { showVerifyEmail } from "./auth.store.js";
import { onDestroy, onMount, tick } from "svelte";

let modal = $state();
let countdown = $state(60);
let verifiedModalDisplayed = $state(false);

onMount(async () => {
	modal.open();
	await tick();
	verifiedModalDisplayed = true;
	const interval = setInterval(() => {
		countdown = countdown - 1;
		if (countdown == 0) {
			clearInterval(interval);
		}
	}, 1000);
});

onDestroy(() => {
	modal.close();
});
</script>

<Modal
	bind:this={modal}
	exitOutsideClick={false}
	exitWithEscapeKey={false}
	closeButton={false}
	modalPosition="top">
	<div class="content">
		<div class="icon">
			<Icon icon="lucide:mail" width="40" height="40" />
		</div>
		<h1>Verify your email</h1>

		<p>We have sent a verification link to <b>{$showVerifyEmail.email}</b>.</p>

		<p>Please click on the link to complete the verification process.</p>

		<div class="py-4 flex flex-col items-center">
			<AsyncButton
				disabled={countdown > 0}
				onclick={() => {
					alert("this function is not ready yet");
				}}>Resend Verification Email</AsyncButton>
			{#if countdown}
				<p class="pt-2 text-sm">Please wait {countdown}s before trying again</p>
			{/if}
		</div>
		<p class="text-sm">
			If you do not receive the email within a few minutes, please check your spam folder.
		</p>
		<div class="divider mt-2"></div>

		<p class="text-sm">
			Return to <a href="/">Home</a> or try
			<a href="/signin" onclick={($showVerifyEmail = null)}>Signing In</a>
		</p>
	</div>
</Modal>

<style lang="scss">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: min(600px, 80vw);
	gap: 1rem;
	.icon {
		background-color: var(--primary);
		color: var(--text-alt);
		padding: 1rem;
		border-radius: 50%;
	}

	p {
		text-align: center;
		margin: 0;
		&.text-sm {
			color: var(--text-soft);
		}
	}
}
</style>
