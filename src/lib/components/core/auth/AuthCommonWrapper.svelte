<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script>
import AppIcon from "$common/AppIcon.svelte";
</script>

<div class="page-wrapper">
	<div class="page-header">
		<a href="/" class="flex items-center">
			<AppIcon --height="48px" />
		</a>
		<div class="page-header-content">
			<slot name="page-header" />
		</div>
	</div>

	<div class="content">
		<slot name="page-content" />
	</div>

	<div class="page-footer">
		<slot name="page-footer" />
	</div>
</div>

<style lang="scss">
.page-wrapper {
	position: relative;
	display: flex;
	margin-inline: auto;
	flex-direction: column;
	width: min(450px, 100%);
	padding-top: rem;

	@media screen and (max-width: 768px) {
		padding-top: 1rem;
	}

	.page-header {
		display: flex;
		padding-block: 1rem;
		align-items: center;
		gap: 1rem;
		.page-header-content {
			& :global(h1) {
				font-size: 1.5rem;
				font-weight: 600;
			}
			& :global(span) {
				color: var(--text-soft);
				font-size: 0.875rem;
			}
		}
	}
	.content {
		width: 100%;
		margin-inline: auto;
		border: 1px solid var(--border-base);
		background-color: color-mix(in srgb, var(--bg-200), 25% transparent);
		backdrop-filter: blur(2px);
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.page-footer {
		margin-top: 1rem;
		margin-inline: auto;
		display: flex;
		font-size: 0.875rem;
		gap: 0.5rem;
		margin-inline: auto;
		width: fit-content;
	}
}
</style>
