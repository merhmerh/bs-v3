<script>
import { readImageFileAsBase64 } from "$fn/helper.client.js";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { tick } from "svelte";
import Avatar from "$common/Avatar.svelte";
import Modal from "$common/Modal.svelte";
import AsyncButton from "$common/AsyncButton.svelte";
import Icon from "@iconify/svelte";

const checkedBackground = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA4SURBVHgB7dHBCQAwDAJAW7qE+w/n3wXaDdJHCOQRv8IhuGxfBJEU1dhIZoAOwPn9TBKlCwboADx+jgmsFcPLRgAAAABJRU5ErkJggg==`;

let {
	avatar = $bindable(null),
	onsave = () => {},
	onremove = () => {},
	background = false,
	fallback = "",
	type = "user",
} = $props();

let newImageSrc = $state("");
let editorModal = $state(),
	imageEditor = $state(),
	cropperBackground = $state(null),
	cropper = $state(),
	showEditor = $state(false);

async function openExplorer() {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.click();
	input.addEventListener("change", async (e) => {
		const file = e.target.files[0];
		const src = await readImageFileAsBase64(file);
		newImageSrc = src;
		showEditor = true;
		await tick();
		initCropper();
		input.remove();
	});

	function initCropper() {
		cropper = new Cropper(imageEditor, {
			aspectRatio: 1,
			viewMode: 0,
			dragMode: "move",
			center: true,
			background: true,
			cropBoxMovable: false,
			cropBoxResizable: false,
			autoCropArea: 0.8,
			minContainerHeight: 300,
			minCropBoxHeight: 250,
		});
	}
}

export async function removePicture() {
	avatar = null;
	onremove();
}

async function save() {
	const croppedCanvas = cropper.getCroppedCanvas();

	const avatar_blob = await resize(croppedCanvas, 512, 512, cropperBackground);
	showEditor = false;
	await tick();
	editorModal.close();
	onsave(avatar_blob);
}

async function resize(canvas, width, height, backgroundColor = "white") {
	if (!height) {
		height = width;
	}
	const newWidth = width; // Adjust to your preferred width
	const newHeight = height; // Adjust to your preferred height

	// Create a new canvas with the desired dimensions
	const resizedCanvas = document.createElement("canvas");
	resizedCanvas.width = newWidth;
	resizedCanvas.height = newHeight;

	// Get the 2D context of the new canvas
	const ctx = resizedCanvas.getContext("2d");

	// Fill the canvas with the background color if specified
	if (cropperBackground) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, newWidth, newHeight);
	}

	// Draw the original image on top of the background
	ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

	// Convert the resized canvas to a blob
	const blob = await new Promise((resolve) => {
		resizedCanvas.toBlob((blob) => resolve(blob), "image/webp", 0.8);
	});

	return blob;
}

export async function openAvatarCropper() {
	editorModal.open();
}

function alignCenter() {
	const containerData = cropper.getContainerData();
	const imageData = cropper.getImageData();

	cropper.setCanvasData({
		left: (containerData.width - imageData.width) / 2,
		top: (containerData.height - imageData.height) / 2,
		width: imageData.width,
		height: imageData.height,
	});
}

function fitToCropArea() {
	const cropBoxData = cropper.getCropBoxData();
	const imageData = cropper.getImageData();

	// Calculate the scaling factor to fit the image inside the crop area
	const scaleX = cropBoxData.width / imageData.naturalWidth;
	const scaleY = cropBoxData.height / imageData.naturalHeight;
	const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit

	// Calculate the new dimensions of the image
	const newWidth = imageData.naturalWidth * scale;
	const newHeight = imageData.naturalHeight * scale;

	// Center the image inside the crop area
	const newLeft = cropBoxData.left + (cropBoxData.width - newWidth) / 2;
	const newTop = cropBoxData.top + (cropBoxData.height - newHeight) / 2;

	// Apply the new position and size to the canvas
	cropper.setCanvasData({
		left: newLeft,
		top: newTop,
		width: newWidth,
		height: newHeight,
	});
}
</script>

<Modal
	bind:this={editorModal}
	modalHeight="fit-content"
	exitOutsideClick={false}
	onClose={() => (showEditor = false)}>
	<div class="image-editor">
		{#if type === "user"}
			<h2>Profile Picture</h2>
			<span class="text-sm">Update your profile picture to help others recognize you.</span>
		{:else if type === "company"}
			<h2>Company Logo</h2>
			<span class="text-sm">Update your company logo to help others recognize your company.</span>
		{/if}
		{#if !showEditor}
			<div class="img-container">
				<Avatar {background} --width="100%" src={avatar} {fallback} --height="300px" />
			</div>
			<div class="flex buttonGroup">
				<button class="outlined" onclick={openExplorer}>Change</button>
				<button class="outlined" onclick={removePicture}>Remove</button>
			</div>
		{:else}
			<div class="img-editor-container img-cropper">
				<img bind:this={imageEditor} src={newImageSrc} alt="" />
			</div>

			<div class="actions">
				<button class="mono" onclick={() => alignCenter()}>
					<div class="icon"><Icon icon="lucide:align-center" /></div>
					Center
				</button>
				<button class="mono" onclick={() => fitToCropArea()}>
					<div class="icon"><Icon icon="lineicons:expand-arrow-1" /></div>
				</button>
				<div class="background">
					<input
						class="color"
						type="color"
						value={cropperBackground ? cropperBackground : "#ffffff"}
						oninput={(event) => {
							const cropperBg = document.querySelector(".cropper-bg");
							cropperBg.style.backgroundColor = event.target.value;
							cropperBackground = event.target.value;
							cropperBg.style.backgroundImage = "unset";
						}} />
					<span class="code">{cropperBackground ? cropperBackground : "Transparent"}</span>
					{#if cropperBackground}
						<button
							class="none icon"
							onclick={() => {
								cropperBackground = null;
								const cropperBg = document.querySelector(".cropper-bg");
								cropperBg.style.backgroundImage = `url(${checkedBackground})`;
							}}>
							<Icon icon="lucide:refresh-ccw" />
						</button>
					{/if}
				</div>
			</div>

			<div class="flex buttonGroup save-cancel">
				<AsyncButton --width="100%" --px="1.5rem" onclick={save}>Save</AsyncButton>
				<AsyncButton --width="100%" buttonStyle={"outlined"} onclick={() => (showEditor = false)}
					>Cancel</AsyncButton>
			</div>
		{/if}
	</div>
</Modal>

<button class="avatar none" onclick={() => editorModal.open()}>
	{#key avatar}
		<Avatar {background} src={avatar} {fallback} --height="150px" />
	{/key}
</button>

<style lang="scss">
button.avatar {
	aspect-ratio: 1;
	border: 0;
	padding: 4px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 170px;
	border-radius: 50%;
}

.image-editor {
	width: 350px;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	@media screen and (max-width: 768px) {
		padding: 1rem;
	}
	.buttonGroup {
		gap: 1rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		button {
			width: 100%;
		}
		&.save-cancel {
			display: flex;
			gap: 1rem;
		}
	}

	div.img-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 300px;
		height: 300px;
		border-radius: 1000px;
		overflow: hidden;
		margin-inline: auto;
	}
	div.img-editor-container {
		outline: 1px solid var(--border-base);
		border-radius: 1rem;
		overflow: clip;
		max-height: 350px;
		display: flex;
		justify-content: center;
		align-items: center;
		img {
			display: block;
			max-width: 100%;
		}
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
		font-size: 0.875rem;
		button.mono {
			font-size: 0.875rem;
			border-radius: 0.375rem;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			min-width: 80px;
			.icon {
				color: var(--text);
			}
		}
		.background {
			display: flex;
			align-items: center;
			border: 1px solid var(--border-base);
			border-radius: 0.5rem;
			height: 32px;
			padding: 0.25rem;
			gap: 0.25rem;
			padding-right: 0.5rem;
			span {
				font-family: var(--font-mono);
			}
			input[type="color"] {
				height: auto;
				border-radius: 0.25rem;
				appearance: none;
				-webkit-appearance: none;
				border: none;
				width: 24px;
				height: 24px;
				padding: 0px;
				border: 1px solid var(--border-base);

				&::-webkit-color-swatch-wrapper {
					padding: 0px;
				}
				&::-webkit-color-swatch {
					border: none;
					border-radius: 0.25rem;
				}
			}
		}
	}
}

.img-cropper :global {
	.cropper-bg {
		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA4SURBVHgB7dHBCQAwDAJAW7qE+w/n3wXaDdJHCOQRv8IhuGxfBJEU1dhIZoAOwPn9TBKlCwboADx+jgmsFcPLRgAAAABJRU5ErkJggg==");
	}
	.cropper-modal {
		opacity: 0;
	}
	.cropper-view-box {
		border-radius: 50% !important;
	}
	.cropper-dashed {
		border-color: grey;
	}
	.cropper-view-box {
		outline: 1px solid var(--primary);
	}
	.cropper-crop-box {
		outline: 1px solid var(--primary);
	}
}
</style>
