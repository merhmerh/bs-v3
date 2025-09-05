<script>
let { children } = $props();
</script>

<div class="settings-container">
	{@render children?.()}
</div>

<style lang="scss">
.settings-container {
	display: grid;
	grid-template-columns: 250px auto;
	@media screen and (max-width: 978px) {
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}
}
</style>
