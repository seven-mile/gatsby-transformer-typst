"use strict";

const { supportedExtensions } = require("./supported-extensions");
const Compiler = require("./compiler");

const compiler = new Compiler();

async function onCreateNode({
  node,
  actions,
  createNodeId,
  createContentDigest,
}) {
  
  const { createNode, createParentChildLink } = actions
  
  const buffer = compiler.vector(node.absolutePath)

  const typstNode = {
    id: createNodeId(`${node.id} >> Typst`),
    children: [],
    parent: node.id,
    internal: {
      type: `Typst`,
    },
  }

  const timestamp = compiler.date(node.absolutePath) / 1000_000;

  typstNode.frontmatter = {
    title: compiler.title(node.absolutePath) ?? ``,
    date: new Date(timestamp).toJSON(),
    description: compiler.description(node.absolutePath) ?? ``,
  }
  typstNode.excerpt = typstNode.frontmatter.description
  typstNode.artifact = buffer.toString('base64')

  typstNode.fileAbsolutePath = node.absolutePath;

  typstNode.internal.contentDigest = createContentDigest(typstNode);

  createNode(typstNode)
  createParentChildLink({ parent: node, child: typstNode })

}

exports.onCreateNode = onCreateNode
exports.shouldOnCreateNode = ({ node }) => {
  return node.internal.type === "File" && !!supportedExtensions[node.extension]
}
