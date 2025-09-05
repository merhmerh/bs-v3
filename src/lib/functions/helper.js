import { customAlphabet } from "nanoid";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import seedrandom from "seedrandom";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export { dayjs };

export { uuidv4, uuidv7 };

/**
 * Generates a random alphanumeric ID using nanoid with an optional prefix.
 *
 * @param {number} [length=24] - The length of the generated ID. Default is 24 characters.
 * @param {string} [prefix=""] - An optional prefix to add before the generated ID. If provided, a dash will separate the prefix and the ID.
 * @returns {string} - A unique ID consisting of alphanumeric characters, optionally prefixed.
 */
export function genId(length = 24, prefix = "") {
	const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	if (typeof length !== "number" || length <= 0) {
		length = 24;
	}
	const random = customAlphabet(alphabet, length);

	if (prefix) return prefix + "-" + random();
	return random();
}

export function fastRandom(length = 6, prefix = "") {
	const rng = Math.random().toString(36).substring(2, length);
	return prefix ? `${prefix}${rng}` : rng;
}

/**
 * Generate random number with nanoid
 * @param {number} length - The length of the number to generate, default is 6
 * @returns {returnType} - String consisting of only numeric characters
 */
export const genNumber = customAlphabet("0123456789", 6);

/**
 * Converts a string to title case. Optionally lowercases the rest of the letters and replaces underscores with spaces.
 *
 * @param {string} str - The input string to be converted.
 * @param {Object} [options] - Optional settings.
 * @param {boolean} [options.toSpace=true] - Whether to replace underscores and dashes with spaces.
 * @param {boolean} [options.firstOnly=false] - Whether to capitalize only the first letter of each word, making the rest lowercase.
 * @returns {string} The converted string in title case.
 */
export function titleCase(str, { toSpace = true, preserveCaps = false } = {}) {
	if (!str) return str;
	if (toSpace) {
		str = str.toString().replace(/[_-]/g, " ");
	}

	return (
		str
			.split(/\s/)
			// @ts-ignore
			.map((word) => {
				const firstChar = word.charAt(0);
				if (
					!firstChar.match(/[a-zA-Z]/) ||
					(preserveCaps === true && word === word.toUpperCase())
				) {
					return word;
				}

				const firstLetter = word.charAt(0).toUpperCase();
				const rest = word.slice(1).toLowerCase();
				return firstLetter + rest;
			})
			.join(" ")
	);
}

/**
 * @param {string} str - The string to convert to pascal Case
 * @returns {string} - The string in pascal case
 */
export function pascalCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * @param {number} ms - The duration to wait in milliseconds
 */
export function timeout(ms = 0) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a debounced version of the provided function, which delays invoking the function until after the specified wait time.
 *
 * @param {Function} func - The function to debounce. This function will be invoked after the delay has passed.
 * @param {number} delay - The delay in milliseconds before invoking the function.
 * @returns {Function} - The debounced function
 */
export function debounce(func, delay = 300) {
	let timeoutId;

	/** @param {any[]} args */
	function debounced(...args) {
		const context = this;

		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	}

	return debounced;
}

/**
 * Format a number to include commas and decimal points
 * @param {number | string} number - The number or string to format
 * @param {number | null} decimal - The number of decimal places to show
 */
export function formatNumber(number, decimal = null) {
	const invalidInputError = "Invalid input: number must be a valid number or numeric string.";

	if (number === null || number === undefined || number === "") {
		throw new TypeError(invalidInputError);
	}

	if (typeof number === "string") {
		number = parseFloat(number);
		if (isNaN(number)) {
			throw new TypeError(invalidInputError);
		}
	}

	if (decimal === 0) {
		number = Math.round(number);
	}

	const [integerPart, decimalPart] = number.toString().split(".");
	const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	let decimalValue = decimalPart || "";
	if (decimal !== null && decimal >= 0) {
		decimalValue = decimalValue.padEnd(decimal, "0").substring(0, decimal);
		return decimal > 0 ? `${formattedIntegerPart}.${decimalValue}` : formattedIntegerPart;
	}

	return decimalPart ? `${formattedIntegerPart}.${decimalValue}` : formattedIntegerPart;
}

/**
 * Convert formatted number string back to a number (e.g. "1,234.5" to 1234.5)
 * @param {string | number} str - The string to convert back to a number
 * @returns {number} - The number converted from the string
 */
export function stringToNumber(str) {
	try {
		return Number(str.toString().replace(/[^0-9.-]+/g, ""));
	} catch (e) {
		throw new TypeError("Invalid input: string must be a valid number or numeric string.");
	}
}

/**
 * Converts a string into a URL-safe slug. It remove diacritics, invalid characters, spaces and replaces them with dash.
 *
 * @param {string} str - The string to convert into a URL-safe slug.
 * @returns {string} - The URL-safe slug.
 */
export function toUrlSafe(str) {
	if (!str || typeof str !== "string") {
		throw new TypeError("Input must be a non-empty string.");
	}

	return str
		.trim()
		.toLowerCase()
		.normalize("NFD") // Normalize diacritics (e.g. "é" to "e")
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
		.replace(/[^a-zA-Z0-9\s-_]/g, "-") // Remove invalid characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Converts a string into a kebab-case. It is an alias for toUrlSafe. It remove diacritics, invalid characters, spaces and replaces them with dash.
 *
 * @param {string} str - The string to convert into kebab case.
 * @returns {string} - The string in kebab case.
 */
export function kebabCase(str) {
	return toUrlSafe(str);
}

/**
 * Round a number to the nearest (e.g. 523 to 520)
 * @param {number} number - The number to round
 * @param {number} nearest - The number to round to, default to 10
 * @returns {number} - The rounded number
 */
export function roundTo(number, nearest = 10) {
	return Math.round(number / nearest) * nearest;
}

/**
 * Calculate the distance between two coordinates in meters.
 * @param {{lat: number, lng: number}} location1 - The first coordinate.
 * @param {{lat: number, lng: number}} location2 - The second coordinate.
 * @returns {number} - Distance in meters.
 * */
export function haversineDistance(location1, location2) {
	const R = 6371000; // Radius of the Earth in meters
	const { lat: lat1, lng: lon1 } = location1;
	const { lat: lat2, lng: lon2 } = location2;
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c; // Distance in meters
	return distance;

	/** @param {number} deg */
	function deg2rad(deg) {
		return deg * (Math.PI / 180);
	}
}

/**
 * Check if an object is empty
 * @param {Object} obj - The object to check
 * @returns {boolean} - True if the object is empty, false otherwise
 */
export function isObjectEmpty(obj) {
	if (!obj || typeof obj !== "object") {
		throw new TypeError("Input must be a non-null object.");
	}
	return Object.keys(obj).length === 0;
}

/**
 * Adds or updates query parameters in a given URL based on an object of key-value pairs.
 *
 * @param {string | URL} url - The URL (string or URL object) to which query parameters will be added or updated.
 * @param {Object} paramsObject - An object representing the query parameters to add or update in the URL.
 * @returns {string} - The modified URL with updated query parameters.
 * @throws {TypeError} - Throws an error if the provided URL is not a valid string.
 */
export function appendUrlParams(url, paramsObject) {
	if (!(typeof url === "string" || url instanceof URL)) {
		throw new TypeError("The URL must be a string or a URL object.");
	}

	if (!paramsObject || typeof paramsObject !== "object") {
		return url.toString();
	}

	const urlObject = typeof url === "string" ? new URL(url) : url;
	const urlParams = new URLSearchParams(urlObject.search);

	// Add or update the query parameters from paramsObject
	for (const [key, value] of Object.entries(paramsObject)) {
		urlParams.set(key, value);
	}

	// Rebuild the URL with updated query parameters
	const pathName = urlObject.pathname == "/" ? "" : urlObject.pathname;
	const hash = urlObject.hash ? urlObject.hash : "";

	return `${urlObject.origin}${pathName}?${urlParams.toString()}${hash}`;
}

export function randomBetween(min, max, returnInt = false) {
	let rand = Math.random() * (max - min) + min;
	if (returnInt) {
		return Math.floor(rand);
	}
	return rand;
}

export function randomizeArrayBySeedTime(arr, minutes = 5) {
	const now = dayjs();
	const seed = `${now.format("YYYY:MM:DD:HH")}-${Math.floor(now.minute() / minutes)}`;
	const rng = seedrandom(seed);

	return arr.sort((a, b) => rng() - rng());
}

export function titleCaseIfAllLowerCase(str) {
	if (str === str.toLowerCase()) {
		return titleCase(str);
	}
	return str;
}

export function validateSocialMediaLinks() {}
