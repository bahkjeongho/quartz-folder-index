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
  "a_wiki/index": { filePath: "A_Wiki/index.md", title: "Hide Park" },
  "a_wiki/bureau-borsche": { filePath: "A_Wiki/Bureau Borsche.md", title: "Bureau Borsche" },
  "a_wiki/cc-co": { filePath: "A_Wiki/CC Co..md", title: "CC Co." },
  "a_wiki/alpha": { filePath: "A_Wiki/Alpha.md", title: "Alpha" },
  "a_wiki/no-meta": { filePath: "A_Wiki/No Meta.md", title: "No Meta" },
  "a_wiki/sub/index": { filePath: "A_Wiki/sub/index.md", title: "folder" },
  "a_wiki/folder-only": { title: "폴더 페이지" },
  "a_wiki/a1_hub/design": { filePath: "A_Wiki/A1_Hub/Design.md", title: "Design" },
  "a_wiki/a2_k-pop-idol/rm": { filePath: "A_Wiki/A2_K-Pop Idol/RM.md", title: "RM" },
  "a_wiki/a4_journal/antikythera": { filePath: "A_Wiki/A4_Journal/Antikythera.md", title: "Antikythera" },
  "a_wiki/a5_sports-team/chicago-cubs": { filePath: "A_Wiki/A5_Sports Team/Chicago Cubs.md", title: "Chicago Cubs" },
  "a_wiki/a3_academic-program/ma-fashion": { filePath: "A_Wiki/A3_Academic Program/MA Fashion.md", title: "MA Fashion" },
  "b_object/b1_music/x": { filePath: "B_Object/B1_Music/x.md", title: "X" },
  "c_blog/index": { filePath: "C_Blog/index.md", title: "t" },
  "c_blog/a": { filePath: "C_Blog/A.md", title: "A" },
  "c_blog/b": { filePath: "C_Blog/B.md", title: "B" },
  "c_blog/c": { filePath: "C_Blog/C.md", title: "C" },
};

const meta = {
  "A_Wiki/Bureau Borsche.md": { topics: ["Design Studio"], regions: ["Germany", "Munich"] },
  "A_Wiki/CC Co..md": { topics: ["Creative Company", "Design Studio"], regions: ["UK", "London"] },
  "A_Wiki/Alpha.md": { topics: ["https://example.com", "Photographer"] },
  "C_Blog/A.md": { date: "2026-10-01", type: "Essay" },
  "C_Blog/B.md": { date: "2026-10-20", type: "Critique" },
};

describe("buildWikiItems", () => {
  const items = buildWikiItems(index, meta);
  it("Wiki 노트만 모은다 (폴더 index, 폴더 페이지, 다른 분야 제외)", () => {
    expect(items.map((i) => i.slug).sort()).toEqual([
      "a_wiki/alpha",
      "a_wiki/bureau-borsche",
      "a_wiki/cc-co",
      "a_wiki/no-meta",
    ]);
  });
  it("주소 모양의 topic 값은 버린다", () => {
    expect(items.find((i) => i.slug === "a_wiki/alpha")?.topics).toEqual(["Photographer"]);
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

describe("숨김 폴더", () => {
  it("K-Pop 멤버 폴더의 노트는 Wiki 색인표에 넣지 않는다", () => {
    const items = buildWikiItems(index, {});
    expect(items.some((i) => i.slug.startsWith("a_wiki/a1_hub/"))).toBe(false);
    expect(items.some((i) => i.slug.startsWith("a_wiki/a2_k-pop-idol/"))).toBe(false);
    expect(items.some((i) => i.slug.startsWith("a_wiki/a3_academic-program/"))).toBe(false);
    expect(items.some((i) => i.slug.startsWith("a_wiki/a5_sports-team/"))).toBe(false);
    expect(items.some((i) => i.slug.startsWith("a_wiki/a4_journal/"))).toBe(false);
    expect(items.some((i) => i.slug === "a_wiki/alpha")).toBe(true);
  });
});
