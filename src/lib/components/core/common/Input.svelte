<script>
let {
	fieldset = false,
	primary = false,
	container = false,
	value = $bindable(""),
	disabled = $bindable(false),
	type = "text",
	placeholder = "Input",
	prefix = null,
	suffix = null,
	...props
} = $props();
</script>

{#if container}
	<div class="input-container" class:prefix class:suffix>
		{#if prefix}
			<div class="snippet-container">
				{#if typeof prefix === "string"}
					<span class="text">{prefix}</span>
				{:else}
					{@render prefix?.()}
				{/if}
			</div>
		{/if}
		{@render Input()}
		{#if suffix}
			{#if typeof suffix === "string"}
				<span class="text">{suffix}</span>
			{:else}
				{@render suffix?.()}
			{/if}
		{/if}
	</div>
	<!--  -->
{:else}
	{@render Input()}
{/if}

{#snippet Input()}
	<input
		class:isFieldset={fieldset}
		class:primary
		class:mono={!primary}
		{type}
		bind:value
		{placeholder}
		{disabled}
		{...props} />
{/snippet}

<style lang="scss">
input {
	--border-color: var(--border);
	outline: 0px solid transparent;
	font-size: 0.875rem;
	padding-inline: 0.75rem;
	padding-block: 0.5rem;
	line-height: 1.25rem;
	width: 100%;
	height: var(--height, auto);
	border: 1px solid var(--border-color);
	position: relative;
	border-radius: 0.375rem;

	&.isFieldset {
		border: 0;
		padding: 0;
		border-radius: 0;
		padding-inline: 0.25rem;
		margin-bottom: 0.375rem;
		&:focus-within {
			outline: 0;
		}
	}
	&:hover:not(:disabled) {
		--border-color: var(--border-mid);
	}

	&:focus-within {
		--border-color: var(--border-mid);
		outline: 0;
		border: 1px solid var(--border-color);
	}

	&:disabled::placeholder {
		color: var(--text-disabled) !important;
		filter: opacity(0.75);
	}

	&:-webkit-autofill {
		-webkit-text-fill-color: var(--text);
		transition: background-color 5000s ease-in-out 0s;
	}

	&.primary {
		--border-color: var(--border);
		background-color: color-mix(in srgb, var(--primary) 4%, transparent);
		&:focus-within,
		&:hover {
			--border-color: color-mix(in srgb, var(--primary) 50%, transparent);
			background-color: color-mix(in srgb, var(--primary) 6%, transparent);
		}
	}
}

.input-container {
	--border-color: var(--border);
	border: 1px solid var(--border-color);
	border-radius: 0.375rem;
	display: flex;
	align-items: center;
	input {
		border: 0;
		&:hover,
		&:focus {
			border: 0;
			outline: 0;
		}
	}
	&.prefix {
		padding-left: 0;
		input {
			padding-left: 0;
		}
	}
	.snippet-container {
		padding-inline: 0.25rem;
		span.text {
			height: 100%;
			line-height: 1.5;
			display: flex;
			align-items: center;
			// margin-top: -2px;
			opacity: 0.75;
			padding-left: 0.25rem;
		}
	}
}
</style>
