# 🎯 功能实现指南

## 新增功能说明

本指南说明了如何使用新实现的认证系统、数据管理和可视化功能。

---

## 🔐 用户认证系统（支持游客模式）

### 特性
- ✅ **游客模式**: 默认允许游客使用所有功能，无需登录
- ✅ **可选登录**: 用户可以选择注册/登录以获得个性化体验
- ✅ **角色管理**: 支持admin、engineer、viewer三种角色
- ✅ **会话管理**: 自动保持登录状态

### 使用方式

#### 在组件中使用认证
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isGuest, signIn, signOut, continueAsGuest } = useAuth();

  return (
    <div>
      {isGuest ? (
        <div>
          <p>当前为游客模式</p>
          <button onClick={continueAsGuest}>继续使用</button>
        </div>
      ) : (
        <div>
          <p>欢迎, {user?.full_name}</p>
          <button onClick={signOut}>登出</button>
        </div>
      )}
    </div>
  );
}
```

#### 游客模式说明
- 游客可以访问所有页面
- 游客可以查看所有数据
- 游客可以使用所有功能（上传、删除等）
- 无需注册即可使用系统

---

## 📊 数据管理Hooks

### 1. useFiles - 文件数据管理

#### 功能
- 获取文件列表
- 筛选和搜索
- 分页支持
- 删除文件
- 自动刷新

#### 使用示例
```tsx
import { useFiles } from '@/hooks/useFiles';

function FilesPage() {
  const { files, loading, totalCount, deleteFile, refreshFiles } = useFiles({
    detectionType: 'weld',    // 可选：筛选检测类型
    status: 'processed',       // 可选：筛选状态
    searchQuery: '焊缝',       // 可选：搜索关键词
    limit: 10,                 // 可选：每页数量
    offset: 0,                 // 可选：分页偏移
  });

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h2>共 {totalCount} 个文件</h2>
      {files.map(file => (
        <div key={file.id}>
          <span>{file.file_name}</span>
          <button onClick={() => deleteFile(file.id)}>删除</button>
        </div>
      ))}
      <button onClick={refreshFiles}>刷新</button>
    </div>
  );
}
```

### 2. useExperiments - 试验数据管理

#### 功能
- 获取试验列表
- 创建试验
- 更新试验状态
- 筛选试验

#### 使用示例
```tsx
import { useExperiments } from '@/hooks/useExperiments';

function ExperimentsPage() {
  const {
    experiments,
    loading,
    createExperiment,
    updateExperiment,
    refreshExperiments
  } = useExperiments({
    status: 'in_progress',  // 可选：筛选状态
    limit: 20,              // 可选：限制数量
  });

  const handleCreate = async () => {
    const { data, error } = await createExperiment({
      experiment_name: '新试验',
      experiment_type: 'weld',
      status: 'preparing',
    });

    if (error) {
      console.error('创建失败:', error);
    } else {
      console.log('创建成功:', data);
    }
  };

  return (
    <div>
      <button onClick={handleCreate}>创建试验</button>
      {experiments.map(exp => (
        <div key={exp.id}>{exp.experiment_name}</div>
      ))}
    </div>
  );
}
```

### 3. useStatistics - 统计数据

#### 功能
- 获取系统统计信息
- 实时数据更新
- 多维度统计

#### 使用示例
```tsx
import { useStatistics } from '@/hooks/useStatistics';

function Dashboard() {
  const { statistics, loading, refreshStatistics } = useStatistics();

  if (loading) return <div>加载统计数据...</div>;

  return (
    <div>
      <div>总文件数: {statistics.totalFiles}</div>
      <div>今日检测: {statistics.todayDetections}</div>
      <div>缺陷检出: {statistics.defectCount}</div>
      <div>合格率: {statistics.passRate}%</div>

      <h3>检测类型分布</h3>
      {statistics.detectionTypeStats.map(item => (
        <div key={item.type}>
          {item.type}: {item.count}
        </div>
      ))}

      <h3>质量等级分布</h3>
      {statistics.qualityGradeStats.map(item => (
        <div key={item.grade}>
          {item.grade}级: {item.count}
        </div>
      ))}

      <button onClick={refreshStatistics}>刷新统计</button>
    </div>
  );
}
```

---

## 🧩 React组件

### 1. StatisticsCards - 统计卡片

显示关键指标的卡片组件，自动从数据库获取数据。

```tsx
import { StatisticsCards } from '@/components/dashboard/StatisticsCards';

function Dashboard() {
  return (
    <div>
      <StatisticsCards />
    </div>
  );
}
```

**特性**:
- 自动加载数据
- 加载动画
- 趋势指示
- 响应式布局

### 2. FilesTable - 文件表格

功能完整的文件列表表格，支持筛选、搜索、分页和删除。

```tsx
import { FilesTable } from '@/components/files/FilesTable';

function FilesPage() {
  const [detectionType, setDetectionType] = useState('all');
  const [status, setStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* 筛选器 */}
      <select onChange={(e) => setDetectionType(e.target.value)}>
        <option value="all">全部类型</option>
        <option value="weld">焊缝检测</option>
        <option value="layered">分层检测</option>
      </select>

      <input
        type="text"
        placeholder="搜索文件名..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 文件表格 */}
      <FilesTable
        detectionType={detectionType}
        status={status}
        searchQuery={searchQuery}
      />
    </div>
  );
}
```

**特性**:
- 实时筛选
- 搜索功能
- 分页导航
- 删除确认
- 查看详情链接

### 3. FileUploader - 文件上传

已实现的完整文件上传组件，支持拖拽上传和Supabase集成。

```tsx
import { FileUploader } from '@/components/files/FileUploader';

function FilesPage() {
  const handleUploadComplete = (data) => {
    console.log('上传完成:', data);
    // 刷新文件列表
  };

  const handleUploadError = (error) => {
    console.error('上传失败:', error);
    alert(error);
  };

  return (
    <FileUploader
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
    />
  );
}
```

**特性**:
- 拖拽上传
- CSV验证
- 进度显示
- Supabase Storage集成
- 自动解析和存储

---

## 🔌 集成到现有页面

### 更新Dashboard页面

```astro
---
// src/pages/dashboard.astro
import Layout from '@/layouts/Layout.astro';
import { Header } from '@/components/layout/Header';
import { StatisticsCards } from '@/components/dashboard/StatisticsCards';
---

<Layout title="数据大屏 - 超声数据管理系统">
  <Header currentPath="/dashboard" client:load />
  <main class="container mx-auto px-4 py-8">
    <div class="space-y-8">
      {/* 使用数据驱动的统计卡片 */}
      <StatisticsCards client:load />

      {/* 其他图表组件 */}
    </div>
  </main>
</Layout>
```

### 更新Files页面

```astro
---
// src/pages/files.astro
import Layout from '@/layouts/Layout.astro';
import { Header } from '@/components/layout/Header';
import { FileUploader } from '@/components/files/FileUploader';
import { FilesTable } from '@/components/files/FilesTable';
---

<Layout title="文件管理 - 超声数据管理系统">
  <Header currentPath="/files" client:load />
  <main class="container mx-auto px-4 py-8">
    <div class="space-y-8">
      {/* 文件上传器 */}
      <FileUploader client:load />

      {/* 文件表格 */}
      <FilesTable client:load />
    </div>
  </main>
</Layout>
```

---

## 📝 数据模型

### 文件数据结构
```typescript
interface UltrasonicFile {
  id: string;
  file_name: string;
  file_size: number | null;
  file_path: string;
  upload_user_id: string | null;
  upload_time: string;
  detection_type: 'weld' | 'layered' | 'slope' | 'single_layer';
  specimen_info: Json;
  device_params: Json;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  frame_count: number;
  beam_count: number;
  position_count: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

### 试验数据结构
```typescript
interface Experiment {
  id: string;
  experiment_name: string;
  experiment_type: 'weld' | 'layered' | 'special';
  standard_reference: string | null;
  operator_id: string | null;
  specimen_info: Json;
  device_params: Json;
  calibration_data: Json;
  start_time: string;
  end_time: string | null;
  status: 'preparing' | 'in_progress' | 'completed' | 'failed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

---

## 🚀 快速开始

### 1. 设置认证提供者

在主入口添加AuthProvider:

```tsx
// src/pages/_app.tsx 或主layout
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### 2. 使用数据管理Hooks

在任何React组件中使用:

```tsx
import { useFiles } from '@/hooks/useFiles';
import { useExperiments } from '@/hooks/useExperiments';
import { useStatistics } from '@/hooks/useStatistics';

function MyComponent() {
  const { files } = useFiles();
  const { experiments } = useExperiments();
  const { statistics } = useStatistics();

  // 使用数据
}
```

### 3. 添加现成组件

```tsx
import { StatisticsCards } from '@/components/dashboard/StatisticsCards';
import { FilesTable } from '@/components/files/FilesTable';
import { FileUploader } from '@/components/files/FileUploader';

function MyPage() {
  return (
    <div>
      <StatisticsCards />
      <FileUploader />
      <FilesTable />
    </div>
  );
}
```

---

## 🔧 配置说明

### 环境变量

确保`.env`文件包含:
```
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase配置

1. **数据库表**: 确保已执行迁移脚本
2. **RLS策略**: 确保已配置行级安全
3. **Storage桶**: 确保`ultrasonic-data`桶已创建

---

## 📊 功能清单

### ✅ 已实现
- ✅ 用户认证上下文（支持游客）
- ✅ 文件数据管理Hook
- ✅ 试验数据管理Hook
- ✅ 统计数据Hook
- ✅ 统计卡片组件
- ✅ 文件表格组件
- ✅ 文件上传组件（含Supabase集成）
- ✅ 数据筛选和搜索
- ✅ 分页导航
- ✅ 删除功能
- ✅ 实时数据更新

### 🔄 待完善
- ⏳ 图表可视化增强（A/C/S扫描）
- ⏳ 试验创建向导
- ⏳ 报告生成功能
- ⏳ 数据导出功能
- ⏳ 批量操作
- ⏳ 高级筛选

---

## 💡 最佳实践

### 1. 错误处理
```tsx
const { files, loading, error } = useFiles();

if (error) {
  return <div>加载失败: {error.message}</div>;
}
```

### 2. 加载状态
```tsx
if (loading) {
  return <LoadingSpinner />;
}
```

### 3. 数据刷新
```tsx
const { refreshFiles } = useFiles();

// 在上传完成后刷新
await uploadFile();
await refreshFiles();
```

### 4. 条件渲染
```tsx
const { isGuest, user } = useAuth();

return (
  <div>
    {isGuest ? (
      <GuestView />
    ) : (
      <UserView user={user} />
    )}
  </div>
);
```

---

## 🎯 下一步

1. **集成组件到页面**: 将新组件添加到现有Astro页面
2. **测试功能**: 验证数据加载和交互
3. **完善UI**: 添加加载动画和错误提示
4. **添加更多功能**: 实现试验创建、报告生成等

---

## 📞 支持

如遇问题，请参考：
- **README.md** - 项目主文档
- **PRD.md** - 产品需求文档
- **SUPABASE_MIGRATION_GUIDE.md** - 数据库指南

---

**版本**: v1.1.0  
**更新日期**: 2025-10-04  
**状态**: ✅ 可用

