import { describe, expect, it } from "vitest";
import {
  applyWiki,
  buildThoughtItems,
  buildWikiItems,
  cleanValues,
  countOptions,
  sortThoughts,
} from "../src/components/scripts/logic";

const index = {
  "2-wiki/index": { filePath: "2 Wiki/index.md", title: "Hide Park" },
  "2-wiki/bureau-borsche": { filePath: "2 Wiki/Bureau Borsche.md", title: "Bureau Borsche" },
  "2-wiki/cc-co": { filePath: "2 Wiki/CC Co..md", title: "CC Co." },
  "2-wiki/alpha": { filePath: "2 Wiki/Alpha.md", title: "Alpha" },
  "2-wiki/no-meta": { filePath: "2 Wiki/No Meta.md", title: "No Meta" },
  "2-wiki/sub/index": { filePath: "2 Wiki/sub/index.md", title: "folder" },
  "2-wiki/folder-only": { title: "폴더 페이지" },
  "3-object/31-music/x": { filePath: "3 Object/31 Music/x.md", title: "X" },
  "1-thoughts/index": { filePath: "1 Thoughts/index.md", title: "t" },
  "1-thoughts/a": { filePath: "1 Thoughts/A.md", title: "A" },
  "1-thoughts/b": { filePath: "1 Thoughts/B.md", title: "B" },
  "1-thoughts/c": { filePath: "1 Thoughts/C.md", title: "C" },
};

const meta = {
  "2 Wiki/Bureau Borsche.md": { topics: ["Design Studio"], regions: ["Germany", "Munich"] },
  "2 Wiki/CC Co..md": { topics: ["Creative Company", "Design Studio"], regions: ["UK", "London"] },
  "2 Wiki/Alpha.md": { topics: ["https://example.com", "Photographer"] },
  "1 Thoughts/A.md": { date: "2026-10-01", type: "Essay" },
  "1 Thoughts/B.md": { date: "2026-10-20", type: "Critique" },
};

describe("buildWikiItems", () => {
  const items = buildWikiItems(index, meta);
  it("Wiki 노트만 모은다 (폴더 index, 폴더 페이지, 다른 분야 제외)", () => {
    expect(items.map((i) => i.slug).sort()).toEqual([
      "2-wiki/alpha",
      "2-wiki/bureau-borsche",
      "2-wiki/cc-co",
      "2-wiki/no-meta",
    ]);
  });
  it("주소 모양의 topic 값은 버린다", () => {
    expect(items.find((i) => i.slug === "2-wiki/alpha")?.topics).toEqual(["Photographer"]);
  });
});

describe("applyWiki", () => {
  const items = buildWikiItems(index, meta);
  const base = { topic: null, region: null, order: "asc" as const };

  it("필터가 없으면 전부, 제목 A–Z", () => {
    expect(applyWiki(items, base).map((i) => i.title)).toEqual([
      "Alpha",
      "Bureau Borsche",
      "CC Co.",
      "No Meta",
    ]);
  });
  it("Z–A는 반대 순서", () => {
    expect(applyWiki(items, { ...base, order: "desc" })[0]?.title).toBe("No Meta");
  });
  it("Topic은 여러 topic 중 하나만 맞아도 포함한다", () => {
    expect(applyWiki(items, { ...base, topic: "Design Studio" }).map((i) => i.title)).toEqual([
      "Bureau Borsche",
      "CC Co.",
    ]);
  });
  it("Topic과 Region은 둘 다 만족해야 한다", () => {
    expect(
      applyWiki(items, { ...base, topic: "Design Studio", region: "London" }).map((i) => i.title),
    ).toEqual(["CC Co."]);
    expect(applyWiki(items, { ...base, topic: "Photographer", region: "London" })).toEqual([]);
  });
  it("메타가 없는 노트는 필터를 켜면 빠진다", () => {
    expect(applyWiki(items, { ...base, region: "UK" }).some((i) => i.title === "No Meta")).toBe(false);
  });
});

describe("countOptions", () => {
  it("값과 개수를 이름순으로 돌려준다", () => {
    const items = buildWikiItems(index, meta);
    expect(countOptions(items, "topics")).toEqual([
      ["Creative Company", 1],
      ["Design Studio", 2],
      ["Photographer", 1],
    ]);
  });
});

describe("Thoughts", () => {
  it("최신 날짜가 위, 날짜 없는 노트는 맨 아래", () => {
    const items = sortThoughts(buildThoughtItems(index, meta));
    expect(items.map((i) => i.title)).toEqual(["B", "A", "C"]);
    expect(items[0]?.type).toBe("Critique");
    expect(items[2]?.date).toBe("");
  });
});

describe("cleanValues", () => {
  it("공백과 중복을 정리한다", () => {
    expect(cleanValues([" A ", "A", "", "http://x.com"])).toEqual(["A"]);
    expect(cleanValues(undefined)).toEqual([]);
  });
});
