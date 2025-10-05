/**
 * 统计卡片组件
 * @description 显示关键统计指标
 */

import React from 'react';
import { useStatistics } from '@/hooks/useStatistics';

export const StatisticsCards: React.FC = () => {
  const { statistics, loading } = useStatistics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-24 bg-primary-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: '总检测文件',
      value: statistics.totalFiles.toLocaleString(),
      subtitle: '累计上传',
      icon: '📁',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: '今日检测',
      value: statistics.todayDetections.toString(),
      subtitle: '实时更新',
      icon: '📊',
      trend: null,
      trendUp: null,
    },
    {
      title: '缺陷检出',
      value: statistics.defectCount.toString(),
      subtitle: '需关注',
      icon: '⚠️',
      trend: null,
      trendUp: null,
    },
    {
      title: '合格率',
      value: `${statistics.passRate}%`,
      subtitle: '质量评级',
      icon: '✓',
      trend: statistics.passRate > 90 ? '优秀' : null,
      trendUp: statistics.passRate > 90,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="card hover-lift">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-sm text-gray-500">{card.subtitle}</p>
              {card.trend && (
                <p
                  className={`text-xs mt-2 ${
                    card.trendUp ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {card.trendUp ? '↑' : '↓'} {card.trend}
                </p>
              )}
            </div>
            <div className="text-4xl opacity-20">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

