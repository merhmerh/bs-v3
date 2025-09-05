import { genId, timeout } from "./helper.js";
import { getStoragePublicUrl } from "./supabase.client.js";
import { toasts } from "$common/toast.store.js";

export function parseLinksFromText(text) {
	const urlRegex = /\b((https?:\/\/)?(www\.)?([a-z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?)\b/g;
	const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;

	// Replace emails with placeholders
	const emailPlaceholders = [];
	text = text.replace(emailRegex, (match) => {
		emailPlaceholders.push(match);
		return `__EMAIL_PLACEHOLDER__${emailPlaceholders.length - 1}__`;
	});

	// Replace URLs with anchor tags
	if (text.match(urlRegex)) {
		const url = text.match(urlRegex)[0];

		if (url.startsWith("http://") || url.startsWith("https://")) {
			text = text.replace(urlRegex, `<a href="${url}">${url}</a>`);
		} else {
			text = text.replace(urlRegex, `<a href="https://${url}">${url}</a>`);
		}
	}

	// Replace email placeholders back into text
	text = text.replace(/__EMAIL_PLACEHOLDER__(\d+)__/g, (_, index) => {
		const email = emailPlaceholders[index];
		return `<a href='mailto:${email}'>${email}</a>`;
	});

	return text;
}
export function autoResizeTextArea(textarea) {
	textarea.style.height = "auto";
	textarea.style.height = textarea.scrollHeight + "px";
}

export function convertBlobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

export function dataURLtoBlob(dataURL) {
	const [metadata, base64Data] = dataURL.split(",");
	const binary = atob(base64Data);
	const array = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		array[i] = binary.charCodeAt(i);
	}
	return new Blob([array], { type: metadata.split(":")[1].split(";")[0] });
}

export function r2ImageTransform(url, options) {
	if (!url) return null;

	let opt_string = Object.entries(options)
		.map(([key, value]) => `${key}=${value}`)
		.join(",");

	const path = url.split("https://cdn.builtsearch.com/").pop();
	return `https://cdn.builtsearch.com/cdn-cgi/image/${opt_string}/${path}`;
}

export function getMediaUrl({ user_id, pid, company_id, published_as_company }, mediaData, size) {
	const { id: mediaId, type, url, youtube_id } = mediaData;
	const profileId = published_as_company ? company_id : user_id;
	const folderPath = `${profileId}/${pid}`;

	if (type === "video") {
		if (url) return url;

		return getStoragePublicUrl(`posts/${folderPath}/${mediaId}`);
	}

	if (type === "youtube" || type == "shorts") {
		return `https://img.youtube.com/vi/${youtube_id}/0.jpg`;
	}

	const ext = type === "image" ? ".webp" : "";
	let fileSize;
	if (!size) {
		fileSize = "-opt";
	} else {
		fileSize = `-${size}`;
	}
	// const fileSize = size === "opt" ? "-opt" : size ? `-${size}` : "";

	const fileName = `${mediaId}${fileSize}${ext}`;
	return getStoragePublicUrl(`posts/${folderPath}/${fileName}`);
}

export async function generateVideoThumbnail(videoSource) {
	return new Promise((resolve, reject) => {
		// Create video element
		const video = document.createElement("video");
		video.muted = true;
		video.playsInline = true;
		video.crossOrigin = "anonymous";

		// Create canvas for capture
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		// Cleanup helper
		const cleanup = () => {
			video.pause();
			video.src = "";
			video.removeAttribute("src");
			video.load();
		};

		// Load video data
		if (videoSource instanceof File) {
			// Local file
			video.src = URL.createObjectURL(videoSource);
		} else if (typeof videoSource === "string" && videoSource.startsWith("data:video")) {
			// base64 data URL string
			video.src = videoSource;
		} else {
			reject(new Error("Unsupported videoSource type. Must be File or base64 data URL."));
			return;
		}

		video.addEventListener("loadedmetadata", () => {
			// determine which time to seek: 5s or 1s
			console.log("Duration:", video.duration);
			const seekTime = video.duration >= 5 ? 5 : 1;

			// set canvas size to video resolution
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			// seek to desired time
			video.currentTime = seekTime;
		});

		video.addEventListener("seeked", async () => {
			await timeout(100);
			try {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				canvas.toBlob((blob) => {
					if (blob) {
						cleanup();
						resolve(blob); // Return the Blob directly
					} else {
						cleanup();
						reject(new Error("Failed to convert canvas to blob"));
					}
				}, "image/webp");
			} catch (err) {
				cleanup();
				reject(err);
			}
		});

		// Handle errors
		video.addEventListener("error", (e) => {
			cleanup();
			reject(new Error("Error loading video"));
		});
	});
}

export function readImageFileAsBase64(file) {
	return new Promise((resolve, reject) => {
		if (!file) {
			reject("No file provided");
			return;
		}

		// Check if the provided file is an image
		if (!file.type.startsWith("image/")) {
			reject("Please provide an image file.");
			return;
		}

		// Create a FileReader to read the image file
		const reader = new FileReader();
		reader.onload = function (event) {
			const imgSrc = event.target.result;
			resolve(imgSrc);
		};

		// Read the selected image file as a data URL
		reader.readAsDataURL(file);
	});
}

export function updateQueryParams(url, params) {
	const urlObj = new URL(url);
	const searchParams = urlObj.searchParams;
	for (const key in params) {
		searchParams.set(key, params[key]);
	}
	urlObj.search = searchParams.toString();
	return urlObj.toString();
}

//params is string
export function removeQueryParams(url, params) {
	const urlObj = new URL(url);
	const searchParams = urlObj.searchParams;

	searchParams.delete(params);

	urlObj.search = searchParams.toString();
	return urlObj.toString();
}

export function copyToClipboard(
	str,
	{ successMessage = "Copied to clipboard", fallbackMessage } = opt,
) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(str);
		toasts.add({ message: successMessage, type: "success", duration: 5000 });
		return;
	} else {
		const message = fallbackMessage || str;
		toasts.add({ message: message, type: "info", duration: 7000 });
	}
}

export function generateWhatsappLink(number) {
	if (!number) return null;
	number = number.replace(/\+/g, "").replace(/\s+/g, "");
	const message =
		"Hello, I found your contact on BuiltSearch, and I would like to connect with you.\n";
	const encodedMessage = encodeURIComponent(message);
	return `https://wa.me/${number}?text=${encodedMessage}`;
}

export const tryCatch = async (promise) => {
	try {
		const data = await promise;

		if (data && typeof data === "object" && "error" in data) {
			if (typeof data.error === "string") {
				return { data: null, error: { message: data.error } };
			}

			return { data: null, error: data.error };
		}

		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
};
