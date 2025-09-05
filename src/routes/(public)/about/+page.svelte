<script>
import AppIcon from "$common/AppIcon.svelte";
import { apps } from "$data/apps.js";
</script>

<div class="container">
	<h1>About</h1>

	<p>
		BuiltSearch is an industry-focused platform designed specifically for the built environment
		sector. It offers a range of essential services such as BuiltChat, IFC Validator, Code and
		Regulation Guidelines, 3D Library, and more, all tailored to meet the unique needs of
		construction and building professionals.
	</p>
	<p>
		Founded and developed by built industry experts with over 15 years of experience, BuiltSearch
		aims to streamline workflows, enhance collaboration, and provide reliable, specialized tools for
		professionals dedicated to shaping the built world.
	</p>

	<h2>Our Services</h2>

	<div class="services">
		{#each apps as app}
			<div class="service">
				<a href={app.url} class="button none href">
					<div class="icon">
						<AppIcon glyph={app.glyph} --height={"36px"} />
					</div>
				</a>
				<div class="right">
					<a href={app.url}>{app.appName}</a>
					<p>
						{app.description || "No description available for this service."}
					</p>
				</div>
			</div>
		{/each}
	</div>

	<h2>Get in Touch</h2>

	<p>
		If you have any questions, feedback, or need assistance with our services. please feel free to
		contact us at
		<a href="mailto:support@builtsearch.com">support@builtsearch.com</a>.
	</p>

	<p>If you’d like to say hello, we’d love to hear from you at the same email address.</p>
</div>

<style lang="scss">
.container {
	font-family: "Poppins", sans-serif;
	margin-inline: auto;
	width: min(800px, 100%);
	padding-bottom: 100px;
	p {
		line-height: 200%;
	}
	h2 {
		margin-top: 4rem;
		font-family: var(--font-serif);
		font-size: 2rem;
		font-weight: 400;
	}
}
.services {
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	gap: 1rem;

	margin-block: 1rem;
	.service {
		background-color: var(--bg-200);
		padding: 1rem;
		width: 100%;
		display: flex;
		gap: 1.5rem;
		align-items: center;
		border-radius: 1rem;
		a.button {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			align-items: center;
			justify-content: center;
			font-size: 0.875rem;
			padding: 1rem;
			border-radius: 0.5rem;
			background-color: transparent;
			height: 64px;
			aspect-ratio: 1;
			&:hover {
				outline: 2px solid var(--url);
			}
		}
		.right {
			a {
				font-size: 1.25rem;
				color: var(--text);
				font-weight: 600;
			}
			p {
				margin: 0;
				margin-top: 0.5rem;
				font-size: 0.85rem;
				line-height: 150%;
				color: var(--text-soft);
			}
		}
	}
}
</style>
