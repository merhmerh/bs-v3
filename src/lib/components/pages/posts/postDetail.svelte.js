import { toasts } from "$common/toast.store.js";

export async function likePost(post_id) {
	try {
		const resp = await fetch(`/api/posts/${post_id}/like`, {
			method: "POST",
		});

		const result = await resp.json();

		if (result.error) throw new Error(result.error.message);

		return result;
	} catch (error) {
		toasts.add({ message: error.message, type: "error" });
		return { error: error.message };
	}
}

export async function sharePost(post) {
	const shareUrl = `${window.location.origin}/post/${post.pid}`;

	const shareData = {
		title: post.title,
		text: `Check out this post: ${post.title}`,
		url: shareUrl,
	};

	const userAgent = navigator.userAgent.toLowerCase();
	const isMobile = userAgent.includes("android") || userAgent.includes("iphone");

	if (navigator.share && isMobile) {
		navigator.share(shareData).catch((error) => {
			console.error("Sharing failed:", error);
		});
	} else {
		navigator.clipboard
			.writeText(shareUrl)
			.then(() => {
				toasts.add({ message: "Link copied to clipboard", type: "success" });
			})
			.catch((error) => {
				console.error("Failed to copy:", error);
			});
	}
}

export async function shareLink(url, opt = { title, text }) {
	const shareData = {
		title: opt.title || "BuiltSearch",
		text: opt.text || "Check out this link",
		url: url,
	};

	const userAgent = navigator.userAgent.toLowerCase();
	const isMobile = userAgent.includes("android") || userAgent.includes("iphone");

	if (navigator.share && isMobile) {
		navigator.share(shareData).catch((error) => {
			console.error("Sharing failed:", error);
		});
	} else {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				toasts.add({ message: "Link copied to clipboard", type: "success" });
			})
			.catch((error) => {
				console.error("Failed to copy:", error);
			});
	}
}
