const encoder = new TextEncoder();

/**
 * Creates a JSON `Response` object representing an error, with a specified HTTP status code and data.
 * @param {number} status The [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses). Must be in the range 400-599.
 * @param {Object | string} data an error message or JSON data.
 * @param {ResponseInit} [init] Options such as `status` and `headers` that will be added to the response. `Content-Type: application/json` and `Content-Length` headers will be added automatically.
 */
export function jsonError(status = 400, data, init) {
	const resp = {
		error: {
			code: status,
		},
	};

	if (typeof data === "object") {
		resp.error = {
			...resp.error,
			...data,
		};
	} else if (typeof data === "string") {
		resp.error.message = data.toString();
	}

	const body = JSON.stringify(resp);

	const headers = new Headers(init?.headers);
	if (!headers.has("content-length")) {
		headers.set("content-length", encoder.encode(body).byteLength.toString());
	}

	if (!headers.has("content-type")) {
		headers.set("content-type", "application/json");
	}

	return new Response(body, {
		...init,
		headers,
	});
}

/**
 * Splits an array into smaller chunks of a specified size.
 *
 * @param {any[]} array - The array o split into chunks.
 * @param {number} [chunkSize=250] - The size of each chunk. Defaults to 250.
 * @returns {Array} - An array of chunks, each of size `chunkSize` or less.
 */
export function createChunks(array, chunkSize = 250) {
	if (!Array.isArray(array)) {
		throw new TypeError("Input must be an array.");
	}

	if (typeof chunkSize !== "number" || chunkSize <= 0) {
		throw new TypeError("Chunk size must be a positive number.");
	}

	const chunks = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, chunkSize + i));
	}
	return chunks;
}
