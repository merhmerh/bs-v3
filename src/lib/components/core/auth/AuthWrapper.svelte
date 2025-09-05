<script>
import { page } from "$app/state";
import AppIcon from "$common/AppIcon.svelte";
import Divider from "$common/Divider.svelte";
import Gsi from "$core/auth/GSI.svelte";

/**
 * @typedef {Object} Props
 * @property {string} [type]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { type = "signin", children } = $props();

function updateURLParams() {
	const params = page.url.searchParams;
	if (type === "signin") {
		params.set("type", "signin");
	} else {
		params.set("type", "signup");
	}
	return "?" + params.toString();
}
</script>

<div class="auth-wrapper">
	<div class="auth-header">
		<a href="/" class="flex items-center">
			<AppIcon --height="48px" />
		</a>
		<div class="content">
			{#if type == "signin"}
				<h1>Welcome Back</h1>
				<span>Sign in to your account</span>
			{:else}
				<h1>Get Started</h1>
				<span>Create your BuiltSearch account</span>
			{/if}
		</div>
	</div>

	<div class="auth-content">
		<Gsi />
		<Divider text="or" />
		{@render children?.()}

		<p class="legal">
			{#if type == "signin"}
				By continuing, you agree to our <a href="/terms">terms</a> and
				<a href="/privacy">privacy policy</a>.
			{:else}
				By creating an account, you agree to our <a href="/terms">terms</a> and
				<a href="/privacy">privacy policy</a>.
			{/if}
		</p>
	</div>

	<div class="auth-footer">
		{#if type == "signin"}
			<span>Don't have an account?</span>
			<a href={`/signup${updateURLParams()}`} class="underline">Sign Up Now</a>
		{:else}
			<span>Already have an account?</span>
			<a href={`/signin${updateURLParams()}`} class="underline">Sign In</a>
		{/if}
	</div>
</div>

<style lang="scss">
.auth-wrapper {
	position: relative;
	display: flex;
	margin-inline: auto;
	flex-direction: column;
	width: min(450px, 100%);
	padding-top: rem;

	@media screen and (max-width: 768px) {
		padding-top: 1rem;
	}

	.auth-header {
		display: flex;
		padding-block: 1rem;
		align-items: center;
		gap: 1rem;
		.content {
			h1 {
				font-size: 1.5rem;
				font-weight: 600;
			}
			span {
				color: var(--text-soft);
				font-size: 0.875rem;
			}
		}
	}

	.auth-content {
		width: 100%;
		margin-inline: auto;
		border: 1px solid var(--border-base);
		background-color: color-mix(in srgb, var(--bg-200), 25% transparent);
		backdrop-filter: blur(2px);
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.legal {
			color: var(--text-light);
			font-size: 0.75rem;
			text-align: center;
			margin: 0;
			margin-top: 1rem;
			a {
				color: var(--text);
				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
	.auth-footer {
		margin-top: 1rem;
		margin-inline: auto;
		display: flex;
		font-size: 0.875rem;
		gap: 0.5rem;
		margin-inline: auto;
		width: fit-content;
	}
}
</style>
