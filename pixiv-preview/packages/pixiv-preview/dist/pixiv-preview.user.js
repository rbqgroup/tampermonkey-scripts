// ==UserScript==
// @name         Pixiv Preview
// @namespace    https://github.com/KagurazakaIris/tampermonkey-scripts
// @version      0.5.0
// @description  悬浮预览 Pixiv 作品，并可通过滚轮切图、B 键收藏和 U 键取消收藏
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      i.pximg.net
// ==/UserScript==
"use strict";(()=>{var u=class extends Error{constructor(t,r){super(t);this.status=r}},b=class{artworkCache=new Map;csrfToken="";async getArtwork(e,t){t?.throwIfAborted();let r=this.artworkCache.get(e);return r||this.refreshArtwork(e,t)}async refreshArtwork(e,t){t?.throwIfAborted();let r=await this.request(`/ajax/illust/${e}?time=${Date.now()}`,{signal:t});if(r.error||!r.body)throw new u(r.message||"\u83B7\u53D6\u4F5C\u54C1\u6570\u636E\u5931\u8D25",200);let o=this.artworkCache.get(e);return o?(Object.assign(o,r.body),o):(this.artworkCache.set(e,r.body),r.body)}async addBookmark(e){await this.sendBookmark(e,!1)}async deleteBookmark(e,t){await this.sendDeleteBookmark(e,t,!1)}async sendBookmark(e,t){let r=await this.getCsrfToken(e.id,t);try{await this.request("/ajax/illusts/bookmarks/add",{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8","x-csrf-token":r},body:JSON.stringify({comment:"",illust_id:e.illustId||e.id,restrict:0,tags:e.tags.tags.map(({tag:o})=>o)})})}catch(o){if(o instanceof u&&o.status===400&&!t){this.csrfToken="",await this.sendBookmark(e,!0);return}throw o}}async sendDeleteBookmark(e,t,r){let o=await this.getCsrfToken(e,r);try{await this.request("/ajax/illusts/bookmarks/delete",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8","x-csrf-token":o},body:new URLSearchParams({bookmark_id:t})})}catch(i){if(i instanceof u&&i.status===400&&!r){this.csrfToken="",await this.sendDeleteBookmark(e,t,!0);return}throw i}}async getCsrfToken(e,t){if(this.csrfToken&&!t)return this.csrfToken;let r=document.querySelector("#__NEXT_DATA__")?.textContent,o=this.extractCsrfToken(r||document.documentElement.innerHTML);if(!o||t){let i=await fetch(`/artworks/${e}`,{credentials:"same-origin",cache:"no-store"});if(!i.ok)throw new u("\u65E0\u6CD5\u5237\u65B0\u6536\u85CF\u51ED\u8BC1",i.status);o=this.extractCsrfToken(await i.text())}if(!o)throw new u("\u9875\u9762\u4E2D\u672A\u627E\u5230\u6536\u85CF\u51ED\u8BC1",0);return this.csrfToken=o,o}extractCsrfToken(e){let t=[/"token":"([a-f\d]{32})"/i,/\\"token\\":\\"([a-f\d]{32})\\"/i,/"postKey":"([a-f\d]{32})"/i,/\\"postKey\\":\\"([a-f\d]{32})\\"/i];for(let r of t){let o=e.match(r)?.[1];if(o)return o}return""}async request(e,t){let r=await fetch(e,{credentials:"same-origin",...t});if(!r.ok)throw new u(`Pixiv \u8BF7\u6C42\u5931\u8D25: HTTP ${r.status}`,r.status);let o=await r.json();if(o.error)throw new u(o.message||"Pixiv \u8BF7\u6C42\u5931\u8D25",r.status);return o}};var k=class{constructor(e,t){this.api=e;this.notification=t}pending=new Set;async add(e,t){if(e.bookmarkData)return this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5DF2\u7ECF\u6536\u85CF","info"),!1;if(this.pending.has(e.id))return this.notification.show("\u6536\u85CF\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D","info"),!1;this.pending.add(e.id),this.notification.show("\u6B63\u5728\u6536\u85CF\u4F5C\u54C1","info");try{return await this.api.addBookmark(e),e.bookmarkData={id:"",private:!1},e.bookmarkCount++,this.syncBookmarkIcon(t),this.notification.show("\u5DF2\u6536\u85CF","success"),!0}catch(r){return this.notification.show(this.getErrorMessage(r),"error"),!1}finally{this.pending.delete(e.id)}}async remove(e,t){if(this.pending.has(e.id))return this.notification.show("\u6536\u85CF\u72B6\u6001\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D","info"),!1;this.pending.add(e.id),this.notification.show("\u6B63\u5728\u68C0\u67E5\u6536\u85CF\u72B6\u6001","info");try{let r=await this.api.refreshArtwork(e.id),o=r.bookmarkData?.id;return o?(await this.api.deleteBookmark(e.id,o),r.bookmarkData=null,r.bookmarkCount=Math.max(0,r.bookmarkCount-1),this.syncUnbookmarkIcon(t),this.notification.show("\u5DF2\u53D6\u6D88\u6536\u85CF","success"),!0):(this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5C1A\u672A\u6536\u85CF","info"),!1)}catch(r){return this.notification.show(this.getErrorMessage(r,"\u53D6\u6D88\u6536\u85CF"),"error"),!1}finally{this.pending.delete(e.id)}}syncBookmarkIcon(e){if(!e)return;let t=this.findBookmarkSvg(e);if(t&&getComputedStyle(t).color!=="rgb(255, 64, 96)"){t.style.color="rgb(255, 64, 96)";for(let o of t.querySelectorAll("path"))o.style.fill="currentcolor"}let r=e.querySelector("._one-click-bookmark");r?.classList.contains("on")||r?.classList.add("on")}syncUnbookmarkIcon(e){if(!e)return;let t=this.findBookmarkSvg(e);if(t){t.style.color="inherit";for(let r of t.querySelectorAll("path"))r.style.fill="none"}e.querySelector("._one-click-bookmark")?.classList.remove("on")}findBookmarkSvg(e){return(e.querySelector('button[data-ga4-label="bookmark_button"]')||e.querySelector('button svg[width="32"]')?.closest("button"))?.querySelector("svg")||void 0}getErrorMessage(e,t="\u6536\u85CF"){if(!(e instanceof u))return`${t}\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5`;switch(e.status){case 401:return`${t}\u5931\u8D25\uFF0C\u8BF7\u5148\u767B\u5F55 Pixiv`;case 403:return`${t}\u5931\u8D25\uFF0C\u8D26\u53F7\u5F53\u524D\u65E0\u6743\u6267\u884C\u6B64\u64CD\u4F5C`;case 429:return`${t}\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5`;default:return`${t}\u5931\u8D25\uFF1A${e.message}`}}};async function S(a,e,t,r){let o=0,i=async()=>{for(;!r.aborted&&o<a.length;){let n=a[o++];try{await t(n)}catch{}}},s=Math.min(Math.max(1,Math.floor(e)),a.length);await Promise.all(Array.from({length:s},i))}var y=class{works=new Map;maxWorks;preloadTask;constructor(e=3){this.maxWorks=e}async createImage(e,t,r){let o=this.works.get(e);if(!o)return;this.touch(e,o);let i=o.images.get(t),s=o.inFlight.get(t);if(!i&&s&&(i=await this.waitForImage(s,r)),!i||this.works.get(e)!==o)return;r.throwIfAborted();let n=new Image;return n.alt=i.alt,n.fetchPriority="high",this.loadImage(n,i.currentSrc||i.src,r,!0)}preload(e,t,r,o){if(this.preloadTask?.artworkId===e.id)return this.preloadTask.promise;this.cancelPreload();let i=this.getOrCreate(e.id),s=Array.from({length:e.pageCount},(p,c)=>c).filter(p=>p!==t).filter(p=>!i.images.has(p)),n=new AbortController,l={artworkId:e.id,controller:n,promise:Promise.resolve()};return l.promise=S(s,o,p=>this.preloadImage(e,p,r(p),i,n.signal),n.signal).finally(()=>{this.preloadTask===l&&(this.preloadTask=void 0)}),this.preloadTask=l,l.promise}cancelPreload(){this.preloadTask?.controller.abort(),this.preloadTask=void 0}setMaxWorks(e){this.maxWorks=e,this.evictOldest()}clear(){this.cancelPreload();for(let e of this.works.values())this.release(e);this.works.clear()}async preloadImage(e,t,r,o,i){if(o.images.has(t)||o.inFlight.has(t))return;let s=new Image;s.alt=e.title,s.decoding="async",s.fetchPriority="low";let n=this.loadImage(s,r,i,!1);o.inFlight.set(t,n);let l=await n;o.inFlight.get(t)===n&&o.inFlight.delete(t),!(!l||i.aborted)&&this.works.get(e.id)===o&&o.images.set(t,l)}waitForImage(e,t){return t.throwIfAborted(),new Promise((r,o)=>{let i=()=>{s(),o(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88","AbortError"))},s=()=>t.removeEventListener("abort",i);t.addEventListener("abort",i,{once:!0}),e.then(n=>{s(),r(n)},n=>{s(),o(n)})})}getOrCreate(e){let t=this.works.get(e)||{images:new Map,inFlight:new Map};return this.touch(e,t),t}touch(e,t){this.works.delete(e),this.works.set(e,t),this.evictOldest()}evictOldest(){for(;this.works.size>this.maxWorks;){let e=this.works.keys().next().value;if(!e)return;this.preloadTask?.artworkId===e&&this.cancelPreload();let t=this.works.get(e);this.works.delete(e),t&&this.release(t)}}release(e){for(let t of e.images.values())t.src="";e.images.clear(),e.inFlight.clear()}loadImage(e,t,r,o){return new Promise((i,s)=>{let n=!1,l=(c,h)=>{n||(n=!0,r.removeEventListener("abort",p),e.onload=null,e.onerror=null,h?s(h):i(c))},p=()=>{e.src="";let c=o?new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88","AbortError"):void 0;l(void 0,c)};r.addEventListener("abort",p,{once:!0}),e.onload=()=>l(e),e.onerror=()=>l(),e.src=t,e.complete&&e.naturalWidth>0&&l(e),r.aborted&&p()})}};var x=class{container=document.createElement("div");constructor(){this.container.className="ppv-toast-container",document.body.append(this.container)}show(e,t){let r=document.createElement("div");r.className=`ppv-toast ppv-toast-${t}`,r.textContent=e,this.container.append(r),window.setTimeout(()=>r.classList.add("ppv-toast-leave"),2200),window.setTimeout(()=>r.remove(),2500)}};var T=class{find(e){if(!(e instanceof Element))return;let t=e.closest('a[href*="/artworks/"]');if(!t||!t.querySelector("img"))return;let r=new URL(t.href,location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1];if(r)return{id:r,element:t,cardElement:this.findCardElement(t,r)}}findCardElement(e,t){let r=e.parentElement;for(;r&&r!==document.body;){let o=new Set([...r.querySelectorAll('a[href*="/artworks/"]')].map(i=>this.getArtworkId(i.href)).filter(i=>!!i));if(o.size>1||!o.has(t))return;if(r.querySelector("button svg")||r.querySelector("._one-click-bookmark"))return r;r=r.parentElement}}getArtworkId(e){return new URL(e,location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1]}};var H=100,M=25,g=8,w=6,E=class{constructor(e,t,r,o,i){this.api=e;this.renderer=t;this.bookmarkController=r;this.notification=o;this.settings=i;this.wrap.className="ppv-preview",this.info.className="ppv-preview-info",this.loadingPanel.className="ppv-preview-loading-panel",this.loadingText.className="ppv-preview-loading-text",this.progressTrack.className="ppv-preview-progress-track",this.progressBar.className="ppv-preview-progress-bar ppv-preview-progress-bar-indeterminate",this.progressTrack.append(this.progressBar),this.loadingPanel.append(this.loadingText,this.progressTrack),this.wrap.append(this.info,this.loadingPanel),document.body.append(this.wrap),this.bindEvents()}wrap=document.createElement("div");info=document.createElement("div");loadingPanel=document.createElement("div");loadingText=document.createElement("div");progressTrack=document.createElement("div");progressBar=document.createElement("div");locator=new T;activeTarget;artwork;activeRequest;renderedArtwork;index=0;showTimer;version=0;lastWheelTime=0;currentUrl=location.href;routeObserver=new MutationObserver(()=>{location.href!==this.currentUrl&&(this.currentUrl=location.href,this.hide())});bindEvents(){document.addEventListener("pointerover",this.onPointerOver,!0),document.addEventListener("pointerout",this.onPointerOut,!0),window.addEventListener("wheel",this.onWheel,{capture:!0,passive:!1}),window.addEventListener("keydown",this.onKeyDown,!0),window.addEventListener("scroll",this.hide,!0),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide),window.addEventListener("popstate",this.hide),this.routeObserver.observe(document.body,{childList:!0,subtree:!0})}onPointerOver=e=>{let t=this.locator.find(e.target);if(!t||this.activeTarget?.element===t.element)return;this.hide(),this.activeTarget=t;let r=++this.version;this.showTimer=window.setTimeout(()=>{this.show(t,r)},this.settings.value.showDelay)};onPointerOut=e=>{this.activeTarget&&(e.target instanceof Node&&!this.activeTarget.element.contains(e.target)||e.relatedTarget instanceof Node&&this.activeTarget.element.contains(e.relatedTarget)||this.hide())};async show(e,t){let r=this.startRequest();this.showLoading(e.element,"\u6B63\u5728\u83B7\u53D6\u4F5C\u54C1\u4FE1\u606F");try{let o=await this.api.getArtwork(e.id,r.signal);if(!this.isCurrent(e,t))return;this.artwork=o,o.bookmarkData&&this.bookmarkController.syncBookmarkIcon(e.cardElement),this.index=0,this.showLoading(e.element,"\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90"),await this.render(t,r.signal)}catch(o){this.handlePreviewError(o,e,t)}}async render(e,t){let r=this.artwork,o=this.activeTarget;if(!r||!o)return;let i=this.index,s=await this.renderer.load(r,i,t,l=>{this.isCurrent(o,e)&&this.index===i&&this.updateLoadingProgress(l)});if(!this.isCurrent(o,e)||this.index!==i){s.dispose();return}this.renderedArtwork=s;let n=s.image;this.wrap.querySelector("img")?.remove(),this.updateInfo(r,n),this.sizeAndPosition(n,o.element),this.wrap.append(n),this.wrap.classList.remove("ppv-preview-loading"),this.wrap.classList.add("ppv-preview-visible","ppv-preview-ready"),this.renderer.preload(r,i)}showLoading(e,t){this.loadingText.textContent=t,this.progressBar.style.width="",this.progressBar.classList.add("ppv-preview-progress-bar-indeterminate"),this.positionWrap(e,220,68),this.wrap.classList.remove("ppv-preview-ready"),this.wrap.classList.add("ppv-preview-visible","ppv-preview-loading")}updateLoadingProgress(e){if(e.total){let t=Math.min(100,Math.round(e.loaded/e.total*100));this.loadingText.textContent=`${this.formatBytes(e.loaded)} / ${this.formatBytes(e.total)} (${t}%)`,this.progressBar.classList.remove("ppv-preview-progress-bar-indeterminate"),this.progressBar.style.width=`${t}%`;return}this.loadingText.textContent=`\u5DF2\u52A0\u8F7D ${this.formatBytes(e.loaded)}`}formatBytes(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(1)} MB`}updateInfo(e,t){this.info.replaceChildren();let r=[e.pageCount>1?`${this.index+1}/${e.pageCount}`:"",`\u6536\u85CF ${e.bookmarkCount}`,`${t.naturalWidth}\xD7${t.naturalHeight}`,e.title];r.forEach((o,i)=>{if(!o)return;let s=document.createElement("span");s.textContent=o,i===r.length-1&&(s.className="ppv-preview-title"),this.info.append(s)})}sizeAndPosition(e,t){let r=t.getBoundingClientRect(),o=r.left-w-g,i=window.innerWidth-r.right-w-g,s=o>=i,n=Math.max(1,s?o:i),l=window.innerHeight-g*2-M,p=Math.min(1,n/e.naturalWidth,l/e.naturalHeight),c=Math.max(1,Math.floor(e.naturalWidth*p)),h=Math.max(1,Math.floor(e.naturalHeight*p));this.positionWrap(t,c,h+M,s),e.style.height=`${h}px`}positionWrap(e,t,r,o){let i=e.getBoundingClientRect(),s=i.left-w-g,n=window.innerWidth-i.right-w-g,l=o??s>=n,p=Math.max(1,l?s:n),c=Math.min(t,Math.max(120,p)),h=l?i.left-w-c:i.right+w,f=Math.min(Math.max(g,h),window.innerWidth-c-g),d=i.top+i.height/2-r/2,v=Math.min(Math.max(g,d),window.innerHeight-r-g);this.wrap.style.width=`${Math.round(c)}px`,this.wrap.style.left=`${Math.round(f)}px`,this.wrap.style.top=`${Math.round(v)}px`}onWheel=e=>{if(!this.artwork||!this.activeTarget||this.artwork.pageCount<=1||!this.wrap.classList.contains("ppv-preview-visible")||!(e.target instanceof Node)||!this.activeTarget.element.contains(e.target))return;e.preventDefault(),e.stopPropagation();let t=performance.now();if(t-this.lastWheelTime<H)return;this.lastWheelTime=t;let r=this.artwork.pageCount;this.index=(this.index+(e.deltaY<0?-1:1)+r)%r;let o=this.activeTarget,i=++this.version,s=this.startRequest();this.showLoading(o.element,"\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90"),this.render(i,s.signal).catch(n=>{this.handlePreviewError(n,o,i)})};onKeyDown=e=>{if(!this.artwork||!this.wrap.classList.contains("ppv-preview-visible")||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey)return;if(e.code==="Escape"){e.preventDefault(),e.stopPropagation(),this.hide();return}if(e.code!=="KeyB"&&e.code!=="KeyU"||e.repeat)return;e.preventDefault(),e.stopPropagation();let t=document.activeElement;t instanceof HTMLElement&&t.blur();let r=this.artwork,o=this.activeTarget?.cardElement;(e.code==="KeyB"?this.bookmarkController.add(r,o):this.bookmarkController.remove(r,o)).then(()=>{let s=this.wrap.querySelector("img");this.artwork===r&&s&&this.updateInfo(r,s)})};startRequest(){this.activeRequest?.abort(),this.renderedArtwork?.dispose(),this.renderedArtwork=void 0,this.wrap.querySelector("img")?.remove();let e=new AbortController;return this.activeRequest=e,e}handlePreviewError(e,t,r){if(!(e instanceof DOMException&&e.name==="AbortError")){if(this.isCurrent(t,r)){let o=e instanceof u&&e.status===429?"\u9884\u89C8\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5":"\u9884\u89C8\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";this.notification.show(o,"error"),this.hide()}console.error("[Pixiv Preview]",e)}}isCurrent(e,t){return this.activeTarget?.element===e.element&&this.version===t}hide=()=>{window.clearTimeout(this.showTimer),this.activeRequest?.abort(),this.renderer.cancelPreload(),this.activeRequest=void 0,this.renderedArtwork?.dispose(),this.renderedArtwork=void 0,this.version++,this.activeTarget=void 0,this.artwork=void 0,this.index=0,this.wrap.classList.remove("ppv-preview-visible","ppv-preview-loading","ppv-preview-ready"),this.wrap.querySelector("img")?.remove()}};function C(a,e,t){return a.urls[t].replace(/_p0(?=[_.])/,`_p${e}`)}var P=class{constructor(e,t){this.cache=e;this.settings=t}async load(e,t,r,o){let i=await this.cache.createImage(e.id,t,r);return i?(o({loaded:1,total:1}),{image:i,dispose:()=>{i.src=""}}):this.download(e,t,r,o)}preload(e,t){return this.settings.value.preloadEnabled?this.cache.preload(e,t,r=>this.getUrl(e,r),this.settings.value.preloadWorkers):Promise.resolve()}cancelPreload(){this.cache.cancelPreload()}download(e,t,r,o){return new Promise((i,s)=>{let n,l="",p=!1,c=()=>r.removeEventListener("abort",f),h=d=>{p||(p=!0,c(),l&&URL.revokeObjectURL(l),s(d))},f=()=>{n?.abort(),h(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88","AbortError"))};r.addEventListener("abort",f,{once:!0}),n=GM_xmlhttpRequest({method:"GET",url:this.getUrl(e,t),headers:{Referer:"https://www.pixiv.net/"},responseType:"blob",onprogress:d=>{p||o({loaded:d.loaded,total:d.lengthComputable&&d.total>0?d.total:void 0})},onload:d=>{if(r.aborted)return f();if(d.status<200||d.status>=300){h(new Error(`\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${d.status} ${d.statusText}`));return}o({loaded:d.response.size,total:d.response.size}),l=URL.createObjectURL(d.response);let v=new Image;v.alt=e.title,v.onload=()=>{if(r.aborted)return f();p=!0,c(),i({image:v,dispose:()=>{v.src="",URL.revokeObjectURL(l)}})},v.onerror=()=>h(new Error("\u9884\u89C8\u56FE\u7247\u89E3\u7801\u5931\u8D25")),v.src=l},onerror:d=>{h(new Error(`\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${d.status} ${d.statusText}`))},onabort:()=>h(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88","AbortError")),ontimeout:()=>h(new Error("\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u8D85\u65F6"))}),r.aborted&&f()})}getUrl(e,t){return C(e,t,this.settings.value.imageQuality)}};var m={preloadEnabled:!0,preloadWorkers:4,cacheWorks:3,showDelay:400,imageQuality:"regular"},A=class{settings;listeners=new Set;storage;constructor(e){this.storage=e;try{this.settings=I(e.get())}catch{this.settings={...m}}}get value(){return this.settings}save(e){this.settings=I(e),this.storage.set(this.settings);for(let t of this.listeners)t(this.settings)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}};function I(a){let e=typeof a=="object"&&a!==null?a:{},t=e.preloadWorkers,r=e.cacheWorks,o=e.showDelay;return{preloadEnabled:typeof e.preloadEnabled=="boolean"?e.preloadEnabled:m.preloadEnabled,preloadWorkers:Number.isInteger(t)&&Number(t)>=1&&Number(t)<=8?Number(t):m.preloadWorkers,cacheWorks:Number.isInteger(r)&&Number(r)>=1&&Number(r)<=10?Number(r):m.cacheWorks,showDelay:Number.isInteger(o)&&Number(o)>=0&&Number(o)<=2e3?Number(o):m.showDelay,imageQuality:e.imageQuality==="original"||e.imageQuality==="regular"?e.imageQuality:m.imageQuality}}var L=class{constructor(e,t){this.store=e;this.notification=t;this.root.className="ppv-settings-backdrop",this.root.innerHTML=`
      <div class="ppv-settings-panel" role="dialog" aria-modal="true" aria-labelledby="ppv-settings-title">
        <div class="ppv-settings-header">
          <strong id="ppv-settings-title">Pixiv Preview \u8BBE\u7F6E</strong>
          <button type="button" class="ppv-settings-close" aria-label="\u5173\u95ED">\xD7</button>
        </div>
        <div class="ppv-settings-fields"></div>
        <div class="ppv-settings-actions">
          <button type="button" class="ppv-settings-defaults">\u6062\u590D\u9ED8\u8BA4\u503C</button>
          <button type="submit" class="ppv-settings-save">\u4FDD\u5B58</button>
        </div>
      </div>`,this.form.className="ppv-settings-form";let r=this.root.firstElementChild;r.querySelector(".ppv-settings-fields").append(this.createCheckbox("preloadEnabled","\u542F\u7528\u540E\u53F0\u9884\u52A0\u8F7D"),this.createNumber("preloadWorkers","\u9884\u52A0\u8F7D worker \u6570",1,8),this.createNumber("cacheWorks","\u7F13\u5B58\u4F5C\u54C1\u6570",1,10),this.createNumber("showDelay","\u60AC\u6D6E\u5EF6\u8FDF\uFF08\u6BEB\u79D2\uFF09",0,2e3),this.createQuality()),this.form.append(...r.childNodes),r.append(this.form),document.body.append(this.root),this.bindEvents(),GM_registerMenuCommand("Pixiv Preview \u8BBE\u7F6E",this.open)}root=document.createElement("div");form=document.createElement("form");createCheckbox(e,t){let r=document.createElement("label");r.className="ppv-settings-row ppv-settings-checkbox-row";let o=document.createElement("input");return o.type="checkbox",o.name=e,r.append(o,t),r}createNumber(e,t,r,o){let i=document.createElement("label");i.className="ppv-settings-row";let s=document.createElement("span");s.textContent=t;let n=document.createElement("input");return n.type="number",n.name=e,n.min=String(r),n.max=String(o),n.step="1",n.required=!0,i.append(s,n),i}createQuality(){let e=document.createElement("label");e.className="ppv-settings-row";let t=document.createElement("span");t.textContent="\u56FE\u7247\u6E05\u6670\u5EA6";let r=document.createElement("select");return r.name="imageQuality",r.innerHTML=`
      <option value="regular">\u6807\u51C6\uFF08regular\uFF09</option>
      <option value="original">\u539F\u56FE\uFF08original\uFF09</option>`,e.append(t,r),e}bindEvents(){this.root.addEventListener("click",e=>{(e.target===this.root||e.target instanceof Element&&e.target.closest(".ppv-settings-close"))&&this.close()}),this.root.querySelector(".ppv-settings-defaults")?.addEventListener("click",()=>this.fill(m)),this.form.addEventListener("submit",e=>{e.preventDefault(),this.form.reportValidity()&&(this.store.save(this.read()),this.notification.show("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58","success"),this.close())}),window.addEventListener("keydown",e=>{e.code==="Escape"&&this.root.classList.contains("is-open")&&(e.preventDefault(),e.stopPropagation(),this.close())},!0)}read(){let e=new FormData(this.form);return{preloadEnabled:e.get("preloadEnabled")==="on",preloadWorkers:Number(e.get("preloadWorkers")),cacheWorks:Number(e.get("cacheWorks")),showDelay:Number(e.get("showDelay")),imageQuality:e.get("imageQuality")==="original"?"original":"regular"}}fill(e){let t=r=>this.form.elements.namedItem(r);t("preloadEnabled").checked=e.preloadEnabled,t("preloadWorkers").value=String(e.preloadWorkers),t("cacheWorks").value=String(e.cacheWorks),t("showDelay").value=String(e.showDelay),t("imageQuality").value=e.imageQuality}open=()=>{this.fill(this.store.value),this.root.classList.add("is-open"),this.form.elements.namedItem("preloadWorkers").focus()};close(){this.root.classList.remove("is-open")}};var R=`
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
.ppv-settings-backdrop {
  position: fixed;
  z-index: 2147483647;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .55);
  font-family: Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}
.ppv-settings-backdrop.is-open { display: flex; }
.ppv-settings-panel {
  box-sizing: border-box;
  width: min(420px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid #4a4a4a;
  border-radius: 10px;
  color: #f4f4f4;
  background: #242424;
  box-shadow: 0 16px 50px rgba(0, 0, 0, .45);
}
.ppv-settings-form { display: contents; }
.ppv-settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #3d3d3d;
  font-size: 17px;
}
.ppv-settings-close {
  padding: 2px 8px;
  border: 0;
  color: #bbb;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}
.ppv-settings-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}
.ppv-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #ddd;
  font-size: 14px;
}
.ppv-settings-checkbox-row { justify-content: flex-start; }
.ppv-settings-row input[type="number"],
.ppv-settings-row select {
  box-sizing: border-box;
  width: 150px;
  padding: 7px 9px;
  border: 1px solid #555;
  border-radius: 5px;
  color: #fff;
  background: #181818;
  font: inherit;
}
.ppv-settings-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #0096fa;
}
.ppv-settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #3d3d3d;
}
.ppv-settings-actions button {
  padding: 8px 14px;
  border: 0;
  border-radius: 5px;
  color: #eee;
  background: #484848;
  font: 14px/1.2 inherit;
  cursor: pointer;
}
.ppv-settings-actions .ppv-settings-save {
  color: #fff;
  background: #0096fa;
}
`;function W(){let a=document.createElement("style");a.textContent=R,document.head.append(a)}var N="pixivPreviewSettings";function B(){W();let a=new b,e=new x,t=new A({get:()=>GM_getValue(N,m),set:n=>GM_setValue(N,n)}),r=new k(a,e),o=new y(t.value.cacheWorks),i=new P(o,t),s=t.value;t.subscribe(n=>{o.setMaxWorks(n.cacheWorks),n.imageQuality!==s.imageQuality?o.clear():n.preloadEnabled||o.cancelPreload(),s=n}),new L(t,e),new E(a,i,r,e,t)}B();})();
