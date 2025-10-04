/**
 * 工具函数单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  formatFileSize,
  formatNumber,
  formatPercentage,
  generateId,
  deepClone,
  detectionTypeLabels,
} from '@/lib/utils';

describe('工具函数测试', () => {
  describe('formatFileSize', () => {
    it('应该格式化字节为KB', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('应该格式化字节为MB', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    });

    it('应该格式化字节为GB', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('应该处理0字节', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('应该保留两位小数', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });
  });

  describe('formatNumber', () => {
    it('应该格式化整数', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('应该格式化小数', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
      expect(formatNumber(1234.5678, 1)).toBe('1,234.6');
    });

    it('应该处理负数', () => {
      expect(formatNumber(-1234.56, 2)).toBe('-1,234.56');
    });
  });

  describe('formatPercentage', () => {
    it('应该格式化百分比', () => {
      expect(formatPercentage(0.5)).toBe('50.0%');
      expect(formatPercentage(0.755)).toBe('75.5%');
    });

    it('应该支持自定义小数位', () => {
      expect(formatPercentage(0.12345, 2)).toBe('12.35%');
      expect(formatPercentage(0.12345, 0)).toBe('12%');
    });

    it('应该处理0和1', () => {
      expect(formatPercentage(0)).toBe('0.0%');
      expect(formatPercentage(1)).toBe('100.0%');
    });
  });

  describe('generateId', () => {
    it('应该生成唯一ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('应该生成字符串ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('deepClone', () => {
    it('应该深度克隆对象', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('应该克隆数组', () => {
      const arr = [1, 2, { a: 3 }];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });

    it('应该处理null', () => {
      expect(deepClone(null)).toBe(null);
    });

    it('应该处理undefined', () => {
      expect(deepClone(undefined)).toBe(undefined);
    });
  });

  describe('detectionTypeLabels', () => {
    it('应该包含所有检测类型', () => {
      expect(detectionTypeLabels.weld).toBe('焊缝检测');
      expect(detectionTypeLabels.layered).toBe('分层检测');
      expect(detectionTypeLabels.slope).toBe('斜坡检测');
      expect(detectionTypeLabels.single_layer).toBe('单层检测');
    });
  });
});

