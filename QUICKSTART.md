# 快速开始指南

本指南将帮助你在5分钟内启动超声数据管理系统。

## 📦 前提条件

确保你的系统已安装：

- **Node.js** 20.x 或更高版本
- **pnpm** 8.x 或更高版本（推荐）或 npm/yarn
- **Git** 2.x 或更高版本

## 🚀 快速启动（3步）

### 第1步：克隆并安装

```bash
# 克隆仓库
git clone https://github.com/your-username/sonardatams.git
cd sonardatams

# 安装依赖（推荐使用pnpm）
pnpm install

# 或使用npm
npm install
```

### 第2步：配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑.env文件，填入你的Supabase配置
# PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 第3步：启动开发服务器

```bash
# 启动开发服务器
pnpm run dev

# 或使用npm
npm run dev
```

🎉 现在访问 http://localhost:4321 即可看到应用！

## 🗄️ 配置数据库（首次使用）

### 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com/)
2. 创建新项目
3. 记录项目URL和API密钥

### 2. 执行数据库迁移

在Supabase控制台的SQL编辑器中，按顺序执行：

```sql
-- 1. 执行 supabase/migrations/001_create_initial_schema.sql
-- 2. 执行 supabase/migrations/002_create_rls_policies.sql
```

### 3. 创建Storage桶

在Supabase Storage中创建桶：

- **名称**: `ultrasonic-data`
- **公开**: 否
- **大小限制**: 500MB

### 4. 更新环境变量

将Supabase的URL和密钥填入`.env`文件。

## 📝 测试示例数据

系统自带示例CSV数据（`data/`文件夹）：

- `1-焊缝.csv` - 焊缝检测数据
- `2-双层-3.csv` - 双层材料检测
- `2-斜坡.csv` - 斜坡结构检测
- `3-单层-1.csv` - 单层材料检测

在文件管理页面上传这些文件进行测试。

## 🎯 核心功能快速导航

| 功能 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 系统概览和快速入口 |
| 数据大屏 | `/dashboard` | 实时数据统计和可视化 |
| 文件管理 | `/files` | 上传和管理CSV文件 |
| 超声图像 | `/ultrasonic` | A/B/C/S扫描图像展示 |
| 试验管理 | `/experiments` | 检测试验流程管理 |

## 🔧 常用命令

```bash
# 开发
pnpm run dev          # 启动开发服务器
pnpm run build        # 构建生产版本
pnpm run preview      # 预览构建结果

# 代码质量
pnpm run check        # TypeScript类型检查
pnpm run lint         # 代码规范检查
pnpm run format       # 代码格式化

# Astro
pnpm run astro        # Astro CLI
```

## 🐛 常见问题

### Q: 开发服务器启动失败

**A**: 检查Node版本是否≥20，端口4321是否被占用：
```bash
node --version
lsof -ti:4321  # 检查端口占用
```

### Q: Supabase连接失败

**A**: 检查环境变量是否正确配置：
```bash
# .env文件中确保有以下配置
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Q: CSV文件上传失败

**A**: 确保：
1. Supabase Storage桶已创建
2. RLS策略已正确配置
3. 文件大小<500MB
4. 文件格式为标准CSV

### Q: 图表不显示

**A**: 打开浏览器控制台检查是否有JavaScript错误，确保echarts正确加载。

## 📚 下一步

- 阅读 [README.md](./README.md) 了解完整功能
- 查看 [PRD.md](./PRD.md) 了解产品设计
- 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解部署流程
- 浏览 `src/` 目录了解代码结构

## 💡 提示

- 使用 `pnpm` 而不是 `npm` 可以节省磁盘空间并加快安装速度
- 开发时推荐使用 [Cursor](https://cursor.sh/) 编辑器
- 启用浏览器开发者工具查看详细日志
- 使用 React DevTools 调试组件

## 🆘 获取帮助

- 查看项目文档
- 提交 [Issue](https://github.com/your-username/sonardatams/issues)
- 联系技术支持

---

**祝你使用愉快！** 🚀

