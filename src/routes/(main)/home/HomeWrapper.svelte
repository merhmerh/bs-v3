<script>
let { children, width = "800px" } = $props();
</script>

<div class="container" style="width: min(100%, {width})">
	{@render children?.()}
</div>

<style lang="scss">
.container {
	padding-block: 4rem;
	margin-inline: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	& :global {
		h2 {
			font-family: var(--font-serif);
			font-weight: 400;
			text-align: center;
			font-size: 2.5rem;
			@media screen and (max-width: 768px) {
				font-size: 2rem;
			}
		}
	}
	@media screen and (max-width: 768px) {
		padding-block: 2rem;
		padding-inline: 2rem;
	}
}
</style>
