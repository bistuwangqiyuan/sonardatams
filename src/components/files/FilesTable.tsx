/**
 * 文件列表表格组件
 * @description 显示和管理文件列表
 */

import React, { useState } from 'react';
import { useFiles } from '@/hooks/useFiles';
import { formatFileSize, formatDateTime, detectionTypeLabels, fileStatusLabels } from '@/lib/utils';

interface FilesTableProps {
  detectionType?: string;
  status?: string;
  searchQuery?: string;
}

export const FilesTable: React.FC<FilesTableProps> = ({
  detectionType,
  status,
  searchQuery,
}) => {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { files, loading, totalCount, deleteFile } = useFiles({
    detectionType,
    status,
    searchQuery,
    limit,
    offset: page * limit,
  });

  const totalPages = Math.ceil(totalCount / limit);

  const handleDelete = async (fileId: string, fileName: string) => {
    if (confirm(`确定要删除文件 "${fileName}" 吗？`)) {
      const { error } = await deleteFile(fileId);
      if (error) {
        alert(`删除失败: ${error.message}`);
      } else {
        alert('文件已删除');
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-primary-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">暂无文件</h3>
        <p className="text-gray-500">点击上传按钮开始上传CSV文件</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="checkbox" />
              </th>
              <th>文件名</th>
              <th>检测类型</th>
              <th>文件大小</th>
              <th>状态</th>
              <th>帧数/波束数</th>
              <th>上传时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td className="font-medium text-white">{file.file_name}</td>
                <td>
                  <span className="badge badge-primary">
                    {detectionTypeLabels[file.detection_type]}
                  </span>
                </td>
                <td className="text-gray-400">
                  {file.file_size ? formatFileSize(file.file_size) : '-'}
                </td>
                <td>
                  <span
                    className={`badge ${
                      file.status === 'processed'
                        ? 'badge-success'
                        : file.status === 'processing'
                        ? 'badge-warning'
                        : file.status === 'error'
                        ? 'badge-error'
                        : 'badge-secondary'
                    }`}
                  >
                    {fileStatusLabels[file.status]}
                  </span>
                </td>
                <td className="text-gray-400">
                  {file.frame_count} / {file.beam_count}
                </td>
                <td className="text-gray-400">
                  {formatDateTime(file.created_at, 'relative')}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      className="btn-sm btn-secondary"
                      title="查看"
                      onClick={() => (window.location.href = `/ultrasonic?file=${file.id}`)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      className="btn-sm btn-error"
                      title="删除"
                      onClick={() => handleDelete(file.id, file.file_name)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页器 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            显示 {page * limit + 1}-{Math.min((page + 1) * limit, totalCount)} 共 {totalCount} 条
          </div>
          <div className="flex space-x-2">
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              上一页
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = page < 3 ? i : page - 2 + i;
              if (pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  className={`btn ${pageNum === page ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

