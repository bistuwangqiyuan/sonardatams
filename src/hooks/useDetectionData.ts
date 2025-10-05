/**
 * 检测数据管理Hook
 * @description 获取超声检测数据用于可视化
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DetectionData } from '@/types/database';

interface UseDetectionDataOptions {
  fileId?: string;
  frameId?: number;
  beamId?: number;
  limit?: number;
}

interface ProcessedScanData {
  aScan: Array<{ time: number; amplitude: number }>;
  bScan: Array<{ x: number; y: number; amplitude: number }>;
  cScan: Array<{ x: number; y: number; maxAmplitude: number }>;
  sScan: Array<{ angle: number; depth: number; amplitude: number }>;
}

export function useDetectionData(options: UseDetectionDataOptions = {}) {
  const [detectionData, setDetectionData] = useState<DetectionData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options.fileId) {
      loadDetectionData();
    }
  }, [options.fileId, options.frameId, options.beamId, options.limit]);

  async function loadDetectionData() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('ultrasonic_detection_data')
        .select('*')
        .order('frame_id', { ascending: true })
        .order('beam_id', { ascending: true });

      // 应用筛选条件
      if (options.fileId) {
        query = query.eq('file_id', options.fileId);
      }

      if (options.frameId !== undefined) {
        query = query.eq('frame_id', options.frameId);
      }

      if (options.beamId !== undefined) {
        query = query.eq('beam_id', options.beamId);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setDetectionData(data || []);
      
      // 处理数据用于不同的扫描模式
      if (data && data.length > 0) {
        const processed = processDataForScans(data);
        setProcessedData(processed);
      }
    } catch (err) {
      setError(err as Error);
      console.error('加载检测数据失败:', err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * 处理原始数据为不同扫描模式所需的格式
   */
  function processDataForScans(data: DetectionData[]): ProcessedScanData {
    // A-Scan: 单个波束的幅度-时间曲线
    const aScanData = data
      .filter(d => d.frame_id === 0 && d.beam_id === 0)
      .flatMap(d => {
        const positions = d.position_data as Record<string, number>;
        return Object.entries(positions).map(([key, amplitude]) => ({
          time: parseInt(key.replace('pos', '')),
          amplitude,
        }));
      });

    // B-Scan: 剖面图（frame_id vs 深度）
    const bScanData = data.flatMap(d => {
      const positions = d.position_data as Record<string, number>;
      return Object.entries(positions).map(([key, amplitude]) => ({
        x: d.frame_id,
        y: parseInt(key.replace('pos', '')),
        amplitude,
      }));
    });

    // C-Scan: 平面图（frame_id vs beam_id，显示最大幅度）
    const cScanMap = new Map<string, number>();
    data.forEach(d => {
      const key = `${d.frame_id}-${d.beam_id}`;
      const maxAmp = d.max_amplitude || 0;
      cScanMap.set(key, Math.max(cScanMap.get(key) || 0, maxAmp));
    });

    const cScanData = Array.from(cScanMap.entries()).map(([key, maxAmplitude]) => {
      const [x, y] = key.split('-').map(Number);
      return { x, y, maxAmplitude };
    });

    // S-Scan: 扇形扫描（角度 vs 深度）
    const sScanData = data.flatMap(d => {
      const angle = d.beam_id * 2 - 90; // 假设每个beam相差2度，中心为0度
      const positions = d.position_data as Record<string, number>;
      return Object.entries(positions).map(([key, amplitude]) => ({
        angle,
        depth: parseInt(key.replace('pos', '')),
        amplitude,
      }));
    });

    return {
      aScan: aScanData.slice(0, 896), // 限制数据点数量
      bScan: bScanData.slice(0, 10000),
      cScan: cScanData,
      sScan: sScanData.slice(0, 10000),
    };
  }

  async function refreshData() {
    await loadDetectionData();
  }

  return {
    detectionData,
    processedData,
    loading,
    error,
    refreshData,
  };
}

