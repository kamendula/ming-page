# 补明史传记

明代人物传记阅读网站，支持从 Word 文档自动转换为在线阅读页面。

🔗 **在线访问**: `https://your-username.github.io/Ming-Page/`

## ✨ 特点

- 📝 **简单编辑** - 使用 Word 编写传记，无需学习复杂技术
- 🤖 **自动转换** - 推送到 GitHub 后自动转换为网页
- 🎨 **优雅排版** - 专为中文古籍阅读优化的界面
- 📱 **响应式设计** - 完美适配桌面、平板和手机
- 🌓 **深色模式** - 护眼的深色主题
- 💰 **Google AdSense** - 支持广告位接入
- 🆓 **完全免费** - 使用 GitHub Pages 托管

## 🚀 快速开始

### 1. Fork 或克隆本项目

```bash
git clone https://github.com/your-username/Ming-Page.git
cd Ming-Page
```

### 2. 编写传记（Word 格式）

在 `doc/` 文件夹中创建 Word 文档（.docx），按以下格式编写：

```
陈山传                           

　　陈山，福建沙县人，元至正二十二年生。

　　其先世居长葛，后徙南剑州沙县...

【1】《赠资善大夫户部尚书兼谨身殿大学士陈公》：...
【2】《太宗文皇帝实录》：...

——乙巳蛇年农历十月初九关山补写
```

**格式说明**：
- 第一行：标题
- 正文：普通段落
- 注释：【1】【2】等标记
- 署名：末尾 `——日期作者撰写`

### 3. 推送到 GitHub

```bash
git add doc/你的传记.docx
git commit -m "添加新传记"
git push
```

### 4. 配置 GitHub Pages

首次部署需要配置：

1. 进入仓库 **Settings** → **Actions** → **General**
2. **Workflow permissions** 选择 **"Read and write permissions"**
3. 保存

然后：

1. 进入 **Settings** → **Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main` → 文件夹选择 `/public` → Save
4. 等待 1-2 分钟

访问 `https://your-username.github.io/Ming-Page/` 查看网站！

## 📁 项目结构

```
Ming-Page/
├── doc/                    # Word 文档源文件（你编辑的地方）
│   ├── 陈山传.docx
│   └── ...
│
├── scripts/                # 转换脚本
│   └── convert.js         # Word → JSON 转换器
│
├── public/                 # 网站文件（自动部署）
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式表
│   ├── app.js             # 前端逻辑
│   ├── config.js          # 网站配置
│   └── data/              # 自动生成的 JSON 数据
│       ├── index.json
│       └── *.json
│
├── .github/
│   └── workflows/
│       └── convert.yml    # 自动化流程
│
├── package.json
├── DESIGN.md              # 详细设计文档
└── README.md
```

## ⚙️ 网站配置

编辑 `public/config.js` 自定义网站：

```javascript
window.siteConfig = {
  site: {
    title: "补明史传记",
    description: "明代人物传记集",
    author: "关山",
  },
  
  // Google AdSense（可选）
  ads: {
    enabled: false,  // 改为 true 启用广告
    client: "ca-pub-你的ID",
    slots: {
      sidebar1: "广告位ID1",
      sidebar2: "广告位ID2",
    },
  },
  
  // 联系方式
  contact: {
    github: "https://github.com/your-username/Ming-Page",
    email: "your-email@example.com",
    // ...
  },
};
```

## 🎯 使用流程

### 日常工作流

```
1. 在 Word 中编写传记
   ↓
2. 保存到 doc/ 文件夹
   ↓
3. git add → commit → push
   ↓
4. 等待 1-2 分钟
   ↓
5. 网站自动更新 ✅
```

### 自动化发生的事情

```
GitHub Actions 监听 doc/ 变化
    ↓
运行 scripts/convert.js
    ↓
Word 文档转换为 JSON
    ↓
自动提交到 public/data/
    ↓
GitHub Pages 检测更新
    ↓
自动重新部署
    ↓
完成！
```

## 🛠️ 本地开发

### 安装依赖

```bash
npm install
```

### 本地转换测试

```bash
npm run convert
```

这会将 `doc/` 中的所有 Word 文档转换为 JSON 文件，保存到 `public/data/`。

### 本地预览

```bash
npm run dev
```

然后访问 `http://localhost:3000`

## 📝 Word 文档格式要求

### ✅ 支持的格式

- 普通段落文字
- 注释标记【1】【2】...【99】
- 书名号《》中的引文来源
- 传统署名格式

### ⚠️ 暂不支持

- Word 表格
- 图片
- 复杂格式（颜色、字体）

### 示例文档结构

```
标题（第一行）

正文段落...
正文段落...

【1】《史料书名》：引文内容...
【2】《另一史料》：引文内容...

——日期作者撰写
```

## 💰 接入 Google AdSense

1. 申请 AdSense 账号：https://www.google.com/adsense
2. 审核通过后，获取客户端 ID 和广告位 ID
3. 编辑 `public/config.js`：
   ```javascript
   ads: {
     enabled: true,
     client: "ca-pub-你的ID",
     slots: {
       sidebar1: "广告位1的ID",
       sidebar2: "广告位2的ID",
     },
   }
   ```
4. 推送更新，完成！

## 🎨 自定义样式

编辑 `public/styles.css` 可以自定义：
- 颜色方案（浅色/深色主题）
- 字体
- 排版样式
- 响应式断点

## 📱 响应式设计

- **桌面端**（> 1024px）：三栏布局
- **平板端**（768-1024px）：两栏布局
- **手机端**（< 768px）：单栏布局

## 🔧 故障排除

### 网站没有更新

1. 检查 Actions 标签页是否有错误
2. 确保 Actions 有写入权限（Settings → Actions → General）
3. 查看 Actions 日志查找问题

### 转换失败

1. 确保 Word 文件是 `.docx` 格式（不是 `.doc`）
2. 检查文件名没有特殊字符
3. 确认不是临时文件（不以 `~` 开头）

### 页面显示空白

1. 确保 GitHub Pages 设置正确（main 分支 /public 文件夹）
2. 检查 `public/data/index.json` 是否存在
3. 打开浏览器开发者工具查看错误信息

## 📚 更多信息

- 详细设计文档：[DESIGN.md](./DESIGN.md)
- 问题反馈：[GitHub Issues](https://github.com/your-username/Ming-Page/issues)

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有为明史研究做出贡献的学者和爱好者。

---

**开始使用**：Fork 本项目，编写你的第一篇传记！

