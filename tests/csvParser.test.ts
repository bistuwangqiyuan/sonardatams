/**
 * CSV解析器单元测试
 */

import { describe, it, expect } from 'vitest';
import { validateCSVFile, extractPositionData, detectDefects } from '@/lib/csvParser';

describe('CSV解析器测试', () => {
  describe('validateCSVFile', () => {
    it('应该验证正确的CSV文件', () => {
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const result = validateCSVFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('应该拒绝非CSV文件', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateCSVFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('只支持CSV文件格式');
    });

    it('应该拒绝空文件', () => {
      const file = new File([], 'test.csv', { type: 'text/csv' });
      const result = validateCSVFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('文件为空');
    });

    it('应该拒绝超大文件', () => {
      // 创建一个模拟的大文件对象（不实际分配内存）
      const file = {
        name: 'large.csv',
        size: 600 * 1024 * 1024,
      } as File;
      const result = validateCSVFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('文件大小超过500MB限制');
    });
  });

  describe('extractPositionData', () => {
    it('应该正确提取位置数据', () => {
      const row = {
        FrameID: 1,
        BeamID: 1,
        Pos1: 10,
        Pos2: 20,
        Pos3: 30,
      };
      const result = extractPositionData(row as any);
      expect(result).toEqual([10, 20, 30]);
    });

    it('应该处理缺失的位置数据', () => {
      const row = {
        FrameID: 1,
        BeamID: 1,
        Pos1: 10,
        Pos2: null,
        Pos3: undefined,
      };
      const result = extractPositionData(row as any);
      expect(result).toEqual([10, 0, 0]);
    });

    it('应该按正确顺序提取位置数据', () => {
      const row = {
        FrameID: 1,
        BeamID: 1,
        Pos10: 100,
        Pos2: 20,
        Pos1: 10,
      };
      const result = extractPositionData(row as any);
      expect(result[0]).toBe(10);
      expect(result[1]).toBe(20);
      expect(result[2]).toBe(100);
    });
  });

  describe('detectDefects', () => {
    it('应该检测缺陷（幅值>阈值）', () => {
      const positionData = [50, 150, 80, 200, 60];
      const result = detectDefects(positionData, 100);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual({ position: 2, amplitude: 150 });
      expect(result[1]).toEqual({ position: 4, amplitude: 200 });
    });

    it('应该使用默认阈值', () => {
      const positionData = [50, 150, 80];
      const result = detectDefects(positionData);
      expect(result.length).toBe(1);
      expect(result[0].amplitude).toBe(150);
    });

    it('应该处理无缺陷情况', () => {
      const positionData = [50, 80, 60, 90];
      const result = detectDefects(positionData, 100);
      expect(result.length).toBe(0);
    });

    it('应该处理空数据', () => {
      const result = detectDefects([]);
      expect(result.length).toBe(0);
    });
  });
});

