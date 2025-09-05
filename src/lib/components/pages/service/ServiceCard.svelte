<script>
import Icon from "@iconify/svelte";

	let { service } = $props();

function openServicePage() {
	const url = `/service/${service._id}`;
	window.open(url, "_blank");
}
</script>

<div class="service">
	<p class="title">{service.title}</p>

	<div class="price-duration-box">
		<div class="duration">
			<Icon icon="material-symbols-light:calendar-month-outline" height="40" />
			<div class="text">
				<sapn class="duration-text">{service.duration} mins</sapn>
				<span class="vedio-meeting">Video meeting</span>
			</div>
		</div>

		<button onclick={openServicePage}>
			S${service.price}
			<Icon icon="mdi:arrow-right-thick" height="20" />
		</button>
	</div>
</div>

<style lang="scss">
.service {
	border-top: 2px solid var(--border-base);
	.title {
		font-size: 1.3rem;
		font-weight: 600;
	}
	.price-duration-box {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding-block: 0.5rem;
		padding-inline: 1rem;
		background-color: var(--bg-300);
		border-radius: 1rem;
		justify-content: space-between;
		.duration {
			display: flex;
			align-items: center;
			gap: 1rem;
			.text {
				display: flex;
				flex-direction: column;
				.duration-text {
					font-weight: 600;
				}
				.vedio-meeting {
					font-size: 0.8rem;
				}
			}
		}
		button {
			display: flex;
			align-items: center;
			gap: 0.1rem;
			font-weight: 600;
		}
	}
}
@media (max-width: 480px) {
	.service {
		.title {
			font-size: 1rem;
		}
	}
}
</style>
