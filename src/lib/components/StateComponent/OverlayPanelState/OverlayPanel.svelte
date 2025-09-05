<script>
import Icon from "@iconify/svelte";
import { getOverlayPanelState } from "./OverlayPanelState.svelte.js";
import { fly } from "svelte/transition";

const ops = getOverlayPanelState();

function handleKeydown(e) {
	if (!ops.panels.length) return;
	const panel = ops.panels.at(-1);
	if (e.key == "Tab") {
		const nodes = panel.container.querySelectorAll("*");
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
	if (e.key === "Escape") {
		ops.close(panel.id);
	}
}
</script>

<svelte:window onkeydown={handleKeydown} />

{#each ops.panels as panel, i (panel.id)}
	<div
		transition:fly={{ ...panel.transition, duration: 200 }}
		id={panel.id}
		bind:this={panel.container}
		style="
            --w: {panel.style.width}px;
            --offset: {i * 16}px;
        "
		class="panel shadow-md {panel.style.anchor} ">
		<div class="scrollable" style="--max-height:{panel.style.height}px;">
			<div class="content">
				<div class="header">
					{#if panel.title}
						<h2>{panel.title}</h2>
					{/if}
					<button class="icon tpx" onclick={() => ops.close(panel.id)}>
						<Icon icon="lucide:x" width="24" />
					</button>
				</div>
				{#if panel.error}
					<div class="panel-error">
						<strong>Error:</strong>
						{panel.error}
					</div>
				{/if}
				{#if panel.snippet}
					{@render panel?.snippet(panel.props)}
				{/if}
				{#if panel.component}
					<panel.component {...panel.props} />
				{/if}
			</div>
		</div>
	</div>
{/each}
{#if ops.panels.some((item) => item.backgroundBlur)}
	<div class="backdrop" transition:fly></div>
{/if}

<style lang="scss">
.panel {
	border: 0;
	border-radius: 1rem;
	padding: 0.5rem;
	position: fixed;
	z-index: 102;
	top: 0;
	width: var(--w, 400px);
	min-height: 400px;
	background-color: var(--bg-100);
	border: 1px solid var(--border-base);
	margin-top: var(--offset, 0px);
	&.left {
		left: 0.25rem;
		top: 50%;
		transform: translateY(-50%);
	}
	&.center {
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	&.right {
		top: 50%;
		transform: translateY(-50%);
		right: 0.25rem;
	}
	&.top {
		top: 2rem;
		left: 50%;
		transform: translateX(-50%);
	}
	&.bottom {
		top: unset;
		bottom: calc(2rem + var(--offset, 0px));
		left: 50%;
		transform: translateX(-50%);
	}

	button.icon.tpx {
		aspect-ratio: 1;
		padding: 0.25rem;
		background-color: transparent;
	}

	.scrollable {
		overflow-y: auto;
		max-height: var(--max-height, calc(100dvh - 4rem));
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
			.panel-error {
				font-size: 0.875rem;
				color: var(--red);
				border: 1px solid var(--red);
				padding: 0.25rem 0.375rem;
				border-radius: 0.25rem;
				width: fit-content;
			}
		}
	}
}

.backdrop {
	position: fixed;
	z-index: 101;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: var(--bg-blur);
	backdrop-filter: blur(4px);
}
</style>
