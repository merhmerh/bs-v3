<script>
export let text = "";
export let limit = 300;
export let onToggle;
export let buttonText = "See";
let showAll = false;

function toggleShowAll() {
	showAll = !showAll;
	onToggle(showAll);
}
</script>

<p>
	{#if text}
		{showAll ? text : text.slice(0, limit) + (text.length > limit ? "..." : "")}
	{/if}
</p>

{#if text && text.length > limit}
	<button
		class="none text text-sm"
		style="--text-color:var(--text-base); "
		onclick={toggleShowAll}>
		{showAll ? `${buttonText} less` : `${buttonText} more`}
	</button>
{/if}

<style lang="scss">
p {
	margin-bottom: 0;
	white-space: pre-wrap;
}
button{
	text-decoration: underline;
	margin-top: 1rem;
}

</style>
