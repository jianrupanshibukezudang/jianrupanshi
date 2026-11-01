/**
 * 小红书风格信息流 —— 页面渲染与交互基础逻辑
 *
 * 数据来源：
 *   帖子数据：data/posts.js 挂载的全局变量 window.POSTS
 *   点赞数量：axios 请求后端 GET http://localhost:8080/likes
 *   点赞操作：axios 请求后端 POST http://localhost:8080/like/
 * 产品规则：暂不支持取消点赞。每条帖子仅可点赞一次，点赞完成后按钮永久锁定，
 *           不提供撤销入口与业务逻辑；已赞记录存于 localStorage，重新进入页面依旧锁定。
 */
(function () {
  'use strict';

  var feedEl = document.getElementById('feed');

  // 点赞数查询接口（见 like-service/API_DOC.md 第一个接口）
  var LIKES_API = 'http://localhost:8080/likes';
  // 点赞接口（见 API_DOC.md 第二个接口，JSON 请求体传 resource_id）
  var LIKE_API = 'http://localhost:8080/like/';

  // 已点赞帖子记录：产品要求每条帖子仅可点赞一次，不支持取消点赞。
  // 用 localStorage 持久化，刷新或重新进入页面后已赞帖子依然保持锁定，无法重复点赞。
  var LIKED_STORAGE_KEY = 'red-like:liked-posts';
  var likedSet = loadLikedSet();

  function loadLikedSet() {
    try {
      var raw = localStorage.getItem(LIKED_STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      var set = {};
      arr.forEach(function (id) { set[id] = true; });
      return set;
    } catch (e) {
      return {}; // localStorage 不可用时退化为仅本次页面访问内锁定
    }
  }

  function saveLikedSet(set) {
    try {
      var ids = Object.keys(set).filter(function (id) { return set[id]; });
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) { /* 忽略写入失败，内存锁定仍然生效 */ }
  }

  // 点赞本地内存状态：{ postId: { liked: Boolean, count: Number } }
  var likeStore = {};

  /* ---------------- 数据处理 ---------------- */

  function initLikeStore(posts, likeCounts) {
    posts.forEach(function (post) {
      likeStore[post.id] = {
        // 点赞状态以本地已赞记录为准（每条帖子仅一次，且不可撤销）
        liked: likedSet[post.id] === true,
        // 初始点赞数以服务端接口返回为准；接口无该帖子数据时默认 0
        count: likeCounts[post.id] || 0
      };
    });
  }

  // 调用后端接口获取所有资源点赞数，返回 { resource_id: count } 映射。
  // 后端未启动、网络异常或 axios 未加载时，静默兜底为空对象，页面统一显示 0，不报错。
  function fetchLikeCounts() {
    if (typeof axios === 'undefined') {
      return Promise.resolve({});
    }
    return axios.get(LIKES_API)
      .then(function (res) {
        var map = {};
        (res.data.likes || []).forEach(function (item) {
          map[item.resource_id] = item.likes;
        });
        return map;
      })
      .catch(function () {
        return {};
      });
  }

  // 点赞数展示格式化：10000 以上显示 x.x万
  function formatCount(count) {
    if (count >= 10000) {
      return (count / 10000).toFixed(1).replace(/\.0$/, '') + '万';
    }
    return String(count);
  }

  // 头像底色（按帖子序号循环取色）
  function avatarColor(index) {
    var hues = [350, 20, 140, 200, 260, 300, 160, 45, 220, 0];
    return 'hsl(' + hues[index % hues.length] + ', 70%, 65%)';
  }

  // 防止本地数据中的特殊字符破坏 HTML
  function escapeHtml(str) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, function (ch) {
      return map[ch];
    });
  }

  /* ---------------- 页面渲染 ---------------- */

  // 爱心图标：空心/实心由 CSS 的 .is-liked 类控制
  var HEART_SVG =
    '<svg class="like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 ' +
    'c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 ' +
    'c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

  function buildCard(post, index) {
    var card = document.createElement('article');
    card.className = 'post-card';
    card.dataset.id = post.id;

    var liked = likeStore[post.id].liked;
    // 已点赞的按钮渲染即为红色实心、禁用状态：不可重复点赞，也没有撤销入口
    var likeBtnAttrs = 'class="like-btn' + (liked ? ' is-liked' : '') + '"' +
      ' type="button"' +
      (liked ? ' disabled' : '') +
      ' aria-pressed="' + (liked ? 'true' : 'false') + '"' +
      ' aria-label="' + (liked ? '已点赞' : '点赞') + '"';

    card.innerHTML =
      '<div class="card-cover">' +
        '<img src="' + escapeHtml(post.imageUrl) + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' +
      '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-title">' + escapeHtml(post.title) + '</h3>' +
        '<p class="card-content">' + escapeHtml(post.content) + '</p>' +
      '</div>' +
      '<div class="card-footer">' +
        '<button ' + likeBtnAttrs + '>' +
          HEART_SVG +
          '<span class="like-count">' + formatCount(likeStore[post.id].count) + '</span>' +
        '</button>' +
        '<div class="author">' +
          '<span class="avatar" style="background:' + avatarColor(index) + '">' +
            escapeHtml(post.author.charAt(0)) +
          '</span>' +
          '<span class="author-name">' + escapeHtml(post.author) + '</span>' +
        '</div>' +
      '</div>';

    return card;
  }

  // 页面初始化：读取本地帖子数据 + 接口点赞数，循环渲染三列信息流
  function render(likeCounts) {
    var posts = window.POSTS || [];
    initLikeStore(posts, likeCounts || {});

    var fragment = document.createDocumentFragment();
    posts.forEach(function (post, index) {
      fragment.appendChild(buildCard(post, index));
    });

    feedEl.innerHTML = '';
    feedEl.appendChild(fragment);
  }

  /* ---------------- 点赞交互（接入真实接口） ---------------- */

  function onLikeClick(event) {
    var btn = event.target.closest ? event.target.closest('.like-btn') : null;
    if (!btn || !feedEl.contains(btn)) return;

    var card = btn.closest('.post-card');
    var id = card && card.dataset.id;
    if (!id || !likeStore[id]) return;

    var state = likeStore[id];
    // 已点赞（含本次/历史访问）的永久锁定；请求进行中防重复点击
    if (state.liked || state.pending) return;
    state.pending = true;

    axios.post(LIKE_API, { resource_id: id })
      .then(function (res) {
        // 接口返回后，以服务端的 likes 为准更新数字，切换为红色实心爱心并永久禁用
        state.liked = true;
        likedSet[id] = true;
        saveLikedSet(likedSet);
        state.count = res.data.likes;
        btn.classList.add('is-liked');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', '已点赞');
        btn.disabled = true; // 点赞完成即锁定：禁止重复点赞，不提供撤销入口
        btn.querySelector('.like-count').textContent = formatCount(state.count);
      })
      .catch(function () {
        // 接口调用失败时提示，UI 状态保持不变（成功后才切换，无需回滚）
        alert('操作失败，请稍后重试');
      })
      .then(function () {
        state.pending = false;
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    feedEl.addEventListener('click', onLikeClick); // 事件委托，统一绑定点赞入口
    // 先请求点赞数再渲染；请求失败时 fetchLikeCounts 内部兜底为 0，不影响页面渲染
    fetchLikeCounts().then(function (likeCounts) {
      render(likeCounts);
    });
  });
})();
