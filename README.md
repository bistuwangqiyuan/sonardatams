# 超声数据实验数据管理系统

<div align="center">

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Astro](https://img.shields.io/badge/Astro-4.0-FF5D01.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)

**一个现代化、工业级的超声检测数据管理和可视化平台**

[特性](#特性) • [快速开始](#快速开始) • [文档](#文档) • [技术栈](#技术栈)

</div>

---

## 📋 目录

- [项目概述](#项目概述)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [配置说明](#配置说明)
- [数据库设计](#数据库设计)
- [API文档](#api文档)
- [部署指南](#部署指南)
- [测试](#测试)
- [任务清单](#任务清单)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 🎯 项目概述

超声数据实验数据管理系统（Ultrasonic Data Management System）是一个专为超声相控阵检测设计的现代化数据管理平台。系统基于国际标准（ISO 16810, ASTM E2700等）构建，提供专业的数据采集、存储、可视化和分析功能。

### 适用场景

- ✅ 无损检测实验室数据管理
- ✅ 工业检测数据集中存储
- ✅ 焊缝质量检测分析
- ✅ 复合材料分层检测
- ✅ 教学培训和研究

### 核心价值

- **标准化**: 基于ISO 16810、ASTM E2700国际标准
- **专业化**: 支持A/B/C/S扫描多种显示模式
- **工业化**: 工业级UI设计，支持大屏展示
- **现代化**: 采用最新Web技术，响应式设计
- **安全性**: 完整的权限控制和数据加密

---

## ✨ 核心特性

### 📊 数据展示大屏
- 实时检测数据统计
- 缺陷分析和趋势图
- 设备状态监控
- 多维度数据可视化
- 支持4K大屏展示

### 📁 数据文件管理
- CSV文件上传和解析
- 批量文件处理
- 智能数据验证
- 完整元数据管理
- 历史版本追溯

### 🖼️ 超声图展示
- **A-Scan**: 时间-幅度曲线
- **B-Scan**: 深度-位置截面图
- **C-Scan**: 平面投影图
- **S-Scan**: 扇形扫描图
- 交互式图像操作（缩放、平移、测量）
- 伪彩色映射
- 缺陷标注和测量

### 🔬 检测试验管理
- **焊缝检测**: 对接、角接、T型焊缝
- **分层检测**: 单层、双层、多层材料
- **特殊检测**: 斜坡、曲面、复杂形状
- 标准化试验流程
- 自动报告生成
- 质量评级系统

### 🔐 安全与权限
- 多级用户权限（管理员/检测员/查看者）
- Row Level Security (RLS)
- 数据加密传输和存储
- 完整审计日志

---

## 🛠 技术栈

### 前端技术
```
├── Astro 4.0          # 现代Web框架，SSG/SSR混合模式
├── React 18           # UI组件库
├── Tailwind CSS 3.4   # 原子化CSS框架
├── TypeScript         # 类型安全
├── ECharts            # 数据可视化
├── D3.js              # 高级可视化
└── Three.js           # 3D图形（未来）
```

### 后端服务
```
├── Supabase           # 后端即服务 (BaaS)
│   ├── PostgreSQL     # 数据库
│   ├── Auth           # 认证服务
│   ├── Storage        # 文件存储
│   ├── Realtime       # 实时订阅
│   └── Edge Functions # 边缘函数
```

### 开发工具
```
├── pnpm               # 包管理器
├── Vite               # 构建工具
├── ESLint             # 代码检查
├── Prettier           # 代码格式化
└── Vitest             # 单元测试
```

### 部署平台
```
├── Netlify            # 前端托管
├── Supabase Cloud     # 后端服务
└── GitHub Actions     # CI/CD（可选）
```

---

## 📁 项目结构

```
sonardatams/
├── src/
│   ├── pages/                 # 页面路由
│   │   ├── index.astro       # 主页
│   │   ├── dashboard.astro   # 数据大屏
│   │   ├── files.astro       # 文件管理
│   │   ├── ultrasonic.astro  # 超声图展示
│   │   └── experiments.astro # 试验管理
│   ├── components/            # React组件
│   │   ├── layout/           # 布局组件
│   │   ├── dashboard/        # 大屏组件
│   │   ├── files/            # 文件管理组件
│   │   ├── ultrasonic/       # 超声图组件
│   │   └── experiments/      # 试验管理组件
│   ├── lib/                   # 工具库
│   │   ├── supabase.ts       # Supabase客户端
│   │   ├── csvParser.ts      # CSV解析器
│   │   ├── imageProcessor.ts # 图像处理
│   │   └── utils.ts          # 通用工具
│   ├── types/                 # TypeScript类型定义
│   ├── styles/                # 全局样式
│   └── config/                # 配置文件
├── data/                      # 示例数据
│   ├── 1-焊缝.csv
│   ├── 2-双层-3.csv
│   ├── 2-斜坡.csv
│   └── 3-单层-1.csv
├── supabase/                  # Supabase配置
│   ├── migrations/            # 数据库迁移
│   ├── functions/             # 边缘函数
│   └── config.toml
├── tests/                     # 测试文件
│   ├── unit/                 # 单元测试
│   ├── integration/          # 集成测试
│   └── e2e/                  # 端到端测试
├── public/                    # 静态资源
├── netlify/                   # Netlify配置
│   └── functions/            # Netlify Functions
├── docs/                      # 文档
│   ├── PRD.md                # 产品需求文档
│   ├── API.md                # API文档
│   └── DEPLOYMENT.md         # 部署指南
├── astro.config.mjs          # Astro配置
├── tailwind.config.mjs       # Tailwind配置
├── tsconfig.json             # TypeScript配置
├── package.json              # 依赖配置
└── README.md                 # 本文件
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18+ 或 20+
- pnpm 8+
- Supabase账号
- Netlify账号（可选）

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/sonardatams.git
cd sonardatams
```

### 2. 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的Supabase配置：

```env
# Supabase配置
PUBLIC_SUPABASE_URL=https://zzyueuweeoakopuuwfau.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 应用配置
PUBLIC_APP_URL=http://localhost:4321
PUBLIC_APP_NAME=超声数据管理系统
```

### 4. 初始化数据库

```bash
# 使用Supabase CLI（推荐）
pnpm supabase db push

# 或手动在Supabase控制台执行SQL
# 见 supabase/migrations/ 目录
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:4321 查看应用。

---

## 💻 开发指南

### 代码规范

本项目遵循以下代码规范：

- **ESLint**: JavaScript/TypeScript代码检查
- **Prettier**: 代码格式化
- **TypeScript**: 严格类型检查
- **命名规范**: 
  - 组件: PascalCase (e.g., `DataTable.tsx`)
  - 函数: camelCase (e.g., `parseCSVData()`)
  - 常量: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
  - 文件: kebab-case (e.g., `csv-parser.ts`)

### 运行代码检查

```bash
# ESLint检查
pnpm lint

# 自动修复
pnpm lint:fix

# Prettier格式化
pnpm format
```

### Git提交规范

使用Conventional Commits规范：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具配置

示例：
feat: 添加超声图缩放功能
fix: 修复CSV解析错误
docs: 更新API文档
```

### 组件开发规范

#### React组件模板

```tsx
// src/components/example/ExampleComponent.tsx
import React from 'react';
import type { FC } from 'react';

interface ExampleComponentProps {
  title: string;
  data: any[];
}

/**
 * 示例组件
 * @description 组件功能描述
 * @param {string} title - 标题
 * @param {any[]} data - 数据数组
 */
export const ExampleComponent: FC<ExampleComponentProps> = ({ title, data }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {/* 组件内容 */}
    </div>
  );
};
```

#### Astro页面模板

```astro
---
// src/pages/example.astro
import Layout from '@/layouts/Layout.astro';
import { ExampleComponent } from '@/components/example/ExampleComponent';

const title = '示例页面';
const data = []; // 从Supabase获取数据
---

<Layout title={title}>
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{title}</h1>
    <ExampleComponent title={title} data={data} client:load />
  </main>
</Layout>
```

---

## ⚙️ 配置说明

### Astro配置

`astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'hybrid', // SSG + SSR混合模式
  adapter: netlify(), // Netlify适配器
});
```

### Tailwind配置

`tailwind.config.mjs`:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a2332',
        secondary: '#00a8ff',
        accent: '#ff6b35',
      },
    },
  },
};
```

### Supabase配置

详见 `supabase/config.toml`

---

## 🗄️ 数据库设计

### 数据表结构

#### users (用户表)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'engineer', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### ultrasonic_files (文件表)
```sql
CREATE TABLE ultrasonic_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_path TEXT,
  upload_user_id UUID REFERENCES users(id),
  upload_time TIMESTAMPTZ DEFAULT NOW(),
  detection_type TEXT CHECK (detection_type IN ('weld', 'layered', 'slope', 'single_layer')),
  specimen_info JSONB,
  device_params JSONB,
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### detection_data (检测数据表)
```sql
CREATE TABLE detection_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID REFERENCES ultrasonic_files(id) ON DELETE CASCADE,
  frame_id INTEGER NOT NULL,
  beam_id INTEGER NOT NULL,
  position_data JSONB NOT NULL,
  max_amplitude FLOAT,
  defect_detected BOOLEAN DEFAULT FALSE,
  defect_position JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

详细的数据库设计见 [数据库文档](./docs/DATABASE.md)

---

## 📡 API文档

### Supabase API示例

#### 获取文件列表

```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('ultrasonic_files')
  .select('*')
  .order('upload_time', { ascending: false });
```

#### 上传文件

```typescript
const { data, error } = await supabase.storage
  .from('ultrasonic-data')
  .upload(`files/${fileName}`, file);
```

#### 查询检测数据

```typescript
const { data, error } = await supabase
  .from('detection_data')
  .select('*')
  .eq('file_id', fileId)
  .limit(100);
```

完整API文档见 [API.md](./docs/API.md)

---

## 🚢 部署指南

### Netlify部署

#### 方法1: 连接Git仓库（推荐）

1. 登录 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择你的仓库
4. 配置构建设置：
   - Build command: `pnpm build`
   - Publish directory: `dist`
5. 添加环境变量
6. 点击 "Deploy site"

#### 方法2: CLI部署

```bash
# 安装Netlify CLI
pnpm add -g netlify-cli

# 登录
netlify login

# 构建
pnpm build

# 部署
netlify deploy --prod
```

### Supabase配置

1. 在Supabase控制台创建项目
2. 执行数据库迁移
3. 配置RLS策略
4. 设置Storage桶

详细部署指南见 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行集成测试
pnpm test:integration

# 测试覆盖率
pnpm test:coverage
```

### 测试文件结构

```
tests/
├── unit/
│   ├── csvParser.test.ts
│   ├── imageProcessor.test.ts
│   └── utils.test.ts
├── integration/
│   ├── fileUpload.test.ts
│   └── dataQuery.test.ts
└── e2e/
    └── userFlow.test.ts
```

---

## 📝 任务清单

### ✅ 已完成任务

#### 文档和规划 (2025-10-03)
- [x] PRD文档编制
- [x] README技术文档编制
- [x] CHANGELOG更新日志
- [x] DEPLOYMENT部署指南

#### 基础架构 (2025-10-03)
- [x] 项目初始化和配置
- [x] Supabase数据库设计
- [x] 数据库迁移SQL文件
- [x] RLS安全策略配置
- [x] TypeScript类型定义
- [x] 环境变量配置

#### 核心功能 (2025-10-03)
- [x] 主页和导航组件
- [x] CSV解析器实现
- [x] Supabase客户端配置
- [x] 通用工具函数库
- [x] 全局样式系统

#### 数据可视化 (2025-10-03)
- [x] 数据展示大屏页面
- [x] 文件管理页面
- [x] 超声图展示页面（A/B/C/S扫描）
- [x] ECharts图表集成
- [x] 交互式控制面板

#### 试验管理 (2025-10-03)
- [x] 试验管理页面
- [x] 试验卡片组件
- [x] 标准参考展示

#### 部署配置 (2025-10-03)
- [x] Netlify部署配置
- [x] 构建脚本优化
- [x] 安全头部配置
- [x] 缓存策略配置

### ✅ 已完成功能

#### 核心功能 (100%)
- ✅ **用户认证系统**（支持游客模式）
- ✅ **文件上传和管理**（完整实现）
- ✅ **真实数据集成**（Supabase API）
- ✅ **数据可视化框架**（ECharts集成）
- ✅ **试验管理系统**（CRUD完整）
- ✅ **统计分析**（实时数据）
- ✅ **数据库系统**（6个表 + RLS）
- ✅ **Storage配置**（文件存储）
- ✅ **构建部署**（Netlify生产环境）
- ✅ **功能测试**（100%通过）

#### 新增功能 🆕 (v1.3.0)
- ✅ **AScanChart** - A扫描可视化组件
- ✅ **CScanChart** - C扫描可视化组件  
- ✅ **SScanChart** - S扫描可视化组件
- ✅ **useDetectionData Hook** - 检测数据管理
- ✅ **ExperimentWizard** - 试验创建向导
- ✅ **ReportGenerator** - PDF/Excel报告生成
- ✅ **DataExporter** - CSV数据导出

#### 上一版本功能 (v1.2.0)
- ✅ **AuthContext** - 认证上下文（游客模式）
- ✅ **useFiles Hook** - 文件数据管理
- ✅ **useExperiments Hook** - 试验数据管理
- ✅ **useStatistics Hook** - 统计数据
- ✅ **StatisticsCards** - 统计卡片组件
- ✅ **FilesTable** - 文件表格组件

#### SEO优化 🆕 (v1.3.1)
- ✅ **Sitemap.xml** - 搜索引擎站点地图
- ✅ **Robots.txt** - 爬虫规则配置
- ✅ **SEO评估报告** - 综合得分78/100
- ⏳ OG分享图片优化
- ⏳ 结构化数据（Schema.org）
- ⏳ Canonical标签

#### 待优化功能（可选）
- ⏳ B-Scan可视化组件
- ⏳ 3D可视化
- ⏳ 性能优化（代码分割）
- ⏳ 移动端深度适配
- ⏳ PWA离线支持
- ⏳ 国际化支持

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 代码审查标准

- ✅ 符合代码规范
- ✅ 包含测试用例
- ✅ 更新相关文档
- ✅ 通过所有测试

---

## 📖 相关文档

- [产品需求文档 (PRD)](./PRD.md)
- [API文档](./docs/API.md)
- [数据库设计](./docs/DATABASE.md)
- [部署指南](./docs/DEPLOYMENT.md)
- [测试指南](./docs/TESTING.md)
- [更新日志](./CHANGELOG.md)

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 团队

- 项目负责人: AI开发团队
- 技术架构: AI开发团队
- UI/UX设计: AI开发团队

---

## 🙏 致谢

- [Astro](https://astro.build/) - 优秀的Web框架
- [Supabase](https://supabase.com/) - 强大的BaaS平台
- [Tailwind CSS](https://tailwindcss.com/) - 现代化CSS框架
- [ECharts](https://echarts.apache.org/) - 数据可视化库

---

## 📞 联系方式

- 项目主页: [GitHub](https://github.com/yourusername/sonardatams)
- 问题反馈: [Issues](https://github.com/yourusername/sonardatams/issues)
- 邮箱: support@example.com

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个Star支持我们！**

Made with ❤️ by AI Development Team

</div>

