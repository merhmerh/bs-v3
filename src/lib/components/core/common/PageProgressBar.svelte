<script>
import { fade } from "svelte/transition";
import { navigating } from "$app/stores";

let progressBar = $state();
let random_1 = $state(),
	random_2 = $state();

$effect(() => {
	if ($navigating) {
		random_1 = Math.floor(Math.random() * 30) + 20;
		random_2 = Math.floor(Math.random() * 20) + 60;
	}
});
</script>

{#if $navigating}
	<div class="progressbar-container" transition:fade={{ duration: 300 }}>
		<div
			bind:this={progressBar}
			class="progress"
			style="--random1:{random_1}%; --random2:{random_2}%">
		</div>
	</div>
{/if}

<style lang="scss">
.progressbar-container {
	position: fixed;
	top: 0;
	width: 100%;
	height: 4px;
	z-index: 1000;

	.progress {
		width: 00%;
		transition: width 2s ease-out;
		height: 100%;
		background-color: var(--primary);
		animation: loading 2s forwards ease-out;

		@keyframes loading {
			0% {
				width: 0%;
			}
			33% {
				width: var(--random1);
			}
			40% {
				width: var(--random1);
			}
			66% {
				width: var(--random2);
			}
			70% {
				width: var(--random2);
			}
			100% {
				width: 90%;
			}
		}
	}
}
</style>
