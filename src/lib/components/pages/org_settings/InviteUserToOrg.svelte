<script>
import { invalidate } from "$app/navigation";
import { page } from "$app/state";
import AsyncButton from "$common/AsyncButton.svelte";
import ComboBox2 from "$common/ComboBox2.svelte";
import Input from "$common/Input.svelte";
import Textarea from "$comp/main/Textarea.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { tryCatch } from "$fn/helper.client.js";
import { remoteInviteUser } from "$lib/remote/org.remote.js";

let { availableRoles } = $props();
let errorMessage = $state("");
const ds = getDialogState();
let user = $state({
	email: "",
	role: null,
	notes: "",
});

async function inviteUser() {
	const insertData = {
		...$state.snapshot(user),
		org_id: page.params.org_id,
	};

	if (!insertData.email.trim() || !insertData.role) {
		return ds.setError("Please fill all required fields");
	}

	const { data, error } = await tryCatch(remoteInviteUser(insertData));
	if (error) return ds.setError(error.message || "An error occurred");

	ds.close();
	invalidate("org:users");
}
</script>

<div class="container">
	<div class="input-group horizontal" required>
		<span class="label"> Email </span>

		<Input bind:value={user.email} placeholder="Email" />
	</div>

	<div class="input-group horizontal" required>
		<span class="label"> Role </span>
		<ComboBox2
			small
			placeholder="Select Role"
			options={availableRoles.filter((x) => x.role_id !== 1)}
			onchange={(_, data) => {
				if (!data) return;
				user.role = $state.snapshot(data);
			}} />
	</div>

	<div class="input-group horizontal">
		<span class="label"> Notes </span>

		<Textarea placeholder="Enter anything..." bind:value={user.notes} rows="2" maxLength="100" />
	</div>

	<div class="button-group actions pt-4">
		<AsyncButton primary small onclick={inviteUser}>Invite User</AsyncButton>
		<button
			class="small outlined"
			onclick={() => {
				ds.close();
			}}>cancel</button>
	</div>
</div>
