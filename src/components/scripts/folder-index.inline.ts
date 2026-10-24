import {
  applyWiki,
  buildThoughtItems,
  buildWikiItems,
  countOptions,
  encodeSlug,
  sortThoughts,
} from "./logic";
import type { IndexEntry, Meta, SortOrder, ThoughtItem, WikiItem } from "./logic";

let metaPromise: Promise<Record<string, Meta>> | null = null;

// 사이트 루트의 wiki-meta.json (update.sh 의 make-labels.mjs 가 만든다). 없으면 필터 없이 표시한다.
function loadMeta(root: string): Promise<Record<string, Meta>> {
  if (!metaPromise) {
    metaPromise = fetch(`${root}/wiki-meta.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
  }
  return metaPromise;
}

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function row(columns: HTMLElement[], className: string): HTMLLIElement {
  const li = h("li", className);
  li.append(...columns);
  return li;
}

function titleLink(root: string, slug: string, title: string): HTMLAnchorElement {
  const a = h("a", "internal folder-index__title", title);
  a.href = `${root}/${encodeSlug(slug)}`;
  return a;
}

function renderWiki(host: HTMLElement, root: string, items: WikiItem[]) {
  const state: { topic: string | null; region: string | null; order: SortOrder } = {
    topic: null,
    region: null,
    order: "asc",
  };
  let open: "topic" | "region" | null = null;

  const tools = h("div", "folder-index__tools");
  const panel = h("div", "folder-index__panel");
  const head = h("div", "folder-index__head");
  const list = h("ul", "folder-index__list");
  host.replaceChildren(tools, panel, head, list);

  const topicBtn = h("button", "folder-index__button");
  const regionBtn = h("button", "folder-index__button");
  const sortBtn = h("button", "folder-index__button");
  for (const b of [topicBtn, regionBtn, sortBtn]) b.type = "button";
  tools.append(topicBtn, regionBtn, sortBtn);

  const topics = countOptions(items, "topics");
  const regions = countOptions(items, "regions");

  function renderPanel() {
    panel.replaceChildren();
    panel.hidden = open === null;
    if (open === null) return;
    const options = open === "topic" ? topics : regions;
    const current = open === "topic" ? state.topic : state.region;
    const choose = (value: string | null) => {
      if (open === "topic") state.topic = value;
      else state.region = value;
      open = null;
      update();
    };
    const all = h("button", "folder-index__option", "All");
    all.type = "button";
    all.setAttribute("aria-pressed", String(current === null));
    all.addEventListener("click", () => choose(null));
    panel.append(all);
    for (const [value, count] of options) {
      const b = h("button", "folder-index__option");
      b.type = "button";
      b.append(h("span", "", value), h("span", "folder-index__count", String(count)));
      b.setAttribute("aria-pressed", String(current === value));
      b.addEventListener("click", () => choose(value));
      panel.append(b);
    }
  }

  function update() {
    const rows = applyWiki(items, state);
    topicBtn.textContent = state.topic ? `Topic: ${state.topic} ×` : "Topic +";
    regionBtn.textContent = state.region ? `Region: ${state.region} ×` : "Region +";
    sortBtn.textContent = `Sort: ${state.order === "asc" ? "A–Z" : "Z–A"}`;
    topicBtn.setAttribute("aria-expanded", String(open === "topic"));
    regionBtn.setAttribute("aria-expanded", String(open === "region"));

    head.replaceChildren(h("span", "", "Topic"), h("span", "", `Notes (${rows.length})`));
    list.replaceChildren(
      ...rows.map((it) =>
        row(
          [h("span", "folder-index__label", it.topics[0] ?? "Wiki"), titleLink(root, it.slug, it.title)],
          "folder-index__item folder-index__item--wiki",
        ),
      ),
    );
    renderPanel();
  }

  const toggle = (which: "topic" | "region") => {
    open = open === which ? null : which;
    renderPanel();
    topicBtn.setAttribute("aria-expanded", String(open === "topic"));
    regionBtn.setAttribute("aria-expanded", String(open === "region"));
  };
  topicBtn.addEventListener("click", () => toggle("topic"));
  regionBtn.addEventListener("click", () => toggle("region"));
  sortBtn.addEventListener("click", () => {
    state.order = state.order === "asc" ? "desc" : "asc";
    update();
  });

  // 바깥을 누르거나 Esc 를 누르면 목록을 닫는다.
  const onDocClick = (e: MouseEvent) => {
    if (open && !tools.contains(e.target as Node) && !panel.contains(e.target as Node)) {
      open = null;
      renderPanel();
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      open = null;
      renderPanel();
    }
  };
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
  window.addCleanup(() => {
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onKey);
  });

  update();
}

function renderThoughts(host: HTMLElement, root: string, items: ThoughtItem[]) {
  const head = h("div", "folder-index__head folder-index__head--thoughts");
  head.append(h("span", "", "Date"), h("span", "", "Title"), h("span", "", "Type"));
  const list = h("ul", "folder-index__list");
  list.replaceChildren(
    ...sortThoughts(items).map((it) =>
      row(
        [
          h("span", "folder-index__label", it.date),
          titleLink(root, it.slug, it.title),
          h("span", "folder-index__label", it.type),
        ],
        "folder-index__item folder-index__item--thoughts",
      ),
    ),
  );
  host.replaceChildren(head, list);
}

async function render() {
  const host = document.querySelector<HTMLElement>(".folder-index");
  if (!host) return;
  const root = host.dataset.root ?? ".";

  let index: Record<string, IndexEntry>;
  try {
    index = (await fetchData) as Record<string, IndexEntry>;
  } catch (error) {
    console.error("[FolderIndex] 색인을 불러오지 못했습니다:", error);
    return;
  }
  const meta = await loadMeta(root);

  if (host.dataset.mode === "wiki") renderWiki(host, root, buildWikiItems(index, meta));
  else if (host.dataset.mode === "thoughts") renderThoughts(host, root, buildThoughtItems(index, meta));
}

// 폴더 페이지에 들어올 때마다(페이지 이동 포함) 새로 그린다.
document.addEventListener("nav", render);
