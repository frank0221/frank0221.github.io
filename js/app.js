const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
    setup() {
        // 文章列表配置（新增文章需在此处添加，支持 category 分类）
        const posts = ref([
            { title: '链接脚本学习', date: '2026-03-23', file: 'posts/链接脚本学习.md', category: '技术' },
            { title: '画图笔记', date: '2026-03-05', file: 'posts/画图笔记.md', category: '笔记' },
            { title: '欢迎来到我的主页', date: '2023-10-01', file: 'posts/welcome.md', category: '置顶' },
            { title: '关于这个酷炫的博客', date: '2023-10-02', file: 'posts/about.md', category: '项目' },
            //{ title: 'Markdown 测试', date: '2023-10-03', file: 'posts/test.md', category: '技术' }
        ]);

        const searchQuery = ref('');
        const currentPost = ref('');
        const renderedContent = ref('');
        const loading = ref(false);

        // 分类折叠状态（默认全展开）
        const collapsedCategories = ref(new Set());

        // 计算属性：按分类分组文章
        const filteredPosts = computed(() => {
            const q = searchQuery.value.trim().toLowerCase();
            if (!q) return posts.value;
            return posts.value.filter(p => {
                const title = (p.title || '').toLowerCase();
                const cat = (p.category || '').toLowerCase();
                const date = (p.date || '').toLowerCase();
                return title.includes(q) || cat.includes(q) || date.includes(q);
            });
        });

        const groupedPosts = computed(() => {
            const groups = {};
            filteredPosts.value.forEach(post => {
                const cat = post.category || '未分类';
                if (!groups[cat]) {
                    groups[cat] = [];
                }
                groups[cat].push(post);
            });
            return groups;
        });

        const setSearch = (term) => {
            searchQuery.value = term;
        };

        // 切换分类折叠
        const toggleCategory = (category) => {
            if (collapsedCategories.value.has(category)) {
                collapsedCategories.value.delete(category);
            } else {
                collapsedCategories.value.add(category);
            }
        };

        // 加载文章
        const loadPost = async (post) => {
            if (currentPost.value === post.file) return;
            
            loading.value = true;
            currentPost.value = post.file;
            
            try {
                // 添加时间戳参数以防止浏览器缓存
                const response = await fetch(`${post.file}?t=${new Date().getTime()}`);
                if (!response.ok) throw new Error('无法加载文章');
                const text = await response.text();
                
                // 使用 marked 解析 markdown
                renderedContent.value = marked.parse(text);
                
                // 代码高亮
                requestAnimationFrame(() => {
                    document.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                });
            } catch (error) {
                console.error(error);
                renderedContent.value = '<h1>加载失败</h1><p>请检查网络或文件路径。</p>';
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            // 默认加载第一篇
            if (posts.value.length > 0) {
                loadPost(posts.value[0]);
            }
            initStarfield();
        });

        return {
            posts,
            searchQuery,
            filteredPosts,
            groupedPosts,
            collapsedCategories,
            toggleCategory,
            setSearch,
            currentPost,
            renderedContent,
            loading,
            loadPost
        };
    }
});

app.mount('#app');

// --- 星空背景动画逻辑 ---
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let stars = [];
    const starCount = 200;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 2 + 0.5; // 深度/速度
            this.size = Math.random() * 1.5;
            this.opacity = Math.random();
            this.fadeSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.y -= this.z * 0.5; // 向上移动
            
            // 闪烁效果
            this.opacity += this.fadeSpeed;
            if (this.opacity > 1 || this.opacity < 0) {
                this.fadeSpeed = -this.fadeSpeed;
            }

            // 重置位置
            if (this.y < 0) {
                this.reset();
                this.y = height;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.opacity)})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
}
