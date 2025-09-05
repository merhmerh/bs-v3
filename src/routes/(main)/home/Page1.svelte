<script>
import { onMount } from "svelte";

const taglines = ["streamlined", "standardised", "simplified"];
let tagline = $state({});
const chars = "abcdefghijklmnopqrstuvwxyz";

function scrambleText(index) {
	const word = taglines[index];
	tagline = { text: word, revealedLength: 0, colorIndex: `c${index}` };

	let revealed = 0;

	// fast scramble interval
	const scrambleInt = setInterval(() => {
		let scrambled = "";
		for (let i = 0; i < word.length; i++) {
			if (i < revealed) {
				scrambled += word[i];
			} else {
				scrambled += chars[Math.floor(Math.random() * chars.length)];
			}
		}
		tagline.text = scrambled;
		tagline.revealedLength = revealed;
	}, 25);

	// slower reveal interval
	const revealInt = setInterval(() => {
		revealed++;
		if (revealed > word.length) {
			clearInterval(revealInt);
			clearInterval(scrambleInt);
		}
	}, 100);
}
onMount(() => {
	let index = 0;

	scrambleText(index);

	const interval = setInterval(() => {
		index = (index + 1) % taglines.length;
		scrambleText(index);
	}, 4000);

	return () => clearInterval(interval);
});
</script>

<div class="page-1">
	<h1>
		<span>Your edge in the Built Environment:</span>
		{#if tagline && tagline.text}
			<span class="t-container">
				{#each tagline.text.split("") as text, i}
					<span class="t {tagline.colorIndex}" class:revealed={tagline.revealedLength > i}
						>{text}</span>
				{/each}
			</span>
		{/if}
	</h1>
	<div class="wave">
		<svg width="206" height="8" viewBox="0 0 206 8" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1 1.83347C26 -1.16653 51 8.76147 76 5.76147C101 2.76147 126.5 -0.878365 151.5 2.12163C176.5 5.12163 201 4.83347 205 1.83347"
				stroke="#4184F1"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round" />
		</svg>
	</div>

	<p>
		Empowering the construction industry with insights, connections, and up-to-date regulations.
	</p>

	<button
		class="outlined"
		onclick={() => {
			const section = document.getElementById("services");
			section?.scrollIntoView({ behavior: "smooth" });
		}}>
		Discover our Services
	</button>
	<div class="grid-background"></div>
</div>

<style lang="scss">
.page-1 {
	height: calc(100dvh - 60px);
	max-height: 1240px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	background-color: var(--bg-100);
	background: radial-gradient(circle at 50% 150%, var(--gc) 0%, var(--bg-100) 50%);

	border-bottom: 1px solid var(--mono-light);
	@media screen and (max-width: 768px) {
		padding-inline: 1rem;
	}
	.grid-background {
		z-index: 0;
		position: absolute;
		top: -1px;
		width: 100%;
		height: 100%;
		--c: color-mix(in srgb, var(--mono-light), 25% transparent);
		background-image: linear-gradient(to right, var(--c) 1px, transparent 1px),
			linear-gradient(to bottom, var(--c) 1px, transparent 1px);
		background-size: 40px 40px; /* adjust grid size */
	}
	> * {
		z-index: 1;
	}
	h1 {
		font-family: var(--font-mono);
		font-size: 2.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		@media screen and (max-width: 768px) {
			text-align: center;
			font-size: 2rem;
		}
		.t-container {
			margin-block: 1rem;
			.t {
				transition: all 0.1s;
				color: var(--text-soft);
				filter: blur(2px);
				&.revealed {
					filter: blur(0px);
					color: var(--c);
				}
				&.c0 {
					--c: var(--orange);
				}
				&.c1 {
					--c: var(--green);
				}
				&.c2 {
					--c: violet;
				}
			}
		}
	}
	svg {
		transform: scale(1.5);
		--c: color-mix(in srgb, var(--primary), 50% transparent);
		filter: drop-shadow(0px 3px 3px var(--c));
	}
	p {
		margin-block: 3rem;
		width: 550px;
		text-align: center;
		@media screen and (max-width: 768px) {
			width: 100%;
		}
	}
	button.outlined {
		border-color: var(--primary);
		padding-block: 0.375rem;
		padding-inline: 0.75rem;
		background-color: color-mix(in srgb, var(--primary) 12%, transparent);
		backdrop-filter: blur(1px);
		&:hover {
			background-color: color-mix(in srgb, var(--primary) 25%, transparent);
		}
	}
}
</style>
