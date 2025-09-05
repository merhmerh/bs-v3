<script>
import { setSocialURL, socialIcons } from "$data/social_links.js";
import { copyToClipboard } from "$fn/helper.client.js";
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

let { socials } = $props();
let mounted = $state(false);
//don't use ssr for socials icon
onMount(() => {
	mounted = true;
	// console.log(socials);
	// console.log(socials["linkedIn"]);
});
</script>

{#if mounted}
	{#each socialIcons as { key, icon }}
		<!-- this is a temporary fix as some database entry have key as linkedIn instead of linkedin -->
		{#if socials && socials[key.replace("linkedin", "linkedIn")]}
			{#if key == "email"}
				<button
					class="none icon"
					onclick={() => {
						copyToClipboard(socials[key], {
							successMessage: "Email copied to clipboard!\n" + socials[key],
							fallbackMessage: `Email: ${socials[key]}`,
						});
					}}>
					<Icon {icon} height="24" />
				</button>
			{:else}
				<a href={setSocialURL(key, socials[key])} target="_blank">
					<Icon {icon} height="24" />
				</a>
			{/if}
		{/if}
	{/each}
{/if}

<style lang="scss">
a,
button {
	height: 1rem;
	color: color-mix(in srgb, var(--text), 24% transparent);
	transition: all 0.3s;
	width: 24px;
	height: 24px;
	transition: none;
	padding: 0;
	cursor: pointer;
	&:hover {
		background-color: transparent;
		color: var(--primary);
	}
}
</style>
