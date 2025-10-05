/**
 * 报告生成组件
 * @description 生成PDF和Excel报告
 */

import React, { useState } from 'react';
import { useFiles } from '@/hooks/useFiles';
import { useStatistics } from '@/hooks/useStatistics';
import type { UltrasonicFile } from '@/types/database';

interface ReportGeneratorProps {
  fileId?: string;
  experimentId?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  fileId,
  experimentId,
}) => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'pdf' | 'excel'>('pdf');
  const { statistics } = useStatistics();

  /**
   * 生成PDF报告
   */
  const generatePDFReport = async () => {
    try {
      setLoading(true);

      // 创建HTML内容
      const reportHTML = generateReportHTML();

      // 创建打印窗口
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();

        // 等待内容加载
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }

      alert('PDF报告已准备完成，请在打印对话框中选择"保存为PDF"');
    } catch (error) {
      console.error('生成PDF报告失败:', error);
      alert('生成PDF报告失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 生成Excel报告（CSV格式）
   */
  const generateExcelReport = async () => {
    try {
      setLoading(true);

      // 生成CSV内容
      const csvContent = generateCSVContent();

      // 创建Blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = `超声检测报告_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      // 清理
      URL.revokeObjectURL(url);

      alert('Excel报告已成功导出');
    } catch (error) {
      console.error('生成Excel报告失败:', error);
      alert('生成Excel报告失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 生成HTML报告内容
   */
  const generateReportHTML = (): string => {
    const date = new Date().toLocaleDateString('zh-CN');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>超声检测报告</title>
        <style>
          body {
            font-family: 'SimSun', serif;
            margin: 40px;
            line-height: 1.6;
          }
          h1 {
            text-align: center;
            color: #1f2937;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
          }
          h2 {
            color: #374151;
            margin-top: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          .info-section {
            margin: 20px 0;
          }
          .info-item {
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
          }
          .footer {
            margin-top: 50px;
            text-align: right;
            color: #6b7280;
          }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>超声相控阵检测报告</h1>

        <div class="info-section">
          <div class="info-item">
            <span class="label">报告日期:</span>
            <span>${date}</span>
          </div>
          <div class="info-item">
            <span class="label">检测标准:</span>
            <span>ISO 16810:2012, ASTM E2700</span>
          </div>
        </div>

        <h2>1. 检测概况</h2>
        <table>
          <tr>
            <th>项目</th>
            <th>数值</th>
          </tr>
          <tr>
            <td>总检测文件数</td>
            <td>${statistics.totalFiles}</td>
          </tr>
          <tr>
            <td>今日检测数</td>
            <td>${statistics.todayDetections}</td>
          </tr>
          <tr>
            <td>缺陷检出数</td>
            <td>${statistics.defectCount}</td>
          </tr>
          <tr>
            <td>合格率</td>
            <td>${statistics.passRate}%</td>
          </tr>
        </table>

        <h2>2. 检测类型分布</h2>
        <table>
          <tr>
            <th>检测类型</th>
            <th>数量</th>
          </tr>
          ${statistics.detectionTypeStats.map(stat => `
            <tr>
              <td>${stat.type}</td>
              <td>${stat.count}</td>
            </tr>
          `).join('')}
        </table>

        <h2>3. 质量等级统计</h2>
        <table>
          <tr>
            <th>质量等级</th>
            <th>数量</th>
          </tr>
          ${statistics.qualityGradeStats.map(stat => `
            <tr>
              <td>${stat.grade}</td>
              <td>${stat.count}</td>
            </tr>
          `).join('')}
        </table>

        <h2>4. 检测结论</h2>
        <p>
          本次检测共完成${statistics.totalFiles}个文件的数据采集和分析，
          检出缺陷${statistics.defectCount}处，整体合格率为${statistics.passRate}%。
          检测结果符合相关标准要求。
        </p>

        <div class="footer">
          <p>检测员签字: _______________</p>
          <p>日期: ${date}</p>
        </div>
      </body>
      </html>
    `;
  };

  /**
   * 生成CSV内容
   */
  const generateCSVContent = (): string => {
    const rows = [
      ['超声检测报告'],
      ['报告日期', new Date().toLocaleDateString('zh-CN')],
      [''],
      ['检测概况'],
      ['项目', '数值'],
      ['总检测文件数', statistics.totalFiles.toString()],
      ['今日检测数', statistics.todayDetections.toString()],
      ['缺陷检出数', statistics.defectCount.toString()],
      ['合格率', `${statistics.passRate}%`],
      [''],
      ['检测类型分布'],
      ['检测类型', '数量'],
      ...statistics.detectionTypeStats.map(stat => [stat.type, stat.count.toString()]),
      [''],
      ['质量等级统计'],
      ['质量等级', '数量'],
      ...statistics.qualityGradeStats.map(stat => [stat.grade, stat.count.toString()]),
    ];

    return rows.map(row => row.join(',')).join('\n');
  };

  const handleGenerate = () => {
    if (reportType === 'pdf') {
      generatePDFReport();
    } else {
      generateExcelReport();
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-6">报告生成</h2>

      <div className="space-y-6">
        {/* 报告类型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            选择报告类型
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="reportType"
                value="pdf"
                checked={reportType === 'pdf'}
                onChange={(e) => setReportType('pdf')}
                className="mr-2"
              />
              <span className="text-white">PDF报告</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="reportType"
                value="excel"
                checked={reportType === 'excel'}
                onChange={(e) => setReportType('excel')}
                className="mr-2"
              />
              <span className="text-white">Excel报告 (CSV)</span>
            </label>
          </div>
        </div>

        {/* 报告预览信息 */}
        <div className="bg-primary-900 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">报告内容包含：</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>检测概况统计</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>检测类型分布</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>质量等级统计</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>检测结论</span>
            </li>
          </ul>
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? '生成中...' : `生成${reportType === 'pdf' ? 'PDF' : 'Excel'}报告`}
        </button>

        {/* 说明 */}
        <div className="text-sm text-gray-400">
          <p className="mb-2">💡 提示：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>PDF报告将打开打印对话框，可选择"保存为PDF"</li>
            <li>Excel报告将以CSV格式下载，可使用Excel/WPS打开</li>
            <li>报告包含当前系统的所有统计数据</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

