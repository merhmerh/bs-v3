<script>
import Icon from "@iconify/svelte";
let { base, clicked, onclick = () => {}, duration = 1000 } = $props();

let iconName = $state(base);
let timeoutId = $state(null);
let buttonClicked = $state(null);

export async function handleButtonClick() {
	onclick();
	buttonClicked = true;
	iconName = clicked;
	if (timeoutId) {
		clearTimeout(timeoutId);
	}
	timeoutId = setTimeout(() => {
		buttonClicked = false;
		iconName = base;
	}, duration);
}
</script>

<button class="none icon button-interactive" onclick={handleButtonClick} class:buttonClicked>
	<Icon icon={iconName} width="16" />
</button>

<style lang="scss">
button {
	transition: all 0.3s;
	&:hover {
		box-shadow: none;
		background-color: color-mix(in srgb, var(--mono-mid) 30%, transparent);
	}
	&.buttonClicked {
		background-color: color-mix(in srgb, var(--mono-mid) 30%, transparent);
	}
}
</style>
