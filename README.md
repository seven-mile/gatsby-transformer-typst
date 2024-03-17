
# `gatsby-transformer-typst`

A simple transformer plugin for Gatsby that converts `typ` / `typst` `File` nodes into `Typst` nodes.

## Node structure

Check `gatsby-node.js` for the node structure.

## How to use

This plugin depends on [`typst.ts`](https://github.com/Myriad-Dreamin/typst.ts). These packages are not published to npm, so you need to link them manually.

```sh
yarn link @myriaddreamin/typst.ts @myriaddreamin/typst-ts-renderer @myriaddreamin/typst-ts-node-compiler
yarn build
yarn link


cd $GATSBY_PROJECT_ROOT
yarn link gatsby-transformer-typst
```

Then include this plugin in your `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    /// ...
    `gatsby-transformer-typst`
  ],
}
```

## Example

Check out my [`blog-ng`](https://github.com/seven-mile/blog-ng) for an example of integrate it into a gatsby.js blog.
