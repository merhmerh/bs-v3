<script>
import { invalidate } from "$app/navigation";
import { page } from "$app/state";
import AsyncButton from "$common/AsyncButton.svelte";
import Avatar from "$common/Avatar.svelte";
import Switch from "$common/Switch.svelte";
import { getOverlayPanelState } from "$comp/StateComponent/OverlayPanelState/OverlayPanelState.svelte.js";
import { hono } from "$fn/hono.js";

let { license, users } = $props();

let selectedUsers = $state(license.users.map((u) => u.user_id).filter(Boolean));
const totalSeats = $derived(license.users.length);
const panel = getOverlayPanelState();

async function updateLicense() {
	panel.clearError();
	const userToRemove = license.users
		.filter((u) => !selectedUsers.includes(u.user_id))
		.map((u) => u.user_id)
		.filter(Boolean);

	const userToAdd = selectedUsers.filter((id) => !license.users.find((u) => u.user_id === id));

	if (userToAdd.length === 0 && userToRemove.length === 0) {
		panel.setError("No changes made");
		return; // No changes to make
	}

	const resp = await hono.org[page.params.org_id].licenses.$put({
		json: {
			group_id: license.group_id,
			delta: {
				add: userToAdd,
				remove: userToRemove,
			},
		},
	});

	const { data, error } = await resp.json();
	if (error) {
		console.log(error);
		return panel.setError(error.message);
	}
	panel.close();
	invalidate("org:licenses");
}
</script>

<div class="header">
	<div class="label-box">
		<div class="label">Product:</div>
		<div class="value">{license.product}</div>
	</div>
	<div class="label-box">
		<div class="label">Seats</div>
		<div class="value seats" class:error={selectedUsers.length > totalSeats}>
			<span>{selectedUsers.length}</span> / {totalSeats}
		</div>
	</div>
</div>

<div class="list">
	{#each users as user}
		{@const userData = user.userData}
		<div class="row">
			<div class="c1">
				<Avatar src={userData?.avatar} fallback={userData.display_name} />
				<div class="div">{user.email}</div>
			</div>

			<div class="c2">
				<div class="name">{user.userData.display_name}</div>
			</div>

			<div class="c3">
				<Switch
					checked={selectedUsers.includes(user.user_id)}
					onchecked={(v) => {
						if (v == true) {
							selectedUsers.push(user.user_id);
						} else {
							selectedUsers = selectedUsers.filter((id) => id !== user.user_id);
						}
					}} />
			</div>
		</div>
	{/each}
</div>
<div class="button-group actions">
	<AsyncButton primary onclick={updateLicense}>Save Changes</AsyncButton>
</div>

<style lang="scss">
.header {
	display: flex;
	gap: 0.25rem;
	.label-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		border: 1px solid var(--border);
		width: fit-content;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		gap: 0.25rem;
		.value {
			font-weight: 600;
			&.seats.error {
				span {
					color: var(--red);
				}
			}
		}
	}
}

.list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	.row {
		width: 100%;
		display: grid;
		grid-template-columns: 250px 1fr 3rem;
		align-items: center;
		font-size: 0.875rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
		.c1 {
			display: flex;
			align-items: center;
			gap: 0.25rem;
		}
	}
}
</style>
