/**
 * CSV解析器单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  extractPositionData,
  detectDefects,
  generateAScanData,
  validateCSVFile,
} from '@/lib/csvParser';
import type { CSVDataRow } from '@/types';

describe('CSV Parser', () => {
  describe('extractPositionData', () => {
    it('should extract position data from CSV row', () => {
      const row: CSVDataRow = {
        FrameID: 1,
        BeamID: 1,
        Pos1: 10,
        Pos2: 20,
        Pos3: 30,
      };

      const result = extractPositionData(row);
      expect(result).toEqual([10, 20, 30]);
    });

    it('should handle missing position data', () => {
      const row: CSVDataRow = {
        FrameID: 1,
        BeamID: 1,
      };

      const result = extractPositionData(row);
      expect(result).toEqual([]);
    });

    it('should sort position data correctly', () => {
      const row: CSVDataRow = {
        FrameID: 1,
        BeamID: 1,
        Pos10: 100,
        Pos2: 20,
        Pos1: 10,
      };

      const result = extractPositionData(row);
      expect(result).toEqual([10, 20, 100]);
    });
  });

  describe('detectDefects', () => {
    it('should detect defects above threshold', () => {
      const positionData = [50, 120, 80, 150, 60];
      const threshold = 100;

      const result = detectDefects(positionData, threshold);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ position: 2, amplitude: 120 });
      expect(result[1]).toEqual({ position: 4, amplitude: 150 });
    });

    it('should return empty array when no defects', () => {
      const positionData = [50, 60, 70, 80, 90];
      const threshold = 100;

      const result = detectDefects(positionData, threshold);
      
      expect(result).toHaveLength(0);
    });

    it('should use default threshold of 100', () => {
      const positionData = [50, 120, 80];

      const result = detectDefects(positionData);
      
      expect(result).toHaveLength(1);
      expect(result[0].amplitude).toBe(120);
    });
  });

  describe('generateAScanData', () => {
    it('should generate A-Scan data format', () => {
      const positionData = [10, 20, 30, 40, 50];

      const result = generateAScanData(positionData);
      
      expect(result.xAxis).toEqual([1, 2, 3, 4, 5]);
      expect(result.yAxis).toEqual([10, 20, 30, 40, 50]);
    });

    it('should handle empty position data', () => {
      const positionData: number[] = [];

      const result = generateAScanData(positionData);
      
      expect(result.xAxis).toEqual([]);
      expect(result.yAxis).toEqual([]);
    });
  });

  describe('validateCSVFile', () => {
    it('should validate CSV file successfully', () => {
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      const result = validateCSVFile(file);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject non-CSV files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const result = validateCSVFile(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('只支持CSV文件格式');
    });

    it('should reject files larger than 500MB', () => {
      // 创建一个模拟的大文件
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      Object.defineProperty(file, 'size', { value: 600 * 1024 * 1024 });

      const result = validateCSVFile(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('文件大小超过500MB限制');
    });

    it('should reject empty files', () => {
      const file = new File([], 'test.csv', { type: 'text/csv' });

      const result = validateCSVFile(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('文件为空');
    });
  });
});

