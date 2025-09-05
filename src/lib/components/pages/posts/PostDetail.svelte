<script>
import { getMediaUrl, parseLinksFromText } from "$fn/helper.client.js";
import emblaCarouselSvelte from "embla-carousel-svelte";
import Icon from "@iconify/svelte";
import { theme } from "$common/theme.store.js";
import { dayjs } from "$fn/helper.js";
import LazyVideo from "./LazyVideo.svelte";
import { likePost, sharePost } from "./postDetail.svelte.js";
import Avatar from "$common/Avatar.svelte";
import { page } from "$app/state";

let { post = $bindable() } = $props();
let emblaApi;
let options = { loop: true };
let currentImageIndex = $state(0);
let imageHeight = $state("min(45dvh, 600px)");

function onInit(event) {
	emblaApi = event.detail;
	emblaApi.on("select", (e) => {
		currentImageIndex = e.selectedScrollSnap();
	});
}

function slideImageTo(i) {
	if (i == "prev" || i == "next") {
		if (i == "prev" && currentImageIndex == 0) {
			i = post.media.length - 1;
		} else if (i == "next" && currentImageIndex == post.media.length - 1) {
			i = 0;
		} else {
			i = i == "prev" ? currentImageIndex - 1 : currentImageIndex + 1;
		}
	}
	emblaApi.scrollTo(i);
}

async function like(post_id) {
	/* update the state, with assumption that the request will succeed
	 * if it fails, revert the state back */
	post.liked = !post.liked;
	const result = await likePost(post_id);
	if (result.error) {
		post.liked = !post.liked;
	}
}
</script>

<div class="post-container" style="--imageHeight:{imageHeight}">
	<div class="embla" use:emblaCarouselSvelte={{ options }} onemblaInit={onInit}>
		<div class="embla__container">
			{#each post.media as media (media.id)}
				<div class="embla__slide">
					{#if media.type == "youtube" || media.type == "shorts"}
						<iframe
							width="100%"
							height="100%"
							src="https://www.youtube.com/embed/{media.youtube_id}?rel=0&autoplay=1&mute=1"
							title="YouTube video player"
							frameborder="0"
							allow="autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen>
						</iframe>
					{:else if media.type == "image"}
						<img src={media.url} alt={post.title} />
						<!-- <ProgressiveImage targetUrl={media.url} wrapperWidth="100%" wrapperHeight={imageHeight}>
							{#snippet base()}
								<img src={getMediaUrl(post, media, 20)} alt="" />
							{/snippet}
						</ProgressiveImage> -->
						<!-- <ProgressiveImage
							targetUrl={getMediaUrl(post, media, "opt")}
							wrapperWidth="100%"
							wrapperHeight={imageHeight}>
							{#snippet base()}
								<img src={getMediaUrl(post, media, 20)} alt="" />
							{/snippet}
						</ProgressiveImage> -->
					{:else if media.type == "video"}
						<LazyVideo src={getMediaUrl(post, media)} />
					{/if}
				</div>
			{/each}
		</div>
		{#if post.media.length > 1}
			<button class="arrow-navigation none prev" onclick={() => slideImageTo("prev")}>
				<Icon icon="tabler:chevron-left" width="24" />
			</button>

			<button class="arrow-navigation none next" onclick={() => slideImageTo("next")}>
				<Icon icon="tabler:chevron-left" width="24" hFlip />
			</button>
		{/if}
	</div>
	<div class="content">
		{#if post.media.length > 1}
			<div class="dot-navigation">
				{#each post.media as _, i}
					<button
						aria-label="slide"
						class="none {$theme}"
						class:current={currentImageIndex == i}
						onclick={() => slideImageTo(i)}>
					</button>
				{/each}
			</div>
		{/if}
		<div class="title">
			<h1>{post.title}</h1>
			<div class="actions">
				{#if !page.params?.post_id}
					<a class="button action none icon" href="/post/{post.pid}">
						<Icon icon="lucide:external-link" width="20" />
					</a>
				{/if}
				<button class="action icon none" class:liked={post.liked} onclick={() => like(post.pid)}>
					<Icon icon="tabler:heart" width="20" />
				</button>
				<button class="action icon none" onclick={() => sharePost(post)}>
					<Icon icon="tabler:share" width="20" />
				</button>
			</div>
		</div>

		<div class="user">
			{#if post.published_as_company}
				<Avatar
					outlined
					src={post.company_avatar}
					fallback={post.company_display_name}
					--height="4rem" />

				<a class="display-name" href="/@{post.company_handle}">
					{post.company_display_name}
				</a>
				<div class="company-tag icon">
					<Icon icon="lucide:briefcase-business" width="16" />
				</div>
			{:else}
				<Avatar outlined src={post.user_avatar} fallback={post.user_display_name} --height="4rem" />
				<a class="display-name" href="/@{post.user_username}">{post.user_display_name}</a>
			{/if}
		</div>

		<div class="tags styled">
			{#each post.tags as tag}
				<a class="tag" href="/posts?q={encodeURIComponent(tag)}">{tag}</a>
			{/each}
		</div>

		<div class="description">
			{#each post.description.split("\n\n") as line}
				<p>{@html parseLinksFromText(line.trim())}</p>
			{/each}
		</div>

		{#if post.repost}
			<div class="source">
				<span>Attribution:</span>
				<span>{@html parseLinksFromText(post.attribution)}</span>
			</div>
		{/if}

		<div class="date text-sm">
			Uploaded on: {dayjs(post.created_at).format("MMMM D, YYYY")}
		</div>
	</div>
</div>

<style lang="scss">
.post-container {
	padding-inline: 1rem;
	padding-right: 1rem;
	height: 100%;
	width: 100%;
	@media screen and (max-width: 768px) {
		padding: 0rem;
		padding-top: 0;
		max-height: unset;
		padding-bottom: 2rem;
		&::-webkit-scrollbar {
			width: 4px;
		}
	}
	.embla {
		overflow: hidden;
		border: 1px solid var(--border-light);
		border-radius: 1rem;
		padding: 0rem;
		position: relative;
		background-color: color-mix(in srgb, var(--bg-200), 75% transparent);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-200), 0% transparent) 0%,
			color-mix(in srgb, var(--bg-200), 60% transparent) 100%
		);
		&:hover {
			button.arrow-navigation {
				opacity: 1;
			}
		}
		.embla__container {
			display: flex;
			align-items: center;
			gap: 1rem;
			.embla__slide {
				flex-grow: 0;
				flex-shrink: 0;
				flex-basis: 100%;
				min-width: 0;
				display: flex;
				justify-content: center;
				overflow: clip;
				height: var(--imageHeight);

				img {
					object-fit: contain;
					height: var(--imageHeight);
					width: 100%;
					margin-inline: auto;
				}
			}
		}
		button.arrow-navigation {
			opacity: 0;
			transition: all 0.3s;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			height: 2rem;
			width: 2rem;
			margin-inline: 1rem;
			color: var(--text-alt);
			background-color: color-mix(in srgb, var(--mono-dark), 25% transparent);
			&.prev {
				left: 0;
			}
			&.next {
				right: 0;
			}
		}
	}
	.dot-navigation {
		margin-top: -0.25rem;
		transition: all 0.3s;
		display: flex;
		gap: 1rem;
		width: 100%;
		justify-content: center;
		align-items: center;
		button {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background-color: var(--bg);
			&.light {
				--bg: var(--mono-light);
				--outline: var(--mono-mid);
			}
			&.dark {
				--bg: var(--mono-base);
				--outline: var(--text-alt);
			}
			&.current {
				outline: 2px solid var(--outline);
			}
		}
	}
	.content {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
		gap: 1rem;

		.title {
			display: flex;
			justify-content: space-between;
			@media screen and (max-width: 768px) {
				flex-direction: column-reverse;
				gap: 0rem;
				margin-top: -0.5rem;
				h1 {
					font-size: 1.25rem;
				}
			}
			.actions {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				.action {
					backdrop-filter: blur(5px);
					border-radius: 50%;
					padding: 0.5rem;
					color: var(--text);
					transition: all 0.3s;
					&:hover {
						background-color: color-mix(in srgb, var(--mono), 50% transparent);
					}
					&.liked {
						background-color: var(--red);
						color: var(--text-alt);
					}
				}
			}
		}

		.description {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding-block: 0.5rem;
			width: 100%;
			max-width: calc(100% - 4rem);
			@media screen and (max-width: 768px) {
				max-width: 100%;
			}
			p {
				color: var(--text-dark);
				margin-block: 0;
				white-space: pre-wrap;
				font-family: var(--font-text);
				line-height: 150%;
				& :global(a) {
					word-break: break-word;
				}
			}
		}
		.date {
			color: var(--text-light);
		}
		.user {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			.company-tag {
				background-color: var(--accent-light);
				padding: 0.5rem;
				border-radius: 50%;
				color: var(--primary);
			}
		}
		.source {
			font-size: 0.875rem;
			color: var(--text-light);
		}
	}
}
</style>
