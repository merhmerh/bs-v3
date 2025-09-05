<script>
import { genId, titleCase } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import { tick } from "svelte";

/**
 * @typedef {Object} Props
 * @property {Array<string>} [tags]
 * @property {number} [max]
 * @property {Array<string>|Boolean} [options]
 * @property {boolean} [enforceOptions]
 * @property {string} [placeholder]
 */
/** @type {Props} */
let {
	tags = $bindable([]),
	max = null,
	options = false,
	enforceOptions = false,
	placeholder = "Enter Tags...",
	showOptionsWhenMatches = false,
	error = $bindable(false),
	onchange = () => {},
} = $props();
let isFocusTriggered = $state(false);
let input = $state();
let inputValue = $state("");
let errorExistTag = $state(false);
let dropdownList = $state(setupList());
let dropdown = $state();
let showOptions = $state(false);
let currentSelection = $state("");
let selected = $state("");

function setupList() {
	if (!options) return false;

	if (Array.isArray(options)) {
		return options.map((x) => ({ value: x, show: true, id: genId(9, "t-") }));
	}
	console.error("Options must be an array");
}

function triggerChange() {
	onchange(tags);
}

function handleKeydown(e) {
	if (e.key == "Backspace" && inputValue == "") {
		tags = tags.slice(0, -1);
		triggerChange();
	}

	if (e.key == "Tab" && !inputValue.trim()) return;

	if (e.key == "Enter" && currentSelection && document.activeElement == input) {
		const selectedValue = dropdownList.find((x) => x.id == currentSelection);

		insertOrRemoveTag(selectedValue.value);
		if (tags.length == 0) {
			currentSelection = null;
		}
		inputValue = "";
		return;
	}

	if (e.key == "Enter" || e.key == "," || e.key == "Tab") {
		e.preventDefault();
		const value = inputValue.trim();
		if (!value && !showOptionsWhenMatches) {
			return toggleOptionsList(true);
		}

		insertValue(inputValue.trim());
		return;
	}

	if (e.key == "ArrowDown" || e.key == "ArrowUp") {
		if (showOptionsWhenMatches && !inputValue) {
			return;
		}
		handleArrowKeys(e);
	}

	function insertValue(value) {
		if (!value) return;

		const isMax = max && tags.length >= max;
		if (tags.includes(value) || isMax) {
			errorExistTag = true;
			return;
		}

		if (enforceOptions && !options.includes(value)) {
			errorExistTag = true;
			return;
		}

		toggleOptionsList(false);
		insertOrRemoveTag(value);
		triggerChange();
		inputValue = "";
	}

	async function handleArrowKeys(e) {
		const key = e.key;
		toggleOptionsList(true);
		await tick();
		e.preventDefault();
		if (dropdownList.filter((x) => x.show).length == 0) {
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
			// const next = dropdown.querySelector(`#${target_id}`);

			const next = dropdown.querySelector(`#${target_id}`).nextElementSibling;
			if (next) {
				currentSelection = next.id;
			} else {
				currentSelection = dropdown.querySelector("li").id;
			}
			// console.log(dropdown);
			dropdown.scrollTo(0, 0);
		}

		if (key == "ArrowUp") {
			const prev = dropdown.querySelector(`#${target_id}`).previousElementSibling;
			if (prev) {
				currentSelection = prev.id;
			} else {
				const last = dropdown.querySelectorAll("li");
				currentSelection = last[last.length - 1].id;
			}
			// dropdown.scrollTo(0, 0);
		}

		const preselected_element = document.querySelector(`#${currentSelection}`);
		if (preselected_element) {
			dropdown.querySelector("ul").scrollTo(0, preselected_element.offsetTop - 119);
		}
	}
}

function resetDropdownOptions() {
	if (!options) return;
	const currentTags = tags.map((x) => x.toLowerCase());
	dropdownList = dropdownList.map((x) => {
		if (currentTags.includes(x.value.toLowerCase())) {
			x.show = false;
			return x;
		}
		x.show = true;
		return x;
	});
}

function handleInput(e) {
	if (!options) return;
	// currentSelection = null;

	const searchVal = e.target.value.toLowerCase();

	if (!searchVal) {
		resetDropdownOptions();
		if (showOptionsWhenMatches) {
			toggleOptionsList(false);
		}
		return;
	}
	if (!showOptions) {
		toggleOptionsList(true);
	}

	dropdownList = dropdownList.map((x) => {
		x.show = x.value.toLowerCase().includes(searchVal);
		return x;
	});
}

function optionOnClick(option) {
	selected = option;
	currentSelection = null;
	insertOrRemoveTag(option.value);
	inputValue = "";
}

async function insertOrRemoveTag(value) {
	if (tags.includes(value)) {
		tags = tags.filter((x) => x !== value);
	} else {
		if (enforceOptions && !options.includes(value)) {
			return;
		}
		if (max && tags.length >= max) {
			return;
		}
		tags.push(value);
	}

	triggerChange();
	resetDropdownOptions();

	if (max && tags.length < max) {
		return input.focus();
	}
	showOptions = false;
}

async function toggleOptionsList(bool) {
	if (bool == true && max && tags.length >= max) {
		return;
	}

	if (bool == true || bool == false) {
		showOptions = bool;
	} else {
		showOptions = !showOptions;
	}
	await tick();
	if (showOptions) {
		//open
		document.documentElement.style.overflow = "hidden";
		document.documentElement.classList.add("scrollbar-gutter"); //auto scroll to selected
	} else {
		//close
		document.documentElement.style.overflow = "unset";
		document.documentElement.classList.remove("scrollbar-gutter");
	}
}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key == "Escape") {
			toggleOptionsList(false);
		}
	}}
	onclick={(e) => {
		if (e.target.closest("button")) {
			return;
		}
		if (e.target.closest(".tags-editor") == null && showOptions) {
			toggleOptionsList(false);
		}
	}} />

<div class="tags-editor">
	<div class="tags-container" class:error>
		{#each tags as tag}
			<span class="tag">
				{#if enforceOptions}
					<span>{options.find((x) => x.toLowerCase() == tag.toLowerCase())}</span>
				{:else}
					<span>{tag}</span>
				{/if}
				<button
					tabindex="-1"
					class="icon none"
					onclick={() => {
						console.log("!");
						insertOrRemoveTag(tag);
						showOptions = false;
					}}>
					<Icon icon="ic:round-close" />
				</button>
			</span>
		{/each}
		<input
			bind:this={input}
			class:errorExistTag
			bind:value={inputValue}
			placeholder={max && tags.length >= max ? "" : placeholder}
			onfocus={() => {
				currentSelection = null;
				if (showOptionsWhenMatches) return;
				toggleOptionsList(true);
				isFocusTriggered = true;
				setTimeout(() => {
					isFocusTriggered = false;
				}, 300);
			}}
			onclick={() => {
				if (showOptionsWhenMatches) return;
				if (isFocusTriggered) {
					isFocusTriggered = false;
					return;
				}
				if (!showOptions) {
					toggleOptionsList(true);
				} else {
					toggleOptionsList(false);
				}
			}}
			onfocusout={(e) => {
				if (dropdown && e.relatedTarget && dropdown.contains(e.relatedTarget)) {
					return;
				}
				if (input.value) {
					insertOrRemoveTag(input.value);
					input.value = "";
				}
				toggleOptionsList(false);
			}}
			onkeydown={handleKeydown}
			oninput={(e) => {
				handleInput(e);
				const isEmpty = e.target.value === "";
				const hasReachedMax = max && tags.length >= max;
				errorExistTag = !isEmpty && hasReachedMax;
			}} />

		{#if max && tags.length >= max}
			<p class="text-sm">
				Maximum of {max} entries reached
			</p>
		{/if}
	</div>
	{#if showOptions && Array.isArray(dropdownList)}
		<div bind:this={dropdown} class="dropdown-container">
			<ul tabindex="-1">
				{#each dropdownList as option}
					{#if option.show}
						<li id={option.id}>
							<button
								class="none"
								tabindex="-1"
								class:preselected={currentSelection == option.id}
								onclick={() => optionOnClick(option)}>
								<div class="name">
									<span>
										{titleCase(option.value)}
									</span>
									{#if tags.map((x) => x.toLowerCase()).includes(option.value.toLowerCase())}
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

				{#if enforceOptions && dropdownList.filter((x) => x.show).length == 0}
					<span class="not-found"> No results found </span>
				{:else if dropdownList.filter((x) => x.show).length == 0}
					<span class="not-found"> No results found, but you’re free to type in your own </span>
				{/if}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
.tags-editor {
	position: relative;
	width: min(600px, 100%);
	.tags-container {
		border: 1px solid var(--border-base);
		width: 100%;
		border-radius: 0.5rem;
		padding-block: 0.5rem;
		padding-inline: 0.75rem;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		border: 1px solid var(--border-base);
		outline: 1px solid transparent;
		transition: all 0.3s;
		background-color: var(--bg, var(--input-base));
		&.error {
			outline: 1px solid var(--red);
			border: 1px solid transparent;
		}
		&:focus-within {
			border: 1px solid var(--mono-mid);
			outline: 1px solid var(--mono-mid);
		}
		.tag {
			display: flex;
			align-items: center;
			padding-inline: 0.25rem;
			padding-left: 0.5rem;
			gap: 0.25rem;
			font-size: 0.875rem;
			border-radius: 0.25rem;
			--bg: var(--accent-light);
			background-color: var(--bg);
			padding-block: 0.25rem;
			button.icon {
				padding: 2px;
				background-color: transparent;
				&:hover {
					background-color: color-mix(in srgb, var(--primary), 70% transparent);
				}
			}
		}
		input {
			background-color: transparent;
			padding: 0;
			padding-block: 2px;
			border: 0;
			border-radius: 0rem;
			flex-shrink: 1;
			flex-grow: 1;
			min-width: 120px;
			width: 1px;

			&:hover,
			&:focus-visible {
				border: 0;
				outline: 0;
			}
			&.errorExistTag {
				color: var(--red);
			}
		}
	}

	.dropdown-container {
		z-index: 1;
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		border-radius: 0.375rem;
		border: 1px solid var(--mono-100);
		width: 100%;
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
				// &.dividerStyle:not(:last-child) {
				// 	border-bottom: 1px solid var(--border-base);
				// }
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
					// &.selected {
					// 	background-color: color-mix(in srgb, var(--primary) 30%, transparent);
					// }
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

p {
	margin: 0;
	margin-top: 0.25rem;
	color: var(--text-light);
}
</style>
