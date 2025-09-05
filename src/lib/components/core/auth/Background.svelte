<script>
import { page } from "$app/state";
import { getThemeState } from "$comp/StateComponent/Preferences/ThemeState.svelte.js";
import { onMount } from "svelte";

let snowCount = $state(200);
const t = getThemeState();
const scheme = $derived(t.theme.scheme);

let isSignUp = $derived.by(() => {
	return page.url.pathname == "/signup";
});

function setSnowCount() {
	if (window.innerWidth < 768) {
		snowCount = 50;
	} else {
		snowCount = 200;
	}
}

onMount(() => {
	setSnowCount();
});
</script>

<svelte:window onresize={setSnowCount} />

<div class="snowContainer {scheme}" class:signUpSnow={isSignUp}>
	<div class="snows">
		{#key snowCount}
			{#each Array(snowCount) as _}
				<div class="snow"></div>
			{/each}
		{/key}
	</div>
	<div class="backgrounds">
		<div class="bg bg1" class:show={scheme == "light"}></div>
		<div class="bg bg2" class:show={scheme == "dark"}></div>
	</div>
</div>

<style lang="scss">
@use "sass:math";

.snowContainer {
	z-index: 0;
	position: fixed;
	top: 0;
	left: 0;
	height: 100dvh;
	width: 100%;
	overflow: hidden;
	--snow-color: var(--mono-mid);
	transition: all 0.5s;
	&.signUpSnow {
		--snow-color: var(--primary);
		transform: scale(2);
		.snows {
			opacity: 0.5;
		}
		.snow {
			width: 10px;
			height: 10px;
		}
	}

	.bg {
		z-index: -1;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		width: 100%;
		height: 100%;
		transition: all 0.5s linear;

		&.show {
			opacity: 1;
		}
		&.bg1 {
			background: radial-gradient(ellipse at bottom, var(--bg-100) 25%, #bac4c6 100%);
		}
		&.bg2 {
			background: radial-gradient(ellipse at bottom, #003b71 0%, #1c1e22 100%);
		}
	}
	.snows {
		transform-origin: center center;
	}
	.snow {
		$total: 200;
		position: absolute;
		left: 0;
		width: 5px;
		height: 5px;
		background: var(--snow-color);
		border-radius: 0;
		transition: all 0.3s;
		@function random_range($min, $max) {
			$rand: math.random();
			$random_range: $min + math.floor($rand * (($max - $min) + 1));
			@return $random_range;
		}

		@for $i from 1 through $total {
			$random-x: math.random(100) * 1vw; // Generate x-coordinate in viewport width percentage
			$random-time: calc(random_range(30, 80) / 1000); // Duration in seconds
			$random-y: $random-time * 100vh; // Vertical movement range
			$random-scale: calc(math.random(100) / 1000) * 10; // Scale factor
			$fall-duration: random_range(10, 30) * 2s; // Falling duration
			$fall-delay: math.random(30) * -1s; // Delay for the start of animation

			&:nth-child(#{$i}) {
				opacity: calc(math.random(100) / 100); // Random opacity between 0 and 1
				transform: translate($random-x, 100vh) scale($random-scale); // Start at bottom
				animation: rise-#{$i} $fall-duration $fall-delay linear infinite;
			}

			@keyframes rise-#{$i} {
				#{math.percentage($random-time)} {
					transform: translate($random-x, calc(100vh - $random-y)) scale($random-scale);
				}
				to {
					transform: translate($random-x, 0vh) scale($random-scale); // End at top
				}
			}
		}
	}
}
</style>
