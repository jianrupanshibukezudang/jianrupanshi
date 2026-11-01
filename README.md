# red-like · 小红书风格信息流

一个使用原生 HTML / CSS / JavaScript 实现的小红书风格信息流页面，零构建工具、零框架依赖。页面展示 10 条模拟帖子卡片，并通过 HTTP 接口对接独立的点赞计数服务（FastAPI），支持查看实时点赞数与"一次点赞、永久生效"的点赞交互。

## 功能特性

- **三列瀑布式信息流**：CSS Grid 三列等宽布局，卡片配图固定 4:5 比例，顶部吸顶毛玻璃标题栏
- **帖子卡片**：封面图（懒加载）、标题与文案（最多两行省略）、彩色首字头像、作者昵称
- **实时点赞数**：页面加载时从后端拉取全部帖子的点赞数；点赞成功后以服务端返回的最新计数回显
- **只赞不撤的产品规则**：每条帖子仅可点赞一次，点赞后爱心变为红色实心并永久锁定，不提供取消入口
- **已赞状态持久化**：已点赞的帖子 ID 存入 `localStorage`，刷新或重新打开页面后仍保持锁定
- **请求防抖与容错**：请求进行中禁止重复点击；后端不可用时页面正常渲染（点赞数兜底为 0）；点赞失败弹出提示且不改变 UI
- **大数格式化**：点赞数 ≥ 10000 时显示为 `x.x万`（如 `12089` → `1.2万`）
- **基础安全处理**：所有数据字段渲染前经过 HTML 转义，防止特殊字符破坏页面结构

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 页面结构 | 原生 HTML5 |
| 样式 | 原生 CSS3（CSS 变量、Grid、`aspect-ratio`、`backdrop-filter`、CSS 动画） |
| 交互逻辑 | 原生 JavaScript（ES5 语法、IIFE、事件委托，无打包产物） |
| HTTP 请求 | [axios](https://github.com/axios/axios)（jsDelivr CDN 引入） |
| 配图 | [Picsum Photos](https://picsum.photos/) 占位图 |
| 后端服务 | FastAPI 点赞服务（独立项目 `like-service`，默认端口 `8080`） |

## 项目结构

```
red-like/
├── index.html        # 页面入口：顶部标题栏 + 信息流容器，按顺序引入脚本
├── css/
│   └── style.css     # 全部样式：品牌色变量、布局、卡片、爱心动画等
├── js/
│   └── app.js        # 页面渲染与点赞交互逻辑（IIFE 包裹，不污染全局）
├── data/
│   └── posts.js      # 本地模拟帖子数据，挂载到 window.POSTS
└── README.md
```

脚本加载顺序（见 `index.html`）：**axios CDN → `data/posts.js` → `js/app.js`**。数据文件使用普通 `<script>` 而非 ES Module，因此页面也支持直接以 `file://` 方式打开。

## 快速开始

### 1. 启动点赞后端服务

前端依赖同级目录下的 [`like-service`](../like-service)（FastAPI，端口 `8080`）：

```bash
cd like-service
python server_fastapi.py
```

启动成功后可见 `Uvicorn running on http://0.0.0.0:8080`，接口文档见 `like-service/API_DOC.md`，交互式文档位于 <http://localhost:8080/docs>。

> 后端为可选依赖：未启动时前端仍可正常浏览，只是所有点赞数显示为 0。

### 2. 打开前端页面

**方式一：直接打开**（无需任何服务器）

双击 `index.html`，或将其拖入浏览器即可。

**方式二：本地静态服务器**（更接近真实环境，推荐）

```bash
# 在 red-like 目录下执行（Python 3）
python -m http.server 8000
```

然后浏览器访问 <http://localhost:8000>。

### 环境要求

- 现代浏览器（Chrome / Edge / Firefox / Safari 较新版本，需支持 `aspect-ratio`、`backdrop-filter`）
- 首次打开需联网：axios 由 CDN 加载，封面图来自 picsum.photos

## 使用说明

1. 页面加载时请求 `GET http://localhost:8080/likes` 获取全部点赞数并渲染卡片
2. 点击卡片左下角的空心爱心即可点赞：
   - 请求成功 → 爱心带弹跳动画变为红色实心、数字更新为服务端返回值、按钮永久禁用
   - 请求失败 → 弹出"操作失败，请稍后重试"，UI 保持原样，可再次点击
3. 已点赞的帖子在刷新页面后仍为锁定状态（记录保存在 `localStorage`）

## 数据说明

### 帖子数据（`data/posts.js`）

通过全局变量 `window.POSTS` 暴露，共 10 条记录（`post_001` ~ `post_010`），字段如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 帖子唯一标识，同时作为点赞接口的 `resource_id` |
| `title` | `string` | 帖子标题 |
| `content` | `string` | 帖子文案内容 |
| `author` | `string` | 作者昵称（取首字渲染彩色头像） |
| `imageUrl` | `string` | 配图地址，统一使用 `https://picsum.photos/400/500?random=x` |
| `likes` | `number` | 初始点赞数（数据规范中的扩展字段，**运行时实际计数以后端接口为准，当前代码未读取该字段**） |

### 本地点赞记录（localStorage）

| 项目 | 值 |
| --- | --- |
| 键名 | `red-like:liked-posts` |
| 内容 | 已点赞帖子 ID 的 JSON 数组，如 `["post_001","post_004"]` |
| 用途 | 重新进入页面后恢复"已赞锁定"状态；清除浏览器本地数据即可重置 |

## 接口对接

接口地址常量集中定义在 `js/app.js` 顶部，需要更换后端地址时直接修改：

```js
var LIKES_API = 'http://localhost:8080/likes'; // 点赞数查询
var LIKE_API  = 'http://localhost:8080/like/'; // 点赞（JSON 请求体）
```

| 调用时机 | 方法 | 地址 | 请求体 | 成功响应 |
| --- | --- | --- | --- | --- |
| 页面初始化 | GET | `/likes` | — | `{ "likes": [{ "resource_id": "post_001", "likes": 3257 }] }` |
| 点击爱心 | POST | `/like/` | `{ "resource_id": "post_001" }` | `{ "resource_id": "post_001", "likes": 3258 }` |

说明：

- 后端同时提供 `/unlike` 接口，但按产品规则前端**不调用、不提供取消入口**
- 后端是纯计数器，不记录用户维度的点赞状态，"每个帖子只能赞一次"完全由前端的 `localStorage` 保证
- 后端已开放全量 CORS，前端以 `file://` 或任意端口打开均可跨域访问

## 后续可扩展方向

- 帖子数据改为后端接口动态获取，移除本地 `posts.js`
- 接入用户体系，将点赞状态下沉到服务端
- 移动端响应式适配（当前固定三列布局，主要面向桌面浏览）
- 图片加载失败占位图与骨架屏
