import {
	genId,
	genNumber,
	timeout,
	titleCase,
	debounce,
	formatNumber,
	stringToNumber,
	toUrlSafe,
	roundTo,
	haversineDistance,
	isObjectEmpty,
	appendUrlParams,
} from "$fn/helper.js";
import { validateSocialUrl } from "$data/social_links.js";
import { beforeEach } from "vitest";
import { describe, test, expect, vi } from "vitest";

function doTest() {
	describe("Generate ID", () => {
		test("Generate random ID default 24 char", () => {
			const id = genId();
			expect(id).toHaveLength(24);
		});

		test("Generate random ID with 6 char", () => {
			const id = genId(6);
			expect(id).toHaveLength(6);
		});

		test("Generate random ID with prefix", () => {
			const id = genId(null, "test");
			expect(id).toMatch(/^test-/);
			expect(id).toHaveLength(24 + 5);
		});

		test("Generate random Number default to length 6", () => {
			const num = genNumber();
			expect(num).toHaveLength(6);
		});

		test("Generate random Number with length 16", () => {
			const num = genNumber(16);
			expect(num).toHaveLength(16);
		});
	});

	describe("Title Case", () => {
		test("Capitalized First Letter", () => {
			const title = titleCase("hello world");
			expect(title).toBe("Hello World");
		});

		test("Stay Capitalized", () => {
			const title = titleCase("HELLO WORLD");
			expect(title).toBe("Hello World");
		});

		test("Replace UnderScore With Space", () => {
			const title = titleCase("HELLO_WORLD");
			expect(title).toBe("Hello World");
		});

		test("Replace Underscore With Space stay Capitalized", () => {
			const title = titleCase("HELLO_WORLD", { preserveCaps: true });
			expect(title).toBe("HELLO WORLD");
		});
	});

	describe("Pascal Case", () => {
		test("Convert string to pascal case", () => {
			expect(titleCase("hello world", true)).toBe("Hello World");
		});
	});

	describe("timeout", () => {
		test("timeout test 500ms", async () => {
			vi.useRealTimers();
			await timeout(500);
			expect(true).toBe(true);
		});
	});

	describe("debounce", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		test("delay fn execution", () => {
			const func = vi.fn();
			const db_func = debounce(func, 300);
			db_func();
			expect(func).not.toHaveBeenCalled();
			vi.advanceTimersByTime(300);
			expect(func).toBeCalledTimes(1);
		});

		test("Debounce 3 fn call", () => {
			const func = vi.fn();
			const db_func = debounce(func, 300);

			db_func();
			db_func();
			db_func();

			expect(func).not.toHaveBeenCalled();
			vi.advanceTimersByTime(300);
			expect(func).toBeCalledTimes(1);
		});

		test("Multiple fn call with delay", () => {
			const func = vi.fn();
			const db_func = debounce(func, 300);

			db_func();
			db_func();
			db_func();

			expect(func).not.toHaveBeenCalled();
			vi.advanceTimersByTime(200);
			expect(func).not.toHaveBeenCalled();

			vi.advanceTimersByTime(100);
			expect(func).toBeCalledTimes(1);

			db_func();
			vi.advanceTimersByTime(100);
			db_func();

			vi.advanceTimersByTime(300);
			expect(func).toBeCalledTimes(2);
		});
	});

	describe("Format Number", () => {
		test("Format number with 7 digit", () => {
			expect(formatNumber(1234567)).toBe("1,234,567");
		});

		test("Format number with decimal", () => {
			expect(formatNumber(1234567.89)).toBe("1,234,567.89");
		});

		test("Format number with decimal 3", () => {
			expect(formatNumber(1234567.89, 3)).toBe("1,234,567.890");
		});

		test("Format negative number", () => {
			expect(formatNumber(-1234567.89, 0)).toBe("-1,234,568");
		});

		test("Format string number", () => {
			expect(formatNumber("1234567.89", 0)).toBe("1,234,568");
		});
	});

	describe("String to number", () => {
		test("String number", () => {
			expect(stringToNumber("12345")).toBe(12345);
		});

		test("Negative string number", () => {
			expect(stringToNumber("-12345")).toBe(-12345);
		});

		test("String number with comma", () => {
			expect(stringToNumber("12,345")).toBe(12345);
		});

		test("String number with comma and decimal", () => {
			expect(stringToNumber("12,345.67")).toBe(12345.67);
		});
	});

	describe("To URL safe string", () => {
		test("String with spaces", () => {
			expect(toUrlSafe("this is a test")).toBe("this-is-a-test");
		});

		test("String with spaces, dash and underscore", () => {
			expect(toUrlSafe("this-is_a_test")).toBe("this-is_a_test");
		});

		test("String with special characters and numbers", () => {
			expect(toUrlSafe("speci@l#ChARAct3r")).toBe("speci-l-charact3r");
		});
	});

	describe("Round to nearest integer", () => {
		test("to nearest 1", () => {
			expect(roundTo(123.5, 1)).toBe(124);
		});

		test("to nearest 10 (default)", () => {
			expect(roundTo(123.456)).toBe(120);
		});

		test("to nearest 100", () => {
			expect(roundTo(123.456, 100)).toBe(100);
		});
	});

	describe("Haversine distance", () => {
		test("Distance between 2 coords", () => {
			const l1 = { lat: 1.3419758560955242, lng: 103.93665425095531 };
			const l2 = { lat: 1.3098459587691273, lng: 103.778237006779 };
			const d = haversineDistance(l1, l2);
			expect(d).toBeCloseTo(17969.22, 2);
		});
	});

	describe("Is object empty", () => {
		test("Empty object", () => {
			expect(isObjectEmpty({})).toBe(true);
		});

		test("Not an object", () => {
			expect(() => isObjectEmpty("string")).toThrow(TypeError);
		});
	});

	describe("Append URL params", () => {
		const params = { a: 1, b: 2 };

		test("Append URL params", () => {
			const url = "https://example.com";
			const newUrl = appendUrlParams(url, params);
			expect(newUrl).toBe("https://example.com?a=1&b=2");
		});

		test("Append URL with paths", () => {
			const url = "https://example.com/path";
			const newUrl = appendUrlParams(url, params);
			expect(newUrl).toBe("https://example.com/path?a=1&b=2");
		});

		test("Append URL params with existing params", () => {
			const url = "https://example.com?c=0";
			const newUrl = appendUrlParams(url, params);
			expect(newUrl).toBe("https://example.com?c=0&a=1&b=2");
		});

		test("Retain hash", () => {
			const url = "https://example.com#hash";
			const newUrl = appendUrlParams(url, params);
			expect(newUrl).toBe("https://example.com?a=1&b=2#hash");
		});

		test("Override existing params", () => {
			const url = "https://example.com?key=old";
			const result = appendUrlParams(url, { key: "new" });
			expect(result).toBe("https://example.com?key=new");
		});
	});
}

describe("Validate Social Media Links", () => {
	const whatsapp = [
		{ num: "6584289874", expected: true },
		{ num: "84289874", expected: true },
		{ num: "+6584289874", expected: true },
		{ num: "+63 917 123 4567", expected: true },
		{ num: "63 2 812 3456", expected: true },
	];

	test("Whatsapp", () => {
		for (const item of whatsapp) {
			const result = validateSocialUrl("whatsapp", item.num);
			const resultBool = result?.error ? false : true;
			console.log(result);
			expect(item.expected).toBe(resultBool);
		}
	});
	const testCase = [
		{ key: "email", url: "enquiry@poshliving.com.sg", expected: true },
		{ key: "website", url: "https://www.example.com", expected: true },
		{ key: "website", url: "http://www.example.com", expected: true },
		{ key: "website", url: "www.example.com", expected: true },
		{ key: "website", url: "example.com", expected: true },
		{ key: "website", url: "//example.com", expected: false },
		{ key: "twitter", url: "https://twitter.com/username", expected: true },
		{ key: "twitter", url: "https://www.twitter.com/username", expected: true },
		{ key: "twitter", url: "twitter.com/username", expected: true },
		{ key: "twitter", url: "x.com/merh_72", expected: true },
		{ key: "instagram", url: "https://www.instagram.com/username", expected: true },
		{ key: "instagram", url: "https://www.instagram.com/ap.concept", expected: true },
		{ key: "instagram", url: "instagram.com/username", expected: true },
		{ key: "tiktok", url: "https://www.tiktok.com/@username", expected: true },
		{ key: "tiktok", url: "tiktok.com/@username", expected: true },
		{
			key: "tiktok",
			url: "https://www.tiktok.com/@projectguru.interior?lang=en",
			expected: true,
		},
		{ key: "linkedin", url: "https://www.linkedin.com/in/username", expected: true },
		{ key: "linkedin", url: "linkedin.com/in/username", expected: true },
		{
			key: "linkedin",
			url: "https://www.linkedin.com/company/projectguru-pte-ltd/mycompany/?viewAsMember=true",
			expected: true,
		},
		{ key: "facebook", url: "https://www.facebook.com/username", expected: true },
		{ key: "facebook", url: "https://www.facebook.com/user-name", expected: true },
		{
			key: "facebook",
			url: "https://www.facebook.com/profile.php?id=100064587436429",
			expected: true,
		},
		{ key: "facebook", url: "facebook.com/username", expected: true },
		{ key: "youtube", url: "https://www.youtube.com/channel/username", expected: true },
		{ key: "youtube", url: "youtube.com/channel/username", expected: true },
		{ key: "youtube", url: "https://www.youtube.com/user/username", expected: true },
		{ key: "youtube", url: "youtube.com/user/username", expected: true },
		{ key: "youtube", url: "https://www.youtube.com/c/username", expected: true },
		{ key: "youtube", url: "youtube.com/c/username", expected: true },
		{ key: "youtube", url: "https://www.youtube.com/@username", expected: true },
		{ key: "dribbble", url: "https://dribbble.com/UpNow_Studio", expected: true },
		{ key: "dribbble", url: "dribbble.com/UpNow_Studio", expected: true },
		{ key: "pinterest", url: "https://www.pinterest.com/archdigest/", expected: true },
		{ key: "pinterest", url: "pinterest.com/archdigest", expected: true },
		{ key: "github", url: "https://github.com/builtsearch", expected: true },
		{ key: "github", url: "github.com/merhmerh", expected: true },
		{ key: "discord", url: "https://discord.gg/username", expected: false },
		{ key: "discord", url: "discord.com/username", expected: false },
		{ key: "discord", url: "discord.com/users/188940563842596864", expected: true },
		{ key: "discord", url: "https://discord.com/users/userid", expected: true },
	];

	test("AllCases", () => {
		for (const item of testCase) {
			const result = validateSocialUrl(item.key, item.url);
			const resultBool = result?.error ? false : true;
			if (resultBool !== item.expected) {
				console.log(item.url, resultBool == item.expected);
			}
			expect(item.expected).toBe(resultBool);
		}
	});
});
