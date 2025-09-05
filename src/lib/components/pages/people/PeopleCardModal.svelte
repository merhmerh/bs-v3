<script>
import Icon from "@iconify/svelte";
import ServiceCard from "../service/ServiceCard.svelte";
import ReviewCard from "$core/ReviewCard.svelte";
import AboutCard from "$pages/people/AboutCard.svelte";
import SocialIcons from "$core/SocialIcons.svelte";
import Avatar from "$common/Avatar.svelte";

let { users } = $props();
let activeTab = $state("about");
let showAllSkills = $state(false);
const skillsLimit = 10;

function setActiveTab(tab) {
	activeTab = tab;
}

function shareProfile() {
	const shareUrl = `${window.location.origin}/@${users.username}`;
	const shareData = {
		title: users.username,
		text: `Check out this Profile: ${users.username}`,
		url: shareUrl,
	};

	if (navigator.share) {
		navigator.share(shareData).catch((error) => {
			console.error("Sharing failed:", error);
		});
	} else {
		navigator.clipboard
			.writeText(shareUrl)
			.then(() => {
				// alert("Link copied to clipboard!");
			})
			.catch((error) => {
				console.error("Failed to copy:", error);
			});
	}
}

function toggleSkills() {
	showAllSkills = !showAllSkills;
}
</script>

<div class="modal">
	<!-- <div class="cover-image">
		{#if users.profile.others && users.profile.others.coverImageUrl}
			<img src={users.profile.others.coverImageUrl} alt="cover_image" />
		{:else}
			<img src="https://guru.builtsearch.com/architect_bg.png" alt="cover_image" />
		{/if}
	</div> -->
	<div class="profile-image">
		<Avatar --height="100%" src={users.avatar || users.display_name} />
	</div>

	<div class="modal-content">
		<div class="user-details">
			<div class="userName">
				<div class="div">
					<h4>
						{users.display_name}
					</h4>
				</div>

				{#if users.username}
					<div class="copy-share-icons">
						<a class="button action none icon" href={`/@${users.username}`}>
							<Icon icon="lucide:external-link" width="20" />
						</a>

						<button class="icon none" onclick={shareProfile}>
							<Icon icon="tabler:share" height="20" />
						</button>
					</div>
				{/if}
			</div>
			<span class="job_title">{users.profile.job_title}</span>
			<p>{users.profile.bio}</p>
		</div>
		<div class="flex justify-start gap-2">
			{#if users.profile.socials}
				<SocialIcons socials={users.profile.socials} />
			{/if}
		</div>

		<div class="skills-container">
			{#if users.profile?.skills && users.profile?.skills?.length > 0}
				<h5>Skills</h5>
				<div class="skills">
					{#each showAllSkills ? users.profile.skills : users.profile.skills.slice(0, skillsLimit) as skill}
						<div class="single-skill">{skill}</div>
					{/each}
					{#if users.profile?.skills?.length > skillsLimit}
						<button class="none see-more" onclick={toggleSkills}>
							{showAllSkills ? "See less" : "See more"}
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<div class="tabs">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- <span
				class:active={activeTab === "services"}
				onclick={() => setActiveTab("services")}>
				<Icon icon="mdi:tick-circle-outline" />
				Services</span> -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- <span
				class:active={activeTab === "reviews"}
				onclick={() => setActiveTab("reviews")}>
				<Icon icon="material-symbols:reviews" />
				Reviews</span> -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span class:active={activeTab === "about"} onclick={() => setActiveTab("about")}>
				<Icon icon="material-symbols:info-outline" />
				About</span>
		</div>

		<div class="tab-content">
			<!-- {#if activeTab === "services"}
				{#each users.services as service}
					<ServiceCard {service} />
				{/each}
			{:else if activeTab === "reviews"}
				{#each users.reviews as review}
					<ReviewCard {review} />
				{/each}
			{:else if activeTab === "about"}
			{/if} -->
			<AboutCard {users} />
		</div>
	</div>
</div>

<style lang="scss">
.modal {
	position: fixed;
	z-index: 100;
	right: 1rem;
	width: 40rem;
	top: 50%;
	height: min(calc(100dvh - 2rem), 1400px);
	transform: translateY(-50%);
	background-color: var(--bg-100);
	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
	transition: right 0.3s ease-in-out;
	display: flex;
	flex-direction: column;
	border-radius: 1rem;
	overflow-y: auto;
	scroll-behavior: smooth;
	padding: 2rem;
	gap: 1rem;

	h4 {
		font-size: 1.5rem;
	}
	h5 {
		font-size: 1.125rem;
	}
	// .cover-image {
	// 	height: 12rem;
	// 	border-top-left-radius: 1rem;
	// 	border-top-right-radius: 1rem;
	// 	img {
	// 		width: 100%;
	// 		height: 12rem;
	// 		object-fit: cover;
	// 	}
	// }

	.profile-image {
		position: relative;
		width: 7.875rem;
		height: 8rem;
		border: 2px solid #ffffff;
		background-color: var(--bg-100);
		border-radius: 100%;
		border: 1px solid var(--border-base);
		// left: 2rem;
		// top: 6rem;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: 100%;
		}
	}

	.modal-content {
		display: flex;
		flex-direction: column;

		.user-details {
			display: flex;
			flex-direction: column;

			.userName {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.div {
					display: flex;
					align-items: center;
					gap: 1rem;
					text-transform: capitalize;
					// .rating {
					// 	display: flex;
					// 	align-items: center;
					// 	font-size: 0.8rem;
					// }
				}
				.copy-share-icons {
					display: flex;
					cursor: pointer;
					gap: 0.8rem;
				}
			}
			span,
			p {
				text-transform: capitalize;
			}
		}
		.skills-container {
			margin-block-start: 1.5em;
			.skills {
				display: flex;
				gap: 0.5rem;
				flex-wrap: wrap;
				margin-top: 1rem;

				.single-skill {
					padding-block: 0.125rem;
					padding-inline: 1rem;
					display: inline;
					border: 1px solid var(--border-base);
					border-radius: 1rem;
					text-transform: capitalize;
				}
			}
			.see-more {
				margin-top: 0.1rem;
				color: var(--primary);
			}
		}

		.tabs {
			display: flex;
			align-items: center;
			// justify-content: center;
			gap: 2rem;
			span {
				display: flex;
				align-items: center;
				gap: 0.4rem;
				cursor: pointer;
				padding: 2.25rem;
				padding-top: 0.6rem;
				padding-bottom: 0.4rem;
				font-size: 1.2rem;
				transition: background-color 0.3s ease;

				&.active {
					color: var(--primary);
					border-bottom: 2px solid var(--primary);
				}
			}
		}
		.tab-content {
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}
	}
}

@media (max-width: 480px) {
	.modal {
		width: 92%;
		border-radius: 1rem;
		&::-webkit-scrollbar {
			width: 0px;
		}

		.profile-image {
			width: 6rem;
			height: 6rem;
			left: 1.5rem;
		}
		.modal-content {
			padding: 0 1rem;

			.user-details h4 {
				font-size: 1.2rem;
			}
			.user-details span,
			.user-details p {
				font-size: 1rem;
			}

			.skills-container {
				h5 {
					font-size: 1rem;
				}
				.single-skill {
					padding-inline: 0.75rem;
					font-size: 0.8rem;
				}
			}
			.tabs {
				gap: 1rem;
				padding-top: 1rem;
				span {
					font-size: 1rem;
					padding: 0.5rem 1.13rem;
				}
			}
			.tab-content {
				gap: 1rem;
			}
		}
	}
}
</style>
