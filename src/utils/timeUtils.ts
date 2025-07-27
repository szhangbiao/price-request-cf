/**
 * 时间格式化工具函数
 */

/**
 * 格式化时间显示，处理时区
 * @param timeString 时间字符串
 * @returns 格式化后的时间字符串
 */
export const formatTime = (timeString: string): string => {
  try {
    // 尝试解析时间字符串
    const date = new Date(timeString);
    
    // 检查是否为有效日期
    if (isNaN(date.getTime())) {
      return timeString; // 如果无法解析，返回原始字符串
    }
    
    // 格式化为本地时间
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  } catch (error) {
    return timeString; // 出错时返回原始字符串
  }
};

/**
 * 格式化时间显示（简化版，不包含秒）
 * @param timeString 时间字符串
 * @returns 格式化后的时间字符串
 */
export const formatTimeSimple = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    
    if (isNaN(date.getTime())) {
      return timeString;
    }
    
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  } catch (error) {
    return timeString;
  }
};