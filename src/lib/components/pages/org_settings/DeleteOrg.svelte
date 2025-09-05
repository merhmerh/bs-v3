<script>
import { goto, invalidate } from "$app/navigation";
import AsyncButton from "$common/AsyncButton.svelte";
import Input from "$common/Input.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { tryCatch } from "$fn/helper.client.js";
import { remoteDeleteOrg } from "$lib/remote/org.remote.js";
let { orgName, org_id } = $props();
let deletionPhrase = $state("");
const correctPhrase = `DELETE ${orgName}`;
const ds = getDialogState();

async function deleteOrg() {
	ds.clearError();
	if (deletionPhrase !== correctPhrase) {
		ds.setError("The deletion phrase does not match. Please type it exactly as shown.");
		return;
	}

	const { data, error } = await tryCatch(remoteDeleteOrg(org_id));

	if (error) {
		ds.setError(error.message || "An error occurred while deleting the organization.");
		return;
	}
	ds.close();
	await goto("/settings/organizations", { invalidate: ["settings:orgs"] });
}
</script>

<div class="container">
	<p>
		This action will permanently delete the organization and all its associated data. This action is
		permanent and cannot be undone.
	</p>

	<p>
		Type '<strong>{correctPhrase}</strong>' to proceed with the deletion.
	</p>
</div>
<Input type="text" placeholder="Type in the deletion phrase" bind:value={deletionPhrase} />

<AsyncButton warning --width="100%" onclick={deleteOrg}>Delete Organization</AsyncButton>

<style lang="scss">
.container {
	padding-block: 0.25rem;
	padding-left: 0.5rem;
	border-left: 4px solid var(--red);
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	p {
		color: var(--text);
		font-size: 0.875rem;
		white-space: normal;
		margin: 0;
		line-height: 150%;
		strong {
			white-space: normal;
		}
	}
}
</style>
