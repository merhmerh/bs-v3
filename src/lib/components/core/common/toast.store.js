import { genId, titleCase } from "$fn/helper.js";
import { writable } from "svelte/store";

export const toasts = initToast();
let toastToTimeout = new Map();

function initToast() {
	const { subscribe, update } = writable([]);

	/**
	 * Adds a notification with specified options.
	 *
	 * @param {Object} [options={}] - The notification options.
	 * @param {"info" | "success" | "warning" | "error" | "alert"} [options.type="info"] - The type of notification. Defaults to "info".
	 * @param {string} [options.title] - The title of the notification. Defaults to the type if not specified.
	 * @param {string} [options.message=""] - The message content of the notification.
	 * @param {number} [options.duration=5000] - Duration in ms, 0 for infinite.
	 */
	function add({ type = "info", title, message = "", duration = 5000 } = {}) {
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
		update((toasts) => [...toasts, { id, type, title, message, duration }]);

		if (duration === 0) {
			return;
		}

		toastToTimeout.set(
			id,
			setTimeout(() => {
				remove(id);
			}, duration),
		);
	}

	function remove(id) {
		const timeout = toastToTimeout.get(id);
		if (timeout) {
			clearTimeout(timeout);
			toastToTimeout.delete(id);
		}
		update((toast) => toast.filter((toast) => toast.id !== id));
	}

	return { subscribe, add, remove };
}
