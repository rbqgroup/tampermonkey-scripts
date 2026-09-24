// ==UserScript==
// @name         Pixiv Preview
// @namespace    https://github.com/KagurazakaIris/tampermonkey-scripts
// @version      0.3.0
// @description  悬浮预览 Pixiv 作品，并可通过滚轮切图和 B 键收藏
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      i.pximg.net
// ==/UserScript==
"use strict";(()=>{var u=class extends Error{constructor(r,t){super(r);this.status=t}},g=class{artworkCache=new Map;csrfToken="";async getArtwork(e,r){r?.throwIfAborted();let t=this.artworkCache.get(e);if(t)return t;let i=await this.request(`/ajax/illust/${e}?time=${Date.now()}`,{signal:r});if(i.error||!i.body)throw new u(i.message||"\u83B7\u53D6\u4F5C\u54C1\u6570\u636E\u5931\u8D25",200);return this.artworkCache.set(e,i.body),i.body}async addBookmark(e){await this.sendBookmark(e,!1)}async sendBookmark(e,r){let t=await this.getCsrfToken(e.id,r);try{await this.request("/ajax/illusts/bookmarks/add",{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8","x-csrf-token":t},body:JSON.stringify({comment:"",illust_id:e.illustId||e.id,restrict:0,tags:e.tags.tags.map(({tag:i})=>i)})})}catch(i){if(i instanceof u&&i.status===400&&!r){this.csrfToken="",await this.sendBookmark(e,!0);return}throw i}}async getCsrfToken(e,r){if(this.csrfToken&&!r)return this.csrfToken;let t=document.querySelector("#__NEXT_DATA__")?.textContent,i=this.extractCsrfToken(t||document.documentElement.innerHTML);if(!i||r){let o=await fetch(`/artworks/${e}`,{credentials:"same-origin",cache:"no-store"});if(!o.ok)throw new u("\u65E0\u6CD5\u5237\u65B0\u6536\u85CF\u51ED\u8BC1",o.status);i=this.extractCsrfToken(await o.text())}if(!i)throw new u("\u9875\u9762\u4E2D\u672A\u627E\u5230\u6536\u85CF\u51ED\u8BC1",0);return this.csrfToken=i,i}extractCsrfToken(e){let r=[/"token":"([a-f\d]{32})"/i,/\\"token\\":\\"([a-f\d]{32})\\"/i,/"postKey":"([a-f\d]{32})"/i,/\\"postKey\\":\\"([a-f\d]{32})\\"/i];for(let t of r){let i=e.match(t)?.[1];if(i)return i}return""}async request(e,r){let t=await fetch(e,{credentials:"same-origin",...r});if(!t.ok)throw new u(`Pixiv \u8BF7\u6C42\u5931\u8D25: HTTP ${t.status}`,t.status);let i=await t.json();if(i.error)throw new u(i.message||"Pixiv \u8BF7\u6C42\u5931\u8D25",t.status);return i}};var b=class{constructor(e,r){this.api=e;this.notification=r}pending=new Set;async add(e,r){if(e.bookmarkData)return this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5DF2\u7ECF\u6536\u85CF","info"),!1;if(this.pending.has(e.id))return this.notification.show("\u6536\u85CF\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D","info"),!1;this.pending.add(e.id),this.notification.show("\u6B63\u5728\u6536\u85CF\u4F5C\u54C1","info");try{return await this.api.addBookmark(e),e.bookmarkData={id:"",private:!1},e.bookmarkCount++,this.updateBookmarkIcon(r),this.notification.show("\u5DF2\u6536\u85CF","success"),!0}catch(t){return this.notification.show(this.getErrorMessage(t),"error"),!1}finally{this.pending.delete(e.id)}}updateBookmarkIcon(e){if(!e)return;let r=e.querySelectorAll("svg"),t=e.querySelector("button svg")||r[r.length-1];if(t){t.style.color="rgb(255, 64, 96)";for(let i of t.querySelectorAll("path"))i.style.fill="currentcolor"}e.querySelector("._one-click-bookmark")?.classList.add("on")}getErrorMessage(e){if(!(e instanceof u))return"\u6536\u85CF\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5";switch(e.status){case 401:return"\u6536\u85CF\u5931\u8D25\uFF0C\u8BF7\u5148\u767B\u5F55 Pixiv";case 403:return"\u6536\u85CF\u5931\u8D25\uFF0C\u8D26\u53F7\u5F53\u524D\u65E0\u6743\u6267\u884C\u6B64\u64CD\u4F5C";case 429:return"\u6536\u85CF\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";default:return`\u6536\u85CF\u5931\u8D25\uFF1A${e.message}`}}};var k=class{constructor(e=3){this.maxWorks=e}works=new Map;async createImage(e,r,t){let i=this.works.get(e),o=i?.images.get(r);if(!i||!o)return;this.touch(e,i),t.throwIfAborted();let n=new Image;return n.alt=o.alt,n.fetchPriority="high",this.loadImage(n,o.currentSrc||o.src,t,!0)}async preload(e,r,t,i){let o=this.getOrCreate(e.id);for(let n=0;n<e.pageCount;n++){if(t.aborted)return;if(n===r||o.images.has(n))continue;let s=new Image;s.alt=e.title,s.decoding="async",s.fetchPriority="low";let a=await this.loadImage(s,i(n),t,!1).catch(()=>{});if(!a||t.aborted||this.works.get(e.id)!==o)return;o.images.set(n,a)}}getOrCreate(e){let r=this.works.get(e)||{images:new Map};return this.touch(e,r),r}touch(e,r){for(this.works.delete(e),this.works.set(e,r);this.works.size>this.maxWorks;){let t=this.works.keys().next().value;if(!t)return;let i=this.works.get(t);this.works.delete(t);for(let o of i?.images.values()||[])o.src="";i?.images.clear()}}loadImage(e,r,t,i){return new Promise((o,n)=>{let s=!1,a=(h,p)=>{s||(s=!0,t.removeEventListener("abort",l),e.onload=null,e.onerror=null,p?n(p):o(h))},l=()=>{e.src="";let h=i?new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88","AbortError"):void 0;a(void 0,h)};t.addEventListener("abort",l,{once:!0}),e.onload=()=>a(e),e.onerror=()=>a(),e.src=r,e.complete&&e.naturalWidth>0&&a(e),t.aborted&&l()})}};var x=class{container=document.createElement("div");constructor(){this.container.className="ppv-toast-container",document.body.append(this.container)}show(e,r){let t=document.createElement("div");t.className=`ppv-toast ppv-toast-${r}`,t.textContent=e,this.container.append(t),window.setTimeout(()=>t.classList.add("ppv-toast-leave"),2200),window.setTimeout(()=>t.remove(),2500)}};var y=class{find(e){if(!(e instanceof Element))return;let r=e.closest('a[href*="/artworks/"]');if(!r||!r.querySelector("img"))return;let t=new URL(r.href,location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1];if(t)return{id:t,element:r,cardElement:this.findCardElement(r,t)}}findCardElement(e,r){let t=e.parentElement;for(;t&&t!==document.body;){let i=new Set([...t.querySelectorAll('a[href*="/artworks/"]')].map(o=>this.getArtworkId(o.href)).filter(o=>!!o));if(i.size>1||!i.has(r))return;if(t.querySelector("button svg")||t.querySelector("._one-click-bookmark"))return t;t=t.parentElement}}getArtworkId(e){return new URL(e,location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1]}};var L=400,M=100,A=25,m=8,w=6,T=class{constructor(e,r,t,i){this.api=e;this.renderer=r;this.bookmarkController=t;this.notification=i;this.wrap.className="ppv-preview",this.info.className="ppv-preview-info",this.loadingPanel.className="ppv-preview-loading-panel",this.loadingText.className="ppv-preview-loading-text",this.progressTrack.className="ppv-preview-progress-track",this.progressBar.className="ppv-preview-progress-bar ppv-preview-progress-bar-indeterminate",this.progressTrack.append(this.progressBar),this.loadingPanel.append(this.loadingText,this.progressTrack),this.wrap.append(this.info,this.loadingPanel),document.body.append(this.wrap),this.bindEvents()}wrap=document.createElement("div");info=document.createElement("div");loadingPanel=document.createElement("div");loadingText=document.createElement("div");progressTrack=document.createElement("div");progressBar=document.createElement("div");locator=new y;activeTarget;artwork;activeRequest;renderedArtwork;index=0;showTimer;version=0;lastWheelTime=0;currentUrl=location.href;routeObserver=new MutationObserver(()=>{location.href!==this.currentUrl&&(this.currentUrl=location.href,this.hide())});bindEvents(){document.addEventListener("pointerover",this.onPointerOver,!0),document.addEventListener("pointerout",this.onPointerOut,!0),document.addEventListener("wheel",this.onWheel,{capture:!0,passive:!1}),window.addEventListener("keydown",this.onKeyDown,!0),window.addEventListener("scroll",this.hide,!0),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide),window.addEventListener("popstate",this.hide),this.routeObserver.observe(document.body,{childList:!0,subtree:!0})}onPointerOver=e=>{let r=this.locator.find(e.target);if(!r||this.activeTarget?.element===r.element)return;this.hide(),this.activeTarget=r;let t=++this.version;this.showTimer=window.setTimeout(()=>{this.show(r,t)},L)};onPointerOut=e=>{this.activeTarget&&(e.target instanceof Node&&!this.activeTarget.element.contains(e.target)||e.relatedTarget instanceof Node&&this.activeTarget.element.contains(e.relatedTarget)||this.hide())};async show(e,r){let t=this.startRequest();this.showLoading(e.element,"\u6B63\u5728\u83B7\u53D6\u4F5C\u54C1\u4FE1\u606F");try{let i=await this.api.getArtwork(e.id,t.signal);if(!this.isCurrent(e,r))return;this.artwork=i,this.index=0,this.showLoading(e.element,"\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90"),await this.render(r,t.signal)}catch(i){this.handlePreviewError(i,e,r)}}async render(e,r){let t=this.artwork,i=this.activeTarget;if(!t||!i)return;let o=this.index,n=await this.renderer.load(t,o,r,a=>{this.isCurrent(i,e)&&this.index===o&&this.updateLoadingProgress(a)});if(!this.isCurrent(i,e)||this.index!==o){n.dispose();return}this.renderedArtwork=n;let s=n.image;this.wrap.querySelector("img")?.remove(),this.updateInfo(t,s),this.sizeAndPosition(s,i.element),this.wrap.append(s),this.wrap.classList.remove("ppv-preview-loading"),this.wrap.classList.add("ppv-preview-visible","ppv-preview-ready"),this.renderer.preload(t,o,r)}showLoading(e,r){this.loadingText.textContent=r,this.progressBar.style.width="",this.progressBar.classList.add("ppv-preview-progress-bar-indeterminate"),this.positionWrap(e,220,68),this.wrap.classList.remove("ppv-preview-ready"),this.wrap.classList.add("ppv-preview-visible","ppv-preview-loading")}updateLoadingProgress(e){if(e.total){let r=Math.min(100,Math.round(e.loaded/e.total*100));this.loadingText.textContent=`${this.formatBytes(e.loaded)} / ${this.formatBytes(e.total)} (${r}%)`,this.progressBar.classList.remove("ppv-preview-progress-bar-indeterminate"),this.progressBar.style.width=`${r}%`;return}this.loadingText.textContent=`\u5DF2\u52A0\u8F7D ${this.formatBytes(e.loaded)}`}formatBytes(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(1)} MB`}updateInfo(e,r){this.info.replaceChildren();let t=[e.pageCount>1?`${this.index+1}/${e.pageCount}`:"",`\u6536\u85CF ${e.bookmarkCount}`,`${r.naturalWidth}\xD7${r.naturalHeight}`,e.title];t.forEach((i,o)=>{if(!i)return;let n=document.createElement("span");n.textContent=i,o===t.length-1&&(n.className="ppv-preview-title"),this.info.append(n)})}sizeAndPosition(e,r){let t=r.getBoundingClientRect(),i=t.left-w-m,o=window.innerWidth-t.right-w-m,n=i>=o,s=Math.max(1,n?i:o),a=window.innerHeight-m*2-A,l=Math.min(1,s/e.naturalWidth,a/e.naturalHeight),h=Math.max(1,Math.floor(e.naturalWidth*l)),p=Math.max(1,Math.floor(e.naturalHeight*l));this.positionWrap(r,h,p+A,n),e.style.height=`${p}px`}positionWrap(e,r,t,i){let o=e.getBoundingClientRect(),n=o.left-w-m,s=window.innerWidth-o.right-w-m,a=i??n>=s,l=Math.max(1,a?n:s),h=Math.min(r,Math.max(120,l)),p=a?o.left-w-h:o.right+w,f=Math.min(Math.max(m,p),window.innerWidth-h-m),d=o.top+o.height/2-t/2,v=Math.min(Math.max(m,d),window.innerHeight-t-m);this.wrap.style.width=`${Math.round(h)}px`,this.wrap.style.left=`${Math.round(f)}px`,this.wrap.style.top=`${Math.round(v)}px`}onWheel=e=>{if(!this.artwork||!this.activeTarget||this.artwork.pageCount<=1||!this.wrap.classList.contains("ppv-preview-visible")||!(e.target instanceof Node)||!this.activeTarget.element.contains(e.target))return;e.preventDefault(),e.stopPropagation();let r=performance.now();if(r-this.lastWheelTime<M)return;this.lastWheelTime=r;let t=this.artwork.pageCount;this.index=(this.index+(e.deltaY<0?-1:1)+t)%t;let i=this.activeTarget,o=++this.version,n=this.startRequest();this.showLoading(i.element,"\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90"),this.render(o,n.signal).catch(s=>{this.handlePreviewError(s,i,o)})};onKeyDown=e=>{if(!this.artwork||!this.wrap.classList.contains("ppv-preview-visible")||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey)return;if(e.code==="Escape"){e.preventDefault(),e.stopPropagation(),this.hide();return}if(e.code!=="KeyB"||e.repeat)return;e.preventDefault(),e.stopPropagation();let r=document.activeElement;r instanceof HTMLElement&&r.blur();let t=this.artwork,i=this.activeTarget?.cardElement;this.bookmarkController.add(t,i).then(o=>{let n=this.wrap.querySelector("img");o&&this.artwork===t&&n&&this.updateInfo(t,n)})};startRequest(){this.activeRequest?.abort(),this.renderedArtwork?.dispose(),this.renderedArtwork=void 0,this.wrap.querySelector("img")?.remove();let e=new AbortController;return this.activeRequest=e,e}handlePreviewError(e,r,t){if(!(e instanceof DOMException&&e.name==="AbortError")){if(this.isCurrent(r,t)){let i=e instanceof u&&e.status===429?"\u9884\u89C8\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5":"\u9884\u89C8\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";this.notification.show(i,"error"),this.hide()}console.error("[Pixiv Preview]",e)}}isCurrent(e,r){return this.activeTarget?.element===e.element&&this.version===r}hide=()=>{window.clearTimeout(this.showTimer),this.activeRequest?.abort(),this.activeRequest=void 0,this.renderedArtwork?.dispose(),this.renderedArtwork=void 0,this.version++,this.activeTarget=void 0,this.artwork=void 0,this.index=0,this.wrap.classList.remove("ppv-preview-visible","ppv-preview-loading","ppv-preview-ready"),this.wrap.querySelector("img")?.remove()}};var E=class{constructor(e){this.cache=e}async load(e,r,t,i){let o=await this.cache.createImage(e.id,r,t);return o?(i({loaded:1,total:1}),{image:o,dispose:()=>{o.src=""}}):this.download(e,r,t,i)}preload(e,r,t){return this.cache.preload(e,r,t,i=>this.getUrl(e,i))}download(e,r,t,i){return new Promise((o,n)=>{let s,a="",l=!1,h=()=>t.removeEventListener("abort",f),p=d=>{l||(l=!0,h(),a&&URL.revokeObjectURL(a),n(d))},f=()=>{s?.abort(),p(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88","AbortError"))};t.addEventListener("abort",f,{once:!0}),s=GM_xmlhttpRequest({method:"GET",url:this.getUrl(e,r),headers:{Referer:"https://www.pixiv.net/"},responseType:"blob",onprogress:d=>{l||i({loaded:d.loaded,total:d.lengthComputable&&d.total>0?d.total:void 0})},onload:d=>{if(t.aborted)return f();if(d.status<200||d.status>=300){p(new Error(`\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${d.status} ${d.statusText}`));return}i({loaded:d.response.size,total:d.response.size}),a=URL.createObjectURL(d.response);let v=new Image;v.alt=e.title,v.onload=()=>{if(t.aborted)return f();l=!0,h(),o({image:v,dispose:()=>{v.src="",URL.revokeObjectURL(a)}})},v.onerror=()=>p(new Error("\u9884\u89C8\u56FE\u7247\u89E3\u7801\u5931\u8D25")),v.src=a},onerror:d=>{p(new Error(`\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${d.status} ${d.statusText}`))},onabort:()=>p(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88","AbortError")),ontimeout:()=>p(new Error("\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u8D85\u65F6"))}),t.aborted&&f()})}getUrl(e,r){return e.urls.regular.replace(/_p0(?=[_.])/,`_p${r}`)}};var C=`
.ppv-preview {
  position: fixed;
  z-index: 2147483646;
  display: none;
  overflow: hidden;
  padding: 0;
  border: 2px solid #0096fa;
  border-radius: 3px;
  background: rgba(0, 150, 250, .1);
  box-shadow: 0 4px 18px rgba(0, 0, 0, .32);
  pointer-events: none;
}
.ppv-preview-visible { display: block; }
.ppv-preview-loading { background: rgba(24, 24, 24, .94); }
.ppv-preview-loading .ppv-preview-info { display: none; }
.ppv-preview-ready .ppv-preview-loading-panel { display: none; }
.ppv-preview-info {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 25px;
  overflow: hidden;
  color: #fff;
  background: #0096fa;
  font-family: Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  white-space: nowrap;
}
.ppv-preview-info span {
  flex: 0 0 auto;
  padding: 0 6px;
  overflow: hidden;
  font-size: 12px;
  line-height: 25px;
  text-overflow: ellipsis;
}
.ppv-preview-info .ppv-preview-title { flex-shrink: 1; }
.ppv-preview img { display: block; width: 100%; height: auto; }
.ppv-preview-loading-panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
  min-height: 68px;
  padding: 12px;
  color: #fff;
  font: 13px/1.4 Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}
.ppv-preview-loading-text {
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ppv-preview-progress-track {
  height: 5px;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(255, 255, 255, .25);
}
.ppv-preview-progress-bar {
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: #29b6f6;
  transition: width .12s linear;
}
.ppv-preview-progress-bar-indeterminate {
  width: 35%;
  animation: ppv-progress 1s ease-in-out infinite;
}
@keyframes ppv-progress {
  from { transform: translateX(-110%); }
  to { transform: translateX(300%); }
}
.ppv-toast-container {
  position: fixed;
  z-index: 2147483647;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.ppv-toast {
  max-width: 360px;
  padding: 10px 14px;
  border-radius: 6px;
  color: #fff;
  background: #333;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .25);
  font: 14px/1.4 Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  opacity: 1;
  transition: opacity .3s, transform .3s;
}
.ppv-toast-info { background: #0096fa; }
.ppv-toast-success { background: #00a878; }
.ppv-toast-error { background: #d64242; }
.ppv-toast-leave { opacity: 0; transform: translateY(-6px); }
`;function P(){let c=document.createElement("style");c.textContent=C,document.head.append(c)}function R(){P();let c=new g,e=new x,r=new b(c,e),t=new k(3);new T(c,new E(t),r,e)}R();})();
