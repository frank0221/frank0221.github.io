# Frank Wu Personal Site

这是 Frank Wu 的个人 GitHub Pages 主页，使用纯静态 HTML、CSS 和 JavaScript 构建。

## 内容

- Apple 风格的个人主页首屏
- About、Focus、Timeline、Contact 信息区
- Markdown 随笔列表、搜索、分类筛选和文章阅读器
- 无构建流程，适合直接部署到 `frank0221.github.io`

## 本地预览

直接双击 `index.html` 时，浏览器会限制 Markdown 文件读取。请在项目根目录启动本地 HTTP 服务：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 添加文章

1. 在 `posts/` 下新增 `.md` 文件。
2. 在 `js/app.js` 的 `posts` 数组中添加文章标题、日期、路径、分类和摘要。
3. 提交并推送到 GitHub Pages 仓库。
