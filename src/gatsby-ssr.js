import path from 'path';
import React from 'react';
import fsExtra from 'fs-extra';
import { v1 as uuidv1 } from 'uuid';

export const onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const {
    plugins, // internal to gatsby
    ...options
  } = pluginOptions;

  const plugin_base = path.resolve(process.cwd(), 'node_modules/gatsby-transformer-typst')
  const typst_assets_path = path.resolve(plugin_base, 'assets')

  const proj_root = process.cwd();
  const typst_main_path = path.resolve(proj_root, 'node_modules/@myriaddreamin/typst.ts/dist/esm/main.bundle.js');
  const renderer_path = path.resolve(proj_root, 'node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm');

  try {
    const target_path = path.join(process.cwd(), 'public', 'typst');
    fsExtra.copySync(typst_assets_path, target_path);
    fsExtra.copyFileSync(typst_main_path, path.join(target_path, 'typst-main.js'));
    fsExtra.copyFileSync(renderer_path, path.join(target_path, 'typst_ts_renderer_bg.wasm'));

    const typst_css_file = path.join(target_path, 'typst.css');
    const typst_css_content = fsExtra.readFileSync(typst_css_file, 'utf-8');
    const typst_css_content_gen = typst_css_content.replace("{{typst-dom-scale}}", options.domScale ?? "1");
    fsExtra.writeFileSync(typst_css_file, typst_css_content_gen, 'utf-8');
  } catch (error) {
    throw new Error('gatsby-transformer-typst could not copy the typst assets into the public folder');
  }

  // Adding custom cache busting
  const nocache = (link) => `${link}?cb=${uuidv1()}`;
  setHeadComponents([
    <link key="typst-asset-css" rel="stylesheet" type="text/css" href={nocache("/typst/typst.css")} />,
    <script key="typst-asset-svg-polyfill" src={nocache("/typst/svg-polyfill.js")} />,
    <script key="typst-asset-main-js" type="module" src={nocache("/typst/typst-main.js")} />,
    <script key="typst-asset-svg-utils" src={nocache("/typst/svg-utils.js")} />,
    <script key="typst-global-config">
      {`
        window.typstBindSvgDom = function () {};
      `}
    </script>
  ]);
};
