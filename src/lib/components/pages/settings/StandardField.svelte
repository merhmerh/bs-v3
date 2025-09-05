<script>
let { name, children, divider = false, required = false } = $props();
</script>

<div class="field-row" class:include-divider={divider}>
	<span class="label">
		{name}
		{#if required}<span class="required">*</span>{/if}
	</span>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
.field-row {
	display: flex;
	align-items: var(--align-items, flex-start);
	flex-direction: row;
	padding-block: 1rem;
	padding-inline: 0.5rem;

	@media screen and (max-width: 768px) {
		flex-direction: column;
	}

	&.include-divider:not(:last-child) {
		border-bottom: 1px solid var(--border-base);
	}

	.label {
		margin-top: 0.5rem;
		flex-shrink: 0;
		font-weight: 600;
		color: var(--mono);
		width: 200px;
		font-size: 0.875rem;

		.required {
			margin-left: 4px;
			color: var(--orange);
		}
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--gap, 0.5rem);
	}
}
</style>
