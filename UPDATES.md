# UPDATES

### toasts

uses global store instead of context

this allow us to call toast in .svelte or .js files

```js
import { toasts } from "$common/toast.store.js";

toasts.add({
	type: "success",
	message: "Toast Message",
});

//see types for more options
```

### All regarding Posts

#### Post Modal

PostModal component is now no more.
We now have `PostDetail.svelte` this is the standard UI for post detail. we use this component in `/post/:id` too.

#### SharePost, LikePost

We hav a helper function at `$comp/pages/posts/postDetail.svelte.js` it includes toasting error or success.

#### LikePost

For LikePost, the helper function only update database and NOT ui. therefore in the code where we call likePost() we need to update the UI manually.

we also update the ui first before invoking likePost(). but if it return error, we need to revert the ui back to original state.

```js
<button class="action icon none" class:liked={post.liked} onclick={() => like(post.pid)}>
	<Icon icon="tabler:heart" width="20" />
</button>;

async function like(post_id) {
	post.liked = !post.liked;
	const result = await likePost(post_id);
	if (result.error) {
		post.liked = !post.liked;
	}
}
```

### Required Field

Instead of adding <span class="required">_</span> to each required field.
We use pseudo element to insert to asterisk `_`

Pseudo element is more suitable it cannot be selected, and being a pure css solution it is easier to write and maintain.

```html
<div class="field required">
	<div class="title">
		<span>Country of relevance</span>
	</div>
	...
</div>
```

```css
.field {
	... &.required {
		.title {
			&:after {
				margin-left: calc(-0.5rem + 2px);
				content: "*";
				color: var(--orange);
			}
		}
	}
}

/* the margin-left is because .field is flex-box with gap */
```
