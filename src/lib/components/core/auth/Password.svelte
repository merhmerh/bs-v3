<script>
import Divider from "$common/Divider.svelte";
import Icon from "@iconify/svelte";

/**
 * @typedef {Object} Props
 * @property {boolean} [showForgetPassword]
 * @property {boolean} [validatePassword]
 * @property {boolean} [hideLabel]
 */

/** @type {Props} */
let {
	showForgetPassword = false,
	validatePassword = false,
	hideLabel = false,
	showPasswordHint = false,
	onenter = () => {},
	oninput = () => {},
	email = "",
} = $props();
let revealPassword = $state(false);
let passwordInput = $state();
let hint = $state();
let strength = $state(0);
let passwordHint = $state(showPasswordHint);
let passwordErrorMessage = $state("");
let invalidPassword = $state(false);
let passwordPasses = $state(false);

let requirements = $state({
	length15: {
		text: "15 Characters or more",
		check: false,
	},
	length8: {
		text: "8 Characters or more",
		check: false,
	},
	letter: {
		text: "Letter",
		check: false,
	},
	number: {
		text: "Number",
		check: false,
	},
	special: {
		text: "Special character (e.g. !#@$<>&%)",
		check: false,
	},
});

export function validate(highlight = false) {
	const password = passwordInput.value.trim();

	//reset
	strength = 0;
	for (const [key, obj] of Object.entries(requirements)) {
		obj.check = false;
	}
	requirements = requirements;

	if (password.length == 0) {
		hint = "Password cannot be empty";
		strength = 0;

		return showError();
	}

	const uniqueCharacters = new Set(password).size;

	//check for length
	if (password.length >= 15) {
		requirements.length15.check = true;
		if (uniqueCharacters <= 6) {
			hint = "Your password consists of too few unique characters";
			strength = 1;
			return showError();
		}

		strength = 3;
		hint = "Password is good";
		if (checkUniqueCharacters()) {
			strength = 4;
			hint = "Password is strong";
		}

		if (checkForConsecutiveNumbers()) {
			hint = "Password is okay, but try to avoid consecutive numbers";
			strength = 3;
		}
		passwordPasses = true;
		return true;
	}

	let count = 0;

	if (password.length >= 8) {
		requirements.length8.check = true;
		count++;
	}

	if (password.match(/[a-z]/)) {
		requirements.letter.check = true;
		count++;
	}

	if (password.match(/[0-9]/)) {
		requirements.number.check = true;
		count++;
	}

	if (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
		requirements.special.check = true;
		count++;
	}

	if (count < 4) {
		strength = 1;
		hint = "Password does not meet the requirements";
		return showError();
	}

	if (count == 4 && uniqueCharacters <= 8) {
		strength = 2;
		hint = "Password is moderate, use more unique characters";
		return true;
	}

	if (count == 4 && password.length <= 10) {
		strength = 2;
		hint = "Password is moderate";
		return true;
	}

	if (count == 4) {
		strength = 3;
		hint = "Password is good";

		if (password.length >= 12 && checkUniqueCharacters()) {
			strength = 4;
			hint = "Password is strong";
		}

		if (checkForConsecutiveNumbers()) {
			hint = "Password is okay, but try to avoid consecutive numbers";
			strength = 3;
		}

		if (email) {
			for (let len = 4; len <= email.length; len++) {
				for (let i = 0; i <= email.length - len; i++) {
					const sub = email.slice(i, i + len).toLowerCase();
					if (password.toLowerCase().includes(sub)) {
						hint = "Avoid using parts of your email in the password";
					}
				}
			}
		}

		passwordPasses = true;
		return true;
	} else {
		passwordPasses = false;
		return showError();
	}

	function showError() {
		if (highlight) {
			invalidPassword = true;
		}
	}

	function checkUniqueCharacters() {
		const uniqueCharacters = new Set(password);
		return uniqueCharacters.size >= 8;
	}

	function checkForConsecutiveNumbers() {
		const consecutivePattern =
			/(321|123|234|345|456|567|678|789|1234|12345|123456|1234567|12345678|123456789|1234567890)/;
		return consecutivePattern.test(password);
	}
}

export function getValue() {
	return passwordInput.value;
}

export function setError(errorMessage) {
	passwordErrorMessage = errorMessage;
}
</script>

<label class="password">
	{#if passwordHint && validatePassword}
		<div class="password-footer">
			<div
				class="strength"
				class:low={strength == 1}
				class:medium={strength == 2}
				class:high={strength == 3}
				class:veryHigh={strength == 4}>
				<div class="indicator">
					<div></div>
					<div></div>
					<div></div>
				</div>
				<span class="error-message">
					{hint ? hint : "Password cannot be empty"}
				</span>
			</div>
			<div class="requirements mt-2">
				{#each Object.entries(requirements) as [key, value]}
					<div class="req">
						<div class="icon" class:checked={value.check}>
							{#if value.check}
								<Icon icon="ic:baseline-check-circle" />
							{:else}
								<Icon icon="ic:outline-radio-button-unchecked" />
							{/if}
						</div>
						<p>{value.text}</p>
					</div>
					{#if key == "length15"}
						<Divider py="0.5rem" text="or" --c="var(--text-soft)" />
					{/if}
				{/each}
			</div>
		</div>
	{/if}

	{#if passwordErrorMessage}
		<span class="error">{passwordErrorMessage}</span>
	{/if}
	<div class="input-box" class:error={passwordErrorMessage || invalidPassword}>
		<input
			type={revealPassword ? "text" : "password"}
			name="password"
			placeholder="••••••••"
			oninput={(v) => {
				oninput(v);
				invalidPassword = false;
				passwordErrorMessage = false;
				if (validatePassword) {
					validate();
				}
			}}
			onfocus={() => (passwordHint = true)}
			onfocusout={(e) => {
				const target = e.relatedTarget;
				if (target?.classList.contains("reveal-password")) {
					return;
				}
				// passwordHint = !passwordPasses;
			}}
			onkeydown={(e) => {
				if (e.key === "Enter") {
					onenter();
				}
			}}
			bind:this={passwordInput} />
		<div class="icon">
			<button
				tabindex="-1"
				class="reveal-password none icon"
				onclick={() => {
					revealPassword = !revealPassword;
				}}>
				{#if revealPassword}
					<Icon icon="mdi:hide" />
				{:else}
					<Icon icon="mdi:show" />
				{/if}
			</button>
		</div>
	</div>
	{#if !hideLabel}
		<div class="label-title">
			<span>Password</span>
			{#if showForgetPassword}
				<!-- svelte-ignore a11y_positive_tabindex -->
				<a tabindex="1" href="/forgot-password">Forgot password?</a>
			{/if}
		</div>
	{/if}
</label>

<style lang="scss">
label {
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	flex-direction: column-reverse;
	.label-title {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: var(--text-soft);

		a {
			font-size: 0.8125rem;
		}
	}
	.input-box {
		background-color: var(--bg-100);
		.icon {
			aspect-ratio: 1;
			padding-right: 6px;
		}
		input {
			border-radius: 0;
		}
	}
	.password-footer {
		margin-top: 0.5rem;
		.strength {
			display: flex;
			flex-direction: column;
			&.low {
				--c: var(--red);
				div > div:first-child {
					background-color: var(--red);
				}
			}
			&.medium {
				--c: var(--orange);

				div > div:first-child,
				div > div:nth-child(2) {
					background-color: var(--orange);
				}
			}
			&.high,
			&.veryHigh {
				--c: var(--green);

				div > div {
					background-color: var(--green);
				}
			}
			&.veryHigh {
				filter: hue-rotate(180deg);
			}
			.indicator {
				display: flex;
				gap: 0.5rem;
				display: grid;
				grid-template-columns: 50px 50px 50px;
				> div {
					border-radius: 4px;
					width: 50px;
					height: 4px;
					background-color: color-mix(in srgb, var(--mono), 50% transparent);
				}
			}

			.error-message {
				padding-block: 0.5rem;
				font-size: 1rem;
				font-weight: 600;
				color: var(--c);
			}
		}
		.requirements {
			.req {
				display: flex;
				align-items: center;
				gap: 0.25rem;
				p {
					margin: 0;
					color: var(--text-soft);
					font-size: 0.875rem;
				}
			}
		}
		span {
			font-size: 0.875rem;
		}
	}
}
</style>
