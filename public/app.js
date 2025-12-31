// 全局状态
let allDocuments = [];
let currentDocument = null;
let fontSize = 2; // 0:小, 1:较小, 2:中, 3:较大, 4:大

// 字号设置
const fontSizes = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
const fontSizeLabels = ['小', '中', '大', '较大', '超大'];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadDocuments();
    setupEventListeners();
    loadUserSettings();
});

// 加载网站配置
function loadConfig() {
    const config = window.siteConfig || {};
    
    // 设置网站标题
    if (config.site?.title) {
        document.getElementById('siteTitle').textContent = config.site.title;
        document.title = config.site.title;
    }
    
    // 加载项目信息
    loadProjectInfo(config.project);
    
    // 加载联系方式
    loadContactInfo(config.contact);
    
    // 加载广告或推广内容
    loadAds(config.ads, config.promotion);
}

// 加载项目信息
function loadProjectInfo(project) {
    if (!project) return;
    
    const projectInfo = document.getElementById('projectInfo');
    let html = '';
    
    if (project.intro) {
        html += `<div class="project-intro">${project.intro}</div>`;
    }
    
    if (project.updateLog && project.updateLog.length > 0) {
        html += '<h4 style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">最近更新</h4>';
        html += '<ul class="update-log-list">';
        project.updateLog.slice(0, 3).forEach(log => {
            html += `<li>${log}</li>`;
        });
        html += '</ul>';
    }
    
    projectInfo.innerHTML = html;
}

// 加载联系方式
function loadContactInfo(contact) {
    if (!contact) return;
    
    const contactInfo = document.getElementById('contactInfo');
    let html = '';
    
    if (contact.github) {
        html += `<a href="${contact.github}" target="_blank" class="contact-link">
            <span>📁</span><span>GitHub 仓库</span>
        </a>`;
    }
    
    if (contact.issues) {
        html += `<a href="${contact.issues}" target="_blank" class="contact-link">
            <span>💬</span><span>问题反馈</span>
        </a>`;
    }
    
    if (contact.email) {
        html += `<a href="mailto:${contact.email}" class="contact-link">
            <span>📧</span><span>邮箱联系</span>
        </a>`;
    }
    
    if (contact.wechatQR) {
        html += `<div class="contact-link" style="flex-direction: column;">
            <span>微信公众号</span>
            <img src="${contact.wechatQR}" alt="微信二维码" style="width: 100%; margin-top: 0.5rem;">
        </div>`;
    }
    
    contactInfo.innerHTML = html;
}

// 加载广告或推广内容
function loadAds(ads, promotion) {
    const ad1 = document.getElementById('adSection1');
    const ad2 = document.getElementById('adSection2');
    const promotionSection = document.getElementById('promotionSection');
    
    if (ads && ads.enabled && ads.client) {
        // 加载 Google AdSense
        loadGoogleAds(ad1, ad2, ads);
    } else if (promotion && promotion.enabled) {
        // 显示自定义推广内容
        ad1.classList.add('hidden');
        ad2.classList.add('hidden');
        promotionSection.innerHTML = `
            <h3>${promotion.title || '推广'}</h3>
            <div class="promotion-content">${promotion.content}</div>
        `;
    } else {
        // 隐藏广告区域
        ad1.classList.add('hidden');
        ad2.classList.add('hidden');
        promotionSection.classList.add('hidden');
    }
}

// 加载 Google AdSense（示例）
function loadGoogleAds(ad1, ad2, ads) {
    // 广告位 1
    ad1.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${ads.client}"
             data-ad-slot="${ads.slots.sidebar1}"
             data-ad-format="auto"></ins>
    `;
    
    // 广告位 2
    ad2.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${ads.client}"
             data-ad-slot="${ads.slots.sidebar2}"
             data-ad-format="auto"></ins>
    `;
    
    // 初始化广告（需要先加载 AdSense 脚本）
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log('AdSense 加载失败');
    }
}

// 加载文档列表
async function loadDocuments() {
    try {
        const response = await fetch('data/index.json');
        const data = await response.json();
        allDocuments = data.documents || [];
        
        renderDocumentList(allDocuments);
        updateStats(data);
    } catch (error) {
        console.error('加载文档列表失败:', error);
        document.getElementById('docList').innerHTML = '<div class="loading">加载失败</div>';
    }
}

// 渲染文档列表
function renderDocumentList(documents) {
    const docList = document.getElementById('docList');
    
    if (documents.length === 0) {
        docList.innerHTML = '<div class="loading">暂无传记</div>';
        return;
    }
    
    const html = documents.map(doc => `
        <div class="doc-item" data-file="${doc.file}" onclick="loadDocument('${doc.file}')">
            <div class="doc-item-title">📄 ${doc.title}</div>
            <div class="doc-item-meta">
                ${doc.author ? doc.author : ''} ${doc.wordCount ? `· ${doc.wordCount}字` : ''}
            </div>
        </div>
    `).join('');
    
    docList.innerHTML = html;
}

// 更新统计信息
function updateStats(data) {
    document.getElementById('totalCount').textContent = data.total || 0;
    
    // 欢迎页统计
    const welcomeStats = document.getElementById('welcomeStats');
    welcomeStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-value">${data.total || 0}</span>
            <div class="stat-label">传记总数</div>
        </div>
    `;
}

// 加载单个文档
async function loadDocument(filename) {
    try {
        const response = await fetch(`data/${filename}`);
        const doc = await response.json();
        currentDocument = doc;
        
        renderDocument(doc);
        updateActiveItem(filename);
        
        // 隐藏欢迎页，显示文章
        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('articleContent').classList.remove('hidden');
        
        // 滚动到顶部
        document.querySelector('.main-content').scrollTop = 0;
    } catch (error) {
        console.error('加载文档失败:', error);
        alert('加载文档失败，请稍后重试');
    }
}

// 渲染文档内容
function renderDocument(doc) {
    // 标题和元数据
    document.getElementById('articleTitle').textContent = doc.title;
    
    let metaHtml = [];
    if (doc.subject) metaHtml.push(`传主: ${doc.subject}`);
    if (doc.author) metaHtml.push(`作者: ${doc.author}`);
    if (doc.date) metaHtml.push(`日期: ${doc.date}`);
    
    document.getElementById('articleSubject').textContent = doc.subject ? `传主: ${doc.subject}` : '';
    document.getElementById('articleAuthor').textContent = doc.author ? `作者: ${doc.author}` : '';
    document.getElementById('articleDate').textContent = doc.date ? `日期: ${doc.date}` : '';
    
    // 正文内容
    const content = doc.content.replace(/\n\n/g, '</p><p>');
    
    // 替换注释标记为可点击链接
    const contentWithNotes = content.replace(/【(\d+)】/g, (match, id) => {
        return `<a href="#note-${id}" class="note-ref" onclick="scrollToNote(${id}); return false;">${match}</a>`;
    });
    
    document.getElementById('articleBody').innerHTML = `<p>${contentWithNotes}</p>`;
    
    // 注释区域
    if (doc.notes && doc.notes.length > 0) {
        const notesHtml = doc.notes.map(note => `
            <div class="note-item" id="note-${note.id}">
                <div class="note-item-header">【${note.id}】</div>
                <div class="note-item-content">${note.content}</div>
            </div>
        `).join('');
        
        document.getElementById('articleNotes').innerHTML = notesHtml;
        document.getElementById('articleNotesSection').classList.remove('hidden');
        
        // 渲染注释导航
        renderNotesNav(doc.notes);
    } else {
        document.getElementById('articleNotesSection').classList.add('hidden');
        document.getElementById('notesNavSection').classList.add('hidden');
    }
    
    // 渲染文档信息
    renderDocInfo(doc);
}

// 渲染注释导航
function renderNotesNav(notes) {
    const navList = document.getElementById('notesNavList');
    const html = notes.map(note => {
        const source = note.source || '史料';
        return `
            <div class="notes-nav-item" onclick="scrollToNote(${note.id})">
                <span class="notes-nav-item-id">【${note.id}】</span>
                <span class="notes-nav-item-source">${source}</span>
            </div>
        `;
    }).join('');
    
    navList.innerHTML = html;
    document.getElementById('notesNavSection').classList.remove('hidden');
}

// 渲染文档信息卡片
function renderDocInfo(doc) {
    const docInfo = document.getElementById('docInfo');
    const html = `
        <div class="doc-info-item">
            <span class="doc-info-label">传主</span>
            <span class="doc-info-value">${doc.subject || '-'}</span>
        </div>
        <div class="doc-info-item">
            <span class="doc-info-label">作者</span>
            <span class="doc-info-value">${doc.author || '-'}</span>
        </div>
        <div class="doc-info-item">
            <span class="doc-info-label">字数</span>
            <span class="doc-info-value">${doc.wordCount || 0}</span>
        </div>
        <div class="doc-info-item">
            <span class="doc-info-label">注释</span>
            <span class="doc-info-value">${doc.notes?.length || 0} 条</span>
        </div>
    `;
    
    docInfo.innerHTML = html;
    document.getElementById('docInfoSection').classList.remove('hidden');
}

// 滚动到指定注释
function scrollToNote(id) {
    const noteElement = document.getElementById(`note-${id}`);
    if (noteElement) {
        noteElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 高亮效果
        noteElement.style.background = 'var(--hover-bg)';
        setTimeout(() => {
            noteElement.style.background = '';
        }, 2000);
    }
}

// 更新当前选中项
function updateActiveItem(filename) {
    document.querySelectorAll('.doc-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.file === filename) {
            item.classList.add('active');
        }
    });
}

// 设置事件监听
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allDocuments.filter(doc => 
            doc.title.toLowerCase().includes(query) ||
            doc.subject.toLowerCase().includes(query) ||
            (doc.author && doc.author.toLowerCase().includes(query))
        );
        renderDocumentList(filtered);
    });
}

// 字号调节
function changeFontSize(delta) {
    fontSize = Math.max(0, Math.min(4, fontSize + delta));
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    document.body.classList.add(`font-${fontSizes[fontSize]}`);
    document.getElementById('fontSizeDisplay').textContent = fontSizeLabels[fontSize];
    
    // 保存设置
    localStorage.setItem('fontSize', fontSize);
}

// 主题切换
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.textContent = isDark ? '☀️ 浅色' : '🌙 深色';
    
    // 保存设置
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 加载用户设置
function loadUserSettings() {
    // 加载字号设置
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize !== null) {
        fontSize = parseInt(savedFontSize);
        document.body.classList.add(`font-${fontSizes[fontSize]}`);
        document.getElementById('fontSizeDisplay').textContent = fontSizeLabels[fontSize];
    } else {
        document.body.classList.add('font-medium');
    }
    
    // 加载主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeBtn').textContent = '☀️ 浅色';
    }
}

