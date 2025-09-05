<script>
import { invalidate } from "$app/navigation";
import { page } from "$app/state";
import AsyncButton from "$common/AsyncButton.svelte";
import Avatar from "$common/Avatar.svelte";
import Divider from "$common/Divider.svelte";
import Input from "$common/Input.svelte";
import { getToastState } from "$common/toast-state.svelte.js";
import Textarea from "$comp/main/Textarea.svelte";
import ConfirmPrompt from "$comp/StateComponent/Dialog/ConfirmPrompt.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { getPopoverState } from "$comp/StateComponent/Popover/PopoverState.svelte.js";
import { r2ImageTransform, tryCatch } from "$fn/helper.client.js";
import { titleCase } from "$fn/helper.js";
import { remoteRemoveUser } from "$lib/remote/org.remote.js";
import { getOrgState } from "$lib/states/OrgState.svelte.js";
import InviteUserToOrg from "$pages/org_settings/InviteUserToOrg.svelte";
import UpdateRole from "$pages/org_settings/UpdateRole.svelte";
import Icon from "@iconify/svelte";

const ps = getPopoverState();
const ds = getDialogState();
let { data } = $props();

const members = $derived(data.org_members);
const roles = $state(data.roles);

const rolesThatCanBeUpdated = roles
	.filter((role) => role.role_name !== "owner")
	.map((r) => {
		return {
			name: r.role_name,
			role_id: r.id,
			role_key: r.role_key,
		};
	});

function openMenu(e, user) {
	const button = e.target.closest("button");
	ps.open({
		button,
		snippet: Menu,
		props: { user: $state.snapshot(user) },
		position: "bottom-right",
		offset: { x: 4, y: 0 },
	});
}

function openInviteUser() {
	ds.open({
		name: "invite-user",
		title: "Invite User",
		component: InviteUserToOrg,
		props: {
			availableRoles: rolesThatCanBeUpdated,
		},
		width: 450,
		showActions: false,
	});
}

function openUpdateUser(user) {
	ps.close();
	ds.open({
		name: "update-role",
		title: "Update Role",
		component: UpdateRole,
		width: 450,
		props: {
			user: $state.snapshot(user),
			availableRoles: rolesThatCanBeUpdated,
			onupdate: (data) => {
				console.log(data);
			},
		},
		showActions: false,
	});
}

function openRemoveUserPrompt(user) {
	const email = user.accepted ? user.userData.email : user.email;
	ds.open({
		name: "remove-user",
		title: "Remove User",
		component: ConfirmPrompt,
		warningButtonName: "Remove User",
		props: {
			message: [`Are you sure you want to remove user '${email}'`, `This action is irreversible.`],
		},
		actions: {
			"Remove User": async () => {
				const { data, error } = await tryCatch(
					remoteRemoveUser({
						org_id: page.params.org_id,
						id: user.id,
					}),
				);
				if (error) return ds.setError(error.message);
				ds.close();

				invalidate("org:users");
			},
		},
	});
	ps.close();
}
</script>

{#snippet Menu({ user })}
	<div class="menu shadow-md">
		{#if user.user_id}
			<button class="none small" onclick={() => openUpdateUser(user)}>Update User</button>
			<Divider />
		{/if}
		<button class="none small" onclick={() => openRemoveUserPrompt(user)}>Remove User</button>
	</div>
{/snippet}

<h1>Organization Users</h1>
<div class="button-group actions pb-4">
	<button class="primary" onclick={openInviteUser}>Invite User</button>
</div>
<div class="table">
	<div class="table-header">
		<div class="c1">User</div>
		<div class="c2">Email</div>
		<div class="c3">Role</div>
		<div class="c4">Notes</div>
		<div class="last"></div>
	</div>
	{#each members as user}
		{@const userData = user.userData}
		<div class="row" class:pending={user.status === "pending"}>
			<div class="c1 user">
				{#if user.accepted}
					<Avatar
						src={r2ImageTransform(userData.avatar, { width: 64 })}
						fallback={userData.display_name} />
					<div class="name">{userData.display_name}</div>
				{:else}
					<Avatar fallback={user.email} />
					<div class="status" class:warning={user.status == "rejected"}>
						{titleCase(user.status) || "Invitation Sent"}
					</div>
				{/if}
			</div>
			<div class="c2 email">{user.accepted ? userData.email : user.email}</div>
			<div class="c3 role">{titleCase(user.org_roles.role_key)}</div>
			<div class="c4">{user.notes || "-"}</div>
			<div class="last">
				<!-- {#if user.role_id !== 1 && os.myPermissions.manage} -->
				<button class="icon none" onclick={(e) => openMenu(e, user)}>
					<Icon icon="iconamoon:menu-kebab-vertical" />
				</button>
				<!-- {/if} -->
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
.table {
	width: 100%;
	font-size: 0.875rem;
	.table-header,
	.row {
		display: grid;
		align-items: center;
		width: 100%;
		// grid-template-columns: 200fr 250px 150px 200px 2rem;
		grid-template-columns: 1fr 1fr 0.5fr 0.75fr 2rem;
		padding: 0.5rem;
	}
	.table-header {
		background-color: var(--bg-200);
		border-block: 1px solid var(--border-base);
	}
	.row {
		border-bottom: 1px solid var(--border-base);
		&.pending {
			color: color-mix(in srgb, var(--text), 50% transparent);
		}
		.user {
			display: flex;
			gap: 0.5rem;
			align-items: center;
			.status {
				border: 1px solid var(--border);
				padding: 0.125rem 0.25rem;
				border-radius: 0.375rem;
				font-size: 0.8125rem;
				background-color: var(--bg-200);
				&.warning {
					color: var(--red);
				}
			}
		}
		.last {
			display: flex;
			justify-content: flex-end;
		}
	}
}
.menu {
	background-color: var(--bg-100);
	border: 1px solid var(--border-base);
	border-radius: 0.375rem;
	button {
		flex-direction: flex-start;
		font-size: 0.8125rem;
		width: 100%;
		padding-block: 0.375rem;
		padding-inline: 0.5rem;
		border-radius: 0;
	}
}
</style>
