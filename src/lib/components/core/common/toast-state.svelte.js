/**
 * THIS IS NOT IN USE
 * USE TOAST-STORE.JS INSTEAD
 *
 */

import { genId, titleCase } from "$fn/helper.js";
import { getContext, onDestroy, setContext } from "svelte";

export class ToastState {
	toasts = $state([]);
	toastToTimeout = new Map();

	constructor() {
		onDestroy(() => {
			for (const timeout of this.toastToTimeout) {
				clearTimeout(timeout);
			}
			this.toastToTimeout.clear();
		});
	}

	/**
	 * Adds a notification with specified options.
	 *
	 * @param {Object} [options={}] - The notification options.
	 * @param {"info" | "success" | "warning" | "error" | "alert"} [options.type="info"] - The type of notification. Defaults to "info".
	 * @param {string} [options.title] - The title of the notification. Defaults to the type if not specified.
	 * @param {string} [options.message=""] - The message content of the notification.
	 * @param {number} [options.duration=5000] - Duration in ms, 0 for infinite.
	 */
	add({ type = "info", title, message = "", duration = 5000 } = {}) {
		const allowedTypes = ["info", "success", "warning", "error", "alert"];

		if (!type && allowedTypes.includes(title.toLowerCase())) {
			type = title.toLowerCase();
		} else if (!allowedTypes.includes(type)) {
			type = "info";
			console.log('Invalid toast type. Defaulting to "info"');
		}

		if (!title) {
			title = titleCase(type);
		}

		const id = genId(9);
		this.toasts.push({ id, type, title, message, duration });

		if (duration === 0) {
			return;
		}

		this.toastToTimeout.set(
			id,
			setTimeout(() => {
				this.remove(id);
			}, duration),
		);
	}

	remove(id) {
		const timeout = this.toastToTimeout.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.toastToTimeout.delete(id);
		}
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}
}

const TOAST_KEY = Symbol("TOAST");

/**
 * @returns {ToastState} - A new instance of `ToastState` which is stored in the context.
 */
export function setToastState() {
	return setContext(TOAST_KEY, new ToastState());
}

/**
 * Retrieves the current toast state from the context.
 * @returns {ReturnType<typeof setToastState>} - The current toast state, typed as the return type of `setToastState`.
 */
export function getToastState() {
	return getContext(TOAST_KEY);
}
