import { createRequire } from 'module';

createRequire(import.meta.url);

// src/types.ts
var FOLDER_PAGES = {
  "2-wiki/index": "wiki",
  "1-thoughts/index": "thoughts"
};

// src/components/styles/folder-index.scss
var folder_index_default = ".folder-index .folder-index__tools {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.25rem 1.5rem;\n  margin-bottom: 28px;\n}\n.folder-index .folder-index__button {\n  all: unset;\n  cursor: pointer;\n  font-family: var(--hp-mono);\n  font-size: 11px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--hp-muted);\n}\n.folder-index .folder-index__button:hover, .folder-index .folder-index__button[aria-expanded=true] {\n  color: var(--hp-text);\n}\n.folder-index .folder-index__panel {\n  max-height: 18rem;\n  overflow-y: auto;\n  margin: -12px 0 24px;\n  border: 1px solid var(--hp-hairline);\n  background: var(--hp-bg);\n}\n.folder-index .folder-index__panel[hidden] {\n  display: none;\n}\n.folder-index .folder-index__option {\n  all: unset;\n  box-sizing: border-box;\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n  width: 100%;\n  padding: 6px 12px;\n  cursor: pointer;\n  font-family: var(--hp-mono);\n  font-size: 11px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--hp-muted);\n}\n.folder-index .folder-index__option:hover, .folder-index .folder-index__option[aria-pressed=true] {\n  color: var(--hp-text);\n}\n.folder-index .folder-index__count {\n  color: var(--hp-muted);\n}\n.folder-index .folder-index__head {\n  display: grid;\n  grid-template-columns: 200px minmax(0, 1fr);\n  padding: 0 0 10px;\n  font-family: var(--hp-mono);\n  font-size: 11px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--hp-muted);\n}\n.folder-index .folder-index__head.folder-index__head--thoughts {\n  grid-template-columns: 140px minmax(0, 1fr) 120px;\n}\n@media all and (max-width: 900px) {\n  .folder-index .folder-index__head {\n    grid-template-columns: 120px minmax(0, 1fr);\n    column-gap: 12px;\n  }\n  .folder-index .folder-index__head.folder-index__head--thoughts {\n    grid-template-columns: 96px minmax(0, 1fr) 72px;\n  }\n}\n.folder-index .folder-index__list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  border-bottom: 1px solid var(--hp-hairline);\n}\n.folder-index .folder-index__item {\n  display: grid;\n  grid-template-columns: 200px minmax(0, 1fr);\n  align-items: baseline;\n  padding: 15px 0;\n  border-top: 1px solid var(--hp-hairline);\n}\n.folder-index .folder-index__item.folder-index__item--thoughts {\n  grid-template-columns: 140px minmax(0, 1fr) 120px;\n}\n@media all and (max-width: 900px) {\n  .folder-index .folder-index__item {\n    grid-template-columns: 120px minmax(0, 1fr);\n    column-gap: 12px;\n    padding: 11px 0;\n  }\n  .folder-index .folder-index__item.folder-index__item--thoughts {\n    grid-template-columns: 96px minmax(0, 1fr) 72px;\n  }\n}\n.folder-index .folder-index__label {\n  font-family: var(--hp-mono);\n  font-size: 11px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--hp-muted);\n}\n.folder-index .folder-index__title {\n  font-size: 24px;\n  line-height: 1.2;\n  font-weight: 400;\n  letter-spacing: -0.01em;\n  text-decoration: none;\n  background: none;\n  padding: 0;\n  color: var(--hp-text);\n}\n@media all and (max-width: 900px) {\n  .folder-index .folder-index__title {\n    font-size: 19px;\n  }\n}\n.folder-index .folder-index__list:hover .folder-index__title {\n  color: var(--hp-dim);\n}\n.folder-index .folder-index__list .folder-index__item:hover .folder-index__title,\n.folder-index .folder-index__list .folder-index__item:hover .folder-index__label {\n  color: var(--hp-text);\n}";

// src/components/scripts/folder-index.inline.ts
var folder_index_inline_default = 'var _=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"});function M(i){let e=new Set;for(let n of i??[]){let t=n.trim();t&&!/^https?:\\/\\//i.test(t)&&e.add(t)}return[...e]}function W(i,e,n){if(!i.startsWith(e+"/")||i===e+"/index"||i.endsWith("/index"))return!1;let t=n?.filePath;return typeof t=="string"&&t.endsWith(".md")}function S(i,e){let n=[];for(let[t,o]of Object.entries(i)){if(!W(t,"2-wiki",o))continue;let s=e[o?.filePath??""]??{};n.push({slug:t,title:o?.title||t.split("/").pop()||t,topics:M(s.topics),regions:M(s.regions)})}return n}function w(i,e){let n=[];for(let[t,o]of Object.entries(i)){if(!W(t,"1-thoughts",o))continue;let s=e[o?.filePath??""]??{};n.push({slug:t,title:o?.title||t.split("/").pop()||t,date:(s.date??"").trim(),type:(s.type??"").trim()})}return n}function C(i,e){let n=i.filter(t=>(!e.topic||t.topics.includes(e.topic))&&(!e.region||t.regions.includes(e.region)));return n.sort((t,o)=>_.compare(t.title,o.title)),e.order==="desc"&&n.reverse(),n}function k(i,e){let n=new Map;for(let t of i)for(let o of t[e])n.set(o,(n.get(o)??0)+1);return[...n.entries()].sort((t,o)=>_.compare(t[0],o[0]))}function R(i){return i.slice().sort((e,n)=>e.date&&n.date&&e.date!==n.date?e.date<n.date?1:-1:e.date&&!n.date?-1:!e.date&&n.date?1:_.compare(e.title,n.title))}function A(i){return i.split("/").map(encodeURIComponent).join("/")}var y=null;function j(i){return y||(y=fetch(`${i}/wiki-meta.json`).then(e=>e.ok?e.json():{}).catch(()=>({}))),y}function r(i,e,n){let t=document.createElement(i);return e&&(t.className=e),n!==void 0&&(t.textContent=n),t}function H(i,e){let n=r("li",e);return n.append(...i),n}function O(i,e,n){let t=r("a","internal folder-index__title",n);return t.href=`${i}/${A(e)}`,t}function K(i,e,n){let t={topic:null,region:null,order:"asc"},o=null,s=r("div","folder-index__tools"),c=r("div","folder-index__panel"),I=r("div","folder-index__head"),E=r("ul","folder-index__list");i.replaceChildren(s,c,I,E);let l=r("button","folder-index__button"),a=r("button","folder-index__button"),f=r("button","folder-index__button");for(let d of[l,a,f])d.type="button";s.append(l,a,f);let P=k(n,"topics"),$=k(n,"regions");function m(){if(c.replaceChildren(),c.hidden=o===null,o===null)return;let d=o==="topic"?P:$,u=o==="topic"?t.topic:t.region,L=p=>{o==="topic"?t.topic=p:t.region=p,o=null,x()},h=r("button","folder-index__option","All");h.type="button",h.setAttribute("aria-pressed",String(u===null)),h.addEventListener("click",()=>L(null)),c.append(h);for(let[p,N]of d){let g=r("button","folder-index__option");g.type="button",g.append(r("span","",p),r("span","folder-index__count",String(N))),g.setAttribute("aria-pressed",String(u===p)),g.addEventListener("click",()=>L(p)),c.append(g)}}function x(){let d=C(n,t);l.textContent=t.topic?`Topic: ${t.topic} \\xD7`:"Topic +",a.textContent=t.region?`Region: ${t.region} \\xD7`:"Region +",f.textContent=`Sort: ${t.order==="asc"?"A\\u2013Z":"Z\\u2013A"}`,l.setAttribute("aria-expanded",String(o==="topic")),a.setAttribute("aria-expanded",String(o==="region")),I.replaceChildren(r("span","","Topic"),r("span","",`Notes (${d.length})`)),E.replaceChildren(...d.map(u=>H([r("span","folder-index__label",u.topics[0]??"Wiki"),O(e,u.slug,u.title)],"folder-index__item folder-index__item--wiki"))),m()}let b=d=>{o=o===d?null:d,m(),l.setAttribute("aria-expanded",String(o==="topic")),a.setAttribute("aria-expanded",String(o==="region"))};l.addEventListener("click",()=>b("topic")),a.addEventListener("click",()=>b("region")),f.addEventListener("click",()=>{t.order=t.order==="asc"?"desc":"asc",x()});let T=d=>{o&&!s.contains(d.target)&&!c.contains(d.target)&&(o=null,m())},v=d=>{d.key==="Escape"&&o&&(o=null,m())};document.addEventListener("click",T),document.addEventListener("keydown",v),window.addCleanup(()=>{document.removeEventListener("click",T),document.removeEventListener("keydown",v)}),x()}function B(i,e,n){let t=r("div","folder-index__head folder-index__head--thoughts");t.append(r("span","","Date"),r("span","","Title"),r("span","","Type"));let o=r("ul","folder-index__list");o.replaceChildren(...R(n).map(s=>H([r("span","folder-index__label",s.date),O(e,s.slug,s.title),r("span","folder-index__label",s.type)],"folder-index__item folder-index__item--thoughts"))),i.replaceChildren(t,o)}async function D(){let i=document.querySelector(".folder-index");if(!i)return;let e=i.dataset.root??".",n;try{n=await fetchData}catch(o){console.error("[FolderIndex] \\uC0C9\\uC778\\uC744 \\uBD88\\uB7EC\\uC624\\uC9C0 \\uBABB\\uD588\\uC2B5\\uB2C8\\uB2E4:",o);return}let t=await j(e);i.dataset.mode==="wiki"?K(i,e,S(n,t)):i.dataset.mode==="thoughts"&&B(i,e,w(n,t))}document.addEventListener("nav",D);\n';
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  return l.vnode && l.vnode(l2), l2;
}

// src/components/FolderIndex.tsx
function pathToRoot(slug) {
  const depth = slug.replace(/^\/+|\/+$/g, "").split("/").length - 1;
  return depth <= 0 ? "." : Array(depth).fill("..").join("/");
}
var FolderIndex_default = (() => {
  const Component = (props) => {
    const slug = props.fileData.slug ?? "";
    const mode = FOLDER_PAGES[slug];
    if (!mode) return null;
    return /* @__PURE__ */ u2("div", { class: "folder-index", "data-mode": mode, "data-root": pathToRoot(slug) });
  };
  Component.css = folder_index_default;
  Component.afterDOMLoaded = folder_index_inline_default;
  return Component;
});

export { FolderIndex_default as FolderIndex };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map