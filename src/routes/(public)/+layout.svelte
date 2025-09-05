<script>
let { children } = $props();
</script>

<div class="content">
	{@render children?.()}
</div>

<style lang="scss">
.content {
	min-height: calc(100dvh - 68px);
	padding-inline: 1rem;
	padding-block: 2rem;
}
</style>
