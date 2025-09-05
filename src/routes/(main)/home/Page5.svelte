<script>
import HomeWrapper from "./HomeWrapper.svelte";
</script>

<HomeWrapper width="600px">
	<h2>Have more Questions?</h2>

	<button class="outlined">Leave a message</button>
</HomeWrapper>

<style lang="scss">
h2 {
	margin-bottom: 2.5rem;
}
button {
	font-size: 1rem;
	padding-block: 0.75rem;
	padding-inline: 1.5rem;
	border-radius: 100rem;
	border-color: var(--primary);
	background-color: color-mix(in srgb, var(--primary) 12%, transparent);
	&:hover {
		border-color: var(--primary);
		background-color: color-mix(in srgb, var(--primary) 20%, transparent);
	}
}
</style>
