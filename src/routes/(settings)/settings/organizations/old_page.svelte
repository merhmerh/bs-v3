<script>
import { goto, invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import AsyncButton from "$common/AsyncButton.svelte";
import Avatar from "$common/Avatar.svelte";
import Input from "$common/Input.svelte";
import Textarea from "$comp/main/Textarea.svelte";
import ConfirmPrompt from "$comp/StateComponent/Dialog/ConfirmPrompt.svelte";
import { getDialogState } from "$comp/StateComponent/Dialog/DialogState.svelte.js";
import { r2ImageTransform } from "$fn/helper.client.js";
import TagsEditor from "$pages/dashboard/TagsEditor.svelte";
import Segment from "$pages/settings/Segment.svelte";
import StandardField from "$pages/settings/StandardField.svelte";

let { data } = $props();

const ds = getDialogState();
const products = ["BuiltChat", "IFC Validator (IV)"];
let selectedServices = $state([]);
let orgName = $state("");
let remarks = $state("");
let errorMessage = $state("");

let successfullySubmitted = $state(false);

async function submit() {
	errorMessage = "";
	const info = {
		orgName: $state.snapshot(orgName),
		services: $state.snapshot(selectedServices),
		remarks: $state.snapshot(remarks),
	};

	const resp = await fetch("/settings/enterprise", {
		method: "POST",
		body: JSON.stringify(info),
	});
	const result = await resp.json();
	if (result.error) {
		errorMessage = result.error;
		return;
	}

	successfullySubmitted = true;
	console.log(result);
}

async function joinOrg(org) {
	const resp = await fetch("/api/enterprise/join-org", {
		method: "POST",
		body: JSON.stringify({ org_id: org.id }),
	});

	const { data, error } = await resp.json();
	if (!error) {
		invalidateAll();
	}
}

async function confirmReject(org) {
	ds.open({
		title: "Confirm Rejection",
		component: ConfirmPrompt,
		props: {
			message: "Are you sure you want to reject this invitation?",
		},
		warningButtonName: "Reject",
		actions: {
			Reject: async () => {
				const resp = await fetch("/api/enterprise/join-org", {
					method: "DELETE",
					body: JSON.stringify({ org_id: org.id }),
				});

				const { data, error } = await resp.json();
				if (!error) {
					ds.close();
					invalidateAll();
				}
			},
		},
	});
}
</script>

<h1>Organization</h1>

{#if data.invites}
	{#each data.invites as inv, i}
		<div class="p-container invite">
			<div class="invite-org">
				<Avatar
					--height="64px"
					src={r2ImageTransform(inv.org.logo, { width: 64 })}
					fallback={inv.org.name} />

				<h3>{inv.org.name}</h3>
			</div>

			<p>You have been invited to join the organization.</p>
			<div class="my-2 flex gap-2">
				<AsyncButton small onclick={() => joinOrg(inv.org)}>
					Join {inv.org.name}
				</AsyncButton>
				<AsyncButton small warning onclick={() => confirmReject(inv.org)}>Reject</AsyncButton>
			</div>
		</div>

		{#if i < data.invites.length - 1}
			<Divider />
		{/if}
	{/each}
{:else}
	<div class="p-container">
		<p>
			BuiltSearch Organization allows users to create a company profile (organization) where
			multiple members can be added, licenses can be centrally managed and assigned to users, and
			important details such as contact information and past projects can be maintained in one
			place.
		</p>
		<ul>
			<li>Easily manage and monitor member access and license allocations</li>
			<li>Benefit from bulk discounts on our services like BuiltChat and IV</li>
			<li>Access priority support and tailored solutions to fit your business needs</li>
		</ul>
		<p>
			This option is ideal for businesses, educational institutions, and large teams that require
			scalable and streamlined software management.
		</p>
		<p>
			To get started, please fill out the form below to request access to BuiltSearch Enterprise. We
			will get in touch with you as soon as possible.
		</p>
	</div>

	<Segment title="Create Org" width="800px">
		<div class="error">
			<span class="error">
				{errorMessage}
			</span>
		</div>

		<StandardField name="Organization Name">
			<Input type="text" placeholder="Organization name" bind:value={orgName} />
		</StandardField>

		{#if successfullySubmitted}
			<div class="my-2 info-box success">
				<p class="m-0">
					Your request has been successfully submitted! We will review your application and get back
					to you shortly.
				</p>
			</div>
		{:else}
			<div class="button-group actions">
				<AsyncButton --width="fit-content" small onclick={() => submit()}
					>Create Organization</AsyncButton>
			</div>
			<!-- <div class="flex justify-end my-2"></div> -->
		{/if}
	</Segment>
{/if}

<style lang="scss">
.p-container {
	display: flex;
	margin-block: 1rem;
	flex-direction: column;
	p {
		margin-block: 0.25rem;
		font-size: 0.875rem;
	}
	ul {
		margin-block: 0.5rem;
		li {
			margin-block: 0.25rem;
			font-size: 0.875rem;
		}
	}
	&.invite {
		padding: 1rem;
		border: 1px solid var(--border-base);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		.invite-org {
			display: flex;
			flex-direction: column;
			width: fit-content;
			gap: 0.25rem;
		}
	}
}
</style>
