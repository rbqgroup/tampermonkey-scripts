// ==UserScript==
// @name         X 界面精简
// @namespace    https://github.com/rbqgroup/tampermonkey-scripts
// @version      0.4.2
// @description  精简 X 界面、净化分享链接、快捷关注、展示 Pixiv 资料链接，并保守省流。
// @license      MIT
// @homepageURL  https://github.com/rbqgroup/tampermonkey-scripts/tree/main/twitter-minimal
// @supportURL   https://github.com/rbqgroup/tampermonkey-scripts/issues
// @downloadURL  https://raw.githubusercontent.com/rbqgroup/tampermonkey-scripts/main/twitter-minimal/dist/twitter-minimal.user.js
// @updateURL    https://raw.githubusercontent.com/rbqgroup/tampermonkey-scripts/main/twitter-minimal/dist/twitter-minimal.user.js
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        none
// @sandbox      raw
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  if (window.top !== window.self || !['x.com', 'twitter.com'].includes(location.hostname)) return;

  // 在页面上下文运行，才能覆盖网站实际使用的剪贴板及网络方法。
  if (window.__twitterMinimal) return;
  const runtime = { version: '0.4.2', blockedRequests: 0 };
  window.__twitterMinimal = runtime;
  const articleSelector = 'article[data-testid="tweet"]';
  const hoverCardSelector = '[data-testid="HoverCard"]';
  const pendingArticles = new Set();
  const pendingHoverCards = new Set();
  const profileLinks = new Map();
  const relationships = new Map();
  const pendingFollows = new Map();
  const allowedVideos = new WeakSet();
  let frame = 0;
  let relationshipSequence = 0;

  function cleanLink(text) {
    if (typeof text !== 'string' || !/^https?:\/\/\S+$/i.test(text)) return text;
    try {
      const url = new URL(text);
      if (!['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(url.hostname)) {
        return text;
      }
      if (/^\/(?:[^/]+\/status|i\/(?:web\/)?status)\/\d+(?:\/|$)/.test(url.pathname)) {
        url.search = '';
        url.hash = '';
      } else {
        for (const key of [...url.searchParams.keys()]) {
          if (/^(?:s|t|ref_src|ref_url|src|cn|cxt|twclid|utm_.+)$/i.test(key)) {
            url.searchParams.delete(key);
          }
        }
      }
      return url.href;
    } catch {
      return text;
    }
  }

  function installSharing() {
    if (window.Clipboard?.prototype.writeText) {
      const writeText = Clipboard.prototype.writeText;
      Clipboard.prototype.writeText = function (text) {
        return Reflect.apply(writeText, this, [cleanLink(text)]);
      };
    }
    if (navigator.share) {
      const share = navigator.share;
      navigator.share = function (data) {
        const cleaned = data && typeof data === 'object'
          ? { ...data, ...(data.url ? { url: cleanLink(data.url) } : {}) }
          : data;
        return Reflect.apply(share, this, [cleaned]);
      };
    }
    // 兼容网站使用旧式复制事件；普通文字及其他网站链接保持原样。
    document.addEventListener('copy', event => {
      if (!event.clipboardData) return;
      const active = document.activeElement;
      const selected = active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement
        ? active.value.slice(active.selectionStart ?? 0, active.selectionEnd ?? 0)
        : window.getSelection()?.toString();
      const text = event.clipboardData.getData('text/plain') || selected || '';
      const cleaned = cleanLink(text);
      if (cleaned === text) return;
      event.clipboardData.clearData();
      event.clipboardData.setData('text/plain', cleaned);
      event.preventDefault();
    });
  }

  function requestUrl(input) {
    try {
      return new URL(input instanceof Request ? input.url : String(input), location.href);
    } catch {
      return null;
    }
  }

  function isTelemetry(input) {
    const url = requestUrl(input);
    if (!url || !['x.com', 'twitter.com', 'api.x.com', 'api.twitter.com'].includes(url.hostname)) {
      return false;
    }
    // 来源：https://easylist.to/easylist/easyprivacy.txt，仅匹配已知统计路径。
    // TODO：核实用途及必要性后再考虑其他端点，不拦截未知的 CES 或业务接口。
    return /^(?:\/(?:i\/api\/)?1\.1\/jot(?:\/|$)|\/i\/jot(?:\/|$)|\/scribe(?:\/|$)|\/jot\.html$)/.test(url.pathname);
  }

  function isRelationshipRequest(input) {
    const url = requestUrl(input);
    return url && ['x.com', 'twitter.com', 'api.x.com', 'api.twitter.com'].includes(url.hostname)
      && /\/1\.1\/friendships\/(?:create|destroy)\.json$/.test(url.pathname);
  }

  function paintRelationship(handle) {
    // 点击后立即同步同一作者的所有按钮，不等待下一次动画帧或原生重绘。
    document.querySelectorAll('.x-minimal-follow').forEach(button => {
      if (button.dataset.handle !== handle) return;
      const article = button.closest(articleSelector);
      if (article) updateArticle(article);
    });
    refreshArticles();
  }

  function cacheRelationship(handle, state) {
    relationships.delete(handle);
    relationships.set(handle, state);
    if (relationships.size > 512) {
      const disposable = [...relationships.keys()].find(key => !pendingFollows.has(key));
      if (disposable) relationships.delete(disposable);
    }
    paintRelationship(handle);
  }

  async function relationshipContext(input, body) {
    const url = requestUrl(input);
    const sequence = ++relationshipSequence;
    if (body === undefined && input instanceof Request) {
      try {
        body = await input.clone().text();
      } catch {
        // 请求体无法读取时，只用响应中的作者标识，不关联其他人的操作。
      }
    }
    const params = typeof body === 'string' ? new URLSearchParams(body) : body;
    const read = key => params?.get?.(key) || url?.searchParams.get(key);
    let handle = read('screen_name')?.replace(/^@/, '').toLowerCase();
    const userId = read('user_id');
    if (!handle && userId) {
      handle = [...pendingFollows].find(([, operation]) => operation.userId === userId)?.[0];
    }
    const candidate = handle ? pendingFollows.get(handle) : null;
    const operation = candidate && candidate.sequence < sequence ? candidate : null;
    return { action: /\/create\.json$/.test(url?.pathname || '') ? 'create' : 'destroy',
      handle, operation, sequence };
  }

  function failRelationship(context, message) {
    const { handle, operation } = context;
    if (!handle || !operation || pendingFollows.get(handle) !== operation) return;
    clearTimeout(operation.timer);
    pendingFollows.delete(handle);
    cacheRelationship(handle, {
      following: false, requested: false, phase: 'error', message,
      sequence: context.sequence ?? operation.sequence,
      userId: operation.userId,
    });
  }

  function rememberRelationship(data, context) {
    if (!data || typeof data.screen_name !== 'string' || data.errors?.length || data.error) {
      failRelationship(context, '关注响应未能确认成功，请检查原生提示后重试');
      return;
    }
    const handle = data.screen_name.toLowerCase();
    if (context.handle && context.handle !== handle) return;
    const pending = pendingFollows.get(handle);
    if (pending && pending !== context.operation) return;
    if ((relationships.get(handle)?.sequence ?? 0) > context.sequence) return;
    if (context.operation) clearTimeout(context.operation.timer);
    pendingFollows.delete(handle);
    const requested = context.action === 'create' && data.follow_request_sent === true;
    // 实际成功响应中的 following 可能仍为旧值，依据已成功完成的操作确认关系。
    const following = context.action === 'create' && !requested;
    cacheRelationship(handle, {
      following, requested, phase: requested ? 'requested' : following ? 'following' : 'idle',
      sequence: context.sequence, userId: data.id_str,
    });
  }

  function installNetworking() {
    const fetch = window.fetch;
    window.fetch = function (input, ...rest) {
      if (isTelemetry(input)) {
        runtime.blockedRequests++;
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      const context = isRelationshipRequest(input) ? relationshipContext(input, rest[0]?.body) : null;
      let result;
      try {
        result = Reflect.apply(fetch, this, [input, ...rest]);
      } catch (error) {
        context?.then(value => failRelationship(value, '关注请求未发出，请重试'));
        throw error;
      }
      if (context) {
        result.then(async response => {
          const value = await context;
          if (!response.ok) {
            failRelationship(value, `关注失败，服务器返回 ${response.status}`);
            return;
          }
          try {
            rememberRelationship(await response.clone().json(), value);
          } catch {
            failRelationship(value, '无法读取关注结果，请检查原生提示后重试');
          }
        }, async () => {
          failRelationship(await context, '关注请求失败或已取消，请重试');
        });
      }
      return result;
    };
    if (navigator.sendBeacon) {
      const beacon = navigator.sendBeacon;
      navigator.sendBeacon = function (url, data) {
        if (isTelemetry(url)) {
          runtime.blockedRequests++;
          return true;
        }
        return Reflect.apply(beacon, this, [url, data]);
      };
    }

    const states = new WeakMap();
    const prototype = XMLHttpRequest.prototype;
    const open = prototype.open;
    const send = prototype.send;
    const abort = prototype.abort;
    const responseProperties = ['readyState', 'status', 'statusText', 'response', 'responseText', 'responseURL'];
    prototype.open = function (method, url, ...rest) {
      if (states.get(this)?.synthetic) {
        for (const key of responseProperties) delete this[key];
      }
      const state = { url, cancelled: false, synthetic: false, async: rest[0] !== false };
      const result = Reflect.apply(open, this, [method, url, ...rest]);
      states.set(this, state);
      return result;
    };
    prototype.abort = function () {
      const state = states.get(this);
      if (state) state.cancelled = true;
      return Reflect.apply(abort, this, []);
    };
    prototype.send = function (...args) {
      const state = states.get(this);
      if (state && isTelemetry(state.url)) {
        if (state.synthetic) throw new DOMException('请求已经发送', 'InvalidStateError');
        state.synthetic = true;
        runtime.blockedRequests++;
        // 本地完成统计请求，避免用网络错误诱发网站重试。
        const complete = () => {
          if (state.cancelled || states.get(this) !== state) return;
          const values = { readyState: 4, status: 204, statusText: 'No Content',
            response: this.responseType === 'json' ? null : '', responseText: '',
            responseURL: requestUrl(state.url)?.href || '' };
          for (const [key, value] of Object.entries(values)) {
            Object.defineProperty(this, key, { configurable: true, value });
          }
          for (const type of ['readystatechange', 'load', 'loadend']) {
            this.dispatchEvent(new Event(type));
          }
        };
        if (state.async) queueMicrotask(complete);
        else complete();
        return;
      }
      if (state && isRelationshipRequest(state.url)) {
        const context = relationshipContext(state.url, args[0]);
        const onEnd = async () => {
          const value = await context;
          if (states.get(this) !== state) {
            failRelationship(value, '关注请求已被替换，请重试');
            return;
          }
          if (this.status < 200 || this.status >= 300) {
            failRelationship(value, '关注请求失败、超时或已取消，请重试');
            return;
          }
          try {
            const data = this.responseType === 'json' ? this.response : JSON.parse(this.responseText);
            rememberRelationship(data, value);
          } catch {
            failRelationship(value, '无法读取关注结果，请检查原生提示后重试');
          }
        };
        this.addEventListener('loadend', onEnd, { once: true });
        try {
          return Reflect.apply(send, this, args);
        } catch (error) {
          this.removeEventListener('loadend', onEnd);
          context.then(value => failRelationship(value, '关注请求未发出，请重试'));
          throw error;
        }
      }
      return Reflect.apply(send, this, args);
    };
  }

  function findUser(tweet, handle, depth = 0) {
    if (!tweet || depth > 4) return null;
    if (tweet.user?.screen_name?.toLowerCase() === handle) return tweet.user;
    return findUser(tweet.retweeted_status, handle, depth + 1)
      || findUser(tweet.quoted_status, handle, depth + 1);
  }

  function pixivUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (!['http:', 'https:'].includes(url.protocol)
        || !['pixiv.net', 'www.pixiv.net'].includes(url.hostname)) return null;
      url.protocol = 'https:';
      url.hostname = 'www.pixiv.net';
      url.port = '';
      url.username = '';
      url.password = '';
      url.hash = '';
      // 兼容旧式主页地址，保留用户编号等功能参数。
      if (url.pathname === '/member.php' && /^\d+$/.test(url.searchParams.get('id') || '')) {
        url.pathname = `/users/${url.searchParams.get('id')}`;
        url.search = '';
      } else {
        url.pathname = url.pathname.replace(/^\/[a-z]{2}(?:-[a-z]{2})?\/(?=users\/)/i, '/');
        for (const key of [...url.searchParams.keys()]) {
          if (/^(?:utm_.+|ref|ref_src|ref_url)$/i.test(key)) url.searchParams.delete(key);
        }
      }
      return url.href;
    } catch {
      return null;
    }
  }

  function rememberProfile(candidate) {
    if (!candidate || typeof candidate !== 'object') return;
    const user = candidate.legacy
      ? { ...candidate.legacy, screen_name: candidate.core?.screen_name || candidate.legacy.screen_name }
      : candidate;
    if (typeof user.screen_name !== 'string') return;
    // 不用只有姓名的局部对象覆盖已有的完整资料。
    if (!Object.hasOwn(user, 'url') && !user.entities?.url && !user.entities?.description) return;
    const handle = user.screen_name.toLowerCase();
    const entries = [
      { url: user.url },
      ...(user.entities?.url?.urls || []),
      ...(user.entities?.description?.urls || []),
    ];
    const links = new Map();
    for (const entry of entries) {
      const href = pixivUrl(entry.unwound_url) || pixivUrl(entry.expanded_url) || pixivUrl(entry.url);
      if (!href) continue;
      const aliases = links.get(href) || new Set([href]);
      for (const alias of [entry.url, entry.expanded_url, entry.unwound_url]) {
        if (typeof alias === 'string') aliases.add(alias);
      }
      links.set(href, aliases);
    }
    const values = [...links].map(([href, aliases]) => ({ href, aliases: [...aliases] }));
    const signature = JSON.stringify(values);
    if (profileLinks.get(handle)?.signature === signature) return true;
    profileLinks.delete(handle);
    profileLinks.set(handle, { signature, links: values });
    if (profileLinks.size > 512) profileLinks.delete(profileLinks.keys().next().value);
    refreshHoverCards();
    return true;
  }

  function hoverCardHandle(card) {
    const name = card.querySelector('[data-testid="User-Name"]');
    for (const anchor of (name || card).querySelectorAll('a[href]')) {
      const match = /^\/([a-z0-9_]+)$/i.exec(anchor.getAttribute('href') || '');
      if (match) return match[1].toLowerCase();
    }
    return null;
  }

  function updateHoverCard(card) {
    if (!card.isConnected) return;
    const handle = hoverCardHandle(card);
    let row = card.querySelector('.x-minimal-pixiv-links');
    if (!handle) {
      row?.remove();
      return;
    }
    // 优先读取悬浮卡自己的资料；时间线缓存作为回退，不另外请求作者主页。
    const roots = [card, card.querySelector('[data-testid="User-Name"]'),
      card.querySelector('[data-testid^="UserAvatar-Container-"]')].filter(Boolean);
    profileSearch: for (const root of roots) {
      const key = Object.keys(root).find(name => name.startsWith('__reactFiber$'));
      let fiber = key ? root[key] : null;
      for (let level = 0; fiber && level < 40; level++, fiber = fiber.return) {
        const user = fiber.memoizedProps?.user;
        const screenName = user?.screen_name || user?.core?.screen_name || user?.legacy?.screen_name;
        if (screenName?.toLowerCase() === handle && rememberProfile(user)) {
          break profileSearch;
        }
      }
    }
    const nativeLinks = [...card.querySelectorAll('a[href]')]
      .filter(anchor => !anchor.closest('.x-minimal-pixiv-links'));
    const links = (profileLinks.get(handle)?.links || []).filter(link => !nativeLinks.some(anchor => {
      return link.aliases.includes(anchor.href) || pixivUrl(anchor.href) === link.href;
    }));
    if (!links.length) {
      // TODO：间接跳转站点或页面未提供展开地址时暂不解析，避免额外请求及错误归属。
      row?.remove();
      return;
    }
    const signature = JSON.stringify([handle, links.map(link => link.href)]);
    if (row?.dataset.signature === signature) return;
    if (!row) {
      row = document.createElement('div');
      row.className = 'x-minimal-pixiv-links';
      (card.firstElementChild || card).appendChild(row);
    }
    row.dataset.signature = signature;
    row.replaceChildren(...links.map(link => {
      const anchor = document.createElement('a');
      const url = new URL(link.href);
      anchor.href = link.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.referrerPolicy = 'no-referrer';
      anchor.textContent = `Pixiv · pixiv.net${url.pathname}${url.search}`;
      anchor.title = link.href;
      anchor.addEventListener('click', event => event.stopPropagation());
      return anchor;
    }));
  }

  function refreshHoverCards() {
    document.querySelectorAll(hoverCardSelector).forEach(card => pendingHoverCards.add(card));
    scheduleArticles();
  }

  function authorState(article, handle) {
    const override = relationships.get(handle);
    if (override) return override;
    const key = Object.keys(article).find(name => name.startsWith('__reactFiber$'));
    let fiber = key ? article[key] : null;
    for (let level = 0; fiber && level < 40; level++, fiber = fiber.return) {
      const user = findUser(fiber.memoizedProps?.tweet, handle);
      if (user) rememberProfile(user);
      if (user && typeof user.following === 'boolean') {
        return { following: user.following, requested: user.follow_request_sent === true,
          userId: user.id_str };
      }
    }
    // TODO：网站更换内部数据结构时补充适配；未知状态不显示按钮，也不新增查询。
    return null;
  }

  function waitForFollowItem(handle, caret) {
    return new Promise((resolve, reject) => {
      let timer;
      let settled = false;
      const finish = item => {
        if (settled) return;
        settled = true;
        observer.disconnect();
        clearTimeout(timer);
        resolve(item);
      };
      const inspect = () => {
        const item = [...document.querySelectorAll('[role="menuitem"]')].find(element => {
          const text = element.textContent.trim().replace(/\s+/g, ' ').toLowerCase();
          return ['关注', '關注', 'follow'].some(label => text === `${label} @${handle}`);
        });
        if (item) finish(item);
      };
      const observer = new MutationObserver(inspect);
      observer.observe(document.body, { childList: true, subtree: true });
      timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        observer.disconnect();
        reject(new Error('未找到对应作者的原生关注项，请使用已打开的更多菜单'));
      }, 2500);
      try {
        caret.click();
        inspect();
      } catch (error) {
        settled = true;
        observer.disconnect();
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  async function followAuthor(event) {
    event.preventDefault();
    event.stopPropagation();
    const button = event.currentTarget;
    const article = button.closest(articleSelector);
    const handle = button.dataset.handle;
    const state = article && authorState(article, handle);
    if (!article || !state || state.following || state.requested || pendingFollows.has(handle)) return;
    const caret = article.querySelector('[data-testid="caret"]');
    if (!caret || document.querySelector('[role="menu"]')) return;
    const operation = { userId: state.userId, timer: null, sequence: ++relationshipSequence };
    pendingFollows.set(handle, operation);
    cacheRelationship(handle, {
      following: false, requested: false, phase: 'pending', userId: state.userId,
      sequence: operation.sequence,
    });
    operation.timer = setTimeout(() => {
      if (pendingFollows.get(handle) !== operation) return;
      // 超时不代表失败；保留操作标识，阻止重复提交，并继续接受迟到的真实结果。
      cacheRelationship(handle, {
        following: false, requested: false, phase: 'uncertain', userId: operation.userId,
        sequence: operation.sequence,
        message: '服务器尚未确认关注结果，请稍后查看；为避免重复关注，暂不重新提交',
      });
    }, 15000);
    try {
      const item = await waitForFollowItem(handle, caret);
      if (pendingFollows.get(handle) !== operation) return;
      // 仅在用户点击新增按钮后执行，且严格匹配作者，绝不调用取消关注项。
      item.click();
    } catch (error) {
      failRelationship({ handle, operation }, error.message);
    }
  }

  // 查看数据改为只读，并移到时间行末尾；操作栏中的等宽格子留给收藏。
  function updateViewStats(article) {
    const links = article.querySelectorAll('a[href*="/analytics"]');
    for (const link of links) {
      if (link.tabIndex !== -1) link.tabIndex = -1;
      if (link.getAttribute('aria-disabled') !== 'true') {
        link.setAttribute('aria-disabled', 'true');
      }
    }
    const source = [...links].find(link => link.closest('[role="group"]'));
    // 时间行已经显示查看数时（例如宽屏详情页）不再复制一份。
    const inline = [...links].find(link => !link.closest('[role="group"]'));
    const time = source && article.querySelector('[data-testid="User-Name"] time');
    const line = time?.closest('a')?.parentElement;
    const existing = article.querySelector('.x-minimal-views');
    if (!source || inline || !line) {
      existing?.remove();
      return;
    }
    // 原生无障碍名称形如“733 次查看。查看帖子分析”，仅保留数量描述。
    let label = (source.getAttribute('aria-label') || '').split(/。|\.\s/)[0].trim()
      || source.textContent.trim();
    if (/^[\d.,]+$/.test(label)) label += ' 查看';
    const text = `· ${label || '查看'}`;
    let item = existing;
    if (!item) {
      item = document.createElement('span');
      item.className = 'x-minimal-views';
    }
    if (item.previousElementSibling !== line) line.after(item);
    if (item.textContent !== text) item.textContent = text;
  }

  function updateArticle(article) {
    if (!article.isConnected) return;
    updateViewStats(article);
    const name = article.querySelector('[data-testid="User-Name"]');
    const link = name?.querySelector('a[href]');
    const path = link?.getAttribute('href') || '';
    const handle = /^\/([A-Za-z0-9_]+)$/.exec(path)?.[1].toLowerCase();
    const existing = article.querySelector('.x-minimal-follow');
    const self = document.querySelector('[data-testid="AppTabBar_Profile_Link"]')?.getAttribute('href');
    const state = handle && authorState(article, handle);
    const cachedAction = state?.phase && state.phase !== 'idle';
    if (!state || (!cachedAction && (state.following || state.requested))
      || self?.toLowerCase() === path.toLowerCase()) {
      existing?.remove();
      return;
    }
    let button = existing;
    if (!button) {
      button = document.createElement('button');
      button.className = 'x-minimal-follow';
      button.type = 'button';
      button.addEventListener('click', followAuthor);
      // 阻止按钮事件被原生 React 委托解释成姓名 hover、焦点或推文快捷键。
      for (const type of ['mouseover', 'mouseout', 'pointerover', 'pointerout',
        'focusin', 'focusout', 'mousedown', 'mouseup', 'pointerdown', 'pointerup',
        'touchstart', 'touchend', 'keydown', 'keyup']) {
        button.addEventListener(type, event => event.stopPropagation());
      }
    }
    // 姓名链接的直接父容器绑定了资料卡事件，按钮必须作为该容器的兄弟节点。
    const line = link.parentElement.parentElement;
    line.classList.add('x-minimal-author-line');
    if (button.parentElement !== line) line.appendChild(button);
    button.dataset.handle = handle;
    const phase = state.phase || 'idle';
    const labels = { pending: '关注中', uncertain: '待确认', following: '已关注',
      requested: '已请求', error: '重试关注', idle: '关注' };
    const text = labels[phase] || '关注';
    button.dataset.phase = phase;
    button.disabled = ['pending', 'uncertain', 'following', 'requested'].includes(phase);
    button.setAttribute('aria-label', `${text} @${handle}`);
    button.setAttribute('aria-busy', String(phase === 'pending'));
    button.title = state.message || '';
    if (button.textContent !== text) button.textContent = text;
  }

  function refreshArticles() {
    document.querySelectorAll(articleSelector).forEach(article => pendingArticles.add(article));
    scheduleArticles();
  }

  function scheduleArticles() {
    if (frame || (!pendingArticles.size && !pendingHoverCards.size)) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const articles = [...pendingArticles];
      pendingArticles.clear();
      articles.forEach(updateArticle);
      const cards = [...pendingHoverCards];
      pendingHoverCards.clear();
      cards.forEach(updateHoverCard);
    });
  }

  function prepareVideo(video) {
    if (!(video instanceof HTMLVideoElement) || allowedVideos.has(video)) return;
    if (video.autoplay) video.autoplay = false;
    if (video.preload !== 'none') video.preload = 'none';
  }

  function installMediaSaving() {
    // 在线预览时不打断已经开始播放的视频；新加载的视频必须先有播放手势。
    document.querySelectorAll('video').forEach(video => {
      if (!video.paused) allowedVideos.add(video);
    });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this instanceof HTMLVideoElement && !allowedVideos.has(this)) {
        prepareVideo(this);
        return Promise.reject(new DOMException('请点击视频后播放', 'NotAllowedError'));
      }
      return Reflect.apply(play, this, []);
    };
    const allowPlayback = event => {
      if (!event.isTrusted || !(event.target instanceof Element)) return;
      const player = event.target.closest('video, [data-testid="videoPlayer"], [data-testid="videoComponent"]');
      if (!player) return;
      const videos = player instanceof HTMLVideoElement ? [player] : player.querySelectorAll('video');
      videos.forEach(video => allowedVideos.add(video));
    };
    document.addEventListener('pointerdown', allowPlayback, true);
    document.addEventListener('keydown', allowPlayback, true);
  }

  function startObserving() {
    refreshArticles();
    refreshHoverCards();
    document.querySelectorAll('video').forEach(prepareVideo);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.target instanceof Element) {
          const article = record.target.closest(articleSelector);
          if (article) pendingArticles.add(article);
          const card = record.target.closest(hoverCardSelector);
          if (card) pendingHoverCards.add(card);
          if (record.type === 'attributes' && record.target instanceof HTMLVideoElement) {
            prepareVideo(record.target);
          }
        }
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(articleSelector)) pendingArticles.add(node);
          node.querySelectorAll(articleSelector).forEach(article => pendingArticles.add(article));
          if (node.matches(hoverCardSelector)) pendingHoverCards.add(node);
          node.querySelectorAll(hoverCardSelector).forEach(card => pendingHoverCards.add(card));
          if (node.matches('video')) prepareVideo(node);
          node.querySelectorAll('video').forEach(prepareVideo);
        }
      }
      scheduleArticles();
    });
    observer.observe(document.body, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['autoplay', 'preload', 'href'],
    });
    runtime.refresh = () => {
      refreshArticles();
      refreshHoverCards();
    };
  }

  function addStyle(css) {
    const style = document.createElement('style');
    style.id = 'twitter-minimal-style';
    style.textContent = css;
    if (document.documentElement) {
      document.documentElement.appendChild(style);
    } else {
      const observer = new MutationObserver(() => {
        if (!document.documentElement) return;
        observer.disconnect();
        document.documentElement.appendChild(style);
      });
      observer.observe(document, { childList: true });
    }
  }

  installSharing();
  installNetworking();
  installMediaSaving();
  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving, { once: true });

  // 使用稳定的页面标识，避免依赖文字语言或动态类名。
  // 样式也会作用于后续加载的节点，无需轮询或修改页面业务逻辑。
  addStyle(`
    .x-minimal-pixiv-links {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 8px 16px 12px;
      font-size: 14px;
      line-height: 20px;
      overflow-wrap: anywhere;
    }

    .x-minimal-pixiv-links a {
      color: rgb(29, 155, 240);
      text-decoration: none;
    }

    .x-minimal-pixiv-links a:hover {
      text-decoration: underline;
    }

    .x-minimal-author-line {
      flex-direction: row !important;
      align-items: center !important;
      gap: 8px;
    }

    .x-minimal-follow {
      flex: 0 0 auto;
      border: 1px solid currentColor;
      border-radius: 9999px;
      padding: 2px 10px;
      background: transparent;
      color: rgb(29, 155, 240);
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      line-height: 20px;
      cursor: pointer;
    }

    .x-minimal-follow:disabled {
      cursor: default;
      opacity: 0.6;
    }

    .x-minimal-follow[data-phase="pending"] {
      cursor: wait;
    }

    .x-minimal-follow:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    /* 隐藏整个右侧栏。 */
    [data-testid="sidebarColumn"] {
      display: none !important;
    }

    /* 左侧导航仅保留主页、探索、通知、聊天、历史、个人资料和更多。 */
    header nav > :is(a, button):not(
      [data-testid="AppTabBar_Home_Link"],
      [data-testid="AppTabBar_Explore_Link"],
      [data-testid="AppTabBar_Notifications_Link"],
      [data-testid="AppTabBar_DirectMessage_Link"],
      [href="/i/history"],
      [data-testid="AppTabBar_Profile_Link"],
      [data-testid="AppTabBar_More_Menu"]
    ) {
      display: none !important;
    }

    /* 隐藏导航外的标志、独立发帖按钮和账号菜单。 */
    header h1:has(a[aria-label="X"][href="/home"]),
    header [data-testid="SideNav_NewTweet_Button"],
    header [data-testid="SideNav_AccountSwitcher_Button"] {
      display: none !important;
    }

    /* 仅隐藏悬浮聊天和 Grok 抽屉，不影响左侧聊天入口和聊天页面。 */
    [data-testid="GrokDrawer"],
    [data-testid="GrokDrawerHeader"],
    [data-testid="chat-drawer-root"],
    [data-testid="chat-drawer-main"],
    [data-testid="DMDrawer"] {
      display: none !important;
    }

    /* 桌面布局：两侧为导航预留等宽空间，让时间线自身位于屏幕中央。 */
    @media (min-width: 768px) {
      div:has(> header[role="banner"]):has(> main[role="main"]) {
        --x-minimal-nav-width: 72px;
        width: calc(100% - 32px) !important;
        max-width: calc(1000px + var(--x-minimal-nav-width) + var(--x-minimal-nav-width)) !important;
        margin-inline: auto !important;
        padding-inline-end: var(--x-minimal-nav-width) !important;
        box-sizing: border-box !important;
      }

      header[role="banner"] {
        flex: 0 0 var(--x-minimal-nav-width) !important;
        width: var(--x-minimal-nav-width) !important;
        align-items: flex-start !important;
      }

      /* 同步固定定位导航及其内层宽度，避免沿用原来的桌面宽度。 */
      header[role="banner"] > div,
      header[role="banner"] > div > div,
      header[role="banner"] > div > div > div {
        width: var(--x-minimal-nav-width) !important;
        box-sizing: border-box !important;
      }

      /* 清除原生导航的横向补偿，避免固定定位层伸入推文并截获鼠标。 */
      header[role="banner"] > div {
        margin-inline: 0 !important;
      }

      header nav {
        width: 100% !important;
      }

      main[role="main"] {
        flex: 1 1 0% !important;
        min-width: 0 !important;
        width: 100% !important;
        max-width: 1000px !important;
      }

      main > div:has([data-testid="primaryColumn"]),
      main > div > div:has([data-testid="primaryColumn"]),
      main div:has(> [data-testid="primaryColumn"]) {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        flex: 1 1 auto !important;
      }

      [data-testid="primaryColumn"] {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 1000px !important;
        flex: 1 1 auto !important;
        box-sizing: border-box !important;
      }

      /* 解除列表内层原生的 600 像素限宽，让推文卡片随时间线展开。 */
      [data-testid="primaryColumn"] div:has(> section[role="region"]) {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }

      /* 操作栏随正文展开，保留原生按钮的弹性比例与间距分配。 */
      [data-testid="primaryColumn"] article[data-testid="tweet"]
      [role="group"]:has([data-testid="reply"]):has([data-testid="like"], [data-testid="unlike"]) {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
    }

    /* 回复、转帖、喜欢、收藏的可点击范围撑满各自格子；分享保持原生范围。 */
    article[data-testid="tweet"]
    [role="group"]:has([data-testid="reply"]) > div > :is(
      [data-testid="reply"],
      [data-testid="retweet"],
      [data-testid="unretweet"],
      [data-testid="like"],
      [data-testid="unlike"],
      [data-testid="bookmark"],
      [data-testid="removeBookmark"]
    ) {
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      border-radius: 4px;
    }

    /* 用背景色标示各动作的实际触发范围：回复、转帖、喜欢、收藏、分享。 */
    article[data-testid="tweet"] [role="group"] [data-testid="reply"] {
      background: rgba(29, 155, 240, 0.28) !important;
    }

    article[data-testid="tweet"] [role="group"] :is(
      [data-testid="retweet"], [data-testid="unretweet"]
    ) {
      background: rgba(0, 186, 124, 0.28) !important;
    }

    article[data-testid="tweet"] [role="group"] :is(
      [data-testid="like"], [data-testid="unlike"]
    ) {
      background: rgba(249, 24, 128, 0.28) !important;
    }

    article[data-testid="tweet"] [role="group"] :is(
      [data-testid="bookmark"], [data-testid="removeBookmark"]
    ) {
      background: rgba(255, 160, 0, 0.30) !important;
    }

    article[data-testid="tweet"]
    [role="group"]:has([data-testid="reply"]) > div:last-child button:not([data-testid]) {
      background: rgba(120, 86, 255, 0.22) !important;
      border-radius: 4px;
    }

    /* 操作栏中的查看数据按钮只保留占位语义，实际显示位置改到时间行。 */
    article[data-testid="tweet"]
    [role="group"]:has([data-testid="reply"]) > div:has(a[href*="/analytics"]) {
      display: none !important;
    }

    /* 收藏沿用查看数据原来的等宽格子，触发区域与其他动作一致。 */
    article[data-testid="tweet"]
    [role="group"]:has([data-testid="reply"]) > div:has(> :is(
      [data-testid="bookmark"], [data-testid="removeBookmark"]
    )) {
      flex: 1 1 0% !important;
    }

    /* 查看数据只读：取消链接的点击与键盘访问。 */
    article[data-testid="tweet"] a[href*="/analytics"] {
      pointer-events: none !important;
      cursor: default !important;
      text-decoration: none !important;
    }

    .x-minimal-views {
      margin-left: 4px;
      line-height: inherit;
      white-space: nowrap;
    }

    /* 中等屏幕：只保留导航图标，文字隐藏但无障碍名称仍然保留。 */
    @media (min-width: 768px) and (max-width: 1439px) {
      header nav > :is(a, button) {
        align-items: center !important;
      }

      header nav > :is(a, button) > div {
        padding: 12px !important;
      }

      header nav > :is(a, button) > div > div:not(:has(svg)) {
        display: none !important;
      }
    }

    /* 宽屏：恢复带文字的导航，时间线最多占用 1000 像素。 */
    @media (min-width: 1440px) {
      div:has(> header[role="banner"]):has(> main[role="main"]) {
        --x-minimal-nav-width: 240px;
      }
    }

    /* 窄屏：不重写原生移动导航，仅让主内容随可用空间收缩。 */
    @media (max-width: 767px) {
      main[role="main"] {
        flex: 1 1 0% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }

      main > div:has([data-testid="primaryColumn"]),
      main > div > div:has([data-testid="primaryColumn"]),
      main div:has(> [data-testid="primaryColumn"]),
      [data-testid="primaryColumn"] {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        flex: 1 1 auto !important;
        box-sizing: border-box !important;
      }
    }
  `);
})();
