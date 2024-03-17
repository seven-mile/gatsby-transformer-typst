"use strict";

const { supportedExtensions } = require("./supported-extensions");
const Compiler = require("./compiler");
const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');
const { writeFileSync } = require("fs");

const compiler = new Compiler();

async function onCreateNode({
  node,
  actions,
  createNodeId,
  createContentDigest,
  getNode,
}) {
  
  const { createNode, createParentChildLink } = actions

  const finalPath = createFilePath({ node, getNode, basePath: `content` })
  const artifactName = path.normalize(path.format({
    ...path.parse(finalPath),
    base: '', ext: '.multi.sir'
  }))
  const artifactPath = path.join('public', 'typst', artifactName)
  
  const buffer = compiler.vector(node.absolutePath)

  writeFileSync(artifactPath, buffer)

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
  typstNode.artifact = path.join('/typst', artifactName).replace(/\\/g, '/')

  typstNode.fileAbsolutePath = node.absolutePath;

  typstNode.internal.contentDigest = createContentDigest(typstNode);

  createNode(typstNode)
  createParentChildLink({ parent: node, child: typstNode })

}

exports.onCreateNode = onCreateNode
exports.shouldOnCreateNode = ({ node }) => {
  return node.internal.type === "File" && !!supportedExtensions[node.extension]
}
