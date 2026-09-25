// ==UserScript==
// @name         Pixiv Preview
// @namespace    https://github.com/KagurazakaIris/tampermonkey-scripts
// @version      0.6.0
// @description  悬浮预览 Pixiv 作品，并可通过滚轮切图、B 键收藏和 U 键取消收藏
// @license      MIT
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      i.pximg.net
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.18.2/dist/zip-native.min.js
// ==/UserScript==
"use strict";
(() => {
  // src/api.ts
  var PixivApiError = class extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  };
  var PixivApi = class {
    artworkCache = /* @__PURE__ */ new Map();
    csrfToken = "";
    /** 获取作品数据；失败的请求不会写入缓存。 */
    async getArtwork(id, signal) {
      signal?.throwIfAborted();
      const cached = this.artworkCache.get(id);
      if (cached) return cached;
      return this.refreshArtwork(id, signal);
    }
    /** 绕过缓存获取最新作品数据，并保持已有缓存对象的引用不变。 */
    async refreshArtwork(id, signal) {
      signal?.throwIfAborted();
      const data = await this.request(
        `/ajax/illust/${id}?time=${Date.now()}`,
        { signal }
      );
      if (data.error || !data.body) {
        throw new PixivApiError(data.message || "\u83B7\u53D6\u4F5C\u54C1\u6570\u636E\u5931\u8D25", 200);
      }
      const cached = this.artworkCache.get(id);
      if (cached) {
        Object.assign(cached, data.body);
        return cached;
      }
      this.artworkCache.set(id, data.body);
      return data.body;
    }
    /** 获取 Ugoira 压缩包地址和逐帧延迟。 */
    async getUgoiraMetadata(id, signal) {
      const data = await this.request(
        `/ajax/illust/${id}/ugoira_meta`,
        { signal }
      );
      if (data.error || !data.body) {
        throw new PixivApiError(data.message || "\u83B7\u53D6\u52A8\u56FE\u6570\u636E\u5931\u8D25", 200);
      }
      return data.body;
    }
    /** 将作品公开收藏并附带原始标签。 */
    async addBookmark(artwork) {
      await this.sendBookmark(artwork, false);
    }
    /** 使用收藏记录 ID 取消收藏。 */
    async deleteBookmark(artworkId, bookmarkId) {
      await this.sendDeleteBookmark(artworkId, bookmarkId, false);
    }
    /** 发送收藏请求；token 失效时只刷新并重试一次。 */
    async sendBookmark(artwork, tokenRefreshed) {
      const token = await this.getCsrfToken(artwork.id, tokenRefreshed);
      try {
        await this.request("/ajax/illusts/bookmarks/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-csrf-token": token
          },
          body: JSON.stringify({
            comment: "",
            illust_id: artwork.illustId || artwork.id,
            restrict: 0,
            tags: artwork.tags.tags.map(({ tag }) => tag)
          })
        });
      } catch (error) {
        if (error instanceof PixivApiError && error.status === 400 && !tokenRefreshed) {
          this.csrfToken = "";
          await this.sendBookmark(artwork, true);
          return;
        }
        throw error;
      }
    }
    /** 发送取消收藏请求；token 失效时只刷新并重试一次。 */
    async sendDeleteBookmark(artworkId, bookmarkId, tokenRefreshed) {
      const token = await this.getCsrfToken(artworkId, tokenRefreshed);
      try {
        await this.request(
          "/ajax/illusts/bookmarks/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
              "x-csrf-token": token
            },
            body: new URLSearchParams({ bookmark_id: bookmarkId })
          }
        );
      } catch (error) {
        if (error instanceof PixivApiError && error.status === 400 && !tokenRefreshed) {
          this.csrfToken = "";
          await this.sendDeleteBookmark(artworkId, bookmarkId, true);
          return;
        }
        throw error;
      }
    }
    /** 从当前页面或作品页面源码中读取 CSRF token。 */
    async getCsrfToken(artworkId, forceRefresh) {
      if (this.csrfToken && !forceRefresh) return this.csrfToken;
      const currentSource = document.querySelector("#__NEXT_DATA__")?.textContent;
      let token = this.extractCsrfToken(currentSource || document.documentElement.innerHTML);
      if (!token || forceRefresh) {
        const response = await fetch(`/artworks/${artworkId}`, {
          credentials: "same-origin",
          cache: "no-store"
        });
        if (!response.ok) {
          throw new PixivApiError("\u65E0\u6CD5\u5237\u65B0\u6536\u85CF\u51ED\u8BC1", response.status);
        }
        token = this.extractCsrfToken(await response.text());
      }
      if (!token) throw new PixivApiError("\u9875\u9762\u4E2D\u672A\u627E\u5230\u6536\u85CF\u51ED\u8BC1", 0);
      this.csrfToken = token;
      return token;
    }
    /** 兼容 Pixiv 页面中未转义和反斜杠转义的 token。 */
    extractCsrfToken(source) {
      const patterns = [
        /"token":"([a-f\d]{32})"/i,
        /\\"token\\":\\"([a-f\d]{32})\\"/i,
        /"postKey":"([a-f\d]{32})"/i,
        /\\"postKey\\":\\"([a-f\d]{32})\\"/i
      ];
      for (const pattern of patterns) {
        const token = source.match(pattern)?.[1];
        if (token) return token;
      }
      return "";
    }
    /** 发送同源请求并统一处理 HTTP 与 Pixiv 业务错误。 */
    async request(url, init) {
      const response = await fetch(url, {
        credentials: "same-origin",
        ...init
      });
      if (!response.ok) {
        throw new PixivApiError(`Pixiv \u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, response.status);
      }
      const data = await response.json();
      if (data.error) {
        throw new PixivApiError(data.message || "Pixiv \u8BF7\u6C42\u5931\u8D25", response.status);
      }
      return data;
    }
  };

  // src/bookmark-controller.ts
  var BookmarkController = class {
    constructor(api, notification) {
      this.api = api;
      this.notification = notification;
    }
    pending = /* @__PURE__ */ new Set();
    /** 启动收藏操作，并返回本次请求是否成功。 */
    async add(artwork, cardElement) {
      if (artwork.bookmarkData) {
        this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5DF2\u7ECF\u6536\u85CF", "info");
        return false;
      }
      if (this.pending.has(artwork.id)) {
        this.notification.show("\u6536\u85CF\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D", "info");
        return false;
      }
      this.pending.add(artwork.id);
      this.notification.show("\u6B63\u5728\u6536\u85CF\u4F5C\u54C1", "info");
      try {
        await this.api.addBookmark(artwork);
        artwork.bookmarkData = { id: "", private: false };
        artwork.bookmarkCount++;
        this.syncBookmarkIcon(cardElement);
        this.notification.show("\u5DF2\u6536\u85CF", "success");
        return true;
      } catch (error) {
        this.notification.show(this.getErrorMessage(error), "error");
        return false;
      } finally {
        this.pending.delete(artwork.id);
      }
    }
    /** 查询服务端最新状态后取消收藏，并返回删除请求是否成功。 */
    async remove(artwork, cardElement) {
      if (this.pending.has(artwork.id)) {
        this.notification.show("\u6536\u85CF\u72B6\u6001\u8BF7\u6C42\u6B63\u5728\u5904\u7406\u4E2D", "info");
        return false;
      }
      this.pending.add(artwork.id);
      this.notification.show("\u6B63\u5728\u68C0\u67E5\u6536\u85CF\u72B6\u6001", "info");
      try {
        const latestArtwork = await this.api.refreshArtwork(artwork.id);
        const bookmarkId = latestArtwork.bookmarkData?.id;
        if (!bookmarkId) {
          this.notification.show("\u8FD9\u4E2A\u4F5C\u54C1\u5C1A\u672A\u6536\u85CF", "info");
          return false;
        }
        await this.api.deleteBookmark(artwork.id, bookmarkId);
        latestArtwork.bookmarkData = null;
        latestArtwork.bookmarkCount = Math.max(0, latestArtwork.bookmarkCount - 1);
        this.syncUnbookmarkIcon(cardElement);
        this.notification.show("\u5DF2\u53D6\u6D88\u6536\u85CF", "success");
        return true;
      } catch (error) {
        this.notification.show(this.getErrorMessage(error, "\u53D6\u6D88\u6536\u85CF"), "error");
        return false;
      } finally {
        this.pending.delete(artwork.id);
      }
    }
    /** 将明确识别出的 Pixiv 收藏按钮同步为红心，不触发原生收藏操作。 */
    syncBookmarkIcon(cardElement) {
      if (!cardElement) return;
      const bookmarkSvg = this.findBookmarkSvg(cardElement);
      if (bookmarkSvg && getComputedStyle(bookmarkSvg).color !== "rgb(255, 64, 96)") {
        bookmarkSvg.style.color = "rgb(255, 64, 96)";
        for (const path of bookmarkSvg.querySelectorAll("path")) {
          path.style.fill = "currentcolor";
        }
      }
      const oneClickBookmark = cardElement.querySelector("._one-click-bookmark");
      if (!oneClickBookmark?.classList.contains("on")) {
        oneClickBookmark?.classList.add("on");
      }
    }
    /** 将明确识别出的 Pixiv 收藏按钮恢复为空心状态。 */
    syncUnbookmarkIcon(cardElement) {
      if (!cardElement) return;
      const bookmarkSvg = this.findBookmarkSvg(cardElement);
      if (bookmarkSvg) {
        bookmarkSvg.style.removeProperty("color");
        for (const path of bookmarkSvg.querySelectorAll("path")) {
          path.style.removeProperty("fill");
        }
        const visiblePaths = bookmarkSvg.querySelectorAll(
          "g[mask] > path"
        );
        if (visiblePaths.length > 1) {
          visiblePaths[visiblePaths.length - 1].style.fill = "rgba(255, 64, 96, 0)";
        }
      }
      cardElement.querySelector("._one-click-bookmark")?.classList.remove("on");
    }
    /** 严格查找新版 Pixiv 缩略图的收藏图标。 */
    findBookmarkSvg(cardElement) {
      const bookmarkButton = cardElement.querySelector(
        'button[data-ga4-label="bookmark_button"]'
      ) || cardElement.querySelector('button svg[width="32"]')?.closest("button");
      return bookmarkButton?.querySelector("svg") || void 0;
    }
    /** 将常见 HTTP 状态转换成可操作的错误提示。 */
    getErrorMessage(error, action = "\u6536\u85CF") {
      if (!(error instanceof PixivApiError)) return `${action}\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5`;
      switch (error.status) {
        case 401:
          return `${action}\u5931\u8D25\uFF0C\u8BF7\u5148\u767B\u5F55 Pixiv`;
        case 403:
          return `${action}\u5931\u8D25\uFF0C\u8D26\u53F7\u5F53\u524D\u65E0\u6743\u6267\u884C\u6B64\u64CD\u4F5C`;
        case 429:
          return `${action}\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5`;
        default:
          return `${action}\u5931\u8D25\uFF1A${error.message}`;
      }
    }
  };

  // src/task-queue.ts
  async function consumeTasks(tasks, workerCount, consume, signal) {
    let cursor = 0;
    const consumeNext = async () => {
      while (!signal.aborted && cursor < tasks.length) {
        const task = tasks[cursor++];
        try {
          await consume(task);
        } catch {
        }
      }
    };
    const count = Math.min(Math.max(1, Math.floor(workerCount)), tasks.length);
    await Promise.all(Array.from({ length: count }, consumeNext));
  }

  // src/browser-image-cache.ts
  var BrowserImageCache = class {
    /** 按最近访问顺序保存作品缓存。 */
    works = /* @__PURE__ */ new Map();
    /** 最多保留的作品数量。 */
    maxWorks;
    /** 当前唯一的后台预加载队列。 */
    preloadTask;
    constructor(maxWorks = 3) {
      this.maxWorks = maxWorks;
    }
    /** 为预览创建缓存图片副本；在途预加载存在时先等待同一任务。 */
    async createImage(artworkId, index, signal) {
      const cache = this.works.get(artworkId);
      if (!cache) return;
      this.touch(artworkId, cache);
      let source = cache.images.get(index);
      const inFlight = cache.inFlight.get(index);
      if (!source && inFlight) {
        source = await this.waitForImage(inFlight, signal);
      }
      if (!source || this.works.get(artworkId) !== cache) return;
      signal.throwIfAborted();
      const image = new Image();
      image.alt = source.alt;
      image.fetchPriority = "high";
      return this.loadImage(image, source.currentSrc || source.src, signal, true);
    }
    /** 使用多个 worker 按页码顺序领取并补齐作品图片。 */
    preload(artwork, currentIndex, getUrl, workerCount) {
      if (this.preloadTask?.artworkId === artwork.id) {
        return this.preloadTask.promise;
      }
      this.cancelPreload();
      const cache = this.getOrCreate(artwork.id);
      const tasks = Array.from({ length: artwork.pageCount }, (_, index) => index).filter((index) => index !== currentIndex).filter((index) => !cache.images.has(index));
      const controller = new AbortController();
      const task = {
        artworkId: artwork.id,
        controller,
        promise: Promise.resolve()
      };
      task.promise = consumeTasks(
        tasks,
        workerCount,
        (index) => this.preloadImage(artwork, index, getUrl(index), cache, controller.signal),
        controller.signal
      ).finally(() => {
        if (this.preloadTask === task) this.preloadTask = void 0;
      });
      this.preloadTask = task;
      return task.promise;
    }
    /** 取消当前作品尚未完成的全部预加载。 */
    cancelPreload() {
      this.preloadTask?.controller.abort();
      this.preloadTask = void 0;
    }
    /** 更新 LRU 容量，并立即淘汰超出限制的旧作品。 */
    setMaxWorks(maxWorks) {
      this.maxWorks = maxWorks;
      this.evictOldest();
    }
    /** 取消预加载并释放全部图片引用。 */
    clear() {
      this.cancelPreload();
      for (const cache of this.works.values()) this.release(cache);
      this.works.clear();
    }
    /** 加载单张预加载图片，并登记在途任务供前台复用。 */
    async preloadImage(artwork, index, url, cache, signal) {
      if (cache.images.has(index) || cache.inFlight.has(index)) return;
      const image = new Image();
      image.alt = artwork.title;
      image.decoding = "async";
      image.fetchPriority = "low";
      const loading = this.loadImage(image, url, signal, false);
      cache.inFlight.set(index, loading);
      const loaded = await loading;
      if (cache.inFlight.get(index) === loading) cache.inFlight.delete(index);
      if (!loaded || signal.aborted) return;
      if (this.works.get(artwork.id) !== cache) return;
      cache.images.set(index, loaded);
    }
    /** 等待共享图片任务，同时只响应当前前台请求自己的取消信号。 */
    waitForImage(loading, signal) {
      signal.throwIfAborted();
      return new Promise((resolve, reject) => {
        const abort = () => {
          cleanup();
          reject(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError"));
        };
        const cleanup = () => signal.removeEventListener("abort", abort);
        signal.addEventListener("abort", abort, { once: true });
        void loading.then(
          (image) => {
            cleanup();
            resolve(image);
          },
          (error) => {
            cleanup();
            reject(error);
          }
        );
      });
    }
    /** 获取并刷新作品的 LRU 顺序。 */
    getOrCreate(artworkId) {
      const cache = this.works.get(artworkId) || { images: /* @__PURE__ */ new Map(), inFlight: /* @__PURE__ */ new Map() };
      this.touch(artworkId, cache);
      return cache;
    }
    /** 将作品移动到队尾。 */
    touch(artworkId, cache) {
      this.works.delete(artworkId);
      this.works.set(artworkId, cache);
      this.evictOldest();
    }
    /** 释放超出容量限制的最旧作品。 */
    evictOldest() {
      while (this.works.size > this.maxWorks) {
        const oldestId = this.works.keys().next().value;
        if (!oldestId) return;
        if (this.preloadTask?.artworkId === oldestId) this.cancelPreload();
        const oldest = this.works.get(oldestId);
        this.works.delete(oldestId);
        if (oldest) this.release(oldest);
      }
    }
    /** 清空一个作品持有的原生图片引用。 */
    release(cache) {
      for (const image of cache.images.values()) image.src = "";
      cache.images.clear();
      cache.inFlight.clear();
    }
    /** 加载原生图片，并在取消时终止尚未完成的请求。 */
    loadImage(image, url, signal, rejectOnAbort) {
      return new Promise((resolve, reject) => {
        let settled = false;
        const finish = (result, error) => {
          if (settled) return;
          settled = true;
          signal.removeEventListener("abort", abort);
          image.onload = null;
          image.onerror = null;
          if (error) reject(error);
          else resolve(result);
        };
        const abort = () => {
          image.src = "";
          const error = rejectOnAbort ? new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError") : void 0;
          finish(void 0, error);
        };
        signal.addEventListener("abort", abort, { once: true });
        image.onload = () => finish(image);
        image.onerror = () => finish();
        image.src = url;
        if (image.complete && image.naturalWidth > 0) finish(image);
        if (signal.aborted) abort();
      });
    }
  };

  // src/notification.ts
  var Notification = class {
    container = document.createElement("div");
    constructor() {
      this.container.className = "ppv-toast-container";
      document.body.append(this.container);
    }
    /** 显示一条会自动消失的提示。 */
    show(message, type) {
      const toast = document.createElement("div");
      toast.className = `ppv-toast ppv-toast-${type}`;
      toast.textContent = message;
      this.container.append(toast);
      window.setTimeout(() => toast.classList.add("ppv-toast-leave"), 2200);
      window.setTimeout(() => toast.remove(), 2500);
    }
  };

  // src/artwork-locator.ts
  var ArtworkLocator = class {
    /** 查找当前事件对应的作品；标题等不含图片的链接不会触发预览。 */
    find(target) {
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href*="/artworks/"]');
      if (!link || !link.querySelector("img")) return;
      const id = new URL(link.href, location.href).pathname.match(
        /^\/artworks\/(\d+)/
      )?.[1];
      if (!id) return;
      return {
        id,
        element: link,
        cardElement: this.findCardElement(link, id)
      };
    }
    /** 查找只对应当前作品且包含收藏按钮的最小卡片容器。 */
    findCardElement(link, artworkId) {
      let element = link.parentElement;
      while (element && element !== document.body) {
        const artworkIds = new Set(
          [...element.querySelectorAll('a[href*="/artworks/"]')].map((item) => this.getArtworkId(item.href)).filter((id) => Boolean(id))
        );
        if (artworkIds.size > 1 || !artworkIds.has(artworkId)) return;
        if (element.querySelector("button svg") || element.querySelector("._one-click-bookmark")) {
          return element;
        }
        element = element.parentElement;
      }
    }
    /** 从作品链接中提取数字 ID。 */
    getArtworkId(url) {
      return new URL(url, location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1];
    }
  };

  // src/preview-controller.ts
  var WHEEL_THROTTLE = 100;
  var INFO_HEIGHT = 25;
  var VIEWPORT_MARGIN = 8;
  var PREVIEW_GAP = 6;
  var PreviewController = class {
    constructor(api, renderer, bookmarkController, notification, settings) {
      this.api = api;
      this.renderer = renderer;
      this.bookmarkController = bookmarkController;
      this.notification = notification;
      this.settings = settings;
      this.wrap.className = "ppv-preview";
      this.info.className = "ppv-preview-info";
      this.loadingPanel.className = "ppv-preview-loading-panel";
      this.loadingText.className = "ppv-preview-loading-text";
      this.progressTrack.className = "ppv-preview-progress-track";
      this.progressBar.className = "ppv-preview-progress-bar ppv-preview-progress-bar-indeterminate";
      this.progressTrack.append(this.progressBar);
      this.loadingPanel.append(this.loadingText, this.progressTrack);
      this.wrap.append(this.info, this.loadingPanel);
      document.body.append(this.wrap);
      this.bindEvents();
    }
    wrap = document.createElement("div");
    info = document.createElement("div");
    loadingPanel = document.createElement("div");
    loadingText = document.createElement("div");
    progressTrack = document.createElement("div");
    progressBar = document.createElement("div");
    locator = new ArtworkLocator();
    activeTarget;
    artwork;
    activeRequest;
    renderedArtwork;
    index = 0;
    showTimer;
    version = 0;
    lastWheelTime = 0;
    currentUrl = location.href;
    routeObserver = new MutationObserver(() => {
      if (location.href === this.currentUrl) return;
      this.currentUrl = location.href;
      this.hide();
    });
    /** 使用事件委托绑定 Pixiv 动态页面所需的所有事件。 */
    bindEvents() {
      document.addEventListener("pointerover", this.onPointerOver, true);
      document.addEventListener("pointerout", this.onPointerOut, true);
      window.addEventListener("wheel", this.onWheel, {
        capture: true,
        passive: false
      });
      window.addEventListener("keydown", this.onKeyDown, true);
      window.addEventListener("scroll", this.hide, true);
      window.addEventListener("resize", this.hide);
      window.addEventListener("blur", this.hide);
      window.addEventListener("popstate", this.hide);
      this.routeObserver.observe(document.body, { childList: true, subtree: true });
    }
    /** 在进入新的作品缩略图后开始延迟预览。 */
    onPointerOver = (event) => {
      const target = this.locator.find(event.target);
      if (!target) return;
      if (this.activeTarget?.element === target.element) return;
      this.hide();
      this.activeTarget = target;
      const version = ++this.version;
      this.showTimer = window.setTimeout(() => {
        void this.show(target, version);
      }, this.settings.value.showDelay);
    };
    /** 真正离开当前作品链接时关闭预览。 */
    onPointerOut = (event) => {
      if (!this.activeTarget) return;
      if (event.target instanceof Node && !this.activeTarget.element.contains(event.target)) {
        return;
      }
      if (event.relatedTarget instanceof Node && this.activeTarget.element.contains(event.relatedTarget)) {
        return;
      }
      this.hide();
    };
    /** 加载作品与第一页，并在确认请求仍有效后显示。 */
    async show(target, version) {
      const request = this.startRequest();
      this.showLoading(target.element, "\u6B63\u5728\u83B7\u53D6\u4F5C\u54C1\u4FE1\u606F");
      try {
        const artwork = await this.api.getArtwork(target.id, request.signal);
        if (!this.isCurrent(target, version)) return;
        this.artwork = artwork;
        if (artwork.bookmarkData) {
          this.bookmarkController.syncBookmarkIcon(target.cardElement);
        }
        this.index = 0;
        this.showLoading(target.element, "\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90");
        await this.render(version, request.signal);
      } catch (error) {
        this.handlePreviewError(error, target, version);
      }
    }
    /** 加载当前页图片并原子替换预览内容。 */
    async render(version, signal) {
      const artwork = this.artwork;
      const target = this.activeTarget;
      if (!artwork || !target) return;
      const index = this.index;
      const rendered = await this.renderer.load(
        artwork,
        index,
        signal,
        (progress) => {
          if (this.isCurrent(target, version) && this.index === index) {
            this.updateLoadingProgress(progress);
          }
        }
      );
      if (!this.isCurrent(target, version) || this.index !== index) {
        rendered.dispose();
        return;
      }
      this.renderedArtwork = rendered;
      const media = rendered.element;
      media.className = "ppv-preview-media";
      this.wrap.querySelector(".ppv-preview-media")?.remove();
      this.updateInfo(artwork, rendered.width, rendered.height);
      this.sizeAndPosition(media, rendered.width, rendered.height, target.element);
      this.wrap.append(media);
      this.wrap.classList.remove("ppv-preview-loading");
      this.wrap.classList.add("ppv-preview-visible", "ppv-preview-ready");
      void this.renderer.preload(artwork, index);
    }
    /** 显示小型加载窗口，并重置为等待网络响应的状态。 */
    showLoading(element, message) {
      this.loadingText.textContent = message;
      this.progressBar.style.width = "";
      this.progressBar.classList.add("ppv-preview-progress-bar-indeterminate");
      this.positionWrap(element, 220, 68);
      this.wrap.classList.remove("ppv-preview-ready");
      this.wrap.classList.add("ppv-preview-visible", "ppv-preview-loading");
    }
    /** 使用 Tampermonkey 提供的真实下载字节更新进度。 */
    updateLoadingProgress(progress) {
      if (progress.total) {
        const percent = Math.min(
          100,
          Math.round(progress.loaded / progress.total * 100)
        );
        this.loadingText.textContent = `${this.formatBytes(progress.loaded)} / ${this.formatBytes(progress.total)} (${percent}%)`;
        this.progressBar.classList.remove(
          "ppv-preview-progress-bar-indeterminate"
        );
        this.progressBar.style.width = `${percent}%`;
        return;
      }
      this.loadingText.textContent = `\u5DF2\u52A0\u8F7D ${this.formatBytes(progress.loaded)}`;
    }
    /** 将字节数格式化成适合加载窗口显示的短文本。 */
    formatBytes(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    /** 更新顶部摘要信息。 */
    updateInfo(artwork, width, height) {
      this.info.replaceChildren();
      const values = [
        artwork.pageCount > 1 ? `${this.index + 1}/${artwork.pageCount}` : "",
        `\u6536\u85CF ${artwork.bookmarkCount}`,
        `${width}\xD7${height}`,
        artwork.title
      ];
      values.forEach((value, index) => {
        if (!value) return;
        const span = document.createElement("span");
        span.textContent = value;
        if (index === values.length - 1) span.className = "ppv-preview-title";
        this.info.append(span);
      });
    }
    /** 按真实图片比例缩放，并放到缩略图空间较大的一侧。 */
    sizeAndPosition(media, mediaWidth, mediaHeight, element) {
      const rect = element.getBoundingClientRect();
      const leftSpace = rect.left - PREVIEW_GAP - VIEWPORT_MARGIN;
      const rightSpace = window.innerWidth - rect.right - PREVIEW_GAP - VIEWPORT_MARGIN;
      const placeLeft = leftSpace >= rightSpace;
      const availableWidth = Math.max(1, placeLeft ? leftSpace : rightSpace);
      const availableHeight = window.innerHeight - VIEWPORT_MARGIN * 2 - INFO_HEIGHT;
      const scale = Math.min(
        1,
        availableWidth / mediaWidth,
        availableHeight / mediaHeight
      );
      const width = Math.max(1, Math.floor(mediaWidth * scale));
      const height = Math.max(1, Math.floor(mediaHeight * scale));
      this.positionWrap(element, width, height + INFO_HEIGHT, placeLeft);
      media.style.height = `${height}px`;
    }
    /** 把加载窗口或图片预览放到缩略图空间较大的一侧。 */
    positionWrap(element, requestedWidth, height, preferredLeft) {
      const rect = element.getBoundingClientRect();
      const leftSpace = rect.left - PREVIEW_GAP - VIEWPORT_MARGIN;
      const rightSpace = window.innerWidth - rect.right - PREVIEW_GAP - VIEWPORT_MARGIN;
      const placeLeft = preferredLeft ?? leftSpace >= rightSpace;
      const availableWidth = Math.max(1, placeLeft ? leftSpace : rightSpace);
      const width = Math.min(requestedWidth, Math.max(120, availableWidth));
      const rawLeft = placeLeft ? rect.left - PREVIEW_GAP - width : rect.right + PREVIEW_GAP;
      const left = Math.min(
        Math.max(VIEWPORT_MARGIN, rawLeft),
        window.innerWidth - width - VIEWPORT_MARGIN
      );
      const centeredTop = rect.top + rect.height / 2 - height / 2;
      const top = Math.min(
        Math.max(VIEWPORT_MARGIN, centeredTop),
        window.innerHeight - height - VIEWPORT_MARGIN
      );
      this.wrap.style.width = `${Math.round(width)}px`;
      this.wrap.style.left = `${Math.round(left)}px`;
      this.wrap.style.top = `${Math.round(top)}px`;
    }
    /** 在当前缩略图上滚动时循环切换多图页码。 */
    onWheel = (event) => {
      if (!this.artwork || !this.activeTarget || this.artwork.pageCount <= 1 || !this.wrap.classList.contains("ppv-preview-visible") || !(event.target instanceof Node) || !this.activeTarget.element.contains(event.target)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      if (now - this.lastWheelTime < WHEEL_THROTTLE) return;
      this.lastWheelTime = now;
      const count = this.artwork.pageCount;
      this.index = (this.index + (event.deltaY < 0 ? -1 : 1) + count) % count;
      const target = this.activeTarget;
      const version = ++this.version;
      const request = this.startRequest();
      this.showLoading(target.element, "\u6B63\u5728\u8FDE\u63A5\u56FE\u7247\u8D44\u6E90");
      void this.render(version, request.signal).catch((error) => {
        this.handlePreviewError(error, target, version);
      });
    };
    /** 预览显示时处理关闭、收藏与取消收藏快捷键。 */
    onKeyDown = (event) => {
      if (!this.artwork || !this.wrap.classList.contains("ppv-preview-visible") || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }
      if (event.code === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
        return;
      }
      if (event.code !== "KeyB" && event.code !== "KeyU" || event.repeat) return;
      event.preventDefault();
      event.stopPropagation();
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) activeElement.blur();
      const artwork = this.artwork;
      const cardElement = this.activeTarget?.cardElement;
      const operation = event.code === "KeyB" ? this.bookmarkController.add(artwork, cardElement) : this.bookmarkController.remove(artwork, cardElement);
      void operation.then(() => {
        const rendered = this.renderedArtwork;
        if (this.artwork === artwork && rendered) {
          this.updateInfo(artwork, rendered.width, rendered.height);
        }
      });
    };
    /** 终止旧任务并创建只属于当前预览请求的取消信号。 */
    startRequest() {
      this.activeRequest?.abort();
      this.renderedArtwork?.dispose();
      this.renderedArtwork = void 0;
      this.wrap.querySelector(".ppv-preview-media")?.remove();
      const request = new AbortController();
      this.activeRequest = request;
      return request;
    }
    /** 忽略主动取消，只向当前预览报告真实请求错误。 */
    handlePreviewError(error, target, version) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (this.isCurrent(target, version)) {
        const message = error instanceof PixivApiError && error.status === 429 ? "\u9884\u89C8\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" : "\u9884\u89C8\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
        this.notification.show(message, "error");
        this.hide();
      }
      console.error("[Pixiv Preview]", error);
    }
    /** 检查异步结果是否仍属于当前悬浮目标。 */
    isCurrent(target, version) {
      return this.activeTarget?.element === target.element && this.version === version;
    }
    /** 清理所有可见状态并使旧异步任务失效。 */
    hide = () => {
      window.clearTimeout(this.showTimer);
      this.activeRequest?.abort();
      this.renderer.cancelPreload();
      this.activeRequest = void 0;
      this.renderedArtwork?.dispose();
      this.renderedArtwork = void 0;
      this.version++;
      this.activeTarget = void 0;
      this.artwork = void 0;
      this.index = 0;
      this.wrap.classList.remove(
        "ppv-preview-visible",
        "ppv-preview-loading",
        "ppv-preview-ready"
      );
      this.wrap.querySelector(".ppv-preview-media")?.remove();
    };
  };

  // src/image-url.ts
  function getImageUrl(artwork, index, quality) {
    return artwork.urls[quality].replace(/_p0(?=[_.])/, `_p${index}`);
  }

  // src/renderer.ts
  var StaticArtworkRenderer = class {
    constructor(cache, settings) {
      this.cache = cache;
      this.settings = settings;
    }
    /** 下载指定页并返回可主动释放的 Blob 图片。 */
    async load(artwork, index, signal, onProgress) {
      const cachedImage = await this.cache.createImage(
        artwork.id,
        index,
        signal
      );
      if (cachedImage) {
        onProgress({ loaded: 1, total: 1 });
        return {
          element: cachedImage,
          width: cachedImage.naturalWidth,
          height: cachedImage.naturalHeight,
          dispose: () => {
            cachedImage.src = "";
          }
        };
      }
      return this.download(artwork, index, signal, onProgress);
    }
    /** 并发预加载作品的所有图片到浏览器缓存。 */
    preload(artwork, currentIndex) {
      if (!this.settings.value.preloadEnabled) return Promise.resolve();
      return this.cache.preload(
        artwork,
        currentIndex,
        (index) => this.getUrl(artwork, index),
        this.settings.value.preloadWorkers
      );
    }
    /** 取消当前作品的后台预加载。 */
    cancelPreload() {
      this.cache.cancelPreload();
    }
    /** 使用 GM 请求下载未命中的图片并报告真实进度。 */
    download(artwork, index, signal, onProgress) {
      return new Promise((resolve, reject) => {
        let request;
        let objectUrl = "";
        let settled = false;
        const cleanup = () => signal.removeEventListener("abort", abort);
        const fail = (error) => {
          if (settled) return;
          settled = true;
          cleanup();
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          reject(error);
        };
        const abort = () => {
          request?.abort();
          fail(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError"));
        };
        signal.addEventListener("abort", abort, { once: true });
        request = GM_xmlhttpRequest({
          method: "GET",
          url: this.getUrl(artwork, index),
          headers: { Referer: "https://www.pixiv.net/" },
          responseType: "blob",
          onprogress: (event) => {
            if (settled) return;
            onProgress({
              loaded: event.loaded,
              total: event.lengthComputable && event.total > 0 ? event.total : void 0
            });
          },
          onload: (response) => {
            if (signal.aborted) return abort();
            if (response.status < 200 || response.status >= 300) {
              fail(
                new Error(
                  `\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
                )
              );
              return;
            }
            onProgress({
              loaded: response.response.size,
              total: response.response.size
            });
            objectUrl = URL.createObjectURL(response.response);
            const image = new Image();
            image.alt = artwork.title;
            image.onload = () => {
              if (signal.aborted) return abort();
              settled = true;
              cleanup();
              resolve({
                element: image,
                width: image.naturalWidth,
                height: image.naturalHeight,
                dispose: () => {
                  image.src = "";
                  URL.revokeObjectURL(objectUrl);
                }
              });
            };
            image.onerror = () => fail(new Error("\u9884\u89C8\u56FE\u7247\u89E3\u7801\u5931\u8D25"));
            image.src = objectUrl;
          },
          onerror: (response) => {
            fail(
              new Error(
                `\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
              )
            );
          },
          onabort: () => fail(new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError")),
          ontimeout: () => fail(new Error("\u9884\u89C8\u56FE\u7247\u8BF7\u6C42\u8D85\u65F6"))
        });
        if (signal.aborted) abort();
      });
    }
    /** 由当前清晰度的第一页地址生成指定页地址。 */
    getUrl(artwork, index) {
      return getImageUrl(artwork, index, this.settings.value.imageQuality);
    }
  };
  var ArtworkRendererDispatcher = class {
    constructor(staticRenderer, ugoiraRenderer) {
      this.staticRenderer = staticRenderer;
      this.ugoiraRenderer = ugoiraRenderer;
    }
    load(artwork, index, signal, onProgress) {
      return this.getRenderer(artwork).load(artwork, index, signal, onProgress);
    }
    preload(artwork, currentIndex) {
      if (artwork.illustType === 2) return Promise.resolve();
      return this.staticRenderer.preload(artwork, currentIndex);
    }
    cancelPreload() {
      this.staticRenderer.cancelPreload();
      this.ugoiraRenderer.cancelPreload();
    }
    getUrl(artwork, index) {
      return this.getRenderer(artwork).getUrl(artwork, index);
    }
    getRenderer(artwork) {
      return artwork.illustType === 2 ? this.ugoiraRenderer : this.staticRenderer;
    }
  };

  // src/settings.ts
  var DEFAULT_SETTINGS = {
    preloadEnabled: true,
    preloadWorkers: 4,
    cacheWorks: 3,
    showDelay: 400,
    imageQuality: "regular"
  };
  var SettingsStore = class {
    /** 当前生效的设置。 */
    settings;
    /** 所有设置变更订阅者。 */
    listeners = /* @__PURE__ */ new Set();
    /** 油猴存储适配器。 */
    storage;
    constructor(storage) {
      this.storage = storage;
      try {
        this.settings = normalizeSettings(storage.get());
      } catch {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    }
    /** 获取当前设置的只读快照。 */
    get value() {
      return this.settings;
    }
    /** 校验、保存设置并通知所有订阅者。 */
    save(value) {
      this.settings = normalizeSettings(value);
      this.storage.set(this.settings);
      for (const listener of this.listeners) listener(this.settings);
    }
    /** 订阅设置变更，并返回取消订阅方法。 */
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }
  };
  function normalizeSettings(value) {
    const source = typeof value === "object" && value !== null ? value : {};
    const preloadWorkers = source.preloadWorkers;
    const cacheWorks = source.cacheWorks;
    const showDelay = source.showDelay;
    return {
      preloadEnabled: typeof source.preloadEnabled === "boolean" ? source.preloadEnabled : DEFAULT_SETTINGS.preloadEnabled,
      preloadWorkers: Number.isInteger(preloadWorkers) && Number(preloadWorkers) >= 1 && Number(preloadWorkers) <= 8 ? Number(preloadWorkers) : DEFAULT_SETTINGS.preloadWorkers,
      cacheWorks: Number.isInteger(cacheWorks) && Number(cacheWorks) >= 1 && Number(cacheWorks) <= 10 ? Number(cacheWorks) : DEFAULT_SETTINGS.cacheWorks,
      showDelay: Number.isInteger(showDelay) && Number(showDelay) >= 0 && Number(showDelay) <= 2e3 ? Number(showDelay) : DEFAULT_SETTINGS.showDelay,
      imageQuality: source.imageQuality === "original" || source.imageQuality === "regular" ? source.imageQuality : DEFAULT_SETTINGS.imageQuality
    };
  }

  // src/settings-panel.ts
  var SettingsPanel = class {
    constructor(store, notification) {
      this.store = store;
      this.notification = notification;
      this.root.className = "ppv-settings-backdrop";
      this.root.innerHTML = `
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
      </div>`;
      this.form.className = "ppv-settings-form";
      const panel = this.root.firstElementChild;
      const fields = panel.querySelector(".ppv-settings-fields");
      fields.append(
        this.createCheckbox("preloadEnabled", "\u542F\u7528\u540E\u53F0\u9884\u52A0\u8F7D"),
        this.createNumber("preloadWorkers", "\u9884\u52A0\u8F7D worker \u6570", 1, 8),
        this.createNumber("cacheWorks", "\u7F13\u5B58\u4F5C\u54C1\u6570", 1, 10),
        this.createNumber("showDelay", "\u60AC\u6D6E\u5EF6\u8FDF\uFF08\u6BEB\u79D2\uFF09", 0, 2e3),
        this.createQuality()
      );
      this.form.append(...panel.childNodes);
      panel.append(this.form);
      document.body.append(this.root);
      this.bindEvents();
      GM_registerMenuCommand("Pixiv Preview \u8BBE\u7F6E", this.open);
    }
    /** 设置面板遮罩容器。 */
    root = document.createElement("div");
    /** 设置表单。 */
    form = document.createElement("form");
    /** 创建布尔设置控件。 */
    createCheckbox(name, labelText) {
      const label = document.createElement("label");
      label.className = "ppv-settings-row ppv-settings-checkbox-row";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = name;
      label.append(input, labelText);
      return label;
    }
    /** 创建带范围限制的数字设置控件。 */
    createNumber(name, labelText, min, max) {
      const label = document.createElement("label");
      label.className = "ppv-settings-row";
      const text = document.createElement("span");
      text.textContent = labelText;
      const input = document.createElement("input");
      input.type = "number";
      input.name = name;
      input.min = String(min);
      input.max = String(max);
      input.step = "1";
      input.required = true;
      label.append(text, input);
      return label;
    }
    /** 创建图片清晰度选择控件。 */
    createQuality() {
      const label = document.createElement("label");
      label.className = "ppv-settings-row";
      const text = document.createElement("span");
      text.textContent = "\u56FE\u7247\u6E05\u6670\u5EA6";
      const select = document.createElement("select");
      select.name = "imageQuality";
      select.innerHTML = `
      <option value="regular">\u6807\u51C6\uFF08regular\uFF09</option>
      <option value="original">\u539F\u56FE\uFF08original\uFF09</option>`;
      label.append(text, select);
      return label;
    }
    /** 绑定面板内交互。 */
    bindEvents() {
      this.root.addEventListener("click", (event) => {
        if (event.target === this.root || event.target instanceof Element && event.target.closest(".ppv-settings-close")) {
          this.close();
        }
      });
      this.root.querySelector(".ppv-settings-defaults")?.addEventListener("click", () => this.fill(DEFAULT_SETTINGS));
      this.form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!this.form.reportValidity()) return;
        this.store.save(this.read());
        this.notification.show("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58", "success");
        this.close();
      });
      window.addEventListener(
        "keydown",
        (event) => {
          if (event.code === "Escape" && this.root.classList.contains("is-open")) {
            event.preventDefault();
            event.stopPropagation();
            this.close();
          }
        },
        true
      );
    }
    /** 从表单读取通过浏览器校验的设置。 */
    read() {
      const data = new FormData(this.form);
      return {
        preloadEnabled: data.get("preloadEnabled") === "on",
        preloadWorkers: Number(data.get("preloadWorkers")),
        cacheWorks: Number(data.get("cacheWorks")),
        showDelay: Number(data.get("showDelay")),
        imageQuality: data.get("imageQuality") === "original" ? "original" : "regular"
      };
    }
    /** 将设置写入表单控件。 */
    fill(settings) {
      const get = (name) => this.form.elements.namedItem(name);
      get("preloadEnabled").checked = settings.preloadEnabled;
      get("preloadWorkers").value = String(settings.preloadWorkers);
      get("cacheWorks").value = String(settings.cacheWorks);
      get("showDelay").value = String(settings.showDelay);
      get("imageQuality").value = settings.imageQuality;
    }
    /** 显示设置面板并填入当前值。 */
    open = () => {
      this.fill(this.store.value);
      this.root.classList.add("is-open");
      this.form.elements.namedItem("preloadWorkers").focus();
    };
    /** 关闭设置面板。 */
    close() {
      this.root.classList.remove("is-open");
    }
  };

  // src/style.ts
  var style = `
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
.ppv-preview-media { display: block; width: 100%; height: auto; }
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
`;
  function injectStyle() {
    const element = document.createElement("style");
    element.textContent = style;
    document.head.append(element);
  }

  // src/ugoira-player.ts
  function calculateDecodeSize(width, height, maxPixels) {
    if (width * height <= maxPixels) return { width, height };
    const scale = Math.sqrt(maxPixels / (width * height));
    return {
      width: Math.max(1, Math.floor(width * scale)),
      height: Math.max(1, Math.floor(height * scale))
    };
  }
  var UgoiraPlayer = class {
    options;
    currentFrame;
    currentIndex = 0;
    pendingFrame;
    scheduleHandle;
    disposed = false;
    constructor(options) {
      this.options = options;
    }
    async start() {
      if (this.disposed || this.currentFrame) return;
      const frame = await this.options.loadFrame(0);
      if (this.disposed) {
        frame.close();
        return;
      }
      this.showFrame({ index: 0, frame });
    }
    dispose() {
      if (this.disposed) return;
      this.disposed = true;
      if (this.scheduleHandle !== void 0) {
        this.options.cancelSchedule(this.scheduleHandle);
        this.scheduleHandle = void 0;
      }
      this.currentFrame?.close();
      this.currentFrame = void 0;
      const pending = this.pendingFrame;
      this.pendingFrame = void 0;
      void pending?.then(({ frame }) => frame.close(), () => void 0);
    }
    advance = () => {
      if (this.disposed || !this.pendingFrame) return;
      const pending = this.pendingFrame;
      void pending.then(
        (next) => {
          if (this.pendingFrame === pending) this.pendingFrame = void 0;
          if (!this.disposed) this.showFrame(next);
        },
        (error) => {
          if (this.pendingFrame === pending) this.pendingFrame = void 0;
          if (!this.disposed) {
            this.dispose();
            this.options.onError(error);
          }
        }
      );
    };
    showFrame(next) {
      this.options.drawFrame(next.frame);
      this.currentFrame?.close();
      this.currentFrame = next.frame;
      this.currentIndex = next.index;
      if (this.options.frameCount <= 1) return;
      this.prepareNextFrame();
      this.scheduleHandle = this.options.schedule(
        this.advance,
        Math.max(1, this.options.getDelay(next.index))
      );
    }
    prepareNextFrame() {
      const index = (this.currentIndex + 1) % this.options.frameCount;
      const pending = this.options.loadFrame(index).then((frame) => ({ index, frame }));
      this.pendingFrame = pending;
      void pending.catch(() => void 0);
    }
  };

  // src/ugoira-renderer.ts
  var { BlobReader, BlobWriter, ZipReader } = globalThis.zip;
  var MAX_ARCHIVE_BYTES = 96 * 1024 * 1024;
  var MAX_FRAME_BYTES = 32 * 1024 * 1024;
  var MAX_DECODE_PIXELS = 2e6;
  var UgoiraArtworkRenderer = class {
    constructor(api, settings) {
      this.api = api;
      this.settings = settings;
    }
    async load(artwork, _index, signal, onProgress) {
      const metadata = await this.api.getUgoiraMetadata(artwork.id, signal);
      this.validateMetadata(metadata);
      const url = this.settings.value.imageQuality === "original" ? metadata.originalSrc : metadata.src;
      const archive = await this.download(url, signal, onProgress);
      signal.throwIfAborted();
      const reader = new ZipReader(new BlobReader(archive), {
        useCompressionStream: true,
        useWebWorkers: false
      });
      const lifetime = new AbortController();
      const abort = () => lifetime.abort(signal.reason);
      signal.addEventListener("abort", abort, { once: true });
      let readerClosed = false;
      const closeReader = (reason) => {
        if (readerClosed) return;
        readerClosed = true;
        signal.removeEventListener("abort", abort);
        lifetime.abort(reason);
        return reader.close();
      };
      try {
        const entries = await reader.getEntries();
        lifetime.signal.throwIfAborted();
        const files = new Map(
          entries.filter((entry) => !entry.directory).map((entry) => [entry.filename, entry])
        );
        const orderedEntries = metadata.frames.map(({ file }) => {
          const entry = files.get(file);
          if (!entry) throw new Error(`\u52A8\u56FE\u5E27\u4E0D\u5B58\u5728: ${file}`);
          if (entry.uncompressedSize > MAX_FRAME_BYTES) {
            throw new Error(`\u52A8\u56FE\u5355\u5E27\u8D85\u8FC7 ${MAX_FRAME_BYTES} \u5B57\u8282\u9650\u5236`);
          }
          return entry;
        });
        const decodeSize = calculateDecodeSize(
          artwork.width,
          artwork.height,
          MAX_DECODE_PIXELS
        );
        const canvas = document.createElement("canvas");
        canvas.width = decodeSize.width;
        canvas.height = decodeSize.height;
        canvas.setAttribute("aria-label", artwork.title);
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 Canvas 2D");
        const player = new UgoiraPlayer({
          frameCount: orderedEntries.length,
          getDelay: (index) => metadata.frames[index].delay,
          loadFrame: async (index) => {
            const blob = await orderedEntries[index].getData(
              new BlobWriter(metadata.mime_type),
              { signal: lifetime.signal, checkCrc32: true }
            );
            lifetime.signal.throwIfAborted();
            const bitmap = await createImageBitmap(blob, {
              resizeWidth: decodeSize.width,
              resizeHeight: decodeSize.height,
              resizeQuality: "high"
            });
            if (lifetime.signal.aborted) {
              bitmap.close();
              lifetime.signal.throwIfAborted();
            }
            return bitmap;
          },
          drawFrame: (frame) => {
            context.drawImage(frame, 0, 0);
          },
          schedule: (callback, delay) => window.setTimeout(callback, delay),
          cancelSchedule: (handle) => window.clearTimeout(handle),
          onError: (error) => {
            void closeReader(error)?.catch(() => void 0);
            console.error("[Pixiv Preview] \u52A8\u56FE\u5E27\u89E3\u7801\u5931\u8D25", error);
          }
        });
        await player.start();
        let disposed = false;
        return {
          element: canvas,
          width: artwork.width,
          height: artwork.height,
          dispose: () => {
            if (disposed) return;
            disposed = true;
            const error = new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError");
            void closeReader(error)?.catch(() => void 0);
            player.dispose();
            canvas.width = 1;
            canvas.height = 1;
          }
        };
      } catch (error) {
        await closeReader(error)?.catch(() => void 0);
        throw error;
      }
    }
    preload() {
      return Promise.resolve();
    }
    cancelPreload() {
    }
    getUrl(artwork) {
      return artwork.urls.regular;
    }
    validateMetadata(metadata) {
      if (metadata.mime_type !== "image/jpeg") {
        throw new Error(`\u4E0D\u652F\u6301\u7684\u52A8\u56FE\u5E27\u683C\u5F0F: ${metadata.mime_type}`);
      }
      if (!metadata.frames.length) throw new Error("\u52A8\u56FE\u6CA1\u6709\u53EF\u64AD\u653E\u5E27");
    }
    download(url, signal, onProgress) {
      return new Promise((resolve, reject) => {
        let request;
        let settled = false;
        const finish = (blob, error) => {
          if (settled) return;
          settled = true;
          signal.removeEventListener("abort", abort);
          if (error) reject(error);
          else if (blob) resolve(blob);
        };
        const abort = () => {
          request?.abort();
          finish(void 0, new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError"));
        };
        const rejectOversized = () => {
          request?.abort();
          finish(void 0, new Error("\u52A8\u56FE\u6587\u4EF6\u8FC7\u5927\uFF0C\u5DF2\u505C\u6B62\u9884\u89C8\u4EE5\u4FDD\u62A4\u9875\u9762"));
        };
        signal.addEventListener("abort", abort, { once: true });
        request = GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: { Referer: "https://www.pixiv.net/" },
          responseType: "blob",
          onprogress: (event) => {
            if (event.loaded > MAX_ARCHIVE_BYTES || event.lengthComputable && event.total > MAX_ARCHIVE_BYTES) {
              rejectOversized();
              return;
            }
            onProgress({
              loaded: event.loaded,
              total: event.lengthComputable ? event.total : void 0
            });
          },
          onload: (response) => {
            if (response.status < 200 || response.status >= 300) {
              finish(
                void 0,
                new Error(
                  `\u52A8\u56FE\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
                )
              );
              return;
            }
            if (response.response.size > MAX_ARCHIVE_BYTES) {
              rejectOversized();
              return;
            }
            onProgress({
              loaded: response.response.size,
              total: response.response.size
            });
            finish(response.response);
          },
          onerror: (response) => finish(
            void 0,
            new Error(
              `\u52A8\u56FE\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${response.statusText}`
            )
          ),
          onabort: () => finish(void 0, new DOMException("\u9884\u89C8\u5DF2\u53D6\u6D88", "AbortError")),
          ontimeout: () => finish(void 0, new Error("\u52A8\u56FE\u8BF7\u6C42\u8D85\u65F6"))
        });
        if (signal.aborted) abort();
      });
    }
  };

  // src/index.ts
  var SETTINGS_KEY = "pixivPreviewSettings";
  function bootstrap() {
    injectStyle();
    const api = new PixivApi();
    const notification = new Notification();
    const settings = new SettingsStore({
      get: () => GM_getValue(SETTINGS_KEY, DEFAULT_SETTINGS),
      set: (value) => GM_setValue(SETTINGS_KEY, value)
    });
    const bookmarkController = new BookmarkController(api, notification);
    const imageCache = new BrowserImageCache(settings.value.cacheWorks);
    const staticRenderer = new StaticArtworkRenderer(imageCache, settings);
    const renderer = new ArtworkRendererDispatcher(
      staticRenderer,
      new UgoiraArtworkRenderer(api, settings)
    );
    let previousSettings = settings.value;
    settings.subscribe((nextSettings) => {
      imageCache.setMaxWorks(nextSettings.cacheWorks);
      if (nextSettings.imageQuality !== previousSettings.imageQuality) {
        imageCache.clear();
      } else if (!nextSettings.preloadEnabled) {
        imageCache.cancelPreload();
      }
      previousSettings = nextSettings;
    });
    new SettingsPanel(settings, notification);
    new PreviewController(
      api,
      renderer,
      bookmarkController,
      notification,
      settings
    );
  }
  bootstrap();
})();
