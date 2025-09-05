<script>
import Icon from "@iconify/svelte";
import HomeWrapper from "./HomeWrapper.svelte";

const faq = $state(
	[
		{
			q: "Do I need multiple accounts for different services?",
			a: "No, all BuiltSearch services can be accessed with a single login. Similarly, account registration and password reset will be processed under BuiltSearch.",
		},
		{
			q: "What can I use BuiltChat for?",
			a: "BuiltChat can interpret text and images, access real-time web information, search files, provide regulatory guidance, and generate or enhance visuals.",
		},
		{
			q: "Can I switch between different AI models in BuiltChat?",
			a: "Yes, BuiltChat allows users to switch between multiple AI models to meet different task requirements. As BuiltChat is constantly updating, you may find more than 3 AI models in the future.",
		},
		{
			q: "Who should use IFC Validator?",
			a: "BIM professionals, architects, engineers, and regulators needing reliable model validation.",
		},
		{
			q: "Does IFC Validator have a paid subscription?",
			a: "Yes, as this platform is currently in a limited beta trial for industry validation, we are only offering access to verified industry participants. The subscription will be billed yearly. Interested organisations can also request for a 1-week free trial.",
		},
		{
			q: "Is 3D Library free to use?",
			a: "Yes, all assets in 3D Library are free to user for both personal and commercial projects.",
		},
	].map((x) => {
		return { ...x, open: false };
	}),
);
</script>

<HomeWrapper width="900px">
	<h2>FAQ</h2>
	<p>Frequently Asked Questions about BuiltSearch and its services.</p>
	<div class="list">
		{#each faq as item}
			<details bind:open={item.open}>
				<summary>
					<span>{item.q}</span>
					{#if item.open}
						<Icon icon="lucide:minus" />
					{:else}
						<Icon icon="lucide:plus" />
					{/if}
				</summary>
				<div class="content">
					<div class="icon">
						<Icon icon="iconamoon:arrow-right-2-light" width="20" />
					</div>
					<p>{item.a}</p>
				</div>
			</details>
		{/each}
	</div>
</HomeWrapper>

<style lang="scss">
.list {
	padding-top: 3rem;
	width: 100%;
	display: flex;
	flex-direction: column;

	details {
		border-bottom: 1px solid var(--border);
		summary {
			list-style: none;
			cursor: pointer;
			display: flex;
			justify-content: space-between;
			padding-block: 1rem;
			span {
				font-weight: 500;
			}
		}
		.content {
			display: flex;
			align-items: flex-start;
			width: min(800px, 100%);
			padding-block: 1rem 2rem;
			.icon {
				margin-top: 0.125rem;
				color: var(--primary);
			}
			p {
				margin-block: 0;
				margin-left: 0.5rem;
				line-height: 150%;
				color: var(--text-soft);
			}
		}
	}
}
</style>
