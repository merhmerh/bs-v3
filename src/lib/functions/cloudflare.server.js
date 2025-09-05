import { CLOUDFLARE_API_KEY, R2_ACCESS_KEY_ID, R2_ACCOUNT_ID, R2_SECRET_ACCESS_KEY } from '$env/static/private';
import Cloudflare from 'cloudflare';
import {
    DeleteObjectsCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const cloudflare = new Cloudflare({
    apiToken: CLOUDFLARE_API_KEY, // This is the default and can be omitted
});

export const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});


export async function s3DeleteFile(filePath, bucket = "builtsearch-public") {
    console.log(filePath)
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: filePath,
    });
    try {
        await s3.send(command);
        console.log(`Deleted ${filePath}`);
    } catch (err) {
        console.error("Error deleting object:", err);
    }
}

export async function s3ListFiles(prefix, bucket = "builtsearch-public") {
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
    });

    try {
        const response = await s3.send(command);
        return response.Contents.map((file) => file.Key)
    } catch (err) {
        console.error("Error listing objects:", err);
    }
}