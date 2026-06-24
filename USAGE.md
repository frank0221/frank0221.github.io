# 使用说明

这是一份面向日常维护的说明，适用于 Frank Wu 个人 GitHub Pages 主页。

## 1. 项目结构

```text
.
├── index.html        # 首页结构和静态内容
├── css/style.css     # 页面样式、响应式布局和视觉细节
├── js/app.js         # 文章列表、搜索、分类筛选、Markdown 渲染
├── posts/            # Markdown 随笔文章
├── README.md         # 项目简介
└── USAGE.md          # 使用说明
```

这个站点是纯静态项目，不需要 Node.js 构建，也不需要安装依赖。推送到 GitHub Pages 仓库后即可部署。

## 2. 本地预览

不要直接双击 `index.html` 预览文章区，因为浏览器会限制本地文件读取，导致 Markdown 文章加载失败。

在项目根目录运行：

```bash
python -m http.server 8000
```

然后在浏览器打开：

```text
http://localhost:8000
```

如果 8000 端口被占用，可以换一个端口：

```bash
python -m http.server 8080
```

对应访问：

```text
http://localhost:8080
```

## 3. 修改首页内容

首页主要内容在 `index.html` 中维护。

常见修改位置：

- 顶部导航：`<header class="site-header">`
- 首屏介绍：`<section class="hero" id="top">`
- 关于我：`<section class="section section-white" id="about">`
- 研究方向：`<section class="section" id="focus">`
- 随笔区域：`<section class="section section-white" id="notes">`
- 时间线：`<section class="section" id="timeline">`
- 联系方式：`<section class="section contact-section" id="contact">`

如果修改了 CSS 或 JS 文件，建议同步更新 `index.html` 中的版本号，避免浏览器缓存旧文件：

```html
<link rel="stylesheet" href="css/style.css?v=20260620-2">
<script src="js/app.js?v=20260620"></script>
```

例如把 `v=20260620-2` 改成 `v=20260620-3`。

## 4. 修改样式

样式集中在 `css/style.css`。

常见区域：

- 全局颜色和变量：`:root`
- 顶部导航：`.site-header`、`.nav-bar`
- 首屏布局：`.hero`、`.hero-copy`、`.hero-visual`
- 黑色芯片卡片：`.silicon-chip`、`.chip-stack`
- 文章阅读器：`.notes-shell`、`.notes-panel`、`.reader`
- 联系方式黑色卡片：`.contact-card`
- 移动端适配：`@media (max-width: 980px)`、`@media (max-width: 720px)`

修改样式后建议重点检查：

- 桌面端是否有横向滚动条
- 手机端文字是否溢出
- 黑色卡片、文章阅读器、联系区是否换行正常

## 5. 添加新文章

1. 在 `posts/` 目录下创建 Markdown 文件，例如：

```text
posts/riscv-note.md
```

2. 在 `js/app.js` 的 `posts` 数组中添加文章配置：

```javascript
{
    title: "RISC-V 学习笔记",
    date: "2026-06-20",
    file: "posts/riscv-note.md",
    category: "技术",
    summary: "记录 RISC-V 指令集和 CPU 设计相关笔记。"
}
```

字段说明：

| 字段 | 含义 |
| --- | --- |
| `title` | 文章标题，显示在文章列表中 |
| `date` | 日期，建议使用 `YYYY-MM-DD` |
| `file` | Markdown 文件路径 |
| `category` | 分类，会生成筛选按钮 |
| `summary` | 文章摘要，会显示在阅读器顶部 |

3. 本地预览并确认文章能打开。

4. 提交并推送。

## 6. Markdown 写法

文章支持常见 Markdown 语法：

````markdown
# 一级标题

## 二级标题

普通段落文字。

- 列表项
- 列表项

```c
int main() {
    return 0;
}
```

| 名称 | 说明 |
| --- | --- |
| CPU | 处理器 |
````

注意：当前 Markdown 渲染器是项目内的轻量实现，适合普通标题、段落、列表、代码块、引用和表格。如果需要更复杂的 Markdown 功能，可以后续接入成熟解析库。

## 7. 发布到 GitHub Pages

当前仓库远端是：

```text
https://github.com/frank0221/frank0221.github.io.git
```

常规发布流程：

```bash
git status -sb
git add index.html css/style.css js/app.js posts/你的文章.md README.md USAGE.md
git commit -m "update personal site"
git push origin main
```

实际提交时只添加本次修改过的文件，不要无脑 `git add -A`。

推送成功后，GitHub Pages 通常会在几分钟内更新：

```text
https://frank0221.github.io/
```

## 8. 常见问题

### 文章加载失败

通常是因为直接双击打开了 `index.html`。请使用本地 HTTP 服务预览：

```bash
python -m http.server 8000
```

### 修改样式后线上没变化

先确认 GitHub Pages 已部署完成，然后清除浏览器缓存。

在 Windows 上，可以在网站页面按：

```text
Ctrl + F5
```

这会强制重新加载页面资源。如果仍然没有变化，在 Chrome 或 Edge 中执行：

1. 按 `F12` 打开开发者工具。
2. 长按或右键浏览器的刷新按钮。
3. 选择“清空缓存并硬性重新加载”。

开发时也可以打开开发者工具的 `Network` 面板，勾选 `Disable cache`。该选项只在开发者工具保持打开时生效。

如果修改的是 CSS 或 JavaScript，建议同时更新 `index.html` 或 `notes.html` 中资源链接后的版本号：

```html
css/style.css?v=20260620-3
js/app.js?v=20260621-4
```

如果修改的是 Markdown 文章，而页面仍显示旧内容，需要更新 `js/app.js` 中 Markdown 请求地址后的版本号，或者将请求改为不使用缓存：

```javascript
const response = await fetch(post.file, { cache: "no-store" });
```

### 中文文件名文章打不开

本地预览和 GitHub Pages 一般支持中文路径。如果遇到问题，建议新文章使用英文文件名，例如：

```text
posts/linker-script-note.md
```

### 移动端文字溢出

优先检查 `css/style.css` 中的移动端媒体查询：

```css
@media (max-width: 720px) {
    ...
}
```

必要时降低字体大小、取消 `white-space: nowrap`，或者给容器增加 `minmax(0, 1fr)` 约束。

## 9. 维护建议

- 每次改页面后先本地预览。
- 每次改 CSS 或 JS 后更新版本号。
- 新文章优先使用英文文件名。
- 提交前运行：

```bash
git diff --check
git status -sb
```

- 推送后等待 GitHub Pages 部署完成，再刷新线上页面。
