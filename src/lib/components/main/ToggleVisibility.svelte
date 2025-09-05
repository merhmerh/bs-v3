<script>
import Icon from "@iconify/svelte";
import { getPopoverState } from "$comp/StateComponent/Popover/PopoverState.svelte.js";

const ps = getPopoverState();
let {
	options = [{ name: "Public", description: "" }],
	visibility = $bindable(false),
	onchange = () => {},
} = $props();

function showVisibilityOptions(e) {
	const button = e.target.closest("button");
	ps.open({
		name: "visibility-options",
		button: button,
		snippet: visibilityOptionsList,
		position: "bottom-left",
	});
}
</script>

<button
	class="none status {visibility}"
	class:focus={ps.isOpen && ps.name == "visibility-options"}
	onclick={showVisibilityOptions}>
	<div class="dot"></div>
	<span>{visibility}</span>
	<div class="icon">
		<Icon icon="ic:round-expand-more" />
	</div>
</button>

{#snippet visibilityOptionsList()}
	<div class="visibility-list">
		<div class="title">Toggle Visibility</div>
		{#each options as { name, description }}
			<button
				class="none option"
				class:selected={visibility == name}
				onclick={() => onchange(name)}>
				<span class="name">
					{name}
					<div class="icon">
						<Icon icon="tabler:check" width="16" />
					</div>
				</span>
				<span class="description">
					{description}
				</span>
			</button>
		{/each}
	</div>
{/snippet}

<style lang="scss">
.visibility-list {
	margin-top: 0.25rem;
	background-color: var(--bg-200);
	border: 1px solid var(--border-base);
	display: flex;
	flex-direction: column;
	border-radius: 0.5rem;
	width: fit-content;
	max-width: 300px;
	.title {
		font-size: 0.8125rem;
		font-weight: 600;
		padding-inline: 0.75rem;
		padding-block: 0.375rem 0.125rem;
		color: var(--text-light);
	}
	button {
		padding-block: 0.5rem;
		font-size: 0.875rem;
		padding-inline: 1rem;
		width: 100%;
		text-align: left;
		display: flex;
		flex-direction: column;
		border-radius: 0;
		color: var(--text);
		&.selected {
			.icon {
				display: flex !important;
			}
		}
		.name {
			font-weight: 600;
			text-transform: capitalize;
			display: flex;
			align-items: center;
			gap: 0.25rem;
			.icon {
				display: none;
				color: var(--green);
			}
		}
		.description {
			color: var(--text-soft);
			font-size: 0.75rem;
		}
	}
}

button.status {
	margin-left: 0.5rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding-inline: 0.75rem 0.5rem;
	border-radius: 0.5rem;
	--c: var(--mono-mid);
	&:hover,
	&.focus {
		background-color: color-mix(in srgb, var(--accent-100), 80% transparent);
		.icon {
			opacity: 1;
		}
	}
	&.public {
		--c: var(--green);
	}
	.icon {
		opacity: 0;
		margin-left: -0.25rem;
		color: var(--text-soft);
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--c);
	}
	span {
		color: var(--c);
		text-transform: capitalize;
	}
}
</style>
