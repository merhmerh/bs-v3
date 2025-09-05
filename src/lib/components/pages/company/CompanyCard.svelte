<script>
import Avatar from "$common/Avatar.svelte";
import { toasts } from "$common/toast.store.js";
import Icon from "@iconify/svelte";

let { company } = $props();
</script>

<div class="card">
	<Avatar --height="100%" rounded={false} src={company.avatar || company.display_name} />
	<div class="card-overlay hover-overlay-background"></div>
	<div class="text-container">
		<h4>{company.display_name}</h4>
	</div>
</div>

<style lang="scss">
.card {
	width: 205px;
	height: 205px;
	border-radius: 1rem;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	transition: transform 0.3s ease-in-out;
	background-color: var(--bg-200);
	border: 1px solid var(--border-base);
	cursor: pointer;

	&:hover {
		.hover-overlay-background {
			background: rgba(0, 0, 0, 0.75);
			background: linear-gradient(
				180deg,
				rgba(0, 0, 0, 0.75) 0%,
				rgba(0, 0, 0, 0.15) 10%,
				rgba(0, 0, 0, 0.15) 70%,
				rgba(0, 0, 0, 0.75) 100%
			);
			backdrop-filter: blur(1px);
			opacity: 1;
		}
		.card-overlay {
			opacity: 1;
		}
	}
	.card-overlay {
		position: absolute;
		pointer-events: none;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		padding-inline: 0.75rem;
		padding-block: 0.75rem;
		display: flex;
		opacity: 0;
		z-index: 1;
		transition: opacity 0.25s;
	}
	@media (max-width: 768px) {
		width: 13.5rem;
		height: 15rem;
	}
	@media (max-width: 480px) {
		width: 10rem;
		height: 10rem;
	}

	.text-container {
		position: absolute;
		bottom: 0;
		width: 100%;
		background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8));
		// backdrop-filter: blur(0.1rem);
		padding: 0.5rem 1rem;
		color: white;
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
		text-align: start;
		z-index: 5;

		// span {
		// 	@media (max-width: 480px) {
		// 		display: none;
		// 	}
		// }
	}

	h4 {
		overflow-wrap: break-word;
		white-space: normal;
		max-width: 100%;
		color: white;
		margin: 0.1rem 0;
	}

	h4 {
		font-size: 1.2rem;
		font-weight: 600;
		text-transform: capitalize;
		@media (max-width: 480px) {
			font-size: 1rem;
		}
	}
}
</style>
