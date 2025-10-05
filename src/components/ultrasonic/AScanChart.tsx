/**
 * A-Scan可视化组件
 * @description 显示单个波束的幅度-时间曲线
 */

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface AScanChartProps {
  data: Array<{ time: number; amplitude: number }>;
  title?: string;
  height?: number;
}

export const AScanChart: React.FC<AScanChartProps> = ({
  data,
  title = 'A-Scan 显示',
  height = 400,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 准备数据
    const xData = data.map(d => d.time);
    const yData = data.map(d => d.amplitude);

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
        trigger: 'axis',
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        borderColor: '#374151',
        textStyle: {
          color: '#e5e7eb',
        },
        formatter: (params: any) => {
          const p = params[0];
          return `时间: ${p.axisValue}<br/>幅度: ${p.value.toFixed(2)}`;
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '15%',
      },
      xAxis: {
        type: 'category',
        data: xData,
        name: '时间 (ns)',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: '#9ca3af',
        },
        axisLabel: {
          color: '#9ca3af',
          interval: Math.floor(xData.length / 10),
        },
        axisLine: {
          lineStyle: {
            color: '#374151',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '幅度',
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
      series: [
        {
          name: '幅度',
          type: 'line',
          data: yData,
          smooth: true,
          lineStyle: {
            color: '#3b82f6',
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ]),
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
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-400">暂无A-Scan数据</p>
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

