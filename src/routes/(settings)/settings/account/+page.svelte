<script>
import { page } from "$app/state";
import EditableField from "$comp/pages/settings/EditableField.svelte";
import Segment from "$comp/pages/settings/Segment.svelte";
import StandardField from "$comp/pages/settings/StandardField.svelte";
import AsyncButton from "$common/AsyncButton.svelte";
import { invalidateAll } from "$app/navigation";
import { toasts } from "$common/toast.store.js";
import { dev } from "$app/environment";
import { signOut } from "$fn/supabase.client.js";
let { data } = $props();
const { supabase } = data;
const { userData, user, hasPassword } = $state(data);
let displayNameData = $state({ value: "", error: null, show: false });
let usernameData = $state({ value: "", error: null, show: false });
let googleProvider = $state(user.app_metadata.providers.includes("google"));
let showGoogleAccountField = $state(false);
let showPasswordResetLinkSent = $state(false);
let showEmailField = $state(false);
let showPasswordField = $state(false);
setValue();

function setValue() {
	displayNameData.value = userData.display_name;
	usernameData.value = userData.username;
}

async function updateDisplayName() {
	const newDisplayName = displayNameData.value;

	if (newDisplayName === userData.display_name) return closeFields();

	const resp = await fetch("/api/user/update-user-data", {
		method: "POST",
		body: JSON.stringify({ type: "display_name", value: newDisplayName }),
	});
	const result = await resp.json();

	if (result.error) {
		displayNameData.error = result.error.message;
		return;
	}
	toasts.add({ message: "Display name updated successfully", type: "success" });
	userData.display_name = newDisplayName;
	await invalidateAll();
	return closeFields();
}

async function updateUsername() {
	const newUsername = usernameData.value;
	if (newUsername === userData.username) return closeFields();

	const resp = await fetch("/api/user/update-user-data", {
		method: "POST",
		body: JSON.stringify({ type: "username", value: newUsername }),
	});

	const result = await resp.json();

	if (result.error) {
		usernameData.error = result.error.message;
		return;
	}
	toasts.add({ message: "Username updated successfully", type: "success" });
	userData.username = newUsername;
	await invalidateAll();
	return closeFields();
}

function closeFields() {
	displayNameData.show = false;
	displayNameData.error = null;

	usernameData.show = false;
	usernameData.error = null;

	showGoogleAccountField = false;
}

async function unlinkGoogleAccount() {
	const result = confirm("Are you sure you want to unlink your Google account?");
	if (!result) return closeFields();
	const { identities } = (await supabase.auth.getUserIdentities()).data;
	const googleIdentity = identities.find((identity) => identity.provider === "google");
	const { data, error } = await supabase.auth.unlinkIdentity(googleIdentity);
	if (error) return alert(error.message);
	googleProvider = false;
	closeFields();
}

async function linkGoogleAccount() {
	const { data, error } = await supabase.auth.linkIdentity({
		provider: "google",
		options: {
			redirectTo: page.url.href,
		},
	});
	if (error) {
		console.log(error);
	}
}

async function sendResetPasswordEmail() {
	const { data, error } = await supabase.auth.resetPasswordForEmail(userData.email, {
		redirectTo: page.url.origin + "/reset-password",
	});
	if (error) return console.log(error);
	showPasswordResetLinkSent = true;
}

function closeOtherEditableFields(e) {
	const { show, name } = e;
	if (!show) return;

	const field = name.toLowerCase().replace(/\s/g, "_");
	displayNameData.show = false;
	usernameData.show = false;
	showGoogleAccountField = false;
	showEmailField = false;
	showPasswordField = false;

	if (field === "display_name") displayNameData.show = true;
	if (field === "username") usernameData.show = true;
	if (field === "email") showEmailField = true;
	if (field === "password") showPasswordField = true;
	if (field === "google_account") showGoogleAccountField = true;
}
</script>

<h1>Account settings</h1>

<Segment title="User Info" width="800px">
	<EditableField
		name="Display Name"
		nullValue="Set up your display name"
		bind:value={userData.display_name}
		bind:show={displayNameData.show}
		onToggle={closeOtherEditableFields}
		required>
		<input
			type="text"
			placeholder="Display Name"
			spellcheck="false"
			bind:value={displayNameData.value}
			class:error={displayNameData.error} />
		{#if displayNameData.error}
			<p class="info error">{displayNameData.error}</p>
		{/if}
		<p class="info">Your name. This name will be visible to other users on the platform.</p>
		<div class="flex justify-end">
			<AsyncButton primary small onclick={updateDisplayName}>Save Changes</AsyncButton>
		</div>
	</EditableField>

	<EditableField
		name="Username"
		nullValue="Set up your username"
		bind:value={userData.username}
		bind:show={usernameData.show}
		onToggle={closeOtherEditableFields}
		required>
		<div class="input-box" class:error={usernameData.error}>
			<span class="prefix" style="margin-bottom:2px;">@</span>
			<input
				style="margin-left:-0.375rem;"
				type="text"
				placeholder="Username"
				bind:value={usernameData.value} />
		</div>
		{#if usernameData.error}
			<p class="info error">{usernameData.error}</p>
		{/if}

		<p class="info">
			The username uniquely identifies your user profile.<br /> It can only include letters, numbers,
			underscores, and dashes.
		</p>

		<div class="flex justify-end">
			<AsyncButton primary small onclick={updateUsername}>Save Changes</AsyncButton>
		</div>
	</EditableField>

	<EditableField
		name="Email"
		value={userData.email}
		bind:show={showEmailField}
		onToggle={closeOtherEditableFields}>
		<span class="info-box mb-4">Sorry, this feature is currently not available at the moment.</span>
		<label class="horizontal">
			<span>Current Email</span>
			<input type="text" disabled placeholder="current@email.com" value={userData.email} />
		</label>

		<label class="horizontal">
			<span>New Email</span>
			<input type="text" placeholder="new@email.com" value="" />
		</label>

		<p class="info">
			Changing your email will require you to verify your old and new email address.
		</p>
		<div class="flex justify-end">
			<AsyncButton primary small disabled>Save Changes</AsyncButton>
		</div>
	</EditableField>
</Segment>

<Segment title="Security" width="800px">
	<EditableField
		name="Password"
		value={hasPassword ? "••••••••" : ""}
		nullValue="No password needed for Google Sign In"
		bind:show={showPasswordField}
		onToggle={closeOtherEditableFields}>
		{#if showPasswordResetLinkSent}
			<div class="info-box success">
				A password reset link sent to your email, follow the instructions in the email to reset your
				password.
			</div>
		{/if}
		<p class="info">
			To change your password, click the button below, and you'll receive a reset link in your email
		</p>
		<div class="flex justify-start mt-2">
			<AsyncButton primary small onclick={sendResetPasswordEmail}
				>Send Password Reset Email</AsyncButton>
		</div>
	</EditableField>

	<EditableField
		bind:show={showGoogleAccountField}
		name="Google Account"
		value={`<span class='info-box ${googleProvider ? "success" : ""} !py-0.5'>${googleProvider ? "Linked" : "Unlinked"}</span>`}
		onToggle={closeOtherEditableFields}>
		<p class="info">
			{#if googleProvider}
				By unlinking your Google account, you will no longer be able to sign in with Google.
			{:else}
				By linking your Google account, you will be able to sign in with Google.
			{/if}
		</p>
		<div class="flex justify-start mt-2">
			{#if googleProvider}
				<AsyncButton primary small onclick={unlinkGoogleAccount}>Unlink Google Account</AsyncButton>
			{:else}
				<AsyncButton primary small onclick={linkGoogleAccount}>Link Google Account</AsyncButton>
			{/if}
		</div>
	</EditableField>

	<StandardField name="Sign Out Everywhere">
		<p class="info">
			This will log you out of BuiltSearch on all devices. If you believe your account has been
			compromised, we recommend changing your password.
		</p>
		<button
			class="sign-out-everywhere small text"
			onclick={async () => {
				const result = confirm("Are you sure you want to sign out of BuiltSearch on all devices?");
				if (!result) return;

				await signOut();
				location.reload();
			}}>
			Sign Out Everywhere
		</button>
	</StandardField>
</Segment>

{#if dev}
	<pre class="text-xs">{userData.user_id}</pre>
{/if}

<style lang="scss">
button.sign-out-everywhere {
	color: var(--red);
	padding: 2px 0.5rem;
	border: 1px solid var(--red);
	background-color: color-mix(in srgb, var(--red), 80% transparent);
}

p.info {
	font-size: 0.8125rem;
	color: var(--mono);
	margin: 0;
	&.error {
		color: var(--red);
	}
}

input,
.input-box {
	width: min(400px, 100%);
}

label {
	&.horizontal {
		display: grid;
		align-items: center;
		grid-template-columns: 120px 1fr;
		span {
			color: var(--text-soft);
			font-size: 0.875rem;
		}
	}
}
</style>
