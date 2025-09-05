# BuiltSearch

BuiltSearch is a one-stop platform for the Built Industry. Offering a comprehensive range of services, BuiltSearch aims to provide users with the tools and information they need.

## Key Todos

-   ⏹️ - Upgrade theme & CSS variables
-   ⏹️ - Migrate firebase auth to supabase
-   ⏹️ - Layout


## Features

-   **Post**: View user generated POST on the platform.
-   **People**: Browse professional profiles and connect with industry experts.
-   **Companies**: Discover companies and their projects.
-   **Projects**: Explore projects and their details.

## How It Works

1. **Search**: Enter a keyword in the search bar to find relevant information.
2. **Filter**: Use the filter options to narrow down your search results.
3. **Connect**: Connect with professionals and companies to expand your network.
4. **Post**: Share your thoughts and ideas with the community.

## Repo Guideline

-   **Tailwind vs Sass**

    -   This project can utilize Tailwind styling. However, please only use Tailwind for basic styling. For more complex styling, please use Sass.
    -   If more than 3 classes are used for a single element, consider using Sass.

-   **CSS Variables & Styling**

    -   This Project uses both light and dark mode, please use CSS variables for colors.
    -   All the css variables are defined in `src/style/main.scss`.
    -   Most basic HTML elements are already styled (buttons, inputs, etc).
    -   There are also custom components created in `$comp/*.svelte` that can be used, such as `AsyncButton`, `Avatar`, `Switch`, etc...

-   **Function Declarations vs Arrow Functions**

    -   Please use function declarations for all functions.
    -   Arrow functions should only be used for one-liner.

-   **Type Checking**

    -   This project uses JSDoc for type checking, but is not mandatory.
    -   It is recommended to at least use JSDoc for reusable helper function.

-   **Server vs Client Function**

    -   `*.server.js` should only be use in server-side code.
    -   `*.client.js` - This file should contain reusable functions that are dependent on the browser environment, if the function is not dependent on the browser environment, it should be in `*.js`.
    -   `*.js` can be use in both server-side and client-side code. Provided that the function is not dependent on the browser environment.
        -   helper.js - This file contains reusable functions that can be use in both server-side and client-side code.

-   **Unique ID**
    -   This project favour the use of nanoid instead of uuid.
    -   By default `nanoid` generate unique id using these characters `[A-Za-z0-9_-]`
    -   The preferred character set is alphanumeric, a helper function `genId` that uses `nanoid` `customAlphabet` function is provided in `$fn/helper.js`.
    -   If UUID is required, please use `uuid` from `uuid` package.

## Recommended Setup

### VS Code Extension

1. `Svelte for VS Code` by Svelte
2. `Prettier - Code formatter` by Prettier
3. `SCSS Formatter` by Sibiraj S

### VS Code Settings

1. Setting > `Label Format` > Short
2. Setting > Workbench > `Tree: Indent` > 12 or 16 //default is 8
3. Setting > `Explorer: Sort Order`
4. Settings > `Explorer: Compact Folders` > unchecked

## Installation

#### Requirements

1. [node.js](https://nodejs.org/)
2. [pnpm](https://pnpm.io/)

#### Installation

```bash
git clone <repo-url | repo-ssh url>

cd builtsearch-core

pnpm i

pnpm dev
```

#### Unit Testing & Integration Testing

```bash
pnpm test
```

#### Building

```bash
pnpm build
```

## Technologies Used

-   **Frontend & Backend**: [SvelteKit](https://kit.svelte.dev/)
-   **Database**: [Supabase](https://supabase.com/)

## Author

[Arvin | merhmerh](https://github.com/merhmerh)
