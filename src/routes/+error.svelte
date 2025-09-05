<script>
import { page } from "$app/state";
import Navbar from "$comp/layout/Navbar.svelte";
import { randomBetween, timeout } from "$fn/helper.js";
import { onMount } from "svelte";
import Icon from "@iconify/svelte";

let { data } = $props();

let footnote = $state(null);

let error = $state(initError());

function initError() {
	const href = page.url.href;
	if (href.endsWith(".php")) {
		return {
			title: "PHP? Really?",
			message: "We are not even using PHP. What are you trying to do?",
			footnote: "Trying to be sneaky? ( ︶︿︶)_╭∩╮",
		};
	}

	if (href.includes("wp-")) {
		return {
			title: "Nice Try",
			message: "I see what you did there, but Wordpress is not our thing.",
			footnote: 'Now get lost. "( – ⌓ – )',
		};
	}

	return page.error;
}

onMount(() => {
	console.log(page.error);
	document.body.style.width = "100%";
	document.documentElement.style.width = "100%";

	document.documentElement.style.height = "auto";
	document.body.style.height = "auto";

	document.documentElement.style.backgroundColor = "var(--bg-100)";
	document.body.style.backgroundColor = "var(--bg-100)";
});

onMount(() => {
	renderFootnote();
});

async function renderFootnote() {
	if (footnote) {
		const value = footnote.textContent;
		footnote.textContent = "";
		const pipe = "¦";
		const t0 = performance.now();
		for (const v of value) {
			footnote.textContent = footnote.textContent.replace(pipe, "") + v + pipe;

			let toFast = Math.random() < 0.9;
			let rand = toFast ? randomBetween(20, 40) : randomBetween(100, 160);

			await timeout(rand);
		}
		footnote.textContent = footnote.textContent.replace(pipe, "");
		const t1 = performance.now();
		console.log("Footnote rendered in", t1 - t0, "ms");
	}
}
</script>

{#snippet messages(err)}
	{#if typeof err == "string"}
		<p class="error">{err}</p>
	{/if}
	{#if typeof err == "object"}
		<h2 class="title">{err.title || "Uh Oh!"}</h2>

		<p class="message">{err.message}</p>

		{#if err.footnote}
			<div class="footnote" bind:this={footnote}>{err.footnote}</div>
		{/if}
	{/if}
{/snippet}

{#snippet error500()}
	<h2 class="title">Internal Server Error</h2>

	<div class="messages">
		<p class="message">
			Something went wrong on our end. We're working to fix it as soon as possible.
		</p>
		<p class="message">
			If you need immediate assistance, contact us at
			<a href="mailto:support@builtsearch.com"> support@builtsearch.com </a>
		</p>
	</div>
	<div class="footnote" bind:this={footnote}>
		We probably broke something. Sorry about that :&lt;
	</div>
{/snippet}

<main class="error">
	<h1>{page.status}</h1>

	<div class="error-message">
		{#if page.status >= 500 && page.status < 600}
			{@render error500()}
		{:else}
			{@render messages(error)}
		{/if}
	</div>

	<a class="home button mono" href="/">
		<div class="icon">
			<Icon icon="lucide:home" width="16" />
		</div>
		<span>Return Home</span>
	</a>

	{#if page.error.message}
		<div class="error-code">
			Error Message: {page.error.message}
		</div>
	{/if}
</main>

<style lang="scss">
main.error {
	display: flex;
	min-height: calc(100dvh - 60px);
	width: 600px;
	margin-inline: auto;
	padding-top: 2rem;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	@media screen and (max-width: 768px) {
		width: 100%;
		padding-inline: 2rem;
	}
	h1 {
		font-size: 256px;
		font-weight: 900;
		font-family: var(--font-serif);
		@media screen and (max-width: 768px) {
			font-size: 128px;
		}
	}

	.error-code {
		margin-block: 1rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
		color: var(--text-light);
		text-align: center;
		white-space: pre-wrap;
	}

	.error-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(450px, 100%);
		h2.title {
			font-size: 2rem;
			font-weight: 600;
			line-height: normal;
		}
		p.message {
			margin-block: 0.75rem;
		}
		.messages {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin-block: 1rem;
			p.message {
				margin-block: 0;
			}
		}

		.footnote {
			font-size: 0.875rem;
			font-family: var(--font-mono);
			color: var(--text-light);
			text-align: center;
			white-space: pre-wrap;
		}

		p.error {
			margin: 0;
			font-size: 1.25rem;
			font-weight: 300;
			white-space: pre-wrap;
			text-align: center;
		}
	}
	a.home {
		font-size: 0.875rem;
		border-radius: 0.25rem;
		margin-top: 2rem;
		border-radius: 5rem;
		padding-block: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		.icon {
			color: var(--text);
		}
	}
}
</style>
