import { OPEN_AI_API_KEY } from "$env/static/private";
import OpenAI from "openai";

export const openai = new OpenAI({
	apiKey: OPEN_AI_API_KEY,
});
