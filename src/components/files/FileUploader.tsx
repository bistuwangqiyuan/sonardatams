/**
 * 文件上传组件
 * @description CSV文件上传，支持拖拽和点击选择
 */

import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import { parseCSVFile, validateCSVFile } from '@/lib/csvParser';
import { createClient } from '@supabase/supabase-js';
import type { ParsedCSVData, UploadProgress } from '@/types';
import type { Database } from '@/types/database';

// 创建类型化的Supabase客户端
const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface FileUploaderProps {
  onUploadComplete?: (fileData: ParsedCSVData) => void;
  onUploadError?: (error: string) => void;
}

export const FileUploader: FC<FileUploaderProps> = ({ onUploadComplete, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 处理拖拽事件
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  }, []);

  // 处理文件上传
  const handleFiles = async (files: File[]) => {
    setIsUploading(true);

    // 初始化进度
    const initialProgress: UploadProgress[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    setUploadProgress(initialProgress);

    // 逐个处理文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // 更新状态为上传中
        setUploadProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, status: 'uploading', progress: 10 } : item
          )
        );

        // 验证文件
        const validation = validateCSVFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // 更新进度：20%
        setUploadProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, progress: 20 } : item
          )
        );

        // 解析CSV文件
        const parsedData = await parseCSVFile(file);

        // 更新进度：40%
        setUploadProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, progress: 40 } : item
          )
        );

        // 上传文件到Supabase Storage
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ultrasonic-data')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`文件上传失败: ${uploadError.message}`);
        }

        // 更新进度：60%
        setUploadProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, progress: 60 } : item
          )
        );

        // 保存文件元数据到数据库
        const insertData: Database['public']['Tables']['ultrasonic_files']['Insert'] = {
          file_name: file.name,
          file_size: file.size,
          file_path: uploadData.path,
          detection_type: inferDetectionType(file.name),
          frame_count: parsedData.frameCount,
          beam_count: parsedData.beamCount,
          position_count: parsedData.positionCount,
          status: 'processing',
        };

        const { data: fileRecord, error: dbError } = await supabase
          .from('ultrasonic_files')
          .insert(insertData)
          .select()
          .single();

        if (dbError || !fileRecord) {
          console.error('数据库插入错误:', dbError);
          throw new Error(`保存文件信息失败: ${dbError?.message || '未知错误'}`);
        }

        // 更新进度：80%
        setUploadProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, progress: 80 } : item
          )
        );

        // 保存检测数据（批量插入）
        const detectionDataRecords: Database['public']['Tables']['ultrasonic_detection_data']['Insert'][] = parsedData.data.map((row) => ({
          file_id: fileRecord.id,
          frame_id: row.FrameID,
          beam_id: row.BeamID,
          position_data: extractPositionDataAsJson(row),
          max_amplitude: findMaxAmplitude(row),
          min_amplitude: findMinAmplitude(row),
          avg_amplitude: calculateAvgAmplitude(row),
          defect_detected: hasDefects(row),
          defect_count: countDefects(row),
        }));

        // 分批插入（每批1000条）
        const batchSize = 1000;
        for (let j = 0; j < detectionDataRecords.length; j += batchSize) {
          const batch = detectionDataRecords.slice(j, j + batchSize);
          const { error: insertError } = await supabase
            .from('ultrasonic_detection_data')
            .insert(batch);

          if (insertError) {
            console.error('检测数据插入错误:', insertError);
          }
        }

        // 更新文件状态为已处理
        const updateData: Database['public']['Tables']['ultrasonic_files']['Update'] = {
          status: 'processed'
        };
        await supabase
          .from('ultrasonic_files')
          .update(updateData)
          .eq('id', fileRecord.id);

        // 更新进度：100%
        setUploadProgress((prev) =>
          prev.map((item, index) =>
            index === i
              ? { ...item, status: 'completed', progress: 100, message: '上传成功' }
              : item
          )
        );

        // 调用成功回调
        if (onUploadComplete) {
          onUploadComplete(parsedData);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        console.error('文件处理错误:', error);

        // 更新进度为错误状态
        setUploadProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, status: 'error', message: errorMessage } : item
          )
        );

        // 调用错误回调
        if (onUploadError) {
          onUploadError(errorMessage);
        }
      }
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-secondary bg-secondary/10'
            : 'border-primary-600 hover:border-secondary'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
          />
        </svg>
        <p className="mt-4 text-lg text-gray-300">拖拽CSV文件到此处，或</p>
        <label className="mt-2 inline-block">
          <span className="btn btn-secondary cursor-pointer">选择文件</span>
          <input
            type="file"
            accept=".csv"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
        <p className="mt-2 text-sm text-gray-400">支持CSV格式，单个文件最大500MB</p>
      </div>

      {/* 上传进度 */}
      {uploadProgress.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">上传进度</h4>
          {uploadProgress.map((item, index) => (
            <div key={index} className="bg-primary-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 truncate flex-1 mr-4">
                  {item.file.name}
                </span>
                <span
                  className={`text-xs font-medium ${
                    item.status === 'completed'
                      ? 'text-success'
                      : item.status === 'error'
                      ? 'text-danger'
                      : 'text-secondary'
                  }`}
                >
                  {item.status === 'completed'
                    ? '✓ 完成'
                    : item.status === 'error'
                    ? '✗ 失败'
                    : `${item.progress}%`}
                </span>
              </div>
              <div className="w-full bg-primary-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.status === 'error' ? 'bg-danger' : 'bg-secondary'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              {item.message && (
                <p
                  className={`mt-2 text-xs ${
                    item.status === 'error' ? 'text-danger' : 'text-gray-400'
                  }`}
                >
                  {item.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 辅助函数

/**
 * 从文件名推断检测类型
 */
function inferDetectionType(fileName: string): 'weld' | 'layered' | 'slope' | 'single_layer' {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('焊缝') || lowerName.includes('weld')) return 'weld';
  if (lowerName.includes('双层') || lowerName.includes('多层') || lowerName.includes('layered'))
    return 'layered';
  if (lowerName.includes('斜坡') || lowerName.includes('slope')) return 'slope';
  return 'single_layer';
}

/**
 * 提取位置数据为JSON对象
 */
function extractPositionDataAsJson(row: any): any {
  const positionData: any = {};
  Object.keys(row).forEach((key) => {
    if (key.startsWith('Pos')) {
      positionData[key] = row[key];
    }
  });
  return positionData;
}

/**
 * 查找最大幅值
 */
function findMaxAmplitude(row: any): number {
  let max = 0;
  Object.keys(row).forEach((key) => {
    if (key.startsWith('Pos') && typeof row[key] === 'number') {
      max = Math.max(max, row[key]);
    }
  });
  return max;
}

/**
 * 查找最小幅值
 */
function findMinAmplitude(row: any): number {
  let min = Infinity;
  Object.keys(row).forEach((key) => {
    if (key.startsWith('Pos') && typeof row[key] === 'number') {
      min = Math.min(min, row[key]);
    }
  });
  return min === Infinity ? 0 : min;
}

/**
 * 计算平均幅值
 */
function calculateAvgAmplitude(row: any): number {
  let sum = 0;
  let count = 0;
  Object.keys(row).forEach((key) => {
    if (key.startsWith('Pos') && typeof row[key] === 'number') {
      sum += row[key];
      count++;
    }
  });
  return count > 0 ? sum / count : 0;
}

/**
 * 检测是否有缺陷（阈值>100）
 */
function hasDefects(row: any, threshold: number = 100): boolean {
  return Object.keys(row).some(
    (key) => key.startsWith('Pos') && typeof row[key] === 'number' && row[key] > threshold
  );
}

/**
 * 统计缺陷数量
 */
function countDefects(row: any, threshold: number = 100): number {
  let count = 0;
  Object.keys(row).forEach((key) => {
    if (key.startsWith('Pos') && typeof row[key] === 'number' && row[key] > threshold) {
      count++;
    }
  });
  return count;
}

