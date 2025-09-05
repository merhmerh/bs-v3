<script>
let { title, children, width = "auto", required = false } = $props();
</script>

<div class="segment-container" style="--content-width:{width};">
	<h2>
		{title}
		{#if required}<span class="required">*</span>{/if}
	</h2>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
.segment-container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-block: var(--my, 1.5rem);

	h2 {
		font-weight: 500;
		font-size: 0.875rem;
		color: var(--text-light);
		margin: 0;
		display: flex;
		align-items: center;

		.required {
			margin-left: 4px;
			color: var(--orange);
			font-weight: bold;
		}
	}

	.content {
		border: 1px solid var(--border-base);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		padding-block: 0.5rem;
		width: min(var(--content-width), 100%);

		@media screen and (max-width: 768px) {
			padding-inline: 0.5rem;
		}
	}
}
</style>
