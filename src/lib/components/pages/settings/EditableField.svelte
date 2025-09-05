<script>
/**
 * @typedef {Object} Props
 * @property {any} name
 * @property {any} value
 * @property {string} [nullValue]
 * @property {boolean} [show]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let {
	name,
	value = $bindable(""),
	nullValue = "Not set",
	onToggle,
	show = $bindable(false),
	children,
	required,
} = $props();
</script>

<div class="editableField">
	<div class="row">
		<label for="name"
			>{name}

			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
		{#if !show}
			{#if value}
				<span class="value">{@html value}</span>
			{:else}
				<span class="value null">{nullValue}</span>
			{/if}
		{/if}
		<div class="action">
			<button
				class="none noHover"
				onclick={() => {
					show = !show;
					onToggle({ show, name });
				}}>
				{!show ? "Edit" : "Cancel"}
			</button>
		</div>
	</div>
	{#if show}
		<div class="content">
			{@render children?.()}
		</div>
	{/if}
</div>

<style lang="scss">
.editableField {
	width: 100%;
	position: relative;
	display: flex;
	padding-block: 1.25rem;
	padding-inline: 0.5rem;
	flex-direction: column;
	&:not(:last-child) {
		border-bottom: 1px solid var(--border-base);
	}
	.row {
		display: flex;
		align-items: center;
		flex-direction: row;
		position: relative;
		height: 2rem;
		@media screen and (max-width: 768px) {
			display: grid;
			grid-template-columns: 1fr 1fr;
			row-gap: 0.25rem;
			height: auto;
			span.value {
				grid-column: 1 / 2;
				grid-row: 2;
			}
		}
		label {
			font-weight: 600;
			color: var(--mono);
			width: 200px;
			font-size: 0.875rem;
			.required {
				color: var(--red);
			}
		}

		span.value {
			&.null {
				color: var(--text-soft);
				font-size: 0.875rem;
				background-color: var(--bg-200);
				border: 1px solid var(--border-base);
				border-radius: 0.25rem;
				padding: 0rem 0.5rem;
			}
		}
		.action {
			position: absolute;
			top: 0;
			right: 0;
			button {
				font-size: 0.875rem;
				color: var(--primary);
			}
		}
	}
}
.content {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding-top: 1rem;
	padding-bottom: 0;
}
</style>
