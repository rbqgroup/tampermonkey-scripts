// ==UserScript==
// @name         Pixiv Preview
// @namespace    https://github.com/KagurazakaIris/tampermonkey-scripts
// @version      0.1.0
// @description  悬浮预览 Pixiv 作品，并可通过滚轮切图和 B 键收藏
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
"use strict";(()=>{var s=class extends Error{constructor(e,r){super(e);this.status=r}},c=class{artworkCache=new Map;csrfToken="";async getArtwork(t){let e=this.artworkCache.get(t);if(e)return e;let r=await this.request(`/ajax/illust/${t}?time=${Date.now()}`);if(r.error||!r.body)throw new s(r.message||"\u83B7\u53D6\u4F5C\u54C1\u6570\u636E\u5931\u8D25",200);return this.artworkCache.set(t,r.body),r.body}async addBookmark(t){await this.sendBookmark(t,!1)}async sendBookmark(t,e){let r=await this.getCsrfToken(t.id,e);try{await this.request("/ajax/illusts/bookmarks/add",{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8","x-csrf-token":r},body:JSON.stringify({comment:"",illust_id:t.illustId||t.id,restrict:0,tags:t.tags.tags.map(({tag:i})=>i)})})}catch(i){if(i instanceof s&&i.status===400&&!e){this.csrfToken="",await this.sendBookmark(t,!0);return}throw i}}async getCsrfToken(t,e){if(this.csrfToken&&!e)return this.csrfToken;let r=document.querySelector("#__NEXT_DATA__")?.textContent,i=this.extractCsrfToken(r||document.documentElement.innerHTML);if(!i||e){let o=await fetch(`/artworks/${t}`,{credentials:"same-origin",cache:"no-store"});if(!o.ok)throw new s("\u65E0\u6CD5\u5237\u65B0\u6536\u85CF\u51ED\u8BC1",o.status);i=this.extractCsrfToken(await o.text())}if(!i)throw new s("\u9875\u9762\u4E2D\u672A\u627E\u5230\u6536\u85CF\u51ED\u8BC1",0);return this.csrfToken=i,i}extractCsrfToken(t){let e=[/"token":"([a-f\d]{32})"/i,/\\"token\\":\\"([a-f\d]{32})\\"/i,/"postKey":"([a-f\d]{32})"/i,/\\"postKey\\":\\"([a-f\d]{32})\\"/i];for(let r of e){let i=t.match(r)?.[1];if(i)return i}return""}async request(t,e){let r=await fetch(t,{credentials:"same-origin",...e});if(!r.ok)throw new s(`Pixiv \u8BF7\u6C42\u5931\u8D25: HTTP ${r.status}`,r.status);let i=await r.json();if(i.error)throw new s(i.message||"Pixiv \u8BF7\u6C42\u5931\u8D25",r.status);return i}};var d=class{constructor(t,e){this.api=t;this.notification=e}pending=new Set;async add(t){if(t.bookmarkData)return this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5DF2\u7ECF\u6536\u85CF","info"),!1;if(this.pending.has(t.id))return this.notification.show("\u6536\u85CF\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D","info"),!1;this.pending.add(t.id),this.notification.show("\u6B63\u5728\u6536\u85CF\u4F5C\u54C1","info");try{return await this.api.addBookmark(t),t.bookmarkData={id:"",private:!1},t.bookmarkCount++,this.notification.show("\u5DF2\u6536\u85CF","success"),!0}catch(e){return this.notification.show(this.getErrorMessage(e),"error"),!1}finally{this.pending.delete(t.id)}}getErrorMessage(t){if(!(t instanceof s))return"\u6536\u85CF\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5";switch(t.status){case 401:return"\u6536\u85CF\u5931\u8D25\uFF0C\u8BF7\u5148\u767B\u5F55 Pixiv";case 403:return"\u6536\u85CF\u5931\u8D25\uFF0C\u8D26\u53F7\u5F53\u524D\u65E0\u6743\u6267\u884C\u6B64\u64CD\u4F5C";case 429:return"\u6536\u85CF\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";default:return`\u6536\u85CF\u5931\u8D25\uFF1A${t.message}`}}};var l=class{container=document.createElement("div");constructor(){this.container.className="ppv-toast-container",document.body.append(this.container)}show(t,e){let r=document.createElement("div");r.className=`ppv-toast ppv-toast-${e}`,r.textContent=t,this.container.append(r),window.setTimeout(()=>r.classList.add("ppv-toast-leave"),2200),window.setTimeout(()=>r.remove(),2500)}};var h=class{find(t){if(!(t instanceof Element))return;let e=t.closest('a[href*="/artworks/"]');if(!e||!e.querySelector("img"))return;let r=new URL(e.href,location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1];if(r)return{id:r,element:e}}};var P=400,C=100,v=25,p=8,u=6,m=class{constructor(t,e,r,i){this.api=t;this.renderer=e;this.bookmarkController=r;this.notification=i;this.wrap.className="ppv-preview",this.info.className="ppv-preview-info",this.wrap.append(this.info),document.body.append(this.wrap),this.bindEvents()}wrap=document.createElement("div");info=document.createElement("div");locator=new h;activeTarget;artwork;index=0;showTimer;version=0;lastWheelTime=0;currentUrl=location.href;routeObserver=new MutationObserver(()=>{location.href!==this.currentUrl&&(this.currentUrl=location.href,this.hide())});bindEvents(){document.addEventListener("pointerover",this.onPointerOver,!0),document.addEventListener("pointerout",this.onPointerOut,!0),document.addEventListener("wheel",this.onWheel,{capture:!0,passive:!1}),window.addEventListener("keydown",this.onKeyDown,!0),window.addEventListener("scroll",this.hide,!0),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide),window.addEventListener("popstate",this.hide),this.routeObserver.observe(document.body,{childList:!0,subtree:!0})}onPointerOver=t=>{let e=this.locator.find(t.target);if(!e||this.activeTarget?.element===e.element)return;this.hide(),this.activeTarget=e;let r=++this.version;this.showTimer=window.setTimeout(()=>{this.show(e,r)},P)};onPointerOut=t=>{this.activeTarget&&(t.target instanceof Node&&!this.activeTarget.element.contains(t.target)||t.relatedTarget instanceof Node&&this.activeTarget.element.contains(t.relatedTarget)||this.hide())};async show(t,e){try{let r=await this.api.getArtwork(t.id);if(!this.isCurrent(t,e))return;this.artwork=r,this.index=0,await this.render(e)}catch(r){if(this.isCurrent(t,e)){let i=r instanceof s&&r.status===429?"\u9884\u89C8\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5":"\u9884\u89C8\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";this.notification.show(i,"error"),this.hide()}console.error("[Pixiv Preview]",r)}}async render(t){let e=this.artwork,r=this.activeTarget;if(!e||!r)return;let i=this.index,o=await this.renderer.load(e,i);if(!this.isCurrent(r,t)||this.index!==i){o.src="";return}this.wrap.querySelector("img")?.remove(),this.updateInfo(e,o),this.sizeAndPosition(o,r.element),this.wrap.append(o),this.wrap.classList.add("ppv-preview-visible"),this.preloadNext(e,i)}updateInfo(t,e){this.info.replaceChildren();let r=[t.pageCount>1?`${this.index+1}/${t.pageCount}`:"",`\u6536\u85CF ${t.bookmarkCount}`,`${e.naturalWidth}\xD7${e.naturalHeight}`,t.title];r.forEach((i,o)=>{if(!i)return;let a=document.createElement("span");a.textContent=i,o===r.length-1&&(a.className="ppv-preview-title"),this.info.append(a)})}sizeAndPosition(t,e){let r=e.getBoundingClientRect(),i=r.left-u-p,o=window.innerWidth-r.right-u-p,a=i>=o,y=Math.max(1,a?i:o),b=window.innerHeight-p*2-v,g=Math.min(1,y/t.naturalWidth,b/t.naturalHeight),k=Math.max(1,Math.floor(t.naturalWidth*g)),w=Math.max(1,Math.floor(t.naturalHeight*g)),T=a?r.left-u-k:r.right+u,E=r.top+r.height/2-(w+v)/2,A=Math.min(Math.max(p,E),window.innerHeight-w-v-p);this.wrap.style.width=`${k}px`,this.wrap.style.left=`${Math.round(T)}px`,this.wrap.style.top=`${Math.round(A)}px`,t.style.height=`${w}px`}onWheel=t=>{if(!this.artwork||!this.activeTarget||this.artwork.pageCount<=1||!this.wrap.classList.contains("ppv-preview-visible")||!(t.target instanceof Node)||!this.activeTarget.element.contains(t.target))return;t.preventDefault(),t.stopPropagation();let e=performance.now();if(e-this.lastWheelTime<C)return;this.lastWheelTime=e;let r=this.artwork.pageCount;this.index=(this.index+(t.deltaY<0?-1:1)+r)%r,this.render(++this.version).catch(i=>{console.error("[Pixiv Preview]",i)})};onKeyDown=t=>{if(!this.artwork||!this.wrap.classList.contains("ppv-preview-visible")||t.ctrlKey||t.shiftKey||t.altKey||t.metaKey)return;if(t.code==="Escape"){t.preventDefault(),t.stopPropagation(),this.hide();return}if(t.code!=="KeyB"||t.repeat)return;t.preventDefault(),t.stopPropagation();let e=document.activeElement;e instanceof HTMLElement&&e.blur();let r=this.artwork;this.bookmarkController.add(r).then(i=>{let o=this.wrap.querySelector("img");i&&this.artwork===r&&o&&this.updateInfo(r,o)})};preloadNext(t,e){if(e+1>=t.pageCount)return;let r=new Image;r.src=this.renderer.getUrl(t,e+1)}isCurrent(t,e){return this.activeTarget?.element===t.element&&this.version===e}hide=()=>{window.clearTimeout(this.showTimer),this.version++,this.activeTarget=void 0,this.artwork=void 0,this.index=0,this.wrap.classList.remove("ppv-preview-visible");let t=this.wrap.querySelector("img");t&&(t.src=""),t?.remove()}};var f=class{load(t,e){return new Promise((r,i)=>{let o=new Image;o.alt=t.title,o.onload=()=>r(o),o.onerror=()=>i(new Error("\u9884\u89C8\u56FE\u7247\u52A0\u8F7D\u5931\u8D25")),o.src=this.getUrl(t,e)})}getUrl(t,e){return t.urls.regular.replace(/_p0(?=[_.])/,`_p${e}`)}};var L=`
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
`;function x(){let n=document.createElement("style");n.textContent=L,document.head.append(n)}function M(){x();let n=new c,t=new l,e=new d(n,t);new m(n,new f,e,t)}M();})();
