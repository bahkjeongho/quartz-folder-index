import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { FOLDER_PAGES } from "../types";
import style from "./styles/folder-index.scss";
// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/folder-index.inline.ts";

/** 현재 페이지에서 사이트 루트로 가는 상대 경로. "index" → ".", "2-wiki/index" → ".." */
function pathToRoot(slug: string): string {
  const depth = slug.replace(/^\/+|\/+$/g, "").split("/").length - 1;
  return depth <= 0 ? "." : Array(depth).fill("..").join("/");
}

export default (() => {
  const Component: QuartzComponent = (props: QuartzComponentProps) => {
    const slug = props.fileData.slug ?? "";
    const mode = (FOLDER_PAGES as Record<string, string>)[slug];
    // Wiki와 Thoughts 폴더 페이지에서만 표시한다.
    if (!mode) return null;

    return <div class="folder-index" data-mode={mode} data-root={pathToRoot(slug)} />;
  };

  Component.css = style;
  Component.afterDOMLoaded = script;

  return Component;
}) satisfies QuartzComponentConstructor;
