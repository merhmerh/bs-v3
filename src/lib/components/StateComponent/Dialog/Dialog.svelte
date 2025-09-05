<script>
import AsyncButton from "$common/AsyncButton.svelte";
import { titleCase } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import { getDialogState } from "./DialogState.svelte.js";

let { key, debug = false, children } = $props();
const ds = getDialogState(key || null);

function handleKeydown(e) {
	if (!ds.dialog) return;
	if (e.key == "Tab") {
		const nodes = ds.dialog.querySelectorAll("*");
		const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

		let index = tabbable.indexOf(document.activeElement);
		if (index === -1 && e.shiftKey) index = 0;

		index += tabbable.length + (e.shiftKey ? -1 : 1);
		index %= tabbable.length;

		while (tabbable[index].disabled) {
			index += 1;
		}

		tabbable[index].focus();
		e.preventDefault();
	}
}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if ds.showDialog}
	<dialog
		onclose={() => {
			ds.close();
		}}
		bind:this={ds.dialog}
		style="--w: {ds.style.width}px"
		class:top={ds.style.alignTop}>
		<div class="scrollable">
			<div class="content">
				<div class="header">
					{#if ds.content.title}
						<h2>{ds.content.title}</h2>
						{#if ds.closeButton}
							<button class="none icon tpx" onclick={() => ds.close()}>
								<Icon icon="lucide:x" width="24" />
							</button>
						{/if}
					{/if}
				</div>
				{#if ds.content.error}
					<div class="error">{ds.content.error}</div>
				{/if}
				{#key ds.content}
					{#if ds.content.snippet}
						{@render ds.content?.snippet(ds.content.props)}
					{/if}
					{#if ds.content.component}
						<ds.content.component {...ds.content.props} />
					{/if}
				{/key}
				{#if ds.showActions}
					<div class="actions">
						{#each Object.entries(ds.content.actions) as [key, fn]}
							<AsyncButton
								--px="1rem"
								primary
								warning={/delete/i.test(key) || ds.warningButtonName == key}
								small
								onclick={fn}>{titleCase(key)}</AsyncButton>
						{/each}
						<button class="outlined small" onclick={() => ds.close()}>{ds.cancelName}</button>
					</div>
				{/if}
			</div>
		</div>
	</dialog>
{/if}

<style lang="scss">
dialog {
	border: 0;
	border-radius: 1rem;
	padding: 0.5rem;
	position: absolute;
	top: 0;
	left: 0;
	background-color: var(--bg-100);
	width: min(var(--w), 100%);

	@media screen and (min-width: 520px) {
		&.top {
			position: fixed; /* Make sure to use fixed or absolute positioning */
			top: 5rem; /* Align to top */
			left: 50%; /* Center horizontally */
			transform: translateX(-50%); /* Translate to center horizontally */
			margin: 0;
			.scrollable {
				max-height: calc(100dvh - 10rem);
			}
		}
	}

	.scrollable {
		overflow-y: auto;
		max-height: calc(100dvh - 4rem);
		.content {
			padding: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			color: var(--text);
			.header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				h2 {
					font-size: 1.125rem;
					font-weight: 700;
					color: var(--text);
				}
			}
			.error {
				color: var(--red);
				font-size: 0.875rem;
				border: 1px solid var(--red);
				border-radius: 0.25rem;
				padding: 0.25rem;
			}
		}
		.actions {
			display: flex;
			gap: 0.5rem;
			flex-direction: row-reverse;
			button {
				min-width: 60px;
				font-size: 0.875rem;
				border-radius: 0.375rem;
			}
		}
	}
}

::backdrop {
	background-color: var(--bg-blur);
	backdrop-filter: blur(4px);
}
</style>
