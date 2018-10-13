# Chunkify js

Chunkify splits a string into chunks defined using square brackets `[` `]` as
the delimeter. Simply set `chunkify` as the class of the desired element.

Chunks can be defined either in the HTML of the element or using `data-map`

## innerHTML

```html
<h1 class="chunkify">
  H[e]ll[o ]W[o]rld
</h1>
```
*The above generates the following chunks:*

- `H`
- `e`
- `ll`
- `o `
- `W`
- `o`
- `rld`

## `data-map`

```html
<h1 class="chunkify" data-map="H[e]ll[o ]W[o]rld">
  Initialising...
</h1>
```
*This method generates the same results as using `innerHTML`, but has the
benefit of allowing the innerHTML of the element to be independently set before
the script has initialised.*

## `data-parenthesised-class`

This dataset attribute allows you to define a class (*applied as
`chunkify__chunk--{class}`*) for all chunks wrapped in the parenthesis,
 allowing for specific CSS control of those elements.

```html
<h1 class="chunkify" data-map="H[e]ll[o ]W[o]rld" data-parenthesised-class="hidden">
  Initialising...
</h1>
```
```css
.chunkify__chunk--hidden {
  display: none;
}
```
*The above code will hide all chunks wrapped in parenthesis, displaying in the
 following format:*

- `HllWrld`
