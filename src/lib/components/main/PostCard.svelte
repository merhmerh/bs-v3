<script>
import Icon from "@iconify/svelte";
import { shareLink } from "$pages/posts/postDetail.svelte.js";
import { theme } from "$common/theme.store.js";
import { dayjs } from "$fn/helper.js";
import ImageWrapper from "$common/Image.svelte";

let { mode = "card", post } = $props();
</script>

<div class="item" class:card={mode == "card"} class:shadow={$theme == "light"}>
	<a class="post-image" href="/post/{post.pid}">
		{#if post.media[0].type == "video"}
			<video class="object-cover" autoplay preload muted width="100%" src={post.media[0].url}>
			</video>
		{:else if post.media[0].type == "youtube" || post.media[0].type == "shorts"}
			<div class="play-icon-overlay">
				<div class="icon">
					<Icon icon="logos:youtube-icon" width="32" />
				</div>
			</div>
			<img
				src={`https://img.youtube.com/vi/${post.media[0].youtube_id}/hqdefault.jpg`}
				alt={post.title} />
		{:else}
			<ImageWrapper data={post} cover width="600" height="600" />
		{/if}
	</a>

	<div class="post-detail">
		<div class="actions">
			<button
				tabindex="-1"
				class="action icon none"
				onclick={() => {
					const url = `/post/${post.pid}`;
					shareLink(url, {
						title: post.title,
						text: post.description,
					});
				}}>
				<Icon icon="tabler:share" width="16" />
			</button>
		</div>
		<div class="post-user-detail">
			<div class="flex flex-col info">
				<div class="title">{post.title}</div>
				<div class="date_created">{dayjs(post.created_at).fromNow()}</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
.item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 0.5rem;
	width: 100%;
	min-width: var(--min-width);
	background-color: var(--bg-200);
	border-radius: 0.75rem;

	--shadow: 4px 4px 0 rgba(0, 0, 0, 0.12);
	&.shadow {
		box-shadow: var(--shadow);
		@media screen and (max-width: 450px) {
			--shadow: 2px 2px 0 rgba(0, 0, 0, 0.12);
		}
	}

	a.post-image {
		padding: 0;
		background-color: transparent;
		display: flex;
		width: 100%;
		aspect-ratio: 3/2;
		overflow: hidden;
		border-radius: 0.25rem;

		video {
			border-radius: 0.5rem;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		.play-icon-overlay {
			position: absolute;
			top: 0.75rem;
			left: 0.75rem;
		}
	}

	.post-detail {
		position: relative;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		.actions {
			display: flex;
			gap: 0.5rem;
			pointer-events: all;
			position: relative;
			button.action {
				border-radius: 50%;
				padding: 0.5rem;
				color: var(--text);
				transition: all 0.3s;
			}
		}
		.post-user-detail {
			display: flex;
			gap: 0.75rem;
			width: calc(100% - 2rem);
			color: var(--text);
			padding-left: 0.25rem;
			.info {
				text-align: left;
				line-height: 120%;
				width: 100%;
				overflow: hidden;
				.title {
					font-size: 0.875rem;
					line-height: 1.5rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.date_created {
					font-size: 0.75rem;
					color: var(--text-soft);
				}
			}
		}
	}
}
</style>
