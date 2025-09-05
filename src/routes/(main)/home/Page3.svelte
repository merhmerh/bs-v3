<script>
import AppIcon from "$common/AppIcon.svelte";
import Icon from "@iconify/svelte";
import HomeWrapper from "./HomeWrapper.svelte";

const content = [
	{
		title: "Partners & Collaborators",
		icon: "la:handshake",
		description:
			"We work with industry partners and government agencies to provide holistic solutions for you.",
	},
	{
		title: "Security",
		icon: "lucide:lock",
		description:
			"We prioritize security, collecting data only with your consent and ensuring it is secure.",
	},
	{
		title: "Technology",
		icon: "grommet-icons:technology",
		description:
			"We leverage the latest web technologies to provide a blazing fast experience for our users.",
	},
	{
		title: "For Everyone",
		icon: "pepicons-pencil:people",
		description:
			"We strongly believe in the freemium model, providing core services for free and charging only for advanced features.",
	},
];
</script>

<HomeWrapper width="860px">
	<div class="container">
		<h2>
			About
			<AppIcon glyph="B" --height="2.5rem" />
		</h2>
		<p>
			BuiltSearch is an industry-focused platform designed specifically for the built environment
			sector. It offers a range of essential services such as BuiltChat, IFC Validator, Code and
			Regulation Guidelines, 3D Library, and more, all tailored to meet the unique needs of
			construction and building professionals. Founded and developed by built industry experts with
			over 15 years of experience, BuiltSearch aims to streamline workflows, enhance collaboration,
			and provide reliable, specialized tools for professionals dedicated to shaping the built
			world.
		</p>
	</div>

	<div class="grid">
		{#each content as item}
			<div class="card">
				<div class="title">
					<span>{item.title}</span>
					<Icon icon={item.icon} width="24" />
				</div>
				<p>
					{item.description}
				</p>
			</div>
		{/each}
	</div>
</HomeWrapper>

<style lang="scss">
.container {
	width: min(100%, 800px);
	display: flex;
	flex-direction: column;

	h2 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	p {
		line-height: 175%;
		color: var(--text-soft);
		text-align: justify;
		@media screen and (max-width: 768px) {
			// text-align: left;
			line-height: 150%;
			font-size: 0.875rem;
		}
	}
}
.grid {
	margin-top: 6rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto auto;
	@media screen and (max-width: 768px) {
		margin-top: 2rem;
		grid-template-columns: 1fr;
	}
	.card {
		padding-block: 3rem;
		padding-inline: 2rem;
		display: flex;
		flex-direction: column;
		&:nth-child(1),
		&:nth-child(2) {
			border-bottom: 1px solid var(--border);
		}
		&:nth-child(odd) {
			border-right: 1px solid var(--border);
		}
		@media screen and (max-width: 768px) {
			border: none !important;
			padding: 0;
			.title {
				font-size: 1rem !important;
			}
			p {
				font-size: 0.875rem;
			}
		}
		.title {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 1.25rem;
		}
		p {
			color: var(--text-soft);
		}
	}
}
</style>
