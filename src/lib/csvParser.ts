/**
 * CSV解析器
 * @description 解析超声检测CSV数据文件
 */

import Papa from 'papaparse';
import type { CSVDataRow, ParsedCSVData } from '@/types';

/**
 * 解析CSV文件
 * @param file CSV文件对象
 * @returns Promise<ParsedCSVData>
 */
export async function parseCSVFile(file: File): Promise<ParsedCSVData> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVDataRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = processCSVData(results.data, file.name, file.size);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV解析失败: ${error.message}`));
      },
    });
  });
}

/**
 * 处理CSV数据
 * @param data 原始CSV数据
 * @param fileName 文件名
 * @param fileSize 文件大小
 * @returns ParsedCSVData
 */
function processCSVData(
  data: CSVDataRow[],
  fileName: string,
  fileSize: number
): ParsedCSVData {
  // 验证数据格式
  if (!data || data.length === 0) {
    throw new Error('CSV文件为空');
  }

  // 验证必需字段
  const firstRow = data[0];
  if (!('FrameID' in firstRow) || !('BeamID' in firstRow)) {
    throw new Error('CSV格式错误：缺少FrameID或BeamID字段');
  }

  // 计算位置点数量
  const positionKeys = Object.keys(firstRow).filter((key) => key.startsWith('Pos'));
  if (positionKeys.length === 0) {
    throw new Error('CSV格式错误：未找到位置数据（Pos字段）');
  }

  // 统计信息
  const frames = new Set<number>();
  const beams = new Set<number>();
  let maxAmplitude = -Infinity;
  let minAmplitude = Infinity;
  let sumAmplitude = 0;
  let totalPoints = 0;
  let defectCount = 0;

  // 处理每一行数据
  data.forEach((row) => {
    frames.add(row.FrameID);
    beams.add(row.BeamID);

    // 统计位置数据
    positionKeys.forEach((key) => {
      const value = row[key as keyof CSVDataRow] as number;
      if (typeof value === 'number' && !isNaN(value)) {
        maxAmplitude = Math.max(maxAmplitude, value);
        minAmplitude = Math.min(minAmplitude, value);
        sumAmplitude += value;
        totalPoints++;

        // 简单的缺陷检测（阈值 > 100）
        if (value > 100) {
          defectCount++;
        }
      }
    });
  });

  const avgAmplitude = totalPoints > 0 ? sumAmplitude / totalPoints : 0;

  return {
    fileName,
    fileSize,
    rowCount: data.length,
    frameCount: frames.size,
    beamCount: beams.size,
    positionCount: positionKeys.length,
    data,
    statistics: {
      maxAmplitude: maxAmplitude === -Infinity ? 0 : maxAmplitude,
      minAmplitude: minAmplitude === Infinity ? 0 : minAmplitude,
      avgAmplitude,
      defectCount,
    },
  };
}

/**
 * 提取位置数据数组
 * @param row CSV数据行
 * @returns 位置数据数组
 */
export function extractPositionData(row: CSVDataRow): number[] {
  const positionData: number[] = [];
  const positionKeys = Object.keys(row)
    .filter((key) => key.startsWith('Pos'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('Pos', ''));
      const numB = parseInt(b.replace('Pos', ''));
      return numA - numB;
    });

  positionKeys.forEach((key) => {
    const value = row[key as keyof CSVDataRow] as number;
    positionData.push(typeof value === 'number' && !isNaN(value) ? value : 0);
  });

  return positionData;
}

/**
 * 检测缺陷
 * @param positionData 位置数据数组
 * @param threshold 阈值
 * @returns 缺陷位置数组
 */
export function detectDefects(
  positionData: number[],
  threshold: number = 100
): { position: number; amplitude: number }[] {
  const defects: { position: number; amplitude: number }[] = [];

  positionData.forEach((amplitude, index) => {
    if (amplitude > threshold) {
      defects.push({
        position: index + 1, // Pos1开始
        amplitude,
      });
    }
  });

  return defects;
}

/**
 * 生成A-Scan数据（单个波束）
 * @param positionData 位置数据
 * @returns ECharts格式数据
 */
export function generateAScanData(positionData: number[]) {
  return {
    xAxis: positionData.map((_, index) => index + 1),
    yAxis: positionData,
  };
}

/**
 * 生成B-Scan数据（深度-位置截面）
 * @param data CSV数据
 * @param frameId 帧ID
 * @returns 二维数组数据
 */
export function generateBScanData(data: CSVDataRow[], frameId: number): number[][] {
  const frameData = data.filter((row) => row.FrameID === frameId);

  // 按BeamID排序
  frameData.sort((a, b) => a.BeamID - b.BeamID);

  // 构建二维数组 [beam][position]
  const bscanData: number[][] = [];

  frameData.forEach((row) => {
    const positionData = extractPositionData(row);
    bscanData.push(positionData);
  });

  return bscanData;
}

/**
 * 生成C-Scan数据（平面投影）
 * @param data CSV数据
 * @param positionIndex 位置索引
 * @returns 二维数组数据
 */
export function generateCScanData(data: CSVDataRow[], positionIndex: number): number[][] {
  // 获取所有帧和波束
  const frames = Array.from(new Set(data.map((row) => row.FrameID))).sort((a, b) => a - b);
  const beams = Array.from(new Set(data.map((row) => row.BeamID))).sort((a, b) => a - b);

  // 构建二维数组 [frame][beam]
  const cscanData: number[][] = [];

  frames.forEach((frameId) => {
    const frameRow: number[] = [];
    beams.forEach((beamId) => {
      const row = data.find((r) => r.FrameID === frameId && r.BeamID === beamId);
      if (row) {
        const key = `Pos${positionIndex}` as keyof CSVDataRow;
        const value = row[key] as number;
        frameRow.push(typeof value === 'number' && !isNaN(value) ? value : 0);
      } else {
        frameRow.push(0);
      }
    });
    cscanData.push(frameRow);
  });

  return cscanData;
}

/**
 * 验证CSV文件格式
 * @param file 文件对象
 * @returns 是否有效
 */
export function validateCSVFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return { valid: false, error: '只支持CSV文件格式' };
  }

  // 检查文件大小（最大500MB）
  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: '文件大小超过500MB限制' };
  }

  // 检查文件是否为空
  if (file.size === 0) {
    return { valid: false, error: '文件为空' };
  }

  return { valid: true };
}

