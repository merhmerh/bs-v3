<script>
import { invalidate } from "$app/navigation";
import { page } from "$app/state";
import AsyncButton from "$common/AsyncButton.svelte";
import Avatar from "$common/Avatar.svelte";
import Cropper from "$common/Cropper.svelte";
import Divider from "$common/Divider.svelte";
import Input from "$common/Input.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { hono } from "$fn/hono.js";
import { getOrgState } from "$lib/states/OrgState.svelte.js";
import DeleteOrg from "$pages/org_settings/DeleteOrg.svelte";
import Segment from "$pages/settings/Segment.svelte";
import StandardField from "$pages/settings/StandardField.svelte";
import { tick } from "svelte";

const ds = getDialogState();
const orgState = getOrgState();
const errorData = $state({});
let new_org_name = $state(orgState.org.name);

async function openAvatarCropper() {
	const org_id = page.params.org_id;

	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.multiple = true;
	input.onchange = async (e) => {
		const file = e.target.files[0];
		const url = URL.createObjectURL(file);
		ds.open({
			title: "Company Logo",
			name: "cropper-company-logo",
			component: Cropper,
			props: {
				outputFormat: "webp",
				maxOutputWidth: 512,
				title: "",
				newImageSrc: url,
				onsave: async (_, blob) => {
					console.log(blob);
					await saveAvatar(blob);
					ds.close();
				},
				onclose: () => ds.close(),
			},
			width: 600,
			showActions: false,
		});
		await tick();
	};
	input.click();

	async function saveAvatar(blob) {
		const resp = await hono.org[org_id].r2.logo.$get();
		const { data: uploadUrls } = await resp.json();
		const uploadURL = uploadUrls[0];

		const uploadResp = await fetch(uploadURL.url, {
			method: "PUT",
			headers: {
				"Content-Type": blob.type,
			},
			body: blob,
		});

		if (!uploadResp.ok) {
			errorData.avatar = "Failed to upload avatar. Please try again.";
			return;
		}
		const updateResp = await hono.org[page.params.org_id].profile.$put({
			json: {
				logo: uploadURL.uploaded_url,
			},
		});
		const { error } = await updateResp.json();

		if (error) {
			return ds.setError(error.message);
		}
		location.reload();
		ds.close();
	}
}

function deleteOrganization() {
	ds.open({
		title: "Delete Organization",
		component: DeleteOrg,
		props: { orgName: orgState.org.name, org_id: orgState.org.org_id },
		showActions: false,
	});
}

async function updateOrgName() {
	const resp = await hono.org[page.params.org_id].profile.$put({
		json: {
			name: new_org_name,
		},
	});
	const { error } = await resp.json();
	if (error) return alert(error.message);

	invalidate("org:root");
}
</script>

<div class="container">
	<h1>Organization Profile</h1>
	<Segment title="Organization Logo">
		<div class="profile-picture-container">
			<button class="avatar-cropper none" onclick={() => openAvatarCropper()}>
				<Avatar
					src={orgState.org.logo}
					fallback={orgState.org.name}
					--height="100%"
					--width="100%" />
			</button>

			<div class="content">
				{#if errorData?.avatar}
					<p class="info error !-mt-4">{errorData.avatar}</p>
				{/if}
				<div class="buttons">
					<button onclick={() => openAvatarCropper()} class="small mono"
						>Edit Profile Picture</button>
				</div>
				<div class="note">
					<span> Updated picture may takes up to a minute to reflect across the platform. </span>
				</div>
			</div>
		</div>
	</Segment>

	<Segment title="Organization Information">
		<StandardField name="Name">
			<Input bind:value={new_org_name} placeholder="Enter organization name" />
			<div class="flex justify-end my-2">
				<AsyncButton
					small
					primary
					--width="fit-content"
					disabled={new_org_name === orgState.org.name}
					onclick={updateOrgName}>
					Save Changes
				</AsyncButton>
			</div>
		</StandardField>
	</Segment>

	<Divider />

	<Segment title="Danger Zone">
		<StandardField name="Delete Organization">
			<p class="note-info m-0">
				Once you delete an organization, all of its resources and data will be permanently deleted.
				This action cannot be undone.
				<br />
				If you have any active licenses, please contact support to proceed with the deletion.
			</p>
			<div class="flex justify-end my-2">
				<button class="warning outlined" onclick={deleteOrganization}>Delete Organization</button>
			</div>
		</StandardField>
	</Segment>
</div>

<style lang="scss">
.container {
	width: min(100%, 900px);
	margin-inline: auto;
}
.profile-picture-container {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding-block: 0.5rem;
	.avatar-cropper {
		flex-shrink: 0;
		border-radius: 50%;
		display: flex;
		width: 128px;
		height: 128px;
		padding: 0;
		&:hover {
			outline: 8px solid color-mix(in srgb, var(--mono-light), 50% transparent);
		}
	}
	.content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		.buttons {
			display: flex;
			gap: 0.5rem;
		}
		.note {
			font-size: 0.875rem;
			color: var(--text-light);
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}
	}
}
</style>
