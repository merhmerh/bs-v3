<script>
import SeeMore from "$core/SeeMore.svelte";

let { company } = $props();

let showFullExperience = $state(false);

function handleToggle(showAll) {
	showFullExperience = showAll;
}
</script>

<div class="about">
	<div class="description">
		<h4>
			About
			{company.display_name}
		</h4>
		<SeeMore text={company.description} limit={400} onToggle={handleToggle} />
	</div>
</div>

<style lang="scss">
.about {
	display: flex;
	flex-direction: column;
	border-top: 2px solid var(--border-base);
	.description {
		margin-block-start: 1.5em;
		margin-bottom: 0.5rem;
		h4 {
			font-size: 1.1rem;
		}
	}
}
@media (max-width: 480px) {
	.about {
		.description {
			font-size: 0.93rem;
		}
	}
}
</style>
