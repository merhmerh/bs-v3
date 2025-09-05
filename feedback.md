### Sizes

Use whole number values for font sizes. This is because browsers can render fractional font sizes differently, which can cause text to look blurry or misaligned.

```css
.heading {
	font-size: 0.9rem;
}
```

Don't use 1rem, is base size is 16px, 0.9rem is 14.4px.

Only use 1rem, 0.875rem, 0.75rem, 0.625rem, 0.5rem, 0.375rem, 0.25rem, 0.125rem.

### Unnecessary Container

```html
<div class="flex items-center justify-between">
	<div class="heading">
		<h3>View All Users</h3>
	</div>
	<a href="/people"><u>View all</u></a>
</div>
```

```css
.heading {
	font-size: 0.9rem;
}
```

In the above example, the `div.heading` is not needed, since you can change font-size in the h3 tag instead.

### Server Load

Always use server load to load initial data, don't use client javascript to load. this will cause page to show blank, loading screen or no result found even for a second.

Using server load will always return page with data.

Subsequent data can be loaded using client javascript.

This ensure good SEO, and user experience.
