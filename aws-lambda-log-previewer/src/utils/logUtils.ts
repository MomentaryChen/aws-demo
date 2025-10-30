// utils/logUtils.ts

// 检测是否为JSON格式
export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

// 格式化JSON字符串
export const formatJSON = (str: string): string => {
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return str;
  }
};

// 格式化消息文本
export const formatMessage = (
  msg: string, 
  previewLines: number = 5, 
  isExpanded: boolean = false
): string => {
  // 统一处理换行符
  const normalizedMsg = msg.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalizedMsg.split("\n");

  if (isExpanded || lines.length <= previewLines) {
    return normalizedMsg;
  }

  // 预览模式只显示前 previewLines 行
  const preview = lines.slice(0, previewLines).join("\n");
  return preview + "\n...";
};

// 高亮关键信息（错误、警告等）
export const highlightKeywords = (text: string): string => {
  // 简单的关键词高亮，可以在UI中使用颜色来实现
  return text;
};
