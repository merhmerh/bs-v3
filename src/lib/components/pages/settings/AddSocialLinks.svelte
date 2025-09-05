<script>
import Icon from "@iconify/svelte";
import { socialIcons } from "$data/social_links.js";
import ButtonSelect from "$comp/main/ButtonSelect.svelte";
import { onMount } from "svelte";

let { socials = $bindable(), coloredIcon = false, onchange = () => {} } = $props();
let buttonSelect = $state(null);
let visibleSocials = $state([]);

let dropdownOptions = $derived.by(() => {
	const keys = visibleSocials.map((x) => x.key);
	return socialIcons.filter((x) => !keys.includes(x.key));
});

let errorData = $state({ whatsapp: null });

const basic = ["website"];

onMount(() => {
	for (const key of basic) {
		const data = socialIcons.find((x) => x.key.toLowerCase() == key);
		if (data) {
			visibleSocials.push(data);
		}
	}
	for (const [key, value] of Object.entries(socials)) {
		if (basic.includes(key)) continue;

		const k = key.toLowerCase();
		const data = socialIcons.find((x) => x.key.toLowerCase() == k);
		visibleSocials.push(data);
	}
});

export function get() {
	const s = {};

	for (const [k, v] of Object.entries(socials)) {
		if (!v) continue;
		s[k] = v
			.replace(/\s/g, "")
			.trim()
			.replace(/\u200B/g, "");
	}

	return s;
}

export function setError(obj) {
	errorData = obj;
}

function addOption(s) {
	visibleSocials.push(s);
}
</script>

<div class="container">
	{#each visibleSocials as s}
		{@render input(s)}
	{/each}

	{#if dropdownOptions.length !== 0}
		<div class="field add-more mt-2">
			<div class="button-select">
				<ButtonSelect
					onAddOption={(key) => {
						addOption(socialIcons.find((x) => x.key == key));
					}}
					bind:this={buttonSelect}
					buttonText="Add Another Social Link"
					fallbackOptionValue={socialIcons
						.filter((x) => {
							return !visibleSocials.map((x) => x.key).includes(x.key);
						})
						.map((x) => {
							return { value: x.key, display_value: x.name };
						})}>
					{#each dropdownOptions as s}
						<button
							class="none"
							onclick={() => {
								buttonSelect.closeDropdown();
								addOption(s);
							}}>
							<div class="icon">
								<Icon icon={!coloredIcon ? s.icon : s.coloredIcon} width="20" />
							</div>
							<span>{s.name}</span>
						</button>
					{/each}
				</ButtonSelect>
			</div>
		</div>
	{/if}

	<p class="note">Enter full URL of your social media profile.</p>
</div>

{#snippet input(s)}
	<div class="field">
		<div class="row">
			<div class="icon">
				<Icon icon={!coloredIcon ? s.icon : s.coloredIcon} width="24" />
			</div>
			<span>{s.name}</span>
		</div>
		<div class="row">
			<input
				class:error={errorData[s.key]}
				class="clear"
				type="text"
				name={s.key}
				placeholder={s.name}
				oninput={() => {
					errorData[s.key] = null;
				}}
				bind:value={socials[s.key]} />
			<!-- {#if socials[s.key]} -->
			<button
				class="icon none clear"
				onclick={() => {
					if (socials[s.key]) {
						socials[s.key] = "";
						errorData[s.key] = null;
					} else {
						delete socials[s.key];
						visibleSocials = visibleSocials.filter((x) => x.key != s.key);
					}
				}}>
				<Icon icon="lucide:x" width="16" />
			</button>
			<!-- {/if} -->
		</div>
		{#if errorData[s.key]}
			<span class="error">{errorData[s.key]}</span>
		{/if}
	</div>
{/snippet}

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: var(--width, 100%);
	@media screen and (max-width: 768px) {
		margin-top: 1rem;
		gap: 1rem;
	}
}
.field {
	display: grid;
	grid-template-columns: 124px 1fr;
	gap: 0.5rem;
	font-size: 0.875rem;
	align-items: center;

	@media screen and (max-width: 768px) {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-start;
	}
	.row {
		display: flex;
		align-items: center;
		position: relative;
		gap: 0.5rem;
		width: 100%;
		input {
			width: 100%;
		}
		button.clear {
			position: absolute;
			right: 0.5rem;
			background-color: var(--bg-100);
		}
	}

	&.add-more {
		.button-select {
			grid-column: 2;
			width: min(250px, 100%);
			font-size: 0.875rem;
			@media screen and (max-width: 768px) {
				width: 250px;
			}

			button {
				display: flex;
				justify-content: center;
				width: 100%;
				gap: 1rem;
				padding-inline: 1rem;
				align-items: center;
				padding-block: 0.375rem;
				border-radius: 0;
				font-size: inherit;
				&:not(:last-child) {
					border-bottom: 1px solid var(--border-base);
				}
				span {
					width: 100%;
					text-align: left;
				}
			}
		}
	}
	span.error {
		width: fit-content;
		font-size: 0.875rem;
		grid-column: 2 / 3;
		@media screen and (max-width: 768px) {
			margin-top: -0.25rem;
		}
	}
}
p.note {
	font-size: 0.75rem;
	color: var(--text-light);
	margin: 0;
	margin-left: 130px;
	@media screen and (max-width: 768px) {
		margin-left: 0;
	}
}
</style>
