const posts = [
    {
        title: "欢迎来到我的主页",
        date: "2023-10-01",
        file: "posts/welcome.md",
        category: "置顶",
        summary: "个人简介、技术栈与联系方式。"
    },
    {
        title: "链接脚本学习",
        date: "2026-03-23",
        file: "posts/链接脚本学习.md",
        category: "笔记",
        summary: "链接脚本的 MEMORY、SECTIONS 与位置计数器。"
    },
    {
        title: "系统结构笔记（一）：系统结构基础概念",
        date: "2026-06-21",
        file: "posts/系统结构笔记（一）：系统结构基本概念.md",
        category: "笔记",
        summary: "计算机系统结构基础知识"
    },
    {
        title: "pynq入门笔记（一）",
        date: "2026-06-24",
        file: "posts/pynq入门（一）：Overlay和MMIO.md",
        category: "pynq系列",
        summary: "pynq入门"
    },
    {
        title: "画图笔记",
        date: "2026-03-05",
        file: "posts/画图笔记.md",
        category: "笔记",
        summary: "Matplotlib 常用图表与科研绘图技巧。"
    },
    {
        title: "关于这个站点",
        date: "2026-06-20",
        file: "posts/about.md",
        category: "项目",
        summary: "这个 GitHub Pages 站点的设计与实现说明。"
    }
];

const state = {
    query: "",
    category: "全部",
    currentFile: ""
};

const elements = {
    searchInput: document.querySelector("#searchInput"),
    categoryFilters: document.querySelector("#categoryFilters"),
    postList: document.querySelector("#postList"),
    readerMeta: document.querySelector("#readerMeta"),
    articleContent: document.querySelector("#articleContent")
};

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
}

function renderInline(text) {
    let html = escapeHtml(text);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/\[\^([^\]]+)\]/g, '<sup>[$1]</sup>');
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
    );
    return html;
}

function isTableDivider(line) {
    return /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line) && line.includes("-");
}

function splitTableRow(line) {
    return line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim());
}

function parseMarkdown(source) {
    const lines = source.replace(/\r\n/g, "\n").split("\n");
    const html = [];

    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            continue;
        }

        if (trimmed.startsWith("```")) {
            const lang = trimmed.slice(3).trim();
            const codeLines = [];
            i += 1;
            while (i < lines.length && !lines[i].trim().startsWith("```")) {
                codeLines.push(lines[i]);
                i += 1;
            }
            html.push(
                `<pre><code class="language-${escapeAttr(lang)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`
            );
            continue;
        }

        if (/^---+$/.test(trimmed)) {
            html.push("<hr>");
            continue;
        }

        if (trimmed === "$$") {
            const mathLines = [];
            i += 1;
            while (i < lines.length && lines[i].trim() !== "$$") {
                mathLines.push(lines[i]);
                i += 1;
            }
            html.push(`<div class="math-block">${escapeHtml(mathLines.join("\n"))}</div>`);
            continue;
        }

        const footnote = trimmed.match(/^\[\^([^\]]+)\]:\s*(.+)$/);
        if (footnote) {
            html.push(`<p class="footnote"><sup>[${escapeHtml(footnote[1])}]</sup> ${renderInline(footnote[2])}</p>`);
            continue;
        }

        const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
            continue;
        }

        if (trimmed.startsWith(">")) {
            const quoteLines = [];
            while (i < lines.length && lines[i].trim().startsWith(">")) {
                quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
                i += 1;
            }
            i -= 1;
            html.push(`<blockquote>${quoteLines.map(renderInline).join("<br>")}</blockquote>`);
            continue;
        }

        if (/^\s*[-*]\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
                i += 1;
            }
            i -= 1;
            html.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
            continue;
        }

        if (/^\s*\d+\.\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
                i += 1;
            }
            i -= 1;
            html.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
            continue;
        }

        if (line.includes("|") && lines[i + 1] && isTableDivider(lines[i + 1])) {
            const headers = splitTableRow(line);
            i += 2;
            const rows = [];
            while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
                rows.push(splitTableRow(lines[i]));
                i += 1;
            }
            i -= 1;
            html.push(`
                <table>
                    <thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>
                    <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
                </table>
            `);
            continue;
        }

        const paragraph = [trimmed];
        while (
            i + 1 < lines.length &&
            lines[i + 1].trim() &&
            !/^(#{1,6})\s+/.test(lines[i + 1].trim()) &&
            !lines[i + 1].trim().startsWith("```") &&
            lines[i + 1].trim() !== "$$" &&
            !lines[i + 1].trim().startsWith(">") &&
            !/^\[\^([^\]]+)\]:\s*(.+)$/.test(lines[i + 1].trim()) &&
            !/^\s*[-*]\s+/.test(lines[i + 1]) &&
            !/^\s*\d+\.\s+/.test(lines[i + 1]) &&
            !(lines[i + 1].includes("|") && lines[i + 2] && isTableDivider(lines[i + 2]))
        ) {
            i += 1;
            paragraph.push(lines[i].trim());
        }
        html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    }

    return html.join("");
}

function getCategories() {
    return ["全部", ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))];
}

function comparePostsByDateDesc(a, b) {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) {
        return dateDiff;
    }
    return a.title.localeCompare(b.title, "zh-CN");
}

function getFilteredPosts() {
    const query = state.query.trim().toLowerCase();
    return posts
        .filter((post) => {
            const matchesCategory = state.category === "全部" || post.category === state.category;
            const haystack = `${post.title} ${post.category} ${post.date} ${post.summary}`.toLowerCase();
            return matchesCategory && (!query || haystack.includes(query));
        })
        .sort(comparePostsByDateDesc);
}

function renderCategoryFilters() {
    elements.categoryFilters.innerHTML = getCategories()
        .map((category) => {
            const active = category === state.category ? " active" : "";
            return `<button class="filter-button${active}" type="button" data-category="${escapeAttr(category)}">${escapeHtml(category)}</button>`;
        })
        .join("");
}

function renderPostList() {
    const filteredPosts = getFilteredPosts();

    if (!filteredPosts.length) {
        elements.postList.innerHTML = '<p class="empty-state">没有匹配的文章。</p>';
        return;
    }

    elements.postList.innerHTML = filteredPosts
        .map((post) => {
            const active = post.file === state.currentFile ? " active" : "";
            return `
                <button class="post-button${active}" type="button" data-file="${escapeAttr(post.file)}">
                    <span class="post-title">${escapeHtml(post.title)}</span>
                    <span class="post-meta">
                        <span>${escapeHtml(post.category)}</span>
                        <span>${escapeHtml(post.date)}</span>
                    </span>
                </button>
            `;
        })
        .join("");
}

function resetReader() {
    state.currentFile = "";
    elements.readerMeta.innerHTML = "";
    elements.articleContent.innerHTML = '<p class="empty-state">选择一篇文章开始阅读。</p>';
}

function renderReaderMeta(post) {
    elements.readerMeta.innerHTML = `
        <span>${escapeHtml(post.category)}</span>
        <span>${escapeHtml(post.date)}</span>
        <span>${escapeHtml(post.summary)}</span>
    `;
}

async function loadPost(post) {
    if (!post) {
        return;
    }

    state.currentFile = post.file;
    renderPostList();
    renderReaderMeta(post);
    elements.articleContent.innerHTML = '<p class="loading-state">正在加载文章...</p>';

    try {
        const response = await fetch(post.file, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        elements.articleContent.innerHTML = parseMarkdown(text);
    } catch (error) {
        elements.articleContent.innerHTML = `
            <h1>文章加载失败</h1>
            <p>请确认当前页面通过本地 HTTP 服务或 GitHub Pages 访问，而不是直接双击打开 HTML 文件。</p>
        `;
        console.error(error);
    }
}

function bindEvents() {
    elements.searchInput.addEventListener("input", (event) => {
        state.query = event.target.value;
        if (!getFilteredPosts().some((post) => post.file === state.currentFile)) {
            resetReader();
        }
        renderPostList();
    });

    elements.categoryFilters.addEventListener("click", (event) => {
        const button = event.target.closest("[data-category]");
        if (!button) {
            return;
        }
        state.category = button.dataset.category;
        if (!getFilteredPosts().some((post) => post.file === state.currentFile)) {
            resetReader();
        }
        renderCategoryFilters();
        renderPostList();
    });

    elements.postList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-file]");
        if (!button) {
            return;
        }
        const post = posts.find((item) => item.file === button.dataset.file);
        loadPost(post);
    });
}

function init() {
    bindEvents();
    renderCategoryFilters();
    renderPostList();
    loadPost(posts.filter((post) => post.category === "置顶").sort(comparePostsByDateDesc)[0] || getFilteredPosts()[0]);
}

init();
