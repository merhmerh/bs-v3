import crypto from "crypto";

export function encrypt(text, key) {
	const iv = crypto.randomBytes(12);
	key = Buffer.from(key, "hex");
	const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

	const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();

	// Concatenate iv + tag + encrypted data
	const encryptedBuffer = Buffer.concat([iv, tag, encrypted]);

	// Return a single base64 string
	return encryptedBuffer.toString("base64");
}

export function decrypt(encryptedBase64, key) {
	key = Buffer.from(key, "hex");

	try {
		const data = Buffer.from(encryptedBase64, "base64");

		// Extract iv (12 bytes), tag (16 bytes), and encrypted data
		const iv = data.subarray(0, 12);
		const tag = data.subarray(12, 28);
		const encryptedData = data.subarray(28);

		const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
		decipher.setAuthTag(tag);

		const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
		return decrypted.toString("utf8");
	} catch (err) {
		console.error("Decryption error:", err);
		return null;
	}
}
