<script>
import { debounce, fastRandom, genId, titleCase } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import { tick } from "svelte";

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
	titleCaseValue = false,
	selectedValue = $bindable(null),
	divider = false,
	error = $bindable(false),
	disabled = $bindable(false),
	small = true,
	enforceOptions = true,
	setNull = false,
	disableTextInput = false,
	onchange = () => {},
	parentContainer = null,
} = $props();
let thisComponentID = fastRandom(9, "f-");
let currentSelection = $state();
let optionsData = $state(initOptions());
let showOptions = $state(false);
let dropdown = $state();
let input = $state();
let initialLoad = $state(true);

export function set(name) {
	if (name == null) {
		selected = null;
		selectedValue = null;
		return;
	}
	selected = optionsData.find((x) => x.name == name);
	setValue();
}

function setBySelectedValue() {
	if (!input) return;
	if (!selected && selectedValue) {
		selected = optionsData.find((x) => x.name == selectedValue);
		if (selected) {
			return setValue();
		}
	}

	if (input && !enforceOptions) {
		// input.value = selectedValue;
		setInputValue(selectedValue);
	}
}

function setValue() {
	if (!input) return;
	if (resetOption && selected && selected.name == resetOption) {
		setInputValue(null);
		selected = null;
		selectedValue = null;
		optionsData.find((x) => x.id == "c-reset").show = false;
		triggerOnChange(optionsData.find((x) => x.id == "c-reset"));
		return;
	}

	if (selected) {
		// input.value = titleCaseValue ? titleCase(selected.name) : selected.name;
		setInputValue(selected);
		// selectedValue = selected.name;
		error = null;
		triggerOnChange(selected);
	}

	if (resetOption && selected) {
		optionsData.find((x) => x.id == "c-reset").show = true;
	}

	showOptions = false;
}

function setInputValue(data) {
	if (data === null) {
		return (input.value = "");
	}

	if (typeof data === "string") {
		return (input.value = data);
	}

	let value = "";
	if (data.display_value) {
		value = data.display_value;
	} else {
		value = data.name;
	}

	value = titleCaseValue ? titleCase(value) : value;
	selectedValue = value;
}

const triggerOnChange = debounce((val) => {
	if (initialLoad) {
		initialLoad = false;
		return;
	}
	onchange(val.name, val);
}, 10);

function initOptions() {
	// if option is array of string
	if (typeof options[0] !== "object") {
		const data = options.map((x) => ({
			name: x.toString(),
			show: true,
			id: genId(9, "c-"),
		}));
		if (resetOption) {
			data.unshift({ name: resetOption, show: false, id: "c-reset" });
		}
		return data;
	}

	const data = options.map((x) => ({
		...x,
		name: x.display_value ?? x.name,
		show: true,
		id: genId(9, "c-"),
	}));
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

	const scrollableElement = parentContainer
		? document.querySelector(parentContainer)
		: document.documentElement;
	if (showOptions) {
		//if body is scrollable
		const isScrollable = scrollableElement.scrollHeight > window.innerHeight;
		if (!isScrollable) return;

		//open
		scrollableElement.style.overflow = "hidden";
		scrollableElement.classList.add("scrollbar-gutter");
		//auto scroll to selected
		if (selected) {
			const selected_element = document.querySelector(`#${selected.id}`);
			dropdown.querySelector("ul").scrollTo(0, selected_element.offsetTop - 119);
		}
	} else {
		//close
		if (document.querySelector(".modal_background ")) {
			return;
		}
		scrollableElement.style.overflow = "auto";
		scrollableElement.classList.remove("scrollbar-gutter");
	}
}

function handleInputKeydown(e) {
	initialLoad = false;

	if (e.key == "ArrowDown" || e.key == "ArrowUp") {
		handleArrowKeys(e);
	}

	if (e.key == "Enter" || e.key == "Tab") {
		if (!showOptions) return;
		e.preventDefault();

		if (!enforceOptions) {
			if (currentSelection) {
				selected = optionsData.find((x) => x.id == currentSelection);
				currentSelection = null;
				setValue();
			}

			forceSetValue(input.value);
			toggleOptions(false);
			return;
		}

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

function forceSetValue(value) {
	selectedValue = value;
	triggerOnChange(value, selected);
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

function validateElseSetValue() {
	if (input.value == "") {
		selected = null;
		selectedValue = null;
		onchange("");
		return;
	}

	if (!enforceOptions) {
		forceSetValue(input.value);
		return;
	}

	const match = optionsData.find((x) => {
		if (x.display_value) {
			return x.display_value.toLowerCase() == selectedValue.toLowerCase();
		}
		return x.name.toLowerCase() == selectedValue.toLowerCase();
	});
	let matchValue = match?.display_value || match?.name;
	matchValue = titleCaseValue ? titleCase(matchValue) : matchValue;

	if (enforceOptions && selectedValue !== matchValue) {
		if (currentSelection) {
			selected = optionsData.find((x) => x.id == currentSelection);
			currentSelection = null;
		} else {
			selected = optionsData.find((x) => x.show == true);
		}
		setValue();
		resetFilter();
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
		if (x.display_value) {
			fts += " " + x.display_value.toLowerCase();
		}
		if (x.description) {
			fts += " " + x.description.toLowerCase();
		}
		x.show = fts.includes(searchValue);
		return x;
	});
}

$effect.pre(() => {
	selectedValue, setBySelectedValue();
	if (!enforceOptions) {
		currentSelection = false;
		if (selectedValue !== selected?.name) {
			selected = null;
		}
	}
});
</script>

<svelte:window
	onclick={(e) => {
		if (e.target.closest(`#${thisComponentID}`) == null && showOptions) {
			toggleOptions(false);
			validateElseSetValue();
		}
	}} />

<div class="combo-box" id={thisComponentID} class:small>
	<div class="input-box" class:error class:disabled>
		<input
			type="text"
			spellcheck="false"
			autocomplete="off"
			{placeholder}
			bind:this={input}
			bind:value={selectedValue}
			onkeydown={handleInputKeydown}
			readonly={disableTextInput}
			oninput={handleInput}
			{disabled}
			onmousedown={() => {
				toggleOptions();
			}} />
		{#if setNull && selectedValue}
			<button tabindex="-1" class="none icon reset" onclick={() => set(null)}>
				<Icon icon="lucide:x" height="14" />
			</button>
		{/if}

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
								onclick={(e) => {
									initialLoad = false;

									selected = option;
									setValue();
									currentSelection = null;
									showOptions = false;
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

									{#if option.note}
										<span class="note">{option.note}</span>
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
					<span class="not-found">
						{#if enforceOptions}
							No results found
						{:else}
							Not available in the list, but you can type your own
						{/if}
					</span>
				{/if}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
.combo-box {
	position: relative;
	width: min(var(--min-width), 100%);
	&.small {
		font-size: 0.875rem;
		input {
			height: 2.25rem !important;
		}
		.input-box {
			border-radius: 0.5rem;
		}
		.dropdown-container {
			border-radius: 0.5rem;
			button {
				border-radius: 0.25rem;
				padding-block: 0.375rem;
				padding-left: 0.375rem;
			}
		}
	}
	.input-box {
		padding-right: 0.5rem;
		border-radius: 0.5rem;
		padding: 0;
		padding-inline: 0.5rem;
		border: 1px solid var(--border-color);
		outline: 0px solid transparent;
		--border-color: var(--border-base);
		background-color: var(--bg, var(--input-base));
		width: 100%;

		&:hover:not(.disabled):not(.error) {
			--border-color: var(--border-mid);
		}
		&:focus-within {
			--border-color: var(--mono) !important;
		}
		&.disabled {
			background-color: var(--input-disabled);
			.icon {
				color: var(--mono-soft);
			}
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
			&:disabled::placeholder {
				color: var(--text-disabled) !important;
				filter: opacity(0.75);
			}
		}
		button.reset {
			padding: 0.25rem;
			margin-right: 0.25rem;
			// border-radius: 50%;
			&:hover {
				background-color: transparent;
				color: color-mix(in srgb, var(--primary), 50% var(--bg-alt));
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
		top: calc(100% + 0.25rem);
		left: 0;
		border-radius: 0.375rem;
		border: 1px solid var(--border-base);
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
						align-items: center;
						text-align: left;
						font-size: 0.875rem;
						width: 100%;
						gap: 0.5rem;
						span {
							width: fit-content;
							max-width: 100%;
							text-overflow: ellipsis;
							overflow: hidden;
						}
						.note {
							margin-right: auto;
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
				padding-inline: 0rem;
				padding-block: 0rem;
				font-size: 0.875rem;
				color: var(--mono);
			}
		}
	}
}
</style>
