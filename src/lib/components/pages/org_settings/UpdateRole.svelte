<script>
import { invalidate } from "$app/navigation";
import { page } from "$app/state";
import AsyncButton from "$common/AsyncButton.svelte";
import Avatar from "$common/Avatar.svelte";
import ComboBox2 from "$common/ComboBox2.svelte";
import Textarea from "$comp/main/Textarea.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { r2ImageTransform, tryCatch } from "$fn/helper.client.js";
import { remoteUpdateUserRole } from "$lib/remote/org.remote.js";

let { user, availableRoles } = $props();
const ds = getDialogState();

let newData = $state({
	role: availableRoles.find((r) => user.role_id === r.role_id),
	notes: user.notes || "",
});

async function updateRole() {
	ds.clearError();
	const { data, error } = await tryCatch(
		remoteUpdateUserRole({
			org_id: page.params.org_id,
			user_id: user.user_id,
			role: newData.role,
			notes: newData.notes,
		}),
	);
	if (error) {
		return ds.setError(error.message || "An error occurred");
	}
	ds.close();
	invalidate("org:users");
}
</script>

<div class="container">
	<div class="input-group horizontal">
		<span class="label">User</span>
		<div class="user">
			<Avatar
				src={r2ImageTransform(user.userData.avatar, { width: 32 })}
				fallback={user.userData.display_name} />
			<span>{user.userData.display_name}</span>
		</div>
	</div>

	<div class="input-group horizontal">
		<span class="label"> Role </span>

		<ComboBox2
			small
			options={availableRoles.filter((x) => x.role_id !== 1)}
			selectedValue={newData.role.name}
			onchange={(_, data) => {
				newData.role = {
					role_id: data.role_id,
					name: data.name,
				};
			}} />
	</div>

	<div class="input-group horizontal">
		<span class="label"> Notes </span>

		<Textarea bind:value={newData.notes} placeholder="notes" />
	</div>

	<div class="button-group actions mt-4">
		<AsyncButton primary small onclick={updateRole}>Update</AsyncButton>
		<button
			class="small outlined"
			onclick={() => {
				ds.close();
			}}>cancel</button>
	</div>
</div>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	font-size: 0.875rem;
	.user {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
}
</style>
