<script>
import Icon from "@iconify/svelte";
import { dayjs } from "$fn/helper.js";
export let review;
let showFullReview = false;
const reviewLimit = 350;

function generateStars(rating) {
	return Array.from({ length: rating }, (_, i) => i);
}

function formatDateWithOrdinal(isoString) {
	return dayjs(isoString).format("Do MMM YYYY");
}

function toggleReview() {
	showFullReview = !showFullReview;
}
</script>

<div class="reviews">
	<div class="rating">
		<div class="left">
			<div class="image">
				<img src={review.authorInfo.profilePhotoUrl} alt="profile-pic" />
			</div>
			<div class="text">
				<span>{review.authorInfo.name}</span>
				<span class="createAt">{formatDateWithOrdinal(review.createdAt)}</span>
			</div>
		</div>
		<div class="right">
			{#each generateStars(review.rating) as _}
				<Icon icon="mdi:star" color="#FFC609" height="20" />
			{/each}
		</div>
	</div>

	<p>
		{!showFullReview && review.review.length > reviewLimit
			? `${review.review.slice(0, reviewLimit)}...`
			: review.review}

		{#if review.review.length > reviewLimit}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<sapn class="see-more" onclick={toggleReview}>
				{showFullReview ? "See less" : "See more"}
			</sapn>
		{/if}
	</p>
</div>

<style lang="scss">
.reviews {
	display: flex;
	flex-direction: column;
	border-top: 2px solid var(--border-base);

	.rating {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-block-start: 1.5em;

		.left {
			display: flex;
			align-items: center;
			gap: 1rem;

			.image {
				height: 3rem;
				width: 3rem;
				border-radius: 100%;

				img {
					width: 100%;
					height: 100%;
					border-radius: 100%;
				}
			}

			.text {
				display: flex;
				flex-direction: column;

				.createAt {
					font-size: 0.8rem;
				}
			}
		}
	}

	.see-more {
		margin-left: 1em;
		background: none;
		border: none;
		color: var(--primary);
		cursor: pointer;
		text-decoration: underline;
	}
}

@media (max-width: 480px) {
	.reviews p {
		font-size: 0.93rem;
	}
}
</style>
