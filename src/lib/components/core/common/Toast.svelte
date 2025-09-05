<script>
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import { fly } from "svelte/transition";
import { toasts } from "./toast.store.js";

onMount(() => {});

const icons = {
	success: {
		icon: "material-symbols:check-circle-outline-rounded",
		color: "var(--green)",
	},
	error: {
		icon: "material-symbols:error-outline-rounded",
		color: "var(--red)",
	},
	alert: { icon: "lucide:octagon-alert", color: "var(--orange)" },
	warning: { icon: "tabler:alert-triangle", color: "PaleVioletRed" },
	info: { icon: "material-symbols:info-outline-rounded", color: "var(--mono)" },
};
</script>

<div class="toaster">
	{#each $toasts as toast (toast.id)}
		<div
			in:fly={{ y: -50 }}
			out:fly={{ x: 100 }}
			class="toast"
			style="--c:{icons[toast.type].color} ">
			<div class="status icon">
				<Icon icon={icons[toast.type].icon} height="36" />
			</div>
			<div class="text">
				<div class="title">
					{toast.title}
				</div>
				<div class="message">
					{toast.message}
				</div>
			</div>
			<button
				class="close icon none"
				onclick={() => {
					toasts.remove(toast.id);
				}}>
				<Icon icon="lucide:x" width="24" />
			</button>
		</div>
	{/each}
</div>

<style lang="scss">
.toaster {
	z-index: 1000;
	position: fixed;
	top: 4rem;
	right: 1rem;
	display: flex;
	flex-direction: column-reverse;
	gap: 0.5rem;
	width: max-content;
	.toast {
		background-color: #fff;
		border: 1px solid #000;
		padding-block: 1rem;
		padding-inline: 1rem;
		padding-right: 0rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		border: 2px solid var(--c);
		background-color: color-mix(in srgb, var(--c), 85% var(--bg-100));
		gap: 0.5rem;
		max-width: 400px;
		.status {
			color: var(--c);
		}
		.text {
			min-width: 150px;
			.title {
				font-size: 1rem;
			}
			.message {
				font-size: 0.875rem;
				color: var(--text-soft);
				white-space: pre-wrap;
			}
		}
		button.close {
			color: var(--text-soft);
			display: flex;
			justify-content: center;
			align-items: center;
			margin-inline: 0.5rem;
			margin-left: auto;
		}
	}
}
</style>
