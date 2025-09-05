<script>
import { beforeNavigate, replaceState, pushState, onNavigate } from "$app/navigation";
import { page } from "$app/state";
import { genId } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import { onDestroy, onMount, tick } from "svelte";
let modal = $state();
let ready;
let defaultScrollbarGutter;
/**
 * @typedef {Object} Props
 * @property {boolean} [showModal]
 * @property {boolean} [closeButton]
 * @property {string} [closePosition]
 * @property {string} [modalPosition]
 * @property {boolean} [escape]
 * @property {boolean} [exitOutsideClick]
 * @property {boolean} [exitWithEscapeKey]
 * @property {boolean} [modalStyle]
 * @property {string} [viewTransitionName]
 * @property {import('svelte').Snippet<[any]>} [children]
 */

/** @type {Props} */
let {
	showModal = $bindable(false),
	closeButton = true,
	closePosition = "modal",
	modalPosition = "center",
	escape = true,
	exitOutsideClick = true,
	exitWithEscapeKey = true,
	modalStyle = true,
	viewTransitionName = "",
	modalHeight = "100%",
	autoFocus = true,
	children,
	onClose,
} = $props();

let clickedOutside;
const modalID = genId(6, "mdl-");

onMount(() => {
	if (!modal) return;
	document.body.style.overflowY = "hidden";

	focusFirstElement();
	ready = true;

	defaultScrollbarGutter = window.getComputedStyle(document.body).scrollbarGutter;

	return () => {
		document.body.style.overflowY = "auto";
		document.body.style.scrollbarGutter = defaultScrollbarGutter;
	};
});

function startClick(e) {
	if (e.target == modal) {
		clickedOutside = true;
		return;
	}
	clickedOutside = false;
}

function clickOutside(e) {
	if (e.target !== e.target.closest(".modal_background")) return;
	if (clickedOutside == false) return;

	if (!exitOutsideClick) {
		return;
	}
	close();
}

async function focusFirstElement() {
	await tick();
	if (!modal) return;
	if (!autoFocus) return;
	const nodes = modal.querySelectorAll("*");
	const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);
	for (const el of tabbable) {
		if (el.classList.contains("modal_close")) continue;
		el.focus();
		break;
	}
}

function handle_keydown(e) {
	if (!modal) return;

	if (modal.querySelector(".modal_background")) {
		return;
	}

	if (e.key === "Tab") {
		const nodes = modal.querySelectorAll("*");
		const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

		let index = tabbable.indexOf(document.activeElement);
		if (index === -1 && e.shiftKey) index = 0;

		index += tabbable.length + (e.shiftKey ? -1 : 1);
		index %= tabbable.length;

		while (tabbable[index].disabled) {
			index += 1;
		}

		tabbable[index].focus();
		e.preventDefault();
	}
}

function closeFromChild() {
	close();
}

function closeModal() {
	close();
}

export function show() {
	open();
}

export function hide() {
	close();
}

export function getElement() {
	return modal;
}

export function open() {
	showModal = true;
	pushState("", {
		[modalID]: true,
	});

	console.log(">", page.state);

	document.documentElement.style.overflow = "hidden";
	document.documentElement.classList.add("scrollbar-gutter");

	focusFirstElement();
}

export async function close() {
	replaceState("", {
		[modalID]: false,
	});
	showModal = false;
	if (onClose) onClose();
	document.documentElement.style.overflow = "unset";
	document.documentElement.classList.remove("scrollbar-gutter");
}

function handlePopState(e) {
	if (page.state[modalID] == true) {
		replaceState("", {
			[modalID]: false,
		});
		return;
	}
}

function handle_window_keydown(e) {
	if (!modal) return;

	if (!escape) return;

	if (modal.querySelector(".modal_background")) {
		return;
	}

	if (e.key === "Escape") {
		if (exitWithEscapeKey) {
			return close();
		}
	}
}

function resetOverflowStyles() {
	if (typeof document !== "undefined") {
		document.documentElement.style.overflow = "unset";
		document.documentElement.classList.remove("scrollbar-gutter");
	}
}

onDestroy(() => {
	resetOverflowStyles();
});
</script>

<svelte:window
	onkeydown={handle_window_keydown}
	onpopstate={(e) => {
		handlePopState(e);
		document.documentElement.style.overflow = "unset";
		document.documentElement.classList.remove("scrollbar-gutter");
	}} />

{#if page.state[modalID]}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		aria-modal="true"
		class="modal_background"
		onmouseup={clickOutside}
		onmousedown={startClick}
		bind:this={modal}
		onkeydown={handle_keydown}>
		<div
			class="modal"
			modal_position={modalPosition}
			class:noStyle={!modalStyle}
			role="dialog"
			aria-modal="true"
			style="--view-transition-name: {viewTransitionName}; --modal-height:{modalHeight}">
			<div class="child" class:slot={modalStyle}>
				{#if closeButton}
					{#if closePosition == "modal"}
						<button class="modal_close none" onclick={close}>
							<Icon icon="lucide:x" width="24" inline={true} />
						</button>
					{/if}
				{/if}
				{@render children?.({ closeFromChild, closeModal })}
			</div>
		</div>
		{#if closeButton}
			{#if closePosition == "background"}
				<button class="modal_close none topright" onclick={close}>
					<Icon icon="lucide:x" width="42" inline={true} />
				</button>
			{/if}
		{/if}
	</div>
{/if}

<style lang="scss">
.modal_background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100dvh;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
	background: color-mix(in srgb, var(--mono-light) 75%, transparent);
	backdrop-filter: blur(4px);
}
button.modal_close {
	// background-color: transparent !important;
	border: none;
	outline: none;
	color: var(--text-base);
	position: absolute;
	top: 0.25rem;
	right: 0.25rem;
	cursor: pointer;
	display: flex;
	height: 36px;
	width: 36px;
	border-radius: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	:global(svg) {
		flex-shrink: 0;
	}
	&.topright {
		margin: 1.5rem;
		width: 42px;
		height: 42px;
		@media screen and (max-width: 768px) {
			display: none;
		}
	}
}

.modal {
	z-index: 101;
	position: absolute;
	max-height: calc(100dvh - 4rem);
	min-width: 250px;
	width: min(var(--max-width, fit-content));
	max-width: 80vw;
	background-color: var(--bg-100);
	border-radius: 1rem;
	view-transition-name: var(--view-transition-name);
	padding: 1.5rem;
	padding-top: 1rem;
	padding-right: 1rem;
	overflow: clip;
	@media screen and (max-width: 768px) {
		max-width: unset;
		max-height: calc(100dvh - 2rem);
		width: calc(100vw - 2rem);
		height: var(--modal-height, 100dvh);

		@media screen and (max-width: 768px) {
			&::-webkit-scrollbar {
				width: 0px;
				height: 0px;
			}
		}
	}
	.child {
		max-height: calc(100dvh - 8rem);
		position: relative;
		padding: 0.25rem;
		padding-right: 1rem;
		overflow: auto;

		&.slot {
			min-width: 250px;
			min-height: 100px;
			@media screen and (max-width: 768px) {
				padding: 1rem;
				height: 100%;
				width: 100%;
			}
		}
	}

	&[modal_position="top"] {
		top: 5rem;
		.child {
			max-height: calc(100dvh - 5rem - 8rem);
		}
		@media screen and (max-width: 768px) {
			top: 1rem;
			transform: none;
		}
	}

	&.noStyle {
		padding: 0;
		border-radius: 0;
		background-color: transparent;
		max-height: unset !important;
		height: unset !important;
		width: unset !important;
		max-width: unset !important;
		@media screen and (max-width: 768px) {
			.child {
				padding-inline: 1rem;
				max-height: unset !important;
			}
		}
	}
}
</style>
