// 网站配置文件
window.siteConfig = {
  // 网站基本信息
  site: {
    title: "补明史传记",
    description: "明代人物传记集",
    author: "关山",
  },

  // Google AdSense 配置
  ads: {
    enabled: false, // 是否启用广告（初始为 false，申请 AdSense 后改为 true）
    client: "ca-pub-XXXXXXXXXXXXXXXX", // 你的 AdSense 客户端 ID
    slots: {
      sidebar1: "1234567890", // 右侧上部广告位 ID
      sidebar2: "0987654321", // 右侧中部广告位 ID
    },
  },

  // 联系方式
  contact: {
    github: "https://github.com/your-username/Ming-Page",
    email: "",
    issues: "https://github.com/your-username/Ming-Page/issues",
    // 微信二维码（可选）
    wechatQR: "", // 如: "/images/wechat-qr.png"
  },

  // 项目信息
  project: {
    intro: "本项目致力于整理明代人物传记，为历史研究提供便利。",
    updateLog: [
      "项目启动",
      "添加自动化转换功能",
      "完成网站基础框架",
    ],
  },

  // 自定义推广内容（可选，当广告未启用时显示）
  promotion: {
    enabled: true,
    title: "关于本站",
    content: `
      <p style="margin-bottom: 1rem;">欢迎访问补明史传记网站。</p>
      <p style="margin-bottom: 1rem;">本站收录明代人物传记，持续更新中。</p>
      <p>如有问题或建议，欢迎通过 GitHub 反馈。</p>
    `,
  },
};

