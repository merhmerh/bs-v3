<script>
import { onDestroy, tick } from "svelte";

let {
	position = "auto",
	autoClose = true,
	sameWidthAsParent = false,
	showPopup = $bindable(false),
	onopen = () => {},
	popup,
	button,
} = $props();

let elem_button = $state();
let elem_popup = $state();

import { browser } from "$app/environment";

$effect.pre(() => {
	onShowPopup();
});

async function onShowPopup() {
	if (!showPopup) {
		enableScroll();
		return;
	}
	await tick();
	preventScroll();
	onopen();

	if (popup) {
		positionPopup();
	}

	if (autoClose) {
		elem_popup.querySelectorAll("a, button").forEach((el) => {
			el.addEventListener(
				"click",
				(e) => {
					showPopup = false;
				},
				{ once: true },
			);
		});
	}
}

function positionPopup() {
	const windowHeight = window.innerHeight;
	const windowWidth = window.innerWidth;
	if (!elem_button || !elem_popup) {
		// console.log("element not found in DOM");
		return;
	}
	const {
		top: button_top,
		left: button_left,
		right: button_right,
		width: button_width,
		height: button_height,
	} = elem_button.getBoundingClientRect();
	let popup_dim = elem_popup.getBoundingClientRect();

	if (position == "auto") {
		elem_popup.style.top = button_top + button_height + "px";
		elem_popup.style.left = button_left - popup_dim.width / 2 + button_width / 2 + "px";

		popup_dim = elem_popup.getBoundingClientRect();

		if (popup_dim.left + popup_dim.width > windowWidth - 32) {
			elem_popup.style.left = button_right - popup_dim.width + "px";
		}
		if (popup_dim.left < 0) {
			elem_popup.style.left = button_left + "px";
		}
		if (popup_dim.bottom > windowHeight) {
			elem_popup.style.top = button_top - popup_dim.height + "px";
		}
	}

	if (position == "bottom-right") {
		elem_popup.style.top = button_top + button_height + "px";
		elem_popup.style.left = button_right - popup_dim.width + "px";
	}

	if (position == "bottom-left") {
		elem_popup.style.top = button_top + button_height + "px";
		elem_popup.style.left = button_left + "px";
	}

	if (position == "bottom-center") {
		elem_popup.style.top = button_top + button_height + "px";
		elem_popup.style.left = button_left - popup_dim.width / 2 + button_width / 2 + "px";
	}

	if (position == "top-right") {
		elem_popup.style.top = button_top - popup_dim.height + "px";
		elem_popup.style.left = button_right - popup_dim.width + "px";
	}

	if (position == "top-left") {
		elem_popup.style.top = button_top - popup_dim.height + "px";
		elem_popup.style.left = button_left + "px";
	}

	if (position == "top-center") {
		elem_popup.style.top = button_top - popup_dim.height + "px";
		elem_popup.style.left = button_left - popup_dim.width / 2 + button_width / 2 + "px";
	}

	if (sameWidthAsParent) {
		elem_popup.style.width = button_width + "px";
		elem_popup.style.left = button_left + "px";
	}
}

function closePopover() {
	showPopup = false;
	enableScroll();
}

onDestroy(() => {
	enableScroll();
});

function preventScroll() {
	if (!browser) return;
	if (document.documentElement.scrollHeight <= window.innerHeight) return;

	document.documentElement.style.overflow = "hidden";
	document.documentElement.classList.add("scrollbar-gutter");
}

function enableScroll() {
	if (!browser) return;
	document.documentElement.style.overflow = "unset";
	document.documentElement.classList.remove("scrollbar-gutter");
}
</script>

{#if showPopup}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="background"
		onclick={() => {
			showPopup = false;
		}}>
	</div>
{/if}

<svelte:window onresize={() => positionPopup()} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="popover">
	<!-- svelte-ignore slot_element_deprecated -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		bind:this={elem_button}
		class="button"
		role="button"
		onclick={() => {
			showPopup = true;
		}}>
		{@render button?.()}
	</div>
	{#if showPopup}
		<div
			bind:this={elem_popup}
			class="popup"
			class:auto={position == "auto"}
			class:anchor={position != "auto"}
			class:bottom-left={position == "bottom-left"}
			class:bottom-right={position == "bottom-right"}
			class:bottom-center={position == "bottom-center"}
			class:top-left={position == "top-left"}
			class:top-right={position == "top-right"}
			class:top-center={position == "top-center"}>
			{@render popup?.()}
		</div>
	{/if}
</div>

<style lang="scss">
.background {
	background-color: transparent;
	width: min(100%, 100vw);
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
}
.button {
	padding: 0 !important;
}
.popover {
	width: var(--width, fit-content);
}
.popup {
	z-index: 1001;
	position: fixed;
	width: fit-content;
	left: 0;
	top: 0;
	padding: 0 !important;
}
</style>
