<script>
import Icon from "@iconify/svelte";
import SocialIcons from "$core/SocialIcons.svelte";
import Avatar from "$common/Avatar.svelte";
import { shareLink } from "$pages/posts/postDetail.svelte.js";
import { titleCase, titleCaseIfAllLowerCase } from "$fn/helper.js";
import { onMount } from "svelte";
import { toasts } from "$common/toast.store.js";
import PostCard from "./PostCard.svelte";

let { data: dataProp, onclose = () => {}, type = "user" } = $props();
let postsData = $state(null);
let data = $derived.by(() => {
	return {
		...dataProp,
		handle: dataProp?.username || dataProp?.handle,
	};
});

let activeTab = $state("about");

function setActiveTab(tab) {
	if (tab == "posts" && !postsData) {
		fetchPosts();
	}
	activeTab = tab;
}

async function fetchPosts() {
	const profileId = type == "user" ? data.user_id : data.company_id;
	const resp = await fetch("/api/posts/get-posts-by-profile-id", {
		method: "POST",
		body: JSON.stringify({
			id: profileId,
			type: type,
			limit: 6,
		}),
	});
	const result = await resp.json();
	if (result.error) {
		return toasts.add({ message: result.error.message, type: "error" });
	}

	if (!result.posts.length) {
		return;
	}
	// console.log(postsData.posts);
	postsData = result;
}
</script>

{#snippet userDetail(data)}
	<div class="user-data">
		{#if type == "user"}
			{#if data.occupation}
				<span class="row-1">{titleCaseIfAllLowerCase(data.occupation)}</span>
			{/if}
			{#if data.bio}
				<p class="bio">{data.bio}</p>
			{/if}
		{:else}
			{#if data.category && data.category.length > 0}
				<span class="row-2">{data.category.join(" • ")}</span>
			{/if}

			{#if data.registration_number}
				<span class="row-2">{data.registration_number}</span>
			{/if}
			<span class="row-2">{titleCase(data.country)}</span>
		{/if}
	</div>
{/snippet}

<div class="modal">
	<div class="modal-content">
		<button class=" close-button none icon" onclick={() => onclose()}>
			<Icon icon="lucide:x" width="24" height="24" />
		</button>
		<div class="profile-image">
			<Avatar --height="100%" rounded src={data.avatar} fallback={data.display_name} />
		</div>
		<div class="user-details">
			<div class="name">
				<a href="/@{data.handle}" class="">
					<h3>{data.display_name}</h3>
				</a>

				<div class="actions">
					<a class="button none icon" href={`/@${data.handle}`}>
						<Icon icon="lucide:external-link" width="20" />
					</a>

					<button
						class="icon none"
						onclick={() => {
							const url = "/@" + data.handle;
							shareLink(url, {
								title: data.display_name,
								text: data.bio || data.description,
							});
						}}>
						<Icon icon="tabler:share" height="20" />
					</button>
				</div>
			</div>
			{@render userDetail(data)}
		</div>

		{#if data.socials}
			<div class="flex justify-start gap-2">
				<SocialIcons socials={data.socials} />
			</div>
		{/if}

		{#if type == "user"}
			<div class="skills-container">
				{#if data.skills && data.skills.length > 0}
					<div class="tags">
						{#each data.skills.slice(0, 10) as skill}
							<a href="/people?q={encodeURIComponent(skill)}" class="tag">
								{titleCase(skill)}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<div class="content">
			<div class="tabs">
				<button
					class="none"
					class:active={activeTab === "about"}
					onclick={() => setActiveTab("about")}>
					<!-- <Icon icon="material-symbols:info-outline" /> -->
					About
				</button>
				<button
					class="none"
					class:active={activeTab === "posts"}
					onclick={() => setActiveTab("posts")}>
					<!-- <Icon icon="material-symbols:info-outline" /> -->
					Posts
				</button>
			</div>
			<div class="tab-content">
				{#if activeTab === "about"}
					{#if data.description}
						<p class="description">
							{data.description}
						</p>
					{:else}
						<div class="info-box">No Description</div>
					{/if}
				{:else if postsData}
					<div class="posts-grid">
						{#each postsData.posts as post}
							<PostCard {post} />
						{/each}
						{#if postsData.count > 6}
							<a href="/@{data.handle}#posts"> View all posts </a>
						{/if}
					</div>
				{:else}
					<div class="info-box w-full">No Posts uploaded</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
.modal {
	position: fixed;
	z-index: 100;
	right: 1rem;
	width: 600px;
	top: 50%;
	height: min(calc(100dvh - 2rem), 1400px);
	transform: translateY(-50%);
	background-color: var(--bg-100);
	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
	transition: right 0.3s ease-in-out;
	display: flex;
	flex-direction: column;
	border-radius: 1rem;
	scroll-behavior: smooth;
	padding: 2rem;
	padding-right: 1rem;
	padding-left: calc(2rem - 0.25rem);
	@media screen and (max-width: 768px) {
		width: min(calc(100% - 2rem), 600px);
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-right: 1rem;
		width: 100%;
		padding-left: 0.25rem;
		overflow-y: auto;
		position: relative;
		.close-button {
			position: absolute;
			right: 0.5rem;
			top: 0rem;
			border-radius: 50%;
			padding: 0.5rem;
		}

		.profile-image {
			position: relative;
			width: 8rem;
			height: 8rem;
		}
		.user-details {
			display: flex;
			flex-direction: column;

			.name {
				display: flex;
				align-items: center;
				justify-content: space-between;
				a {
					&:hover {
						text-decoration: underline;
						color: var(--url);
					}
					h3 {
						font-weight: 600;
					}
				}
				.actions {
					display: flex;
					gap: 0.25rem;
				}
			}
			.user-data {
				display: flex;
				flex-direction: column;
				gap: 2px;
				.row-1 {
					font-size: 0.875rem;
					color: var(--text);
				}
				.row-2 {
					font-size: 0.875rem;
					color: var(--text-soft);
				}
				.highlight {
					position: relative;
					padding-left: 0.25rem;
					&:after {
						content: "";
						left: 0;
						top: 50%;
						position: absolute;
						height: 100%;
						transform: translateY(-50%);
						width: 2px;
						background-color: var(--primary);
					}
				}
				p.bio {
					margin: 0;
					font-size: 0.875rem;
					color: var(--text-soft);
					transform: skew(-5deg);
				}
			}
		}
		.skills-container {
			margin-block: 0.25rem;
			.tags {
				display: flex;
				gap: 0.5rem;
				flex-wrap: wrap;
				.tag {
					font-size: 0.875rem;
					padding-block: 0.25rem;
					padding-inline: 0.75rem;
					display: inline;
					background-color: var(--input-base);
					border: 1px solid var(--border-base);
					color: var(--text-soft);
					border-radius: 1rem;
					&:hover {
						border: 1px solid var(--primary);
					}
				}
			}
		}
	}
}
.content {
	display: flex;
	flex-direction: column;
	.tab-content {
		display: flex;
		flex-direction: column;
		padding-block: 0.5rem;
		p {
			white-space: break-spaces;
		}
		a {
			font-size: 0.875rem;
			&:hover {
				text-decoration: underline;
			}
		}
		.posts-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1rem;
		}
	}
	.tabs {
		display: flex;
		align-items: center;
		button {
			display: flex;
			align-items: center;
			cursor: pointer;
			border-radius: 0;
			padding-inline: 1rem;
			font-size: 1rem;
			transition: background-color 0.3s ease;
			border-bottom: 2px solid transparent;
			color: var(--text-soft);
			&:hover {
				background-color: transparent;
			}
			&.active {
				color: var(--primary);
				border-bottom: 2px solid var(--primary);
			}
		}
	}
}
</style>
