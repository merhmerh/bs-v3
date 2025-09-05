import { timeout, toUrlSafe } from "$fn/helper.js";
import { getContext, setContext, tick } from "svelte";

export class DialogState {
	dialog = $state(null);
	showDialog = $state(false);
	content = $state(null);
	dialogName = $state(null);
	listeners = {};
	showActions = $state(true);
	style = $state({});
	closeButton = $state(false);
	cancelName = $state("Cancel");
	warningButtonName = $state(null);
	constructor() {
		this.reset();
		this.listeners = {};
	}

	async show() {
		this.showDialog = true;
		this.defaultScrollbarGutter = window.getComputedStyle(document.body).scrollbarGutter;

		document.body.style.overflowY = "hidden";
		await tick();
		this.dialog.showModal();
	}

	async open({
		event,
		title,
		snippet = null,
		component = null,
		props = null,
		actions,
		name,
		width,
		alignTop = false,
		highlightFirst = false,
		focusFirstElement = true,
		cancelName = "Cancel",
		warningButtonName = null,
		showActions = true,
	}) {
		if (!name) name = toUrlSafe(title, true);
		if (warningButtonName) this.warningButtonName = warningButtonName;
		this.dialogName = name;
		this.style.width = width || 400;
		this.style.alignTop = alignTop;
		this.showActions = showActions;
		this.cancelName = cancelName;
		if (component && snippet) {
			console.error("Only one of 'component' or 'snippet' should be provided.");
			return;
		}

		this.content = {
			title: title,
			snippet: snippet,
			component: component,
			props: props,
			actions: actions ?? {},
		};

		if (!this.showActions) {
			this.closeButton = true;
		}

		await this.show();
		await timeout(50);

		const nodes = this.dialog.querySelectorAll("*");
		const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);
		if (tabbable.length) {
			if (focusFirstElement) {
				for (const el of tabbable) {
					el.blur();
					el.focus();
					//if is input auto highlight
					if (highlightFirst) {
						if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
							el.select();
						}
					}
					break;
				}
			} else {
				tabbable[0].blur();
			}
		}
	}

	close() {
		this.showDialog = false;
		document.body.style.overflowY = "auto";
		document.body.style.scrollbarGutter = this.defaultScrollbarGutter;
		this.emit("close:" + this.dialogName);
		this.reset();
	}

	reset() {
		this.dialogName = null;
		this.content = null;
		this.dialog = null;
		this.dialogName = null;
		this.showActions = true;
		this.closeButton = false;
		this.style = {
			alignTop: false,
		};
	}

	emit(eventName, ...args) {
		if (!this.listeners[eventName]) return;
		for (const cb of this.listeners[eventName]) {
			cb(...args);
		}
	}

	once(eventName, callback) {
		const wrapper = (...args) => {
			callback(...args);
			this.off(eventName, wrapper);
		};
		this.on(eventName, wrapper);
	}

	on(eventName, callback) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(callback);
	}

	off(eventName, callback) {
		if (!this.listeners[eventName]) return;
		this.listeners[eventName] = this.listeners[eventName].filter((cb) => cb !== callback);
	}

	setError(message) {
		this.content.error = message || "An error occurred";
	}
	clearError() {
		if (this.content) this.content.error = null;
	}
}

const KEY = Symbol("DialogState");

/**
 * @returns {DialogState} - A new instance of `State` which is stored in the context.
 */
export function setDialogState(stateKey = null) {
	return setContext(stateKey || KEY, new DialogState());
}

/**
 * Retrieves the current state from the context.
 * @returns {ReturnType<typeof DialogState>} - The current state.
 */
export function getDialogState(stateKey = null) {
	return getContext(stateKey || KEY);
}
