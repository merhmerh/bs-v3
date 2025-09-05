<script>
import { genId, titleCase } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import { onMount, tick } from "svelte";

/**
 * @typedef {Object} Props
 * @property {string} [placeholder]
 * @property {any} [options]
 * @property {any|Object} [selected]
 * @property {boolean} [titleCaseValue]
 * @property {any|string} [selectedValue]
 * @property {boolean} [divider]
 * @property {boolean} [error]
 */

/** @type {Props} */
let {
	placeholder = "Select",
	options = [],
	resetOption = null,
	selected = $bindable(null),
	titleCaseValue = true,
	selectedValue = $bindable(null),
	divider = false,
	error = $bindable(false),
	onchange = () => {},
} = $props();
let optionsData = $state(initOptions());
let showOptions = $state(false);
let dropdown = $state();
let input = $state();
let currentSelection = $state();
let s = $state(1);

function setBySelectedValue() {
	if (!input) return;
	if (!selected && selectedValue) {
		selected = optionsData.find((x) => x.name == selectedValue);
		setValue();
	}
}

function setValue() {
	if (!input) return;
	if (resetOption && selected && selected.name == resetOption) {
		input.value = "";
		selected = null;
		selectedValue = null;
		optionsData.find((x) => x.id == "c-reset").show = false;
		triggerOnChange(optionsData.find((x) => x.id == "c-reset"));
		return;
	}

	if (selected) {
		input.value = titleCaseValue ? titleCase(selected.name) : selected.name;
		selectedValue = selected.name;
		error = null;
		triggerOnChange(selected);
	}
	if (resetOption && selected) {
		optionsData.find((x) => x.id == "c-reset").show = true;
	}

	showOptions = false;
}

function triggerOnChange(val) {
	if (s == 1) {
		s = 0;
		onchange(val);
	}
}

function initOptions() {
	// if option is array of string
	if (typeof options[0] !== "object") {
		const data = options.map((x) => ({
			...x,
			name: x.toString(),
			show: true,
			id: genId(9, "c-"),
		}));
		if (resetOption) {
			data.unshift({ name: resetOption, show: false, id: "c-reset" });
		}
		return data;
	}

	const data = options.map((x) => ({ ...x, show: true, id: genId(9, "c-") }));
	if (resetOption) {
		return data.unshift({ name: resetOption, show: false, id: "c-reset" });
	}

	return data;
}

function handleInput(e) {
	showOptions = true;
	const searchValue = e.target.value;
	filter(searchValue.toLowerCase());
}

async function toggleOptions(bool) {
	if (bool == true || bool == false) {
		showOptions = bool;
	} else {
		showOptions = !showOptions;
	}

	await tick();
	if (showOptions) {
		//open
		document.documentElement.style.overflow = "hidden";
		document.documentElement.classList.add("scrollbar-gutter");
		//auto scroll to selected
		if (selected) {
			const selected_element = document.querySelector(`#${selected.id}`);
			dropdown.querySelector("ul").scrollTo(0, selected_element.offsetTop - 119);
		}
	} else {
		//close
		document.documentElement.style.overflow = "unset";
		document.documentElement.classList.remove("scrollbar-gutter");
	}
}

function handleInputKeydown(e) {
	if (e.key == "ArrowDown" || e.key == "ArrowUp") {
		handleArrowKeys(e);
	}

	if (e.key == "Enter") {
		selected = optionsData.find((x) => x.id == currentSelection);
		currentSelection = null;
		toggleOptions();
		setValue();
		return;
	}

	if (e.key == "Tab") {
		if (!showOptions) return;
		e.preventDefault();

		if (currentSelection) {
			selected = optionsData.find((x) => x.id == currentSelection);
			currentSelection = null;
		} else {
			selected = optionsData.find((x) => x.id == dropdown.querySelector("li").id);
		}
		setValue();
		return;
	}
}

async function handleArrowKeys(e) {
	const key = e.key;
	showOptions = true;

	await tick();

	e.preventDefault();
	if (optionsData.filter((x) => x.show).length == 0) {
		return;
	}

	if (!currentSelection && !selected) {
		currentSelection = dropdown.querySelector("li").id;
		return;
	}

	const target_id = (() => {
		const target_id = currentSelection || selected?.id;

		//check if target_id exists otherwise show the first from the list
		if (dropdown.querySelector(`#${target_id}`)) {
			return target_id;
		} else {
			return dropdown.querySelector("li").id;
		}
	})();

	if (key == "ArrowDown") {
		const next = dropdown.querySelector(`#${target_id}`).nextElementSibling;
		if (next) {
			currentSelection = next.id;
		} else {
			currentSelection = dropdown.querySelector("li").id;
		}
	}

	if (key == "ArrowUp") {
		const prev = dropdown.querySelector(`#${target_id}`).previousElementSibling;
		if (prev) {
			currentSelection = prev.id;
		} else {
			const last = dropdown.querySelectorAll("li");
			currentSelection = last[last.length - 1].id;
		}
	}

	const preselected_element = document.querySelector(`#${currentSelection}`);
	if (preselected_element) {
		dropdown.querySelector("ul").scrollTo(0, preselected_element.offsetTop - 119);
	}
}

function resetFilter() {
	optionsData = optionsData.map((x) => ({ ...x, show: true }));
}

function filter(searchValue) {
	if (!searchValue) {
		resetFilter();
	}

	optionsData = optionsData.map((x) => {
		let fts = x.name.toLowerCase();
		if (x.description) {
			fts += " " + x.description.toLowerCase();
		}
		x.show = fts.includes(searchValue);
		return x;
	});
}

$effect.pre(() => {
	selectedValue, setBySelectedValue();
});

export function clear() {
	selected = null;
	selectedValue = null;
	input.value = "";
	setValue();
}
</script>

<svelte:window
	onclick={(e) => {
		if (e.target.closest(".combo-box") == null && showOptions) {
			toggleOptions();
		}
	}} />
<div class="combo-box">
	<div class="input-box" class:error>
		<input
			type="text"
			spellcheck="false"
			autocomplete="off"
			{placeholder}
			bind:this={input}
			onkeydown={handleInputKeydown}
			oninput={handleInput}
			onclick={toggleOptions} />
		<button tabindex="-1" class="none no-hover icon" onclick={toggleOptions}>
			<Icon icon="ic:round-expand-more" height="20" />
		</button>
	</div>
	{#if showOptions}
		<div bind:this={dropdown} class="dropdown-container">
			<ul>
				{#each optionsData as option}
					{#if option.show}
						<li id={option.id} class:dividerStyle={divider}>
							<button
								class="none"
								class:preselected={currentSelection == option.id}
								class:selected={selected?.id == option.id}
								onclick={() => {
									selected = option;
									setValue();
									currentSelection = null;
									toggleOptions(false);
								}}>
								<div class="name">
									{#if option.display_value}
										<span>{option.display_value}</span>
									{:else}
										<span>
											{#if titleCaseValue}
												{titleCase(option.name)}
											{:else}
												{option.name}
											{/if}
										</span>
									{/if}
									{#if selected?.id == option.id}
										<div class="checked icon">
											<Icon icon="lucide:check" height="20" />
										</div>
									{/if}
								</div>
								{#if option.description}
									<div class="description">{option.description}</div>
								{/if}
							</button>
						</li>
					{/if}
				{/each}

				{#if optionsData.filter((x) => x.show).length == 0}
					<span class="not-found"> No results found </span>
				{/if}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
.combo-box {
	position: relative;
	width: min(var(--min-width), 100%);
	.input-box {
		padding-right: 0.5rem;
		--input-box-bg: var(--bg-100);
		border-radius: 0.5rem;
		padding: 0;
		padding-inline: 0.5rem;
		--border-color: var(--border-base);
		border: 1px solid var(--border-color);
		outline: 0px solid transparent;
		background-color: var(--bg, var(--input-base));
		// transition: all 0.3s;

		&:hover {
			--border-color: var(--border-mid);
		}
		&:focus-within {
			--border-color: var(--mono-mid);
			outline: 1px solid var(--mono-mid);
		}
		&.error {
			--border-color: var(--red);
			&:focus-within {
				outline: 0;
			}
		}
		input {
			cursor: pointer;
			height: 2.5rem;
			padding-inline: 0;
			border-radius: 0;
			&::placeholder {
				color: var(--text-light);
			}
		}
		.icon {
			color: var(--mono);
			padding: 0;
		}
	}
	.dropdown-container {
		z-index: 1;
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		border-radius: 0.375rem;
		border: 1px solid var(--mono-100);
		width: var(--dropdown-width, 100%);
		background-color: var(--bg-100);
		padding-inline: 0.5rem;
		padding-block: 0.5rem;
		height: auto;
		box-shadow: 0 4px 12px color-mix(in srgb, #000 12%, transparent);
		border: 1px solid var(--border-base);
		ul {
			max-height: 250px;
			height: fit-content;
			margin: 0;
			padding: 0;
			padding-right: 0.25rem;
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			li {
				list-style-type: none;
				&.dividerStyle:not(:last-child) {
					border-bottom: 1px solid var(--border-base);
				}
				button {
					padding-block: 0.5rem;
					padding-inline: 0.5rem;
					width: 100%;
					display: flex;
					text-align: left;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					&.preselected {
						background-color: color-mix(in srgb, var(--primary) 12%, transparent);
					}
					&.selected {
						background-color: color-mix(in srgb, var(--primary) 30%, transparent);
					}
					&:focus-visible {
						outline: 0 !important;
						background-color: color-mix(in srgb, var(--primary) 12%, transparent);
					}
					.name {
						display: flex;
						justify-content: space-between;
						text-align: left;
						font-size: 0.875rem;
						width: 100%;
						span {
							width: fit-content;
							max-width: 80%;
						}
						.checked {
							color: var(--primary);
						}
					}
					.description {
						text-align: left;
						margin-right: auto;
						color: var(--mono);
						font-size: 0.8125rem;
					}
				}
			}
			.not-found {
				padding-inline: 0.5rem;
				padding-block: 0.5rem;
				font-size: 0.875rem;
				color: var(--mono);
			}
		}
	}
}
</style>
