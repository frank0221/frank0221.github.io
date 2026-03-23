# 🌌 My Cool Blog

这是一个酷炫、极简且纯静态的个人博客模板，专门设计用于 GitHub Pages。
- 基于 **Vue 3**, **Marked**, 和 **Canvas** 打造。

## ✨ 特性

- **纯静态**: 不需要 Node.js，不需要构建，即开即用。
- **酷炫视觉**: 动态星空背景 + 玻璃态设计 + 霓虹光效。
- **Markdown 支持**: 直接渲染 Markdown 文件，支持代码高亮。
- **极速**: 基于 CDN 加载，文件体积极小。

## 🛠️ 本地预览

由于浏览器的安全策略（CORS），你不能直接双击 `index.html` 打开。你需要一个简单的 HTTP 服务器。

### 如果你安装了 Python (推荐):

在项目根目录下打开终端，运行：

```bash
python -m http.server 8000
```

然后访问: [http://localhost:8000](http://localhost:8000)

### 如果你使用 VS Code:

安装 "Live Server" 扩展，右键 `index.html` 选择 "Open with Live Server"。

## 📝 如何写文章

1.  在 `posts/` 目录下创建一个新的 `.md` 文件（例如 `my-new-post.md`）。
2.  打开 `js/app.js`。
3.  在 `posts` 数组中添加你的文章信息：

```javascript
const posts = ref([
    { title: '我的新文章', date: '2023-10-20', file: 'posts/my-new-post.md' },
    // ... 其他文章
]);
```

## 🚀 部署到 GitHub Pages

1.  在 GitHub 上创建一个新仓库（例如 `my-blog`）。
2.  将所有文件上传到该仓库。
3.  进入仓库 **Settings** -> **Pages**。
4.  在 **Build and deployment** 下：
    - Source: **Deploy from a branch**
    - Branch: **main** (或 master) / **root** (根目录)
5.  点击 **Save**。
6.  等待几分钟，你的博客就会上线！

## 🎨 自定义

- 修改 `css/style.css` 中的 `:root` 变量来改变颜色。
- 修改 `js/app.js` 中的 `initStarfield` 函数来调整背景动画。
