# 🚀 高级功能使用指南

## 版本 v1.3.0 - 高级功能完整版

**更新日期**: 2025-10-04  
**功能状态**: ✅ 全部完成

---

## 📋 目录

1. [高级可视化](#高级可视化)
2. [试验创建向导](#试验创建向导)
3. [报告生成功能](#报告生成功能)
4. [数据导出功能](#数据导出功能)
5. [使用示例](#使用示例)
6. [API文档](#api文档)

---

## 🎨 高级可视化

### 功能概述

系统现已支持完整的A/C/S扫描真实数据可视化，使用ECharts实现专业级的超声图像显示。

### 新增组件

#### 1. AScanChart - A扫描显示
**文件**: `src/components/ultrasonic/AScanChart.tsx`

**功能**:
- 显示单个波束的幅度-时间曲线
- 实时数据可视化
- 缺陷检测标记
- 交互式缩放和查询

**使用示例**:
```tsx
import { AScanChart } from '@/components/ultrasonic';
import { useDetectionData } from '@/hooks';

function UltrasonicPage() {
  const { processedData, loading } = useDetectionData({ fileId: 'xxx' });

  if (loading) return <div>加载中...</div>;

  return (
    <AScanChart 
      data={processedData?.aScan || []}
      title="A-Scan 波形显示"
      height={400}
    />
  );
}
```

**数据格式**:
```typescript
Array<{ time: number; amplitude: number }>
```

#### 2. CScanChart - C扫描显示
**文件**: `src/components/ultrasonic/CScanChart.tsx`

**功能**:
- 显示平面图（俯视图）
- 热力图可视化
- 缺陷区域着色
- 实时数据更新

**使用示例**:
```tsx
import { CScanChart } from '@/components/ultrasonic';

function UltrasonicPage() {
  const { processedData } = useDetectionData({ fileId: 'xxx' });

  return (
    <CScanChart 
      data={processedData?.cScan || []}
      title="C-Scan 平面图"
      height={500}
    />
  );
}
```

**数据格式**:
```typescript
Array<{ x: number; y: number; maxAmplitude: number }>
```

#### 3. SScanChart - S扫描显示
**文件**: `src/components/ultrasonic/SScanChart.tsx`

**功能**:
- 显示扇形扫描视图
- 散点图可视化
- 角度-深度关系
- 缺陷定位

**使用示例**:
```tsx
import { SScanChart } from '@/components/ultrasonic';

function UltrasonicPage() {
  const { processedData } = useDetectionData({ fileId: 'xxx' });

  return (
    <SScanChart 
      data={processedData?.sScan || []}
      title="S-Scan 扇形扫描"
      height={500}
    />
  );
}
```

**数据格式**:
```typescript
Array<{ angle: number; depth: number; amplitude: number }>
```

### useDetectionData Hook

**文件**: `src/hooks/useDetectionData.ts`

**功能**:
- 从Supabase加载检测数据
- 自动处理数据为不同扫描模式格式
- 支持筛选和分页

**使用方法**:
```typescript
import { useDetectionData } from '@/hooks';

function MyComponent() {
  const {
    detectionData,      // 原始检测数据
    processedData,      // 处理后的扫描数据
    loading,            // 加载状态
    error,              // 错误信息
    refreshData,        // 刷新数据
  } = useDetectionData({
    fileId: 'xxx',      // 必需：文件ID
    frameId: 0,         // 可选：帧ID
    beamId: 0,          // 可选：波束ID
    limit: 1000,        // 可选：数据量限制
  });

  return (
    <div>
      {processedData && (
        <>
          <AScanChart data={processedData.aScan} />
          <CScanChart data={processedData.cScan} />
          <SScanChart data={processedData.sScan} />
        </>
      )}
    </div>
  );
}
```

---

## 🧙 试验创建向导

### 功能概述

提供分步骤的试验创建流程，引导用户完成试验配置。

### ExperimentWizard 组件

**文件**: `src/components/experiments/ExperimentWizard.tsx`

**功能**:
- 4步创建流程
- 表单验证
- 数据预览确认
- 自动保存到Supabase

### 创建步骤

#### 步骤1: 基本信息
- 试验名称（必填）
- 试验类型（焊缝/分层/特殊）
- 标准参考
- 备注说明

#### 步骤2: 试件信息
- 材料类型
- 试件尺寸（长×宽×厚）
- 试件描述

#### 步骤3: 设备参数
- 探头频率
- 增益
- 扫查速度
- 采样率
- 设备型号

#### 步骤4: 确认创建
- 信息预览
- 确认创建

### 使用示例

```tsx
import { ExperimentWizard } from '@/components/experiments';
import { useState } from 'react';

function ExperimentsPage() {
  const [showWizard, setShowWizard] = useState(false);

  const handleComplete = (experimentId: string) => {
    console.log('试验创建成功:', experimentId);
    setShowWizard(false);
    // 刷新试验列表
  };

  return (
    <div>
      <button onClick={() => setShowWizard(true)}>
        创建新试验
      </button>

      {showWizard && (
        <ExperimentWizard
          onComplete={handleComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}
```

### 特性

- ✅ 分步骤引导
- ✅ 表单验证
- ✅ 进度指示
- ✅ 数据预览
- ✅ 可返回修改
- ✅ 自动保存

---

## 📄 报告生成功能

### 功能概述

生成专业的PDF和Excel格式检测报告。

### ReportGenerator 组件

**文件**: `src/components/reports/ReportGenerator.tsx`

**功能**:
- PDF报告生成
- Excel报告生成（CSV格式）
- 包含统计数据
- 符合检测标准格式

### 报告内容

#### 1. 检测概况
- 总检测文件数
- 今日检测数
- 缺陷检出数
- 合格率

#### 2. 检测类型分布
- 焊缝检测
- 分层检测
- 其他类型

#### 3. 质量等级统计
- 优秀（A级）
- 良好（B级）
- 合格（C级）
- 不合格（Reject）

#### 4. 检测结论
- 总结性说明
- 签字区域
- 日期

### 使用示例

```tsx
import { ReportGenerator } from '@/components/reports';

function ReportsPage() {
  return (
    <div>
      <h1>报告生成</h1>
      <ReportGenerator 
        fileId="xxx"          // 可选
        experimentId="xxx"    // 可选
      />
    </div>
  );
}
```

### PDF报告生成

**流程**:
1. 用户选择"PDF报告"
2. 点击"生成PDF报告"
3. 系统打开打印对话框
4. 用户选择"保存为PDF"
5. 保存到本地

**特性**:
- 专业排版
- 中文支持
- 表格格式化
- 签字区域

### Excel报告生成

**流程**:
1. 用户选择"Excel报告"
2. 点击"生成Excel报告"
3. 系统自动下载CSV文件
4. 使用Excel/WPS打开

**特性**:
- CSV格式
- UTF-8编码
- 完整字段
- 易于编辑

---

## 📊 数据导出功能

### 功能概述

导出文件列表、检测数据、试验列表等数据为CSV格式。

### DataExporter 组件

**文件**: `src/components/exports/DataExporter.tsx`

**功能**:
- 导出文件列表
- 导出检测数据
- 导出试验列表
- CSV格式（Excel可打开）

### 导出类型

#### 1. 文件列表
**包含字段**:
- 文件ID
- 文件名
- 文件大小
- 检测类型
- 状态
- 帧数/波束数/位置数
- 上传时间

#### 2. 检测数据
**包含字段**:
- 文件ID
- Frame ID
- Beam ID
- 最大/最小/平均幅度
- 缺陷检出
- 缺陷数量

#### 3. 试验列表
**包含字段**:
- 试验ID
- 试验名称
- 试验类型
- 标准参考
- 状态
- 开始/结束时间

### 使用示例

```tsx
import { DataExporter } from '@/components/exports';

function ExportPage() {
  return (
    <div>
      <h1>数据导出</h1>
      <DataExporter fileId="xxx" />
    </div>
  );
}
```

### 特性

- ✅ CSV格式
- ✅ UTF-8编码（支持中文）
- ✅ Excel兼容
- ✅ 完整字段
- ✅ 批量导出
- ✅ 数据限制（前1000条）

---

## 💻 使用示例

### 完整页面示例

```tsx
import React, { useState } from 'react';
import { AScanChart, CScanChart, SScanChart } from '@/components/ultrasonic';
import { ExperimentWizard } from '@/components/experiments';
import { ReportGenerator } from '@/components/reports';
import { DataExporter } from '@/components/exports';
import { useDetectionData } from '@/hooks';

function AdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<'viz' | 'wizard' | 'report' | 'export'>('viz');
  const [selectedFileId, setSelectedFileId] = useState<string>('');

  const { processedData, loading } = useDetectionData({ 
    fileId: selectedFileId 
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 标签页导航 */}
      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setActiveTab('viz')}
          className={`btn ${activeTab === 'viz' ? 'btn-primary' : 'btn-secondary'}`}
        >
          可视化
        </button>
        <button 
          onClick={() => setActiveTab('wizard')}
          className={`btn ${activeTab === 'wizard' ? 'btn-primary' : 'btn-secondary'}`}
        >
          创建试验
        </button>
        <button 
          onClick={() => setActiveTab('report')}
          className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}
        >
          生成报告
        </button>
        <button 
          onClick={() => setActiveTab('export')}
          className={`btn ${activeTab === 'export' ? 'btn-primary' : 'btn-secondary'}`}
        >
          导出数据
        </button>
      </div>

      {/* 内容区域 */}
      <div>
        {activeTab === 'viz' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">超声扫描可视化</h2>
            {loading ? (
              <div>加载中...</div>
            ) : processedData ? (
              <>
                <AScanChart data={processedData.aScan} />
                <CScanChart data={processedData.cScan} />
                <SScanChart data={processedData.sScan} />
              </>
            ) : (
              <div>请选择文件</div>
            )}
          </div>
        )}

        {activeTab === 'wizard' && (
          <ExperimentWizard
            onComplete={(id) => console.log('创建成功:', id)}
            onCancel={() => setActiveTab('viz')}
          />
        )}

        {activeTab === 'report' && (
          <ReportGenerator />
        )}

        {activeTab === 'export' && (
          <DataExporter />
        )}
      </div>
    </div>
  );
}

export default AdvancedFeaturesPage;
```

---

## 📚 API文档

### useDetectionData Hook

```typescript
interface UseDetectionDataOptions {
  fileId?: string;        // 文件ID
  frameId?: number;       // 帧ID
  beamId?: number;        // 波束ID
  limit?: number;         // 数据量限制
}

interface ProcessedScanData {
  aScan: Array<{ time: number; amplitude: number }>;
  bScan: Array<{ x: number; y: number; amplitude: number }>;
  cScan: Array<{ x: number; y: number; maxAmplitude: number }>;
  sScan: Array<{ angle: number; depth: number; amplitude: number }>;
}

function useDetectionData(options: UseDetectionDataOptions): {
  detectionData: DetectionData[];
  processedData: ProcessedScanData | null;
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}
```

### 组件Props

#### AScanChart
```typescript
interface AScanChartProps {
  data: Array<{ time: number; amplitude: number }>;
  title?: string;
  height?: number;
}
```

#### CScanChart
```typescript
interface CScanChartProps {
  data: Array<{ x: number; y: number; maxAmplitude: number }>;
  title?: string;
  height?: number;
}
```

#### SScanChart
```typescript
interface SScanChartProps {
  data: Array<{ angle: number; depth: number; amplitude: number }>;
  title?: string;
  height?: number;
}
```

#### ExperimentWizard
```typescript
interface ExperimentWizardProps {
  onComplete?: (experimentId: string) => void;
  onCancel?: () => void;
}
```

#### ReportGenerator
```typescript
interface ReportGeneratorProps {
  fileId?: string;
  experimentId?: string;
}
```

#### DataExporter
```typescript
interface DataExporterProps {
  fileId?: string;
}
```

---

## 🎯 最佳实践

### 1. 性能优化
```typescript
// 使用React.memo避免不必要的重渲染
const AScanChartMemo = React.memo(AScanChart);

// 限制数据量
const { processedData } = useDetectionData({ 
  fileId, 
  limit: 1000  // 限制为1000条数据
});
```

### 2. 错误处理
```typescript
const { processedData, error } = useDetectionData({ fileId });

if (error) {
  return <div>加载失败: {error.message}</div>;
}
```

### 3. 加载状态
```typescript
const { loading } = useDetectionData({ fileId });

if (loading) {
  return <LoadingSpinner />;
}
```

### 4. 数据验证
```typescript
if (!processedData || processedData.aScan.length === 0) {
  return <EmptyState message="暂无数据" />;
}
```

---

## 🔧 配置说明

### ECharts依赖

确保已安装ECharts:
```json
{
  "dependencies": {
    "echarts": "^5.4.3"
  }
}
```

### Supabase配置

确保数据库表已创建:
- `ultrasonic_detection_data`
- `ultrasonic_experiments`
- `ultrasonic_files`

---

## ��� 常见问题

### Q1: 图表不显示？
**A**: 检查数据格式是否正确，确保有数据传入组件。

### Q2: PDF报告无法生成？
**A**: 确保浏览器允许打开新窗口，检查浏览器弹窗拦截设置。

### Q3: CSV文件中文乱码？
**A**: 使用Excel打开时选择UTF-8编码，或使用WPS直接打开。

### Q4: 试验创建失败？
**A**: 检查必填字段是否填写，查看浏览器控制台错误信息。

### Q5: 数据加载慢？
**A**: 使用limit参数限制数据量，或实现分页加载。

---

## 📝 总结

### 已完成功能 ✅

1. **高级可视化** (100%)
   - AScanChart组件
   - CScanChart组件
   - SScanChart组件
   - useDetectionData Hook

2. **试验创建向导** (100%)
   - 4步创建流程
   - 表单验证
   - 数据预览

3. **报告生成** (100%)
   - PDF报告
   - Excel报告
   - 统计数据

4. **数据导出** (100%)
   - 文件列表导出
   - 检测数据导出
   - 试验列表导出

### 新增文件统计

- 新增组件: 8个
- 新增Hook: 1个
- 新增代码: 1,500+行
- 新增索引文件: 5个

### 技术亮点

- 🎨 专业级可视化
- 🧙 用户友好的向导
- 📄 标准化报告格式
- 📊 灵活的数据导出
- 🚀 高性能渲染
- 🔒 类型安全

---

**版本**: v1.3.0  
**更新日期**: 2025-10-04  
**状态**: ✅ 全部完成

