/**
 * C-Scan可视化组件
 * @description 显示平面图（俯视图），使用热力图
 */

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface CScanChartProps {
  data: Array<{ x: number; y: number; maxAmplitude: number }>;
  title?: string;
  height?: number;
}

export const CScanChart: React.FC<CScanChartProps> = ({
  data,
  title = 'C-Scan 显示',
  height = 500,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 准备热力图数据
    const heatmapData = data.map(d => [d.x, d.y, d.maxAmplitude]);

    // 获取x和y的范围
    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    const maxX = Math.max(...xValues, 0);
    const maxY = Math.max(...yValues, 0);

    // 配置图表
    const option: echarts.EChartsOption = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: '#e5e7eb',
          fontSize: 16,
        },
      },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        borderColor: '#374151',
        textStyle: {
          color: '#e5e7eb',
        },
        formatter: (params: any) => {
          return `Frame: ${params.data[0]}<br/>Beam: ${params.data[1]}<br/>幅度: ${params.data[2].toFixed(2)}`;
        },
      },
      grid: {
        left: '12%',
        right: '15%',
        bottom: '15%',
        top: '15%',
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: maxX + 1 }, (_, i) => i),
        name: 'Frame ID',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: '#9ca3af',
        },
        axisLabel: {
          color: '#9ca3af',
        },
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: Array.from({ length: maxY + 1 }, (_, i) => i),
        name: 'Beam ID',
        nameTextStyle: {
          color: '#9ca3af',
        },
        axisLabel: {
          color: '#9ca3af',
        },
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.map(d => d.maxAmplitude)),
        calculable: true,
        orient: 'vertical',
        right: '2%',
        top: 'center',
        textStyle: {
          color: '#9ca3af',
        },
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
        },
      },
      series: [
        {
          name: '幅度',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 响应式
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, title]);

  // 清理
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  if (data.length === 0) {
    return (
      <div className="card" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-gray-400">暂无C-Scan数据</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div ref={chartRef} style={{ height: `${height}px`, width: '100%' }} />
    </div>
  );
};

