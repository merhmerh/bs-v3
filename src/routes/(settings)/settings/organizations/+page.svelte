<script>
import { invalidate } from "$app/navigation";
import AsyncButton from "$common/AsyncButton.svelte";
import Avatar from "$common/Avatar.svelte";
import Divider from "$common/Divider.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { remoteAcceptOrgInvite } from "$lib/remote/org.remote.js";
import NewOrg from "$pages/org_settings/NewOrg.svelte";

let { data } = $props();
const ds = getDialogState();
const orgs = $derived(data.orgs.filter((x) => x.accepted == true));
const invitations = $derived(data.orgs.filter((x) => x.accepted == false));

async function acceptOrg(org_id, toAccept) {
	await remoteAcceptOrgInvite({ org_id, to_accept: toAccept });
	invalidate("settings:orgs");
}

async function openNewOrgDialog() {
	ds.open({
		title: "Create New Organization",
		component: NewOrg,
		showActions: false,
	});
}
</script>

<div class="header">
	<h1>Organizations</h1>
	<button class="primary" onclick={openNewOrgDialog}>New Org</button>
</div>
<p class="note-info">
	Organizations represent companies or teams that you are part of, and multiple users can belong to
	the same organization. You can manage your organization profile and members here.
</p>

{#if orgs.length}
	<div class="title">My Organizations</div>
	<div class="orgs-list">
		{#each orgs as org}
			<a href="/settings/organizations/{org.org_id}" class="button card">
				<Avatar src={org.logo} fallback={org.name} --height="3rem" />
				<div class="name">{org.name}</div>
			</a>
		{/each}
	</div>
{/if}

{#if orgs.length && invitations.length}
	<Divider py="1rem" />
{/if}

{#if invitations.length}
	<div class="title">Invitations</div>
	<p class="note">You have been invited to join the following organizations:</p>
	<div class="orgs-list">
		{#each invitations as org}
			<div class="card">
				<Avatar src={org.logo} fallback={org.name} --height="3rem" />
				<div class="info">
					<div class="name">{org.name}</div>
					<div class="button-group">
						<AsyncButton smaller warning onclick={() => acceptOrg(org.org_id, false)}
							>Reject</AsyncButton>
						<AsyncButton smaller primary onclick={() => acceptOrg(org.org_id, true)}
							>Accept</AsyncButton>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
.title {
	color: var(--text-soft);
	font-size: 0.875rem;
}
.orgs-list {
	margin-top: 1rem;
	display: flex;
	gap: 1rem;
	.card {
		width: min(300px, 100%);
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 1px solid var(--border);
		padding: 0.5rem;
		border-radius: 0.5rem;
		background-color: var(--bg-200);
		.info {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 0.5rem;
			justify-content: space-between;
			width: 100%;
			.button-group {
				margin-right: 0.25rem;
			}
		}
	}
}
</style>
