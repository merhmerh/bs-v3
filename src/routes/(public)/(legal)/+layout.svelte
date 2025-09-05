<script>
let { children } = $props();
let innerWidth = $state(0);
</script>

<svelte:window bind:innerWidth />

<div class="block"></div>
<div class="legal-page">
	{@render children?.()}
</div>

<style lang="scss">
.legal-page {
	margin-inline: auto;
	width: min(900px, 100%);
	display: flex;
	flex-direction: column;
	gap: 1rem;
	font-family: "Poppins", sans-serif;
	padding-bottom: 100px;
	color: var(--text);
	&:global {
		h1 {
			@media screen and (max-width: 768px) {
				font-size: 2rem;
			}
		}
		h2 {
			font-size: 2rem;
			font-weight: 400;
			font-family: var(--font-serif);
			margin-top: 2rem;
			@media screen and (max-width: 520px) {
				font-size: 1.75rem;
			}
		}
		h3 {
			margin-block: 0;
		}
		p {
			margin-block: 0.25rem;
		}
		ol,
		ul {
			margin: 0;
			li {
				margin-block: 0.25rem;
			}
		}
		hr {
			width: 100%;
			border: 0;
			height: 1px;
			background-color: var(--border-primary);
		}
	}
}
</style>
