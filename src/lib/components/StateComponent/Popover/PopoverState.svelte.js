import { timeout } from "$fn/helper.js";
import { getContext, setContext, tick } from "svelte";

export class PopoverState {
	isOpen = $state(false);
	popover = $state(null);
	isOpening = $state(false);
	offset = $state({ x: 0, y: 0 });
	name = $state(null);
	_checkFrameId = null;
	transitionDuration = $state(0);
	listeners = {};
	mountTarget = $state(null);
	constructor() {
		//
	}

	async open({
		button,
		event,
		snippet,
		position,
		name,
		props = null,
		offset,
		background,
		blur,
	} = {}) {
		//if e is event or elements
		this.isOpening = true;
		this.name = name;
		let targetElement;
		if (event && event instanceof Event) {
			targetElement = event.target;
		} else if (button && button instanceof HTMLElement) {
			targetElement = button;
		} else {
			console.error("PopoverState.open() requires an event or button element");
			return;
		}

		this.isOpen = this.isOpen ? false : true;
		this.popover = {
			target: targetElement,
			snippet: snippet,
			position: position,
			container: null,
			props: props,
			bg: background ?? "transparent",
			blur: blur ? `blur(${blur})` : "none",
		};

		this.offset = offset || { x: 0, y: 0 };
		this.transitionDuration = background ? 200 : 0;

		await tick();

		await timeout(25);
		this.isOpening = false;
		if (!this.popover.container) return;
		this.setPosition();

		let rect = this.popover.target.getBoundingClientRect();
		let lastLeft = rect.left;
		let lastTop = rect.top;

		const checkPositionChange = () => {
			if (!this.popover || !this.isOpen) return;

			const currentRect = this.popover.target.getBoundingClientRect();
			if (currentRect.left !== lastLeft || currentRect.top !== lastTop) {
				lastLeft = currentRect.left;
				lastTop = currentRect.top;
				this.setPosition();
			}

			this._checkFrameId = requestAnimationFrame(checkPositionChange);
		};

		this._checkFrameId = requestAnimationFrame(checkPositionChange);
	}

	on(eventName, callback) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(callback);
	}

	async close() {
		if (this.isOpening) return;
		this.isOpen = false;
		this.popover = null;
		this.name = null;

		if (this._checkFrameId) {
			cancelAnimationFrame(this._checkFrameId);
			this._checkFrameId = null;
		}
		await timeout(250);
		this.transitionDuration = 0;

		if (this.listeners["close"]) {
			this.listeners["close"].forEach((cb) => cb());
		}
		this.listeners = {};
	}

	clickOutsideClose(e) {
		if (this.popover === null) return;

		// if click on anything this.popover.target and child of do nothing
		if (this.popover?.target.contains(e.target)) return;

		if (!this.popover?.container) return;

		//if click on this.popover.container and child of do nothing
		if (this.popover?.container.contains(e.target)) return;

		//if element not in the DOM
		if (!document.body.contains(e.target)) return;

		this.close();
	}

	setPosition() {
		if (this.popover == null || !this.popover.container) return;

		// this.popover.container.style.left = `0px`;
		// this.popover.container.style.top = `0px`;

		// return;
		const targetRect = this.popover.target.getBoundingClientRect();
		const snippetWidth = this.popover.container.getBoundingClientRect().width;

		const offset = {
			bottom: {
				x: targetRect.x + targetRect.width / 2 - snippetWidth / 2,
				y: targetRect.y + targetRect.height,
			},
			"bottom-left": {
				x: targetRect.x,
				y: targetRect.y + targetRect.height,
			},
			"bottom-right": {
				x: targetRect.x + targetRect.width - snippetWidth,
				y: targetRect.y + targetRect.height,
			},
			"bottom-center": {
				x: targetRect.x + targetRect.width / 2 - snippetWidth / 2,
				y: targetRect.y + targetRect.height,
			},
			"top-left": {
				x: targetRect.x,
				y: targetRect.y - this.popover.container.offsetHeight,
			},
			"top-center": {
				x: targetRect.x + targetRect.width / 2 - snippetWidth / 2,
				y: targetRect.y - this.popover.container.offsetHeight,
			},
			"top-right": {
				x: targetRect.x + targetRect.width - snippetWidth,
				y: targetRect.y - this.popover.container.offsetHeight,
			},
		};

		this.t = offset[this.popover.position];

		if (this.offset) {
			this.t.x += this.offset.x || 0;
			this.t.y += this.offset.y || 0;
		}

		this.popover.container.style.left = `${this.t.x}px`;
		this.popover.container.style.top = `${this.t.y}px`;

		//check if popover is out of bounds
		const popoverRect = this.popover.container.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		if (popoverRect.right >= viewportWidth) {
			//shift left by 16px
			this.t.x -= popoverRect.right - viewportWidth + 16;
			this.popover.container.style.left = `${this.t.x}px`;
			this.popover.container.style.width = `${popoverRect.width - 16}px`;
		}
		if (popoverRect.left < 0) {
			//shift right by 16px
			this.t.x += -popoverRect.left + 16;
			this.popover.container.style.left = `${this.t.x}px`;
		}

		if (popoverRect.bottom > viewportHeight) {
			// if popover is out of bounds at the bottom, position at bottom
		}

		if (popoverRect.top < 0) {
			const newPosition = this.popover.position.replace("top", "bottom");
			this.t = offset[newPosition];
			this.popover.container.style.left = `${this.t.x}px`;
			this.popover.container.style.top = `${this.t.y}px`;
		}

		if (viewportHeight < 500) {
			this.popover.container.style.top = `8px`;
			return;
		}
	}

	resize() {
		if (!this.isOpen) return;
		this.setPosition();
	}

	handleKeydown(e) {
		if (e.key === "Escape") {
			this.close();
		}
	}
}

const KEY = Symbol("PopoverState");

/**
 * @returns {PopoverState} - A new instance of `State` which is stored in the context.
 */
export function setPopoverState(stateKey = null) {
	return setContext(stateKey || KEY, new PopoverState());
}

/**
 * Retrieves the current state from the context.
 * @returns {ReturnType<typeof PopoverState>} - The current state.
 */
export function getPopoverState(stateKey = null) {
	// console.log(page.route.id);
	return getContext(stateKey || KEY);
}
