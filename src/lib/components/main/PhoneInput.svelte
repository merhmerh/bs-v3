<script>
import Icon from "@iconify/svelte";
import { prioritizedCountries } from "$data/country_code.js";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { onMount } from "svelte";
import ComboBox2 from "$common/ComboBox2.svelte";

let {
	phone = $bindable(),
	error = $bindable(null),
	oninput = () => {},
	onclear = () => {},
} = $props();
let dial_code = $state("");
let tel_national = $state("");
let init = false;
let dial_combo_box = $state(null);
let parseErrorMessage = $state(null);

onMount(() => {
	parsePhone();
});

function parsePhone() {
	parseErrorMessage = null;
	if (!phone) return;

	try {
		const parsed = parsePhoneNumberWithError(phone);
		if (!parsed) return;
		dial_code = "+" + parsed.countryCallingCode;
		tel_national = parsed.formatNational();
	} catch (e) {
		const codeMap = {
			TOO_SHORT: "Phone number is too short",
			TOO_LONG: "Phone number is too long",
			INVALID_COUNTRY: "Requires a valid country code",
		};
		console.log(e.message);
		parseErrorMessage = codeMap[e.message] || "Invalid phone number";
		return;
	}
}

$effect(() => {
	phone;
	parsePhone();
});

let countries_code = prioritizedCountries.map((x) => {
	return {
		name: x.dial_code,
		display_value: `${x.name} (${x.dial_code})`,
	};
});

export function clear() {
	tel_national = "";
	dial_code = "";
	phone = null;
	dial_combo_box.clear();
}
</script>

<div class="phone-input-container">
	<div class="input-box clear dial-code-input-box" class:error>
		<ComboBox2
			bind:this={dial_combo_box}
			bind:selectedValue={dial_code}
			options={countries_code}
			placeholder="+XXX"
			onchange={() => {
				phone = dial_code + tel_national.replace(/\s/g, "");
				oninput();
			}}
			--min-width="100px"
			--dropdown-width="300px" />

		<div class="divider"></div>

		<input
			type="tel"
			placeholder="9123 4567"
			autocomplete="tel-national"
			bind:value={tel_national}
			oninput={() => {
				phone = dial_code + tel_national.replace(/\s/g, "");
				oninput();
			}}
			onfocusout={() => {
				parsePhone();
			}} />

		<button
			class="icon none clear"
			onclick={() => {
				dial_code = "";
				dial_combo_box.clear();
				tel_national = "";
				parseErrorMessage = null;
				onclear();
			}}>
			<Icon icon="lucide:x" width="16" />
		</button>
	</div>
</div>
{#if parseErrorMessage}
	<span class="error">{parseErrorMessage}</span>
{/if}

<style lang="scss">
.phone-input-container {
	width: 100%;
	position: relative;
	height: var(--height, "auto");
	display: flex;
	align-items: center;
	height: 2.5rem;
	.divider {
		height: 100%;
		width: 1px;
		background-color: var(--border-base);
	}
	.dial-code-input-box {
		width: 100%;
		padding-inline: 0;
		height: 100%;
		padding-block: 0;

		input {
			padding-block: 0.5rem;
			padding-left: 0.5rem;
		}
	}
	button.clear {
		margin-right: 0.375rem;
	}
}

.dial-code-input-box :global {
	font-size: 0.875rem;
	.input-box {
		border: 0;
		padding-block: 0;
		--border-color: transparent;
		outline: none !important;
		background-color: transparent;
		padding-left: 0.5rem;
	}
	input {
		height: auto !important;
	}
}
</style>
