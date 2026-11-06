/** 폴더 페이지 slug → 목록 종류. 사이트의 폴더 이름이 바뀌면 여기를 바꾼다. */
export const FOLDER_PAGES = {
  "a_wiki/index": "wiki",
  "c_blog/index": "thoughts",
} as const;

export type FolderMode = (typeof FOLDER_PAGES)[keyof typeof FOLDER_PAGES];
