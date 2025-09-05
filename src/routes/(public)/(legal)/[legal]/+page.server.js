import { marked } from "marked";
import terms from "./md/terms.md?raw";
import privacy from "./md/privacy.md?raw";
import security from "./md/security.md?raw";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
    const { legal } = params;
    const map = {
        terms: terms,
        privacy: privacy,
        security: security,
    };

    if (!map[legal]) {
        error(404, `Page not found`);
    }

    const md = map[legal];

    const html = marked.parse(md);

    return { html };
}
// This code loads the terms of service markdown file, converts it to HTML using the marked library, and returns it for rendering in the SvelteKit application.
