# quartz-folder-index

Quartz v5 컴포넌트. Hide Park 사이트의 Wiki(`2-wiki/`)와 Thoughts(`1-thoughts/`) 폴더 페이지를 색인표 스타일 목록으로 그린다.

- **Wiki:** `Topic +`, `Region +`, `Sort: A–Z` 버튼, `Topic | Notes (N)` 헤더. Topic과 Region 필터는 함께 걸 수 있고(둘 다 만족), 정렬은 A–Z / Z–A.
- **Thoughts:** `Date | Title | Type` 열, 최신 날짜가 위.
- 목록 데이터는 Quartz 색인(`contentIndex.json`)과 사이트 루트의 `wiki-meta.json`을 합쳐 브라우저에서 만든다. `wiki-meta.json` 은 사이트의 `make-labels.mjs` 가 볼트 속성(`topic`, `Countries`, `Cities`, `Date`, `Type`)에서 생성한다. 없으면 필터 없이 제목만 표시한다.
- 폴더 페이지의 주소(`2-wiki/index`, `1-thoughts/index`)는 `src/types.ts` 의 `FOLDER_PAGES` 에 있다.

## 사용 (quartz.config.yaml)

```yaml
- source: github:bahkjeongho/quartz-folder-index
  enabled: true
  layout:
    position: beforeBody
    priority: 40
```

색은 사이트의 `--hp-*` CSS 변수(`--hp-text`, `--hp-muted`, `--hp-hairline`, `--hp-dim`, `--hp-mono`, `--hp-bg`)를 쓴다.

## 개발

```
npm install
npm test
npm run build   # dist/ 를 갱신한다. dist/ 는 커밋한다 (Quartz 가 git 에서 바로 설치하므로).
```
