<script>
import { invalidate } from "$app/navigation";
import AsyncButton from "$common/AsyncButton.svelte";
import Input from "$common/Input.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { tryCatch } from "$fn/helper.client.js";
import { remoteCreateOrg } from "$lib/remote/org.remote.js";

let orgName = $state("");
const ds = getDialogState();
async function createOrg() {
	ds.clearError();
	const { data, error } = await tryCatch(remoteCreateOrg(orgName));
	if (error) {
		return ds.setError(error.message);
	}
	await invalidate("settings:orgs");
	ds.close();
}
</script>

<fieldset>
	<legend>Organization Name</legend>
	<Input fieldset bind:value={orgName} placeholder="Your Organization Name" />
</fieldset>

<div class="button-group actions">
	<AsyncButton primary onclick={createOrg}>Create</AsyncButton>
	<button class="outlined" onclick={() => ds.close()}>Cancel</button>
</div>
