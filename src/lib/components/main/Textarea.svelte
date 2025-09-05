<script>
import { onMount, tick } from "svelte";

let textarea = $state();
let textAreaHeight = $state(0);
let {
	children,
	title = "",
	value = $bindable(""),
	placeholder = "",
	fieldset = false,
	error = $bindable(false),
	maxLength,
	rows = 3,
	mono = false,
	unstyled = false,
	primary = false,
	required = $bindable(false),
	onResize = () => {},
	maxHeight = "400px",
	onTextareaInput = () => {},
	autoResize = $bindable(true),
	kbd = null,
	oninput = () => {},
	...props
} = $props();
let placeholderStatic = $state.snapshot(placeholder);
let kbdPlaceholder = $derived.by(() => {
	value;
	return setKBD();
});

function setKBD() {
	if (!kbd) return null;
	if (placeholder && !kbd) return null;
	const data = [];
	data.push({ type: "text", value: placeholderStatic });
	data.push(
		...kbd.map((key) => {
			return { type: "kbd", value: key };
		}),
	);
	return data;
}

function autoResizeTextArea(textarea) {
	if (!autoResize) return;
	const original = textarea.style.height;
	textarea.style.height = "auto";
	textarea.style.height = textarea.scrollHeight + "px";
	textAreaHeight = textarea.scrollHeight;
	if (original !== textarea.style.height) {
		onResize(textAreaHeight);
	}
}

export function disable() {
	textarea.disabled = true;
}

export function resize() {
	autoResizeTextArea(textarea);
}

export function enable() {
	textarea.disabled = false;
}

export function focus() {
	textarea.focus();
}

onMount(async () => {
	await tick();
	if (placeholder && kbd) {
		placeholder = "";
	}
});
</script>

<label
	class="wrap"
	class:none={unstyled}
	class:mono
	class:primary
	class:error={(value && value.length >= maxLength) || error}
	class:multiline={textAreaHeight >= 42}
	class:disabled={props.disabled}>
	{#if title}
		<div class="title" class:required class:fieldset>
			{title}
		</div>
	{/if}
	<textarea
		{rows}
		bind:this={textarea}
		class="description"
		{placeholder}
		style="--max-height: {maxHeight}"
		oninput={(e) => {
			oninput(e);
			error = null;
			autoResizeTextArea(e.target);
		}}
		{...props}
		bind:value>
	</textarea>
	<div class="placeholder-overlay">
		{#if kbdPlaceholder && !value}
			{#each kbdPlaceholder as { type, value }}
				{#if type == "text"}
					{value}
				{:else if type == "kbd"}
					<kbd>{value}</kbd>
				{/if}
			{/each}
		{/if}
	</div>
	{#if error || maxLength}
		<div class="label-footer">
			{#if error}
				<p class="error">{error}</p>
			{/if}
			{#if maxLength}
				<div class="count" class:over={value && value.length >= maxLength}>
					{value ? value.length : 0}/{maxLength}
				</div>
			{/if}
		</div>
	{/if}
	{@render children?.()}
</label>

<style lang="scss">
label.wrap {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding-inline: 0.5rem;
	padding-block: 0.25rem;
	border-radius: 0.5rem;
	border: 1px solid var(--border-color);
	--bg-color: var(--bg-100);
	--border-color: var(--border);
	background-color: var(--bg-color);
	transition: all 0.3s;
	position: relative;
	&:has(.fieldset) {
		margin-top: 0.5rem;
		textarea {
			margin-top: 0.25rem;
		}
	}
	.title {
		&.fieldset {
			position: absolute;
			top: -0.5rem;
			left: 0.6325rem;
			font-size: 0.75rem;
			padding-inline: 0.25rem;
			border-radius: 0.25rem;
			background-color: var(--bg-100);
			color: var(--text);
		}
	}
	.placeholder-overlay {
		top: 3px;
		position: absolute;
		align-items: center;
		display: flex;
		gap: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-light);
		user-select: none;
		pointer-events: none;
		kbd {
			color: inherit;
			opacity: 0.75;
			@media screen and (max-width: 520px) {
				opacity: 0;
			}
		}
	}

	&.mono {
		outline: 0px solid transparent;
		--bg-color: var(--input-base);

		&:hover:not(:disabled) {
			--border-color: var(--mono-soft);
		}

		&:focus-within {
			--border-color: var(--mono) !important;
		}

		&:disabled::placeholder {
			color: var(--text-disabled) !important;
			filter: opacity(0.75);
		}

		&.error {
			--border-color: var(--red);
			&:focus-within {
				outline: 0;
			}
		}
	}
	&.none {
		border: 0;
		padding: 0;
		border-radius: 0;
		&.disabled {
			background-color: unset;
		}
	}

	&:hover {
		--border-color: var(--border-mid);
	}

	&:focus-within {
		--border-color: var(--border-mid);
		outline: 0;
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

	&.disabled {
		pointer-events: none;
		filter: grayscale(0.5) opacity(0.75);
		background-color: color-mix(in srgb, var(--mono) 6%, transparent);
	}

	textarea {
		border: 0;
		padding-inline: 0;
		padding-block: 0.25rem;
		border-radius: 0;
		line-height: 150%;
		resize: none;
		max-height: var(--max-height, 400px);
		background-color: transparent;
		font-size: var(--font-size, 1rem);
		position: relative;
		font-family: var(--chat-font, var(--font));
		font-size: 0.875rem;
		&:hover,
		&:focus-within,
		&:focus-visible {
			outline: 0;
			border: 0;
		}
		&::placeholder {
			color: var(--text-light);
		}
	}
	.label-footer {
		display: flex;
		.count {
			margin-left: auto;
			font-size: 0.75rem;
			color: var(--mono);
			&.over {
				color: var(--red);
			}
		}
	}
}
</style>
