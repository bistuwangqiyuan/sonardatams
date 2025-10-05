/**
 * 工具函数单元测试
 */

import { describe, it, expect } from 'vitest';
import { 
  formatFileSize, 
  formatDateTime, 
  formatNumber,
  formatPercentage,
  generateId,
  delay,
  deepClone,
  getErrorMessage
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB');
    });

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.50 KB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.50 MB');
    });
  });

  describe('formatDateTime', () => {
    it('should format date with default full format', () => {
      const date = new Date('2025-10-04T10:30:45');
      const result = formatDateTime(date, 'full');
      
      expect(result).toContain('2025');
      expect(result).toContain('10');
      expect(result).toContain('04');
    });

    it('should format date only', () => {
      const date = new Date('2025-10-04T10:30:45');
      const result = formatDateTime(date, 'date');
      
      expect(result).toContain('2025');
      expect(result).toContain('10');
      expect(result).toContain('04');
    });

    it('should handle string input', () => {
      const dateString = '2025-10-04T10:30:45Z';
      const result = formatDateTime(dateString, 'full');
      
      expect(result).toContain('2025');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with default decimals', () => {
      expect(formatNumber(1234.5678)).toContain('1');
      expect(formatNumber(1000)).toContain('1');
    });

    it('should format numbers with specified decimals', () => {
      const result = formatNumber(1234.5678, 3);
      expect(result).toBeTruthy();
    });
  });

  describe('formatPercentage', () => {
    it('should convert decimal to percentage', () => {
      expect(formatPercentage(0.5)).toBe('50.0%');
      expect(formatPercentage(0.756, 2)).toBe('75.60%');
      expect(formatPercentage(1)).toBe('100.0%');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('deepClone', () => {
    it('should clone objects deeply', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should handle null and undefined', () => {
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, { a: 3 }];
      const cloned = deepClone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error');
      expect(getErrorMessage(error)).toBe('Test error');
    });

    it('should handle string errors', () => {
      expect(getErrorMessage('Error string')).toBe('Error string');
    });

    it('should handle unknown errors', () => {
      expect(getErrorMessage(123)).toBe('发生未知错误');
      expect(getErrorMessage({})).toBe('发生未知错误');
    });
  });
});

