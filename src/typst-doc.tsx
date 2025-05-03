import React, { useState, useRef, useEffect } from 'react';
import * as typst from '@myriaddreamin/typst.ts';
import "enhanced-typst-svg/dist/style.css";
// @ts-ignore
import typst_svg_util from "file-loader!enhanced-typst-svg/dist/index.min.js";
// @ts-ignore
import typst_renderer from 'file-loader!@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm';
import { getOptionValue } from './option-store';

export const TypstPageHead = () =>
  <>
    <script key="typst-svg-util" type="text/javascript" src={typst_svg_util}></script>
    <script key="typst-global-config" type="text/javascript">
      {`
        window.typstBindSvgDom = function(){};
        // workaround for react-refresh
        window.$RefreshReg$ = () => {};
        window.$RefreshSig$ = () => () => {};
      `}
    </script>
  </>;

export interface TypstDocumentProps {
  artifact: ArrayBuffer | undefined;
  domScale: number | undefined;
}

export const TypstDocument = ({ artifact, domScale }: TypstDocumentProps) => {
  domScale = domScale ?? getOptionValue('domScale');

  /// --- beg: update document --- ///
  const displayDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!artifact) {
      return;
    }

    let plugin = typst.createTypstRenderer();
    console.log(plugin);

    const tsModule = fetch(typst_renderer as any as URL);

    plugin.init({ getModule: () => tsModule })
      .then(() => new Uint8Array(artifact))
      .then(artifactData => {
        return new Promise(resolve => {
          plugin.runWithSession(
            ses =>
              new Promise(dispose => {
                // ignore dispose
                void dispose;

                const t = performance.now();
                const dom = plugin.renderDom({
                  renderSession: ses,
                  container: displayDivRef.current!,
                  pixelPerPt: 4.5,
                  domScale: domScale,
                });

                dom.then((dom) => {
                  console.log(dom);
                  // FIXME: artifactData is not string type
                  dom.addChangement(['new', artifactData as any as string]);
                  console.log('render time', performance.now() - t);

                  window.addEventListener('resize', () => dom.addViewportChange());
                  window.addEventListener('scroll', () => dom.addViewportChange());
                })
              }),
          );
        });
      });
  }, [displayDivRef, artifact]);

  /// --- end: update document --- ///

  return (
    <div>
      <div className="typst-app" ref={displayDivRef}
        style={{ "--typst-dom-scale": domScale } as React.CSSProperties}>
      </div>
    </div>
  );
};
