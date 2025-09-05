<script>
import { goto, invalidateAll } from "$app/navigation";

function redirect(e) {
	e.preventDefault();
	goto("/", { invalidateAll: true });
}
</script>

<div class="content">
	<h2>Email Login Success</h2>
	<p>
		Your email address have been verified. <br />
		You can now close this page or go back to the home page.
	</p>
	<a class="button" href="/" onclick={(e) => redirect(e)}>Go to home page </a>
	<!-- <h2></h2> -->
</div>

<style lang="scss">
.content {
	margin-top: 200px;
	grid-column: 1 / -1;
	margin-inline: auto;
	width: 800px;
	min-height: calc(100vh - 70px);
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 1rem;
	p {
		margin: 0;
		padding: 0;
		text-align: center;
	}
}
</style>
