/**
 * S-Scan可视化组件
 * @description 显示扇形扫描视图
 */

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface SScanChartProps {
  data: Array<{ angle: number; depth: number; amplitude: number }>;
  title?: string;
  height?: number;
}

export const SScanChart: React.FC<SScanChartProps> = ({
  data,
  title = 'S-Scan 显示',
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

    // 准备散点图数据
    const scatterData = data.map(d => [d.angle, d.depth, d.amplitude]);

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
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        borderColor: '#374151',
        textStyle: {
          color: '#e5e7eb',
        },
        formatter: (params: any) => {
          return `角度: ${params.data[0]}°<br/>深度: ${params.data[1]}<br/>幅度: ${params.data[2].toFixed(2)}`;
        },
      },
      grid: {
        left: '12%',
        right: '15%',
        bottom: '15%',
        top: '15%',
      },
      xAxis: {
        type: 'value',
        name: '角度 (°)',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: '#9ca3af',
        },
        axisLabel: {
          color: '#9ca3af',
        },
        axisLine: {
          lineStyle: {
            color: '#374151',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#374151',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '深度',
        nameTextStyle: {
          color: '#9ca3af',
        },
        axisLabel: {
          color: '#9ca3af',
        },
        axisLine: {
          lineStyle: {
            color: '#374151',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#374151',
            type: 'dashed',
          },
        },
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.map(d => d.amplitude)),
        dimension: 2,
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
          type: 'scatter',
          data: scatterData,
          symbolSize: 3,
          emphasis: {
            focus: 'series',
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
            <div className="text-4xl mb-2">📡</div>
            <p className="text-gray-400">暂无S-Scan数据</p>
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

