import parsePhoneNumber from "libphonenumber-js";

export const socialLinks = [
	{
		name: "Website",
		key: "website",
		pattern: /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
		icon: "ci:globe",
		coloredIcon: "fluent-emoji-flat:globe-with-meridians",
	},
	// {
	// 	name: "Email",
	// 	key: "email",
	// 	pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	// 	icon: "lucide:mail",
	// 	coloredIcon: "lucide:mail",
	// },
	// {
	// 	name: "Whatsapp",
	// 	key: "whatsapp",
	// 	pattern: /^(\+?\d{1,3})?(\d{10,15})$/,
	// 	icon: "ic:baseline-whatsapp",
	// 	coloredIcon: "logos:whatsapp-icon",
	// },
	{
		name: "Twitter | X",
		key: "twitter",
		pattern: /^(https?:\/\/)?(?:www\.)?(twitter|x)\.com\/[A-Za-z0-9_\-\.]+\/?$/,
		icon: "ri:twitter-x-fill",
		coloredIcon: "ri:twitter-x-fill",
	},
	{
		name: "Instagram",
		key: "instagram",
		pattern: /^(https?:\/\/)?(?:www\.)?instagram\.com\/[A-Za-z0-9_\-\.]+\/?$/,
		icon: "lucide:instagram",
		coloredIcon: "skill-icons:instagram",
	},
	{
		name: "Tiktok",
		key: "tiktok",
		pattern: [
			/^(https?:\/\/)?(?:www\.)?tiktok\.com\/(@)?[A-Za-z0-9_\-\.]+\/?$/,
			/^(https?:\/\/)?(?:www\.)?tiktok\.com\/(@)?[A-Za-z0-9_\-\.]+\/?/,
		],
		icon: "ic:baseline-tiktok",
		coloredIcon: "logos:tiktok-icon",
	},
	{
		name: "Linkedin",
		key: "linkedIn",
		pattern: [
			/^(https?:\/\/)?(?:www\.)?linkedin\.com\/in\/?[A-Za-z0-9_\-\.]+\/?$/,
			/^(https?:\/\/)?(?:www\.)?linkedin\.com\/company\/?[A-Za-z0-9_\-\.]+/,
		],
		icon: "mdi:linkedin",
		coloredIcon: "logos:linkedin-icon",
	},
	{
		name: "Facebook",
		key: "facebook",
		pattern: [
			/^(https?:\/\/)?(?:www\.)?facebook\.com\/[A-Za-z0-9_\-\.]+\/?$/,
			/^(https?:\/\/)?(?:www\.)?facebook\.com\/profile\.php\?id\=[A-Za-z0-9_\-\.]+\/?$/,
		],
		icon: "mdi:facebook",
		coloredIcon: "logos:facebook",
	},
	{
		name: "Youtube",
		key: "youtube",
		pattern:
			/^(https?:\/\/)?(?:www\.)?youtube\.com\/(channel\/|user\/|c\/|@)?[A-Za-z0-9_\-]+\/?$/,
		icon: "mdi:youtube",
		coloredIcon: "logos:youtube-icon",
	},
	{
		name: "Dribbble",
		key: "dribbble",
		pattern: /^(https?:\/\/)?(?:www\.)?dribbble\.com\/[A-Za-z0-9_\-\.]+\/?$/,
		icon: "icon-park-solid:dribble",
		coloredIcon: "logos:dribbble-icon",
	},
	{
		name: "Pinterest",
		key: "pinterest",
		pattern: /^(https?:\/\/)?(?:www\.)?pinterest\.com\/[A-Za-z0-9_\-\.]+\/?$/,
		icon: "mdi:pinterest",
		coloredIcon: "logos:pinterest",
	},
	{
		name: "Github",
		key: "github",
		pattern: /^(https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_\-\.]+\/?$/,
		icon: "mdi:github",
		coloredIcon: "logos:github-icon",
	},
	{
		name: "Discord",
		key: "discord",
		pattern: /^(https?:\/\/)?(?:www\.)?discord\.com\/users\/[A-Za-z0-9]+$/,
		icon: "ic:baseline-discord",
		coloredIcon: "logos:discord-icon",
	},
];

export const socialIcons = socialLinks.map((x) => {
	return {
		key: x.key,
		name: x.name,
		icon: x.icon,
		coloredIcon: x.coloredIcon,
	};
});

export function setSocialURL(key, value) {
	if (key == "email") {
		return `mailto:${value}`;
	}

	if (key == "whatsapp") {
		return generateWhatsappLink(value);
	}
	return value;
}

function generateWhatsappLink(number) {
	if (!number) return null;
	number = number.replace(/\+/, "").replace(/\s+/, "");
	const message =
		"Hello, I found your contact on BuiltSearch, and I would like to connect with you.\n";
	const encodedMessage = encodeURIComponent(message);
	return `https://wa.me/${number}?text=${encodedMessage}`;
}

export function validateSocialUrl(key, value) {
	const data = socialLinks.find((x) => x.key === key);
	if (!data) return { value: null, error: "Invalid key" };
	if (!value) return { value: null, error: "Value is required" };

	const pattern = data.pattern;

	//if pattern is array
	const patterns = Array.isArray(pattern) ? pattern : [pattern];

	if (key == "whatsapp") {
		value = value.startsWith("+") ? value : "+" + value;
		const re = /^\+[\d\s]+$/;
		if (!re.test(value)) {
			return {
				value: null,
				error: "Phone number must be in international format",
			};
		}
		const phoneData = parsePhoneNumber(value);

		if (!phoneData || !phoneData.country) {
			return { value: null, error: "Invalid phone number" };
		}

		return { value, success: true };
	}

	for (const pattern of patterns) {
		console.log(value);
		console.log(pattern, pattern.test(value));
		if (pattern.test(value)) {
			return { value, success: true };
		}
	}

	return {
		value: null,
		error: "Invalid format or URL",
	};
}
