// 목록 페이지의 순수 로직 (브라우저 스크립트와 테스트가 함께 쓴다).

export interface IndexEntry {
  filePath?: string;
  title?: string;
}

/** wiki-meta.json 의 한 항목. Wiki는 topics/regions, Thoughts는 date/type. */
export interface Meta {
  topics?: string[];
  regions?: string[];
  date?: string;
  type?: string;
}

export interface WikiItem {
  slug: string;
  title: string;
  topics: string[];
  regions: string[];
}

export interface ThoughtItem {
  slug: string;
  title: string;
  date: string;
  type: string;
}

export type SortOrder = "asc" | "desc";

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** 표시할 수 없는 값(주소, 빈 문자열)을 빼고 중복을 제거한다. */
export function cleanValues(values: string[] | undefined): string[] {
  const seen = new Set<string>();
  for (const v of values ?? []) {
    const t = v.trim();
    if (t && !/^https?:\/\//i.test(t)) seen.add(t);
  }
  return [...seen];
}

function isNote(slug: string, folder: string, entry: IndexEntry | undefined): boolean {
  if (!slug.startsWith(folder + "/")) return false;
  if (slug === folder + "/index" || slug.endsWith("/index")) return false;
  const fp = entry?.filePath;
  return typeof fp === "string" && fp.endsWith(".md");
}

export function buildWikiItems(
  index: Record<string, IndexEntry>,
  meta: Record<string, Meta>,
): WikiItem[] {
  const items: WikiItem[] = [];
  for (const [slug, entry] of Object.entries(index)) {
    if (!isNote(slug, "2-wiki", entry)) continue;
    const m = meta[entry?.filePath ?? ""] ?? {};
    items.push({
      slug,
      title: entry?.title || slug.split("/").pop() || slug,
      topics: cleanValues(m.topics),
      regions: cleanValues(m.regions),
    });
  }
  return items;
}

export function buildThoughtItems(
  index: Record<string, IndexEntry>,
  meta: Record<string, Meta>,
): ThoughtItem[] {
  const items: ThoughtItem[] = [];
  for (const [slug, entry] of Object.entries(index)) {
    if (!isNote(slug, "1-thoughts", entry)) continue;
    const m = meta[entry?.filePath ?? ""] ?? {};
    items.push({
      slug,
      title: entry?.title || slug.split("/").pop() || slug,
      date: (m.date ?? "").trim(),
      type: (m.type ?? "").trim(),
    });
  }
  return items;
}

export interface WikiFilter {
  topic: string | null;
  region: string | null;
  order: SortOrder;
}

/** 선택한 Topic과 Region을 모두 만족하는 노트만 남기고 제목순으로 정렬한다. */
export function applyWiki(items: WikiItem[], f: WikiFilter): WikiItem[] {
  const out = items.filter(
    (it) =>
      (!f.topic || it.topics.includes(f.topic)) && (!f.region || it.regions.includes(f.region)),
  );
  out.sort((a, b) => collator.compare(a.title, b.title));
  if (f.order === "desc") out.reverse();
  return out;
}

/** 필터 목록에 보여 줄 값과 개수 (가나다/ABC 순). */
export function countOptions(items: WikiItem[], key: "topics" | "regions"): [string, number][] {
  const counts = new Map<string, number>();
  for (const it of items) for (const v of it[key]) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => collator.compare(a[0], b[0]));
}

/** Thoughts: 최신 날짜가 위. 날짜가 없는 노트는 맨 아래에서 제목순. */
export function sortThoughts(items: ThoughtItem[]): ThoughtItem[] {
  return items.slice().sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return collator.compare(a.title, b.title);
  });
}

export function encodeSlug(slug: string): string {
  return slug.split("/").map(encodeURIComponent).join("/");
}
