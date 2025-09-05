import { getContext, onDestroy, setContext } from "svelte";
import { genId, titleCase } from "$fn/helper.js"; // Example title case helper

// Define the structure of a single toast item
/**
 * @typedef {Object} ToastItem
 * @property {string} id - Unique ID for the toast.
 * @property {"info" | "success" | "warning" | "error" | "alert"} type - The type of toast.
 * @property {string} title - The toast title.
 * @property {string} message - The toast message.
 * @property {number} duration - How long the toast should be visible.
 */

export class ToastState {
    // /** @type {Array<ToastItem>} */
    toasts = $state([]);

    toastTimeouts = new Map();

    constructor() {
        onDestroy(() => {
            this.clearAllTimeouts();
        });
    }

    /**
     * @typedef {Object} AddToastOptions
     * @property {"info" | "success" | "warning" | "error" | "alert"} [type="info"] - The type of notification.
     * @property {string} [title] - The title. Defaults to the type if not specified.
     * @property {string} [message=""] - The message content.
     * @property {number} [duration=5000] - Duration in ms, 0 for infinite. Defaults to 5000ms for error/alert/warning, 2500ms for others.
     */

    /**
     * Adds a notification with specified options.
     * @param {AddToastOptions} [options={}] - The notification options.
     */
    add({ type = "info", title, message = "", duration } = {}) {
        const allowedTypes = ["info", "success", "warning", "error", "alert"];

        if (!allowedTypes.includes(type)) {
            if (title && allowedTypes.includes(title.toLowerCase())) {
                type = title.toLowerCase();
            } else {
                type = "info";
                console.warn(`Invalid toast type "${type}". Defaulting to "info".`);
            }
        }

        if (!title) {
            title = titleCase(type);
        }

        if (duration === undefined) {
            duration = type === "error" || type === "alert" || type === "warning" ? 5000 : 2500;
        }

        const id = genId(9);

        const newToast = {
            id,
            type: type,
            title: title,
            message,
            duration: duration,
        };

        this.toasts.push(newToast);
        if (duration > 0) {
            const timeoutId = setTimeout(() => {
                this.remove(id);
            }, duration);
            this.toastTimeouts.set(id, timeoutId); // Store timeout ID
        }
    }

    /**
     * Add an success toast notification. The toast type is always set to "sucess".
     * @param {string|AddToastOptions} [data={}] - The  message string or an options object.
     * @param {string} [data.message] - The message to show.
     * @param {number} [data.duration] - Duration in milliseconds.
     */
    success(data) {
        let message, duration;
        if (typeof data == "object") {
            message = data.message;
            duration = data.duration;
        } else {
            message = data;
        }
        this.add({
            type: "success",
            message,
            duration,
        });
    }

    /**
     * Add an error toast notification. The toast type is always set to "error".
     * @param {string|AddToastOptions} [data={}] - The error message string or an options object.
     * @param {string} [data.message] - The error message to show.
     * @param {number} [data.duration] - Duration in milliseconds the toast should be displayed.
     */
    error(data) {
        let message, duration;
        if (typeof data == "object") {
            message = data.message;
            duration = data.duration;
        } else {
            message = data;
        }
        this.add({
            type: "error",
            message,
            duration,
        });
    }

    /**
     * Removes a notification by its ID.
     * @param {string} id - The ID of the toast to remove.
     */
    remove(id) {
        const timeoutId = this.toastTimeouts.get(id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.toastTimeouts.delete(id);
        }

        this.toasts = this.toasts.filter((toast) => toast.id !== id);
    }

    clearAllTimeouts() {
        this.toastTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
        this.toastTimeouts.clear();
    }
}

const KEY = Symbol("ToastState");

/**
 * Sets the ToastState instance in the Svelte context.
 * @returns {ToastState} - The new instance of ToastState stored in the context.
 */
export function setToastState() {
    return setContext(KEY, new ToastState());
}

/**
 * Retrieves the current ToastState instance from the context.
 * @returns {ToastState} - The current ToastState instance.
 */
export function getToastState() {
    const state = getContext(KEY);
    if (!state) {
        // Optional: Add a helpful error if context is not set
        throw new Error("ToastState not found in context. Did you call setToastState()?");
    }
    return state;
}
