/*
 * @Author: Lmy
 * @LastEditors: Lmy
 * @Date: 2025-11-27 20:19:57
 * @LastEditTime: 2025-11-27 20:21:56
 * @FilePath: \miniProgram-ai\utils\completeMarkdown.js
 * @Description: 处理md渲染闪动问题
 */
export const completeMarkdown = (text) => {
  let result = text;

  // 先检查是否在代码块中（三个反引号），如果在代码块中就不处理
  const codeBlockMatches = text.match(/```/g);
  const inCodeBlock = codeBlockMatches && codeBlockMatches.length % 2 === 1;

  if (inCodeBlock) {
    // 在代码块中，补全代码块标记
    const lastCodeBlockIndex = text.lastIndexOf("```");
    const contentAfter = text.slice(lastCodeBlockIndex + 3);
    if (contentAfter.length > 0) {
      result += "\n```";
    } else {
      result = text.slice(0, lastCodeBlockIndex);
    }
    return result;
  }

  // 检查最后一行是否是列表、标题等特殊格式的开头
  // 如果是，在前面添加空行，避免上一行被误判为 Setext 标题
  const lines = result.split("\n");
  const lastLine = lines[lines.length - 1];

  // 更宽松的检测：只要以这些字符开头就认为是特殊格式
  const isSpecialFormat =
    /^#{1,6}/.test(lastLine) || // 标题 # ## ###
    /^[-*+]/.test(lastLine) || // 无序列表 - * + (不管后面是什么)
    /^\d+\./.test(lastLine) || // 有序列表 1. 2.
    /^>/.test(lastLine) || // 引用 >
    /^=+$/.test(lastLine) || // Setext 标题下划线 ===
    /^-+$/.test(lastLine); // Setext 标题下划线 ---

  // 如果当前行是特殊格式，且前一行不是空行，添加空行
  if (isSpecialFormat && lines.length > 1) {
    const prevLine = lines[lines.length - 2];
    if (prevLine.trim() !== "") {
      // 在最后一行前插入空行
      lines.splice(lines.length - 1, 0, "");
      result = lines.join("\n");
    }
  }

  // 检查加粗 ** - 只有当 ** 后面有内容时才补全
  const boldMatches = result.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 === 1) {
    const lastBoldIndex = result.lastIndexOf("**");
    const contentAfter = result.slice(lastBoldIndex + 2);
    // 确保后面有内容且不是换行符开头（避免误判标题等）
    if (contentAfter.length > 0 && !contentAfter.startsWith("\n")) {
      result += "**";
    } else {
      result = result.slice(0, lastBoldIndex);
    }
  }

  // 检查斜体 * (排除已经被 ** 包含的)
  const textWithoutBold = result.replace(/\*\*/g, "  "); // 替换为两个空格保持位置
  const italicMatches = textWithoutBold.match(/\*/g);
  if (italicMatches && italicMatches.length % 2 === 1) {
    const lastItalicIndex = result.lastIndexOf("*");
    // 确保不是在行首（避免误判列表）
    const beforeChar = result[lastItalicIndex - 1];
    const contentAfter = result.slice(lastItalicIndex + 1);
    if (
      contentAfter.length > 0 &&
      !contentAfter.startsWith("*") &&
      !contentAfter.startsWith("\n") &&
      beforeChar !== "\n" &&
      beforeChar !== undefined
    ) {
      result += "*";
    } else if (
      contentAfter.length === 0 ||
      contentAfter.startsWith("\n") ||
      beforeChar === "\n"
    ) {
      result = result.slice(0, lastItalicIndex);
    }
  }

  // 检查行内代码 `
  const codeMatches = result.match(/`/g);
  if (codeMatches && codeMatches.length % 2 === 1) {
    const lastCodeIndex = result.lastIndexOf("`");
    const contentAfter = result.slice(lastCodeIndex + 1);
    if (contentAfter.length > 0 && !contentAfter.startsWith("\n")) {
      result += "`";
    } else {
      result = result.slice(0, lastCodeIndex);
    }
  }

  // 检查删除线 ~~
  const strikeMatches = result.match(/~~/g);
  if (strikeMatches && strikeMatches.length % 2 === 1) {
    const lastStrikeIndex = result.lastIndexOf("~~");
    const contentAfter = result.slice(lastStrikeIndex + 2);
    if (contentAfter.length > 0 && !contentAfter.startsWith("\n")) {
      result += "~~";
    } else {
      result = result.slice(0, lastStrikeIndex);
    }
  }

  // 处理列表标记的显示 - 避免单独的 - 或 * 闪现
  const resultLines = result.split("\n");
  const lastResultLine = resultLines[resultLines.length - 1];

  // 检查最后一行是否是刚开始的列表项（内容很少）
  // 无序列表：- 或 -  或 - * 或 - ** 等（内容少于3个有效字符）
  const listMatch = lastResultLine.match(/^([-*+])\s*(.*)$/);
  if (listMatch) {
    const listMarker = listMatch[1]; // - 或 * 或 +
    const listContent = listMatch[2]; // 列表项的内容

    // 去除 Markdown 标记，计算实际内容长度
    const contentWithoutMarks = listContent
      .replace(/\*\*/g, "") // 去除加粗
      .replace(/\*/g, "") // 去除斜体
      .replace(/`/g, "") // 去除代码
      .replace(/~~/g, "") // 去除删除线
      .trim();

    // 如果列表项内容少于3个字符，暂时隐藏整行
    if (contentWithoutMarks.length < 3) {
      resultLines.pop(); // 移除最后一行
      result = resultLines.join("\n");
    }
  }

  // 检查有序列表：1. 或 2. 等
  const orderedListMatch = lastResultLine.match(/^(\d+\.)\s*(.*)$/);
  if (orderedListMatch) {
    const listContent = orderedListMatch[2];
    const contentWithoutMarks = listContent
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/~~/g, "")
      .trim();

    if (contentWithoutMarks.length < 3) {
      resultLines.pop();
      result = resultLines.join("\n");
    }
  }

  return result;
};
