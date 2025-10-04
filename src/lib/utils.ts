/**
 * 通用工具函数
 */

import { type ClassValue, clsx } from 'clsx';

/**
 * 合并className
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化日期时间
 * @param date 日期对象或字符串
 * @param format 格式类型
 * @returns 格式化后的字符串
 */
export function formatDateTime(
  date: Date | string,
  format: 'full' | 'date' | 'time' | 'relative' = 'full'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeTime(d);
  }

  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    full: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
    date: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  };
  
  const options = optionsMap[format];

  return new Intl.DateTimeFormat('zh-CN', options).format(d);
}

/**
 * 格式化相对时间
 * @param date 日期对象
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  return `${Math.floor(days / 365)}年前`;
}

/**
 * 格式化数字
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化百分比
 * @param value 数值 (0-1)
 * @param decimals 小数位数
 * @returns 百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 生成唯一ID
 * @returns UUID字符串
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * 延迟执行
 * @param ms 毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 * @param fn 要防抖的函数
 * @param ms 延迟毫秒数
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * 节流函数
 * @param fn 要节流的函数
 * @param ms 间隔毫秒数
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), ms);
    }
  };
}

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 检测类型转中文
 */
export const detectionTypeLabels: Record<string, string> = {
  weld: '焊缝检测',
  layered: '分层检测',
  slope: '斜坡检测',
  single_layer: '单层检测',
};

/**
 * 质量等级转中文
 */
export const qualityGradeLabels: Record<string, string> = {
  A: 'A级（优秀）',
  B: 'B级（良好）',
  C: 'C级（合格）',
  D: 'D级（基本合格）',
  reject: '不合格',
};

/**
 * 用户角色转中文
 */
export const userRoleLabels: Record<string, string> = {
  admin: '管理员',
  engineer: '检测工程师',
  viewer: '查看者',
};

/**
 * 文件状态转中文
 */
export const fileStatusLabels: Record<string, string> = {
  uploaded: '已上传',
  processing: '处理中',
  processed: '已处理',
  error: '错误',
};

/**
 * 试验状态转中文
 */
export const experimentStatusLabels: Record<string, string> = {
  preparing: '准备中',
  in_progress: '进行中',
  completed: '已完成',
  failed: '失败',
};

/**
 * 下载文件
 * @param url 文件URL
 * @param filename 文件名
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean>
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

/**
 * 获取错误消息
 * @param error 错误对象
 * @returns 错误消息字符串
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '发生未知错误';
}

