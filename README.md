
# `gatsby-transformer-typst`

A simple transformer plugin for Gatsby that converts `typ` / `typst` `File` nodes into `Typst` nodes.

## Node structure

Check `gatsby-node.js` for the node structure.

## How to use

Add this package and include this plugin in your `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    /// ...
    `gatsby-transformer-typst`,
  ],
}
```

If you need tweak the scale of typst content, you can pass in a `domScale` option:

```js
module.exports = {
  plugins: [
    /// ...
    {
      resolve: `gatsby-transformer-typst`,
      options: {
        domScale: 1.17,
      }
    },
  ],
}
```

`domScale` align your font-size in the typst content (like `16pt`) with the one in HTML/CSS. Trying several values interactively should work.

## Example

Check out my [`blog-ng`](https://github.com/seven-mile/blog-ng) for an example of integrating it into a gatsby.js blog.

Use [this React component](https://github.com/seven-mile/blog-ng/blob/main/src/components/typst-doc.tsx) to render the `Typst` artifacts.
