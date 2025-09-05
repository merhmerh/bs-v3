<script>
import Avatar from "$common/Avatar.svelte";

let { user } = $props();
console.log(user);
</script>

<div class="card">
	<Avatar --height="100%" rounded={false} src={user.avatar || user.username} />
	<div class="card-overlay hover-overlay-background"></div>
	<div class="text-container">
		<span class="name">{user.display_name}</span>
		{#if user.profile.occupation}
			<span class="job-title">{user.profile.occupation}</span>
		{/if}
		<!-- {#if user.profile.job_title && user.profile.job_title.length >= 1}
			<span class="job-title">{user.profile.job_title}</span>
		{/if} -->
	</div>
</div>

<style lang="scss">
.card {
	width: 200px;
	height: 200px;
	border-radius: 1rem;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	transition: transform 0.3s ease-in-out;
	background-color: var(--bg-200);
	border: 1px solid var(--border-base);
	cursor: pointer;

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
		padding: 0.5rem 1rem;
		color: white;
		text-align: start;
		z-index: 5;
		display: flex;
		flex-direction: column;
		padding-inline: 0.5rem;
		padding-block: 0;
		gap: 0rem;

		.name {
			font-size: 0.875rem;
			font-weight: 500;
		}
		.job-title {
			font-size: 0.875rem;
			@media (max-width: 480px) {
				display: none;
			}
		}
	}
}
</style>
