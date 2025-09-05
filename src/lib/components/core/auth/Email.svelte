<script>
let { onEnter = () => {} } = $props();

let emailValue = $state("");
let emailError = $state(null);
let showError = true;

export function value() {
	return emailValue;
}
export function validate() {
	const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

	if (emailRegex.test(emailValue)) {
		return true;
	}

	if (emailValue.length === 0) {
		emailError = "Email is required";
	} else {
		emailError = "Invalid email format";
	}
	return false;
}

export function setError(errorMessage) {
	if (!errorMessage) {
		emailError = null;
		return;
	}

	emailError = errorMessage;
}
</script>

<label class="email">
	<span class="label">Email Address</span>
	<input
		type="text"
		autocomplete="email"
		autocorrect="off"
		spellcheck="false"
		required
		placeholder="you@email.com"
		oninput={() => (emailError = null)}
		onkeydown={(e) => {
			if (e.key == "Enter") {
				onEnter();
			}
		}}
		bind:value={emailValue}
		class:error={emailError} />
	{#if showError && emailError !== null}
		<span class="error">{emailError}</span>
	{/if}
</label>

<style lang="scss">
label {
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	input.error {
		&::placeholder {
			color: color-mix(in srgb, var(--red), 25% transparent);
		}
	}
	span {
		font-size: 0.875rem;
		.label {
			color: var(--text-soft);
		}
	}
}
</style>
