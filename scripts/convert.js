const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

// 配置路径
const DOC_DIR = path.join(__dirname, "..", "doc");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "data");

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 提取注释来源书名（从《》中提取）
function extractSource(content) {
  const match = content.match(/《(.+?)》/);
  return match ? match[1] : "";
}

// 解析注释：提取【1】【2】等标记的注释
function parseNotes(text) {
  const notes = [];
  // 匹配【数字】开头的注释段落
  const noteRegex = /【(\d+)】([^【]+?)(?=【\d+】|$)/gs;
  let match;

  while ((match = noteRegex.exec(text)) !== null) {
    const content = match[2].trim();
    notes.push({
      id: parseInt(match[1]),
      content: content,
      source: extractSource(content),
    });
  }

  return notes;
}

// 提取元数据
function extractMetadata(text) {
  const metadata = {
    author: "",
    date: "",
  };

  // 提取作者
  const authorMatch = text.match(/作者[：:]\s*(.+)/);
  if (authorMatch) {
    metadata.author = authorMatch[1].trim();
  }

  // 提取日期
  const dateMatch = text.match(/日期[：:]\s*(.+)/);
  if (dateMatch) {
    metadata.date = dateMatch[1].trim();
  }

  // 如果没有明确的作者和日期，尝试从末尾提取
  const lines = text.trim().split("\n");
  const lastLine = lines[lines.length - 1];

  // 匹配类似 "——乙巳蛇年农历十月初九关山补写" 的格式
  const endMatch = lastLine.match(/——(.+?)(补写|撰|著)/);
  if (endMatch && !metadata.author && !metadata.date) {
    const endText = endMatch[1];
    // 尝试分离日期和作者 - 假设最后2-3个字是作者名
    const nameMatch = endText.match(/(.+?)([^\d\s]{2,3})$/);
    if (nameMatch) {
      metadata.date = nameMatch[1].trim();
      metadata.author = nameMatch[2].trim();
    } else {
      // 如果匹配失败，整个作为日期
      metadata.date = endText.trim();
    }
  }

  return metadata;
}

// 分离正文和注释
function separateContentAndNotes(text) {
  // 查找第一个【注释】标记或第一个【1】
  const notesSectionMatch = text.match(/【注释】|【1】/);

  if (notesSectionMatch) {
    const splitIndex = notesSectionMatch.index;
    const content = text.substring(0, splitIndex).trim();
    const notesText = text.substring(splitIndex).trim();
    return { content, notesText };
  }

  return { content: text.trim(), notesText: "" };
}

// 清理正文中的元数据
function cleanContent(content) {
  // 移除开头的作者、日期等元数据行
  let lines = content.split("\n");

  // 跳过前面的元数据行
  let startIndex = 0;
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.match(/^(作者|日期|标题)[：:]/)) {
      startIndex = i;
      break;
    }
  }

  // 移除末尾的署名行（如果有）
  let endIndex = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line && !line.startsWith("——")) {
      endIndex = i + 1;
      break;
    }
  }

  return lines.slice(startIndex, endIndex).join("\n").trim();
}

// 计算字数（不含标点和空格）
function countWords(text) {
  // 移除所有非中文字符
  const chineseOnly = text.replace(/[^\u4e00-\u9fa5]/g, "");
  return chineseOnly.length;
}

// 转换单个 Word 文档
async function convertDocx(filePath) {
  console.log(`正在转换: ${path.basename(filePath)}`);

  try {
    // 读取 Word 文档
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;

    // 分离正文和注释
    const { content, notesText } = separateContentAndNotes(text);

    // 提取元数据
    const metadata = extractMetadata(text);

    // 解析注释
    const notes = parseNotes(notesText);

    // 清理正文
    const cleanedContent = cleanContent(content);

    // 提取标题（从文件名或第一行）
    let title = path.basename(filePath, path.extname(filePath));

    // 尝试从第一行提取更好的标题
    const firstLine = text.split("\n")[0].trim();
    if (firstLine && firstLine.length < 50 && !firstLine.includes("：")) {
      title = firstLine;
    }

    // 提取传主姓名（标题去掉"传"字和其他修饰）
    const subject = title
      .replace(/传$/, "")
      .replace(/[·•].*/, "")
      .replace(/（.*?）/, "")
      .replace(/\(.*?\)/, "")
      .trim();

    // 计算字数
    const wordCount = countWords(cleanedContent);

    return {
      title,
      subject,
      author: metadata.author,
      date: metadata.date,
      content: cleanedContent,
      notes,
      wordCount,
      sourceFile: path.basename(filePath),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`转换失败 ${filePath}:`, error.message);
    return null;
  }
}

// 主函数：转换所有 Word 文档
async function convertAll() {
  console.log("开始转换 Word 文档...\n");

  // 读取 doc 目录
  if (!fs.existsSync(DOC_DIR)) {
    console.log(`错误: doc 目录不存在: ${DOC_DIR}`);
    return;
  }

  const files = fs.readdirSync(DOC_DIR);
  const docxFiles = files.filter(
    (file) => file.endsWith(".docx") && !file.startsWith("~")
  );

  if (docxFiles.length === 0) {
    console.log("没有找到 .docx 文件");
    return;
  }

  console.log(`找到 ${docxFiles.length} 个文档\n`);

  // 转换所有文档
  const results = [];
  for (const file of docxFiles) {
    const filePath = path.join(DOC_DIR, file);
    const result = await convertDocx(filePath);
    if (result) {
      results.push(result);

      // 保存单个 JSON 文件
      const outputFileName = `${result.subject}.json`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
      console.log(`✓ 已生成: ${outputFileName} (${result.wordCount} 字, ${result.notes.length} 条注释)`);
    }
  }

  // 生成索引文件
  const index = {
    total: results.length,
    updatedAt: new Date().toISOString(),
    documents: results.map((r) => ({
      title: r.title,
      subject: r.subject,
      author: r.author,
      date: r.date,
      wordCount: r.wordCount,
      notesCount: r.notes.length,
      file: `${r.subject}.json`,
    })),
  };

  const indexPath = path.join(OUTPUT_DIR, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf-8");
  console.log(`\n✓ 已生成索引: index.json`);
  console.log(`\n完成！共转换 ${results.length} 个文档`);
}

// 运行
convertAll().catch(console.error);

