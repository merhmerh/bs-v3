<script>
import Icon from "@iconify/svelte";
	let { href, children } = $props();
</script>

<div class="flex items-center gap-2">
	<a {href} class="button none">
		<div class="icon">
			<Icon icon="ic:round-keyboard-arrow-left" height="24" />
		</div>
	</a>
	<h1>{@render children?.()}</h1>
</div>

<style lang="scss">
.icon {
	color: var(--text);
}
</style>
