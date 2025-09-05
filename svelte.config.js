import adapter from "@sveltejs/adapter-vercel";
import { sveltePreprocess } from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		experimental: {
			remoteFunctions: true,
		},
		adapter: adapter({
			runtime: "edge",
		}),
		alias: {
			$fn: "src/lib/functions",
			$common: "src/lib/components/core/common",
			$core: "src/lib/components/core",
			$pages: "src/lib/components/pages",
			$comp: "src/lib/components",
			$style: "src/style",
			$data: "src/lib/data",
			$static: "src/static",
			$routes: "src/routes",
			$config: "src/config",
			$lib: "src/lib",
			$src: "src",
		},
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: "alt-w",
			toggleButtonPos: "bottom-left",
			alwaysOnTop: false,
		},
	},
	preprocess: sveltePreprocess({
		scss: {
			prependData: `@use 'src/style/var.scss' as *;`,
		},
	}),
};

export default config;
