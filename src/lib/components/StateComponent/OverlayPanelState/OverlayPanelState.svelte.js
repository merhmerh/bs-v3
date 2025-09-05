import { genId, toUrlSafe } from "$fn/helper.js";
import { getContext, setContext, tick } from "svelte";

export class OverlayPanelState {
	panels = $state([]);
	constructor() {
		// this.reset();
		// this.listeners = {};
	}

	async open({
		title = "",
		name = "",
		toggleToClose = false,
		width,
		height,
		anchor,
		component = null,
		snippet = null,
		props = {},
		backgroundBlur = false,
	}) {
		if (!title && !name) {
			console.error("OverlayPanelState: Either 'title' or 'name' must be provided.");
			return;
		}
		if (!name) name = toUrlSafe(title);

		//check if name exists
		if (this.panels.some((panel) => panel.name === name)) {
			if (toggleToClose) {
				this.close(null, name);
			}
			return;
		}

		const transitionOffset = 32;
		const axisMap = {
			left: { x: -transitionOffset },
			right: { x: transitionOffset },
			center: { x: 0, y: 0 },
			top: { y: -transitionOffset },
			bottom: { y: transitionOffset },
		};
		const transition = axisMap[anchor] || { x: 0, y: 0 };

		const panel_id = genId(9);
		const panel = {
			id: panel_id,
			name: toUrlSafe(name),
			title: title,
			component: component,
			snippet: snippet,
			props: { ...props, panel_id: panel_id },
			container: null,
			backgroundBlur: backgroundBlur,
			transition: transition,
			style: {
				height: height || "auto",
				width: width || 400,
				anchor: anchor || "right",
			},
		};

		this.panels.push(panel);
		await tick();
		if (panel.backgroundBlur) {
			this.openOverlay();
		}
	}

	async close(id, name) {
		if (!id && !name) {
			this.panels = [];
		} else {
			if (id) {
				this.panels = this.panels.filter((panel) => panel.id !== id);
			} else {
				this.panels = this.panels.filter((panel) => panel.name !== name);
			}
		}
		await tick();
		const panelWithBlurExists = this.panels.some((panel) => panel.backgroundBlur);
		if (!panelWithBlurExists) {
			this.closeOverlay();
		}
	}

	setError(message, id) {
		const panel = id
			? this.panels.find((p) => p.id === id)
			: this.panels[this.panels.length - 1];
		if (panel) panel.error = message;
	}

	clearError(id) {
		const panel = id
			? this.panels.find((p) => p.id === id)
			: this.panels[this.panels.length - 1];
		if (panel) panel.error = null;
	}

	openOverlay() {
		document.documentElement.style.overflow = "hidden";
		document.documentElement.classList.add("scrollbar-gutter");
	}

	closeOverlay() {
		document.documentElement.style.overflow = "unset";
		document.documentElement.classList.remove("scrollbar-gutter");
	}
}

const KEY = Symbol("OverlayPanelState");

/**
 * @returns {OverlayPanelState} - A new instance of `State` which is stored in the context.
 */
export function setOverlayPanelState(stateKey = null) {
	return setContext(stateKey || KEY, new OverlayPanelState());
}

/**
 * Retrieves the current state from the context.
 * @returns {ReturnType<typeof OverlayPanelState>} - The current state.
 */
export function getOverlayPanelState(stateKey = null) {
	return getContext(stateKey || KEY);
}
