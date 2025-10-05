/**
 * 数据导出组件
 * @description 导出文件列表、检测数据等
 */

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useFiles } from '@/hooks/useFiles';

interface DataExporterProps {
  fileId?: string;
}

export const DataExporter: React.FC<DataExporterProps> = ({ fileId }) => {
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState<'files' | 'detection' | 'experiments'>('files');
  const { files } = useFiles();

  /**
   * 导出文件列表
   */
  const exportFilesList = async () => {
    try {
      setLoading(true);

      const headers = [
        '文件ID',
        '文件名',
        '文件大小(字节)',
        '检测类型',
        '状态',
        '帧数',
        '波束数',
        '位置数',
        '上传时间',
      ];

      const rows = files.map(file => [
        file.id,
        file.file_name,
        file.file_size?.toString() || '0',
        file.detection_type,
        file.status,
        file.frame_count.toString(),
        file.beam_count.toString(),
        file.position_count.toString(),
        new Date(file.created_at).toLocaleString('zh-CN'),
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

      downloadCSV(csvContent, '文件列表');
      alert('文件列表导出成功');
    } catch (error) {
      console.error('导出文件列表失败:', error);
      alert('导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 导出检测数据
   */
  const exportDetectionData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('ultrasonic_detection_data')
        .select('*')
        .limit(1000);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('暂无检测数据');
        return;
      }

      const headers = [
        '文件ID',
        'Frame ID',
        'Beam ID',
        '最大幅度',
        '最小幅度',
        '平均幅度',
        '缺陷检出',
        '缺陷数量',
      ];

      const rows = data.map(item => [
        item.file_id,
        item.frame_id.toString(),
        item.beam_id.toString(),
        item.max_amplitude?.toFixed(2) || '0',
        item.min_amplitude?.toFixed(2) || '0',
        item.avg_amplitude?.toFixed(2) || '0',
        item.defect_detected ? '是' : '否',
        item.defect_count.toString(),
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

      downloadCSV(csvContent, '检测数据');
      alert('检测数据导出成功');
    } catch (error) {
      console.error('导出检测数据失败:', error);
      alert('导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 导出试验列表
   */
  const exportExperiments = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('ultrasonic_experiments')
        .select('*')
        .limit(1000);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('暂无试验数据');
        return;
      }

      const headers = [
        '试验ID',
        '试验名称',
        '试验类型',
        '标准参考',
        '状态',
        '开始时间',
        '结束时间',
      ];

      const rows = data.map(item => [
        item.id,
        item.experiment_name,
        item.experiment_type,
        item.standard_reference || '',
        item.status,
        new Date(item.start_time).toLocaleString('zh-CN'),
        item.end_time ? new Date(item.end_time).toLocaleString('zh-CN') : '进行中',
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

      downloadCSV(csvContent, '试验列表');
      alert('试验列表导出成功');
    } catch (error) {
      console.error('导出试验列表失败:', error);
      alert('导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 下载CSV文件
   */
  const downloadCSV = (content: string, filename: string) => {
    // 添加BOM以支持中文
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    switch (exportType) {
      case 'files':
        exportFilesList();
        break;
      case 'detection':
        exportDetectionData();
        break;
      case 'experiments':
        exportExperiments();
        break;
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-6">数据导出</h2>

      <div className="space-y-6">
        {/* 导出类型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            选择导出内容
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="exportType"
                value="files"
                checked={exportType === 'files'}
                onChange={(e) => setExportType('files')}
                className="mr-2"
              />
              <span className="text-white">文件列表</span>
              <span className="ml-2 text-sm text-gray-400">({files.length}个文件)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="exportType"
                value="detection"
                checked={exportType === 'detection'}
                onChange={(e) => setExportType('detection')}
                className="mr-2"
              />
              <span className="text-white">检测数据</span>
              <span className="ml-2 text-sm text-gray-400">(前1000条)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="exportType"
                value="experiments"
                checked={exportType === 'experiments'}
                onChange={(e) => setExportType('experiments')}
                className="mr-2"
              />
              <span className="text-white">试验列表</span>
              <span className="ml-2 text-sm text-gray-400">(前1000条)</span>
            </label>
          </div>
        </div>

        {/* 导出格式说明 */}
        <div className="bg-primary-900 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">导出格式：</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center">
              <span className="mr-2">📄</span>
              <span>CSV格式（Excel可直接打开）</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🔤</span>
              <span>UTF-8编码（支持中文）</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📊</span>
              <span>包含完整字段信息</span>
            </li>
          </ul>
        </div>

        {/* 导出按钮 */}
        <button
          onClick={handleExport}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? '导出中...' : '导出数据'}
        </button>

        {/* 说明 */}
        <div className="text-sm text-gray-400">
          <p className="mb-2">💡 提示：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>导出的CSV文件可使用Excel、WPS等软件打开</li>
            <li>大量数据导出可能需要等待一段时间</li>
            <li>检测数据和试验列表默认导出前1000条</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

