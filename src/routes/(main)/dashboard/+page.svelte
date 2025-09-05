<script>
import AppIcon from "$common/AppIcon.svelte";
import Avatar from "$common/Avatar.svelte";
import Divider from "$common/Divider.svelte";
import { apps } from "$data/apps.js";
import Icon from "@iconify/svelte";

let { data } = $props();
const userData = $derived(data.userData);

const mainApps = apps.slice(0, 3);
const secondaryApps = apps.slice(3);
</script>

<div class="container">
	<div class="title">
		<h1>Hello, {userData.display_name}!</h1>
		<p>What will you be doing today?</p>
	</div>

	<div class="cards">
		{#each mainApps as app}
			<a class="card shadow-md" href={app.url}>
				<div class="img-container">
					<img class="img" src={app.image} alt="{app.appName} screenshot" />
				</div>
				<div class="data">
					<div class="name">
						<img src={app.icon} alt="{app.appName} icon" width="32px" />
						<h2>{app.appName}</h2>
					</div>
					<p>{app.description}</p>
				</div>
			</a>
		{/each}
	</div>
	<div class="smaller-cards">
		{#each secondaryApps as app}
			<a class="card shadow-md" href={app.url}>
				<AppIcon glyph={app.glyph} --height="36px" />
				<div class="data">
					<div class="data">
						<h2>{app.appName}</h2>
						<p>{app.description}</p>
					</div>
				</div>
			</a>
		{/each}
	</div>

	<Divider py="2rem" />

	<div class="user-card shadow-md">
		<Avatar src={userData.avatar} fallback={userData.display_name} --height="6rem" />
		<div class="info">
			<h3>{userData.display_name}</h3>
			<span>{userData.email}</span>

			<div class="links">
				<a href="/settings">
					<span>Account Settings</span>
					<div class="icon inherit">
						<Icon icon="iconamoon:arrow-right-2-light" width="16" />
					</div>
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
.container {
	margin-inline: auto;
	width: min(900px, 100%);
	padding: 1rem;
	padding-block: 2rem;
	.title {
		text-align: center;
		p {
			margin-block: 0.25rem;
		}
	}
	.cards {
		padding-block: 2rem 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		.card {
			border-radius: 1rem;
			overflow: hidden;
			border: 1px solid var(--border);
			padding: 0.25rem;
			background-color: var(--bg-200);
			color: unset;
			&:hover {
				img.img {
					transform: scale(1.125);
				}
				h2:after {
					width: 100% !important;
				}
			}
			.img-container {
				border-radius: calc(1rem - 0.25rem);
				width: 100%;
				height: 200px;
				overflow: clip;
				display: flex;
				img {
					width: 100%;
					height: 100%;
					transition: transform 0.3s ease-in-out;
					object-fit: cover;
					object-position: center;
				}
			}
			.data {
				padding-block: 0.25rem;
				padding-inline: 0.5rem;
				.name {
					margin-left: -0.25rem;
					display: flex;
					align-items: center;
					gap: 0.25rem;
					h2 {
						position: relative;
						font-size: 1.25rem;
						&:after {
							transition: all 0.15s ease-in-out;
							left: 0;
							position: absolute;
							content: "";
							width: 0%;
							height: 2px;
							border-radius: 1rem;
							background: var(--primary);
							bottom: -2px;
						}
					}
				}
				p {
					margin-block: 0.5rem;
					font-size: 0.875rem;
				}
			}
		}
	}
	.smaller-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1rem;
		.card {
			border: 1px solid var(--border);
			display: flex;
			align-items: center;
			color: unset;
			padding: 1rem;
			border-radius: 1rem;
			background-color: var(--bg-200);
			gap: 1rem;
			.data {
				h2 {
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
	.user-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 1rem;
		border: 1px solid var(--border);
		font-size: 0.875rem;
		.info {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			h3 {
				font-size: 1rem;
				padding: 0;
			}
			.links {
				margin-top: 0.5rem;
				a {
					display: flex;
					align-items: center;
					font-size: 0.875rem;
					border: 1px solid var(--primary);
					width: fit-content;
					padding-inline: 0.75rem 0.5rem;
					padding-block: 0.375rem;
					border-radius: 5rem;
					&:hover {
						background-color: color-mix(in srgb, var(--primary) 12%, transparent);
					}
				}
			}
		}
	}
}
</style>
