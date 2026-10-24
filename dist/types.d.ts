/** 폴더 페이지 slug → 목록 종류. 사이트의 폴더 이름이 바뀌면 여기를 바꾼다. */
declare const FOLDER_PAGES: {
    readonly "2-wiki/index": "wiki";
    readonly "1-thoughts/index": "thoughts";
};
type FolderMode = (typeof FOLDER_PAGES)[keyof typeof FOLDER_PAGES];

export { FOLDER_PAGES, type FolderMode };
