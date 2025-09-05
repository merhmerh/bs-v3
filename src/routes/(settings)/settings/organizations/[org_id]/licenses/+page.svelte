<script>
import CopyText from "$common/CopyText.svelte";
import { getOverlayPanelState } from "$comp/StateComponent/OverlayPanelState/OverlayPanelState.svelte.js";
import ManageLicense from "$pages/org_settings/ManageLicense.svelte";

let { data } = $props();

const licenses = $derived(data.licenses);
const members = $derived(data.members);
const panel = getOverlayPanelState();

function openLicenseOverlay(lic) {
	panel.open({
		title: "Manage License",
		component: ManageLicense,
		anchor: "center",
		backgroundBlur: true,
		width: 600,
		props: {
			license: $state.snapshot(lic),
			users: $state.snapshot(members),
		},
	});
}
</script>

<h1>Licenses</h1>

<div class="list">
	{#each licenses as lic}
		<div class="card">
			<div class="label-box horizontal">
				<div class="label">Product</div>
				<div class="value"><strong>{lic.product}</strong></div>
			</div>

			<div class="label-box horizontal">
				<div class="label">Reference Number</div>
				<div class="value">{lic.reference}</div>
			</div>

			<div class="label-box horizontal">
				<div class="label">Start Date</div>
				<div class="value">{new Date(lic.start_date).toLocaleDateString()}</div>
			</div>

			<div class="label-box horizontal">
				<div class="label">End Date</div>
				<div class="value">{new Date(lic.end_date).toLocaleDateString()}</div>
			</div>
			<div class="label-box horizontal">
				<div class="label">Seats</div>
				<div class="value">{lic.users.filter((x) => x.user_id).length} / {lic.users.length}</div>
			</div>

			<div class="label-box horizontal">
				<div class="label">Group ID</div>
				<CopyText maxWidth="150" mono text={lic.group_id} />
			</div>
			<div class="button-group py-1">
				<button class="small outlined" onclick={() => openLicenseOverlay(lic)}
					>Manage License</button>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
.list {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	.card {
		border: 1px solid var(--border);
		padding: 0.5rem;
		border-radius: 0.5rem;
		.label-box {
			padding-block: 0.25rem;
			--col: 150px;
			.label {
				font-weight: 600;
				font-size: 0.8125rem;
			}
			.value {
				font-size: 0.875rem;
			}
		}
	}
}
</style>
