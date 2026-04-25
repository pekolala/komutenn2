document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Fade-in Animation on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.flexDirection = 'column';
            navMenu.style.background = '#fff';
            navMenu.style.padding = '20px';
            navMenu.style.boxShadow = '0 10px 10px rgba(0,0,0,0.05)';
        }
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                navMenu.style.display = 'none';
            }
        });
    });

    /* --- microCMS integration --- */
    const MICROCMS_SERVICE_ID = 'fujitaup30'; // あなたのサービスID
    const MICROCMS_API_KEY = 'uasbMofFROgor1GwDTNa9IwPjVUaCMNj0zV1';       // あなたのAPIキー

    async function fetchNews() {
        const newsListContainer = document.getElementById('news-list');
        if (!newsListContainer) return;

        try {
            const response = await fetch(`https://${MICROCMS_SERVICE_ID}.microcms.io/api/v1/news?limit=3`, {
                headers: {
                    'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
                },
            });

            if (!response.ok) throw new Error('microCMS fetch failed');

            const data = await response.json();
            newsListContainer.innerHTML = ''; // Clear loading text

            data.contents.forEach(post => {
                const date = new Date(post.publishedAt);
                const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

                const newsItem = document.createElement('a'); // divからaに変更
                newsItem.href = `news-detail.html?id=${post.id}`; // リンク先を設定
                newsItem.className = 'news-item fade-up';
                
                newsItem.innerHTML = `
                    <div class="news-meta">
                        <span class="news-date">${formattedDate}</span>
                        <span class="news-category">NEWS</span>
                    </div>
                    <h3 class="news-title">${post.title}</h3>
                    <span class="news-more">READ MORE →</span>
                `;

                newsListContainer.appendChild(newsItem);
                
                // 新しく追加した要素をアニメーションの監視対象に入れる
                observer.observe(newsItem);
            });
        } catch (error) {
            console.error('Error fetching news:', error);
            newsListContainer.innerHTML = '<p>ニュースの読み込みに失敗しました。</p>';
        }
    }

    // ニュースを取得
    fetchNews();
});
