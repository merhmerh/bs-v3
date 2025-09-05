<script>
import Icon from "@iconify/svelte";
import { onMount, tick } from "svelte";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import AsyncButton from "./AsyncButton.svelte";

let {
	title = "Crop Image",
	data,
	outputFormat = "webp",
	onsave = () => {},
	onclose = () => {},
	maxOutputWidth = null,
	newImageSrc = "",
} = $props();
let imageEditor = $state("");
let customBackground = $state(null);
let cropper = $state(null);
let thisObj = $state(null);

onMount(async () => {
	if (data) {
		show(data);
	}
});

export async function show(data) {
	thisObj = data;
	newImageSrc = thisObj.url;
}

async function onImageLoad() {
	cropper = new Cropper(imageEditor, {
		aspectRatio: 1,
		viewMode: 0,
		dragMode: "move",
		center: true,
		background: false,
		cropBoxMovable: false,
		cropBoxResizable: false,
		autoCropArea: 0.8,
		minContainerHeight: 300,
		minCropBoxHeight: 250,
		ready() {
			fitToCropArea();
		},
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

async function save() {
	const h = cropper.canvasData.naturalHeight;
	const w = cropper.canvasData.naturalWidth;

	const largestSide = Math.max(h, w);
	console.log(largestSide);
	const croppedCanvas = cropper.getCroppedCanvas();

	const newBlob = await resize(croppedCanvas, largestSide, largestSide, customBackground);
	await tick();
	await onsave(thisObj, newBlob);
	thisObj = null;
}

async function resize(canvas, width, height, backgroundColor = "white") {
	if (!height) {
		height = width;
	}

	if (maxOutputWidth) {
		if (width > maxOutputWidth) {
			const scale = maxOutputWidth / width;
			width = maxOutputWidth;
			height = height * scale;
		}
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
	if (customBackground) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, newWidth, newHeight);
	}

	// Draw the original image on top of the background
	ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

	// Convert the resized canvas to a blob
	const format = `image/${outputFormat}`;
	const blobUrl = await new Promise((resolve) => {
		resizedCanvas.toBlob((blob) => resolve(blob), format, 1);
	});

	return blobUrl;
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
</script>

<div class="image-editor">
	<h1>{title}</h1>
	<div
		class="img-editor-container img-cropper"
		class:bg={customBackground}
		style="--bg: {customBackground}">
		<img bind:this={imageEditor} src={newImageSrc} onload={onImageLoad} alt="" />
	</div>

	<div class="actions">
		<button class="mono" onclick={() => alignCenter()}>
			<div class="icon"><Icon icon="lucide:align-center" /></div>
			Center
		</button>
		<button class="mono" onclick={() => fitToCropArea()}>
			<div class="icon"><Icon icon="lineicons:expand-arrow-1" /></div>
			Fit
		</button>
		<div class="background">
			<input
				class="color"
				type="color"
				value={customBackground ? customBackground : "#808080"}
				oninput={(event) => {
					customBackground = event.target.value;
				}} />
			<span class="code">{customBackground ? customBackground : "Transparent"}</span>
			{#if customBackground}
				<button
					class="none icon"
					onclick={() => {
						customBackground = null;
					}}>
					<Icon icon="lucide:refresh-ccw" />
				</button>
			{/if}
		</div>
	</div>

	<div class="button-group actions">
		<AsyncButton primary small onclick={save}>Save</AsyncButton>
		<button class="small outlined" onclick={() => onclose()}>Cancel</button>
	</div>
</div>

<style lang="scss">
.image-editor {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	@media screen and (max-width: 768px) {
		padding: 1rem;
	}

	div.img-editor-container {
		outline: 1px solid var(--border);
		border-radius: 1rem;
		overflow: clip;
		position: relative;
		max-height: 300px;
		&.bg {
			background-color: var(--bg);
		}
		&:after {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			content: "";
			z-index: -1;
			opacity: 0.75;
			background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA4SURBVHgB7dHBCQAwDAJAW7qE+w/n3wXaDdJHCOQRv8IhuGxfBJEU1dhIZoAOwPn9TBKlCwboADx+jgmsFcPLRgAAAABJRU5ErkJggg==");
		}
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
			border: 1px solid var(--border);
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
				border: 1px solid var(--border);

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
		background-color: transparent;
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
