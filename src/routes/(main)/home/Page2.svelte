<script>
import Icon from "@iconify/svelte";
import HomeWrapper from "./HomeWrapper.svelte";
const services = [
	{
		title: "IV (IFC Validator)",
		logo: "/apps/iv.svg",
		description:
			"Advanced validation solution that evaluates IFC models against IFC+SG standards or custom rule sets, ensuring precision, consistency, and efficient identification of compliance discrepancies.",
		linkText: "Explore IV",
		link: "https://iv.builtsearch.com",
		picture: "/home/iv-pic.webp",
	},
	{
		flip: true,
		title: "BuiltChat",
		logo: "/apps/builtchat.svg",
		description:
			"AI-powered assistant that interprets images, retrieves real-time web data, searches documents for relevant insights, enhances visuals, and delivers accurate codes and regulations.",
		linkText: "Explore BuiltChat",
		link: "https://builtchat.io",
		picture: "/home/bc-pic.webp",
	},
	{
		title: "3D Library",
		logo: "/apps/3d-lib.svg",
		description:
			"A comprehensive repository of 3D assets, including Revit models embedded with IFC+SG parameters, as well as fully furnished and ready-to-use three-dimensional environments..",
		linkText: "Explore 3D Library",
		link: "https://3d.builtsearch.com",
		picture: "/home/3d-pic.webp",
	},
];
</script>

<HomeWrapper width="100%">
	<div class="container">
		<h2 id="services">Our Products & Services</h2>
		<p class="text-center">
			Designed for the built industry to support compliance, regulations, intelligent assistance,
			and shared repository of 3D assets.
		</p>
	</div>
	<div class="grid">
		{#each services as sv}
			<div class="row">
				<div class="content" class:flip={sv.flip}>
					<div class="c1">
						<div class="title">
							<span>{sv.title}</span>
							<img draggable="false" class="logo" src={sv.logo} alt="logo" />
						</div>
						<p class="description">{sv.description}</p>
						<a class="link" href={sv.link} target="_blank">
							<span>{sv.linkText}</span>
							<div class="icon">
								<Icon icon="iconamoon:arrow-right-2-light" width="20" />
							</div>
						</a>
					</div>
					<div class="c2">
						<img src={sv.picture} alt="" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</HomeWrapper>

<style lang="scss">
.container {
	width: min(600px, 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	h2 {
		scroll-margin-top: 6rem;
	}
}
.grid {
	width: 100%;
	display: flex;
	flex-direction: column;
	padding-block: 2rem;
	@media screen and (max-width: 768px) {
		padding-bottom: 0;
	}
	.row {
		border-bottom: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		&:first-child {
			border-top: 1px solid var(--border);
		}
		@media screen and (max-width: 768px) {
			border-top: unset !important	;
			border-bottom: unset;
		}
		.content {
			display: flex;
			width: 978px;
			border-inline: 1px solid var(--border);
			&.flip {
				flex-direction: row-reverse;
				.c1 {
					border-right: none;
					border-left: 1px solid var(--border);
				}
			}
			.c1 {
				width: 60%;
				border-right: 1px solid var(--border);
				padding: 2rem 2rem;
				display: flex;
				flex-direction: column;
				.title {
					font-size: 1.5rem;
					font-family: "Poppins";
					font-weight: 600;
					display: flex;
					align-items: center;
					gap: 0.25rem;
					img {
						width: 2rem;
					}
				}
				p {
					color: var(--text-soft);
				}

				.link {
					margin-top: auto;
					display: flex;
					align-items: center;
					gap: 0.25rem;
					.icon {
						color: inherit;
					}
					&:hover {
						text-decoration: underline;
					}
				}
			}
			.c2 {
				width: 40%;
				display: flex;
				justify-content: center;
				align-items: center;
				padding-block: 1rem;
				img {
					object-fit: contain;
					max-width: 200px;
					max-height: 200px;
				}
			}
			@media screen and (max-width: 768px) {
				margin-top: 2rem;
				flex-direction: column-reverse !important;
				width: 100%;
				border-inline: unset !important;
				align-items: center;
				.c1,
				.c2 {
					width: 100%;
					border: unset !important;
					font-size: 0.875rem;
					padding: 0;
				}
				.c2 {
					padding-block: 2rem;
				}
			}
		}
	}
}
</style>
