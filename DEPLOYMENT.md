# 部署指南 (Deployment Guide)

本指南提供超声数据管理系统的完整部署说明。

## 目录

- [环境要求](#环境要求)
- [准备工作](#准备工作)
- [数据库设置](#数据库设置)
- [本地开发](#本地开发)
- [生产部署](#生产部署)
- [故障排除](#故障排除)

---

## 环境要求

### 必需软件

- **Node.js**: 18.x 或 20.x
- **pnpm**: 8.x 或更高版本（推荐）
- **Git**: 最新版本

### 服务账号

- **Supabase账号**: [注册链接](https://supabase.com)
- **Netlify账号**: [注册链接](https://netlify.com)（用于部署）

---

## 准备工作

### 1. 克隆项目

```bash
git clone <repository-url>
cd sonardatams
```

### 2. 安装依赖

```bash
# 使用pnpm（推荐）
pnpm install

# 或使用npm
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp env-template.txt .env
```

编辑 `.env` 文件，填入你的配置：

```env
# Supabase配置
# Supabase项目URL
PUBLIC_SUPABASE_URL=https://zzyueuweeoakopuuwfau.supabase.co

# Supabase匿名密钥（公开密钥）
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEzMDEsImV4cCI6MjA1OTk1NzMwMX0.y8V3EXK9QVd3txSWdE3gZrSs96Ao0nvpnd0ntZw_dQ4

# Supabase服务角色密钥（私密密钥，仅用于服务端）
# ⚠️ 警告：请勿将此密钥暴露在客户端代码中！
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM4MTMwMSwiZXhwIjoyMDU5OTU3MzAxfQ.CTLF9Ahmxt7alyiv-sf_Gl3U6SNIWZ01PapTI92Hg0g


# 应用配置
PUBLIC_APP_URL=http://localhost:4321
PUBLIC_APP_NAME=超声数据管理系统

# 文件上传配置
PUBLIC_MAX_FILE_SIZE=524288000
PUBLIC_ALLOWED_FILE_TYPES=text/csv,application/vnd.ms-excel

# 环境标识
NODE_ENV=development
```

**获取Supabase凭据**:
1. 登录 [Supabase控制台](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制 **Project URL** 和 **anon/public key**
5. 复制 **service_role key**（⚠️ 保密，仅用于服务端）

---

## 数据库设置

### 重要提示

⚠️ **必须先完成数据库设置才能运行应用！**

详细步骤请参考: [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)

### 快速步骤

#### 1. 创建数据表

在Supabase控制台的SQL Editor中执行：

```sql
-- 执行文件: supabase/migrations/create_ultrasonic_system_schema.sql
-- 这将创建所有必需的表、枚举类型、索引和视图
```

#### 2. 配置RLS策略

```sql
-- 执行文件: supabase/migrations/create_ultrasonic_rls_policies.sql
-- 这将启用行级安全并配置访问策略
```

#### 3. 创建Storage桶

1. 在Supabase控制台进入 **Storage**
2. 点击 **New Bucket**
3. 创建名为 `ultrasonic-data` 的桶
4. 设置为 **Private**

#### 4. 配置Storage策略

```sql
-- 允许认证用户读取
CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT
USING (bucket_id = 'ultrasonic-data' AND auth.role() = 'authenticated');

-- 允许工程师和管理员上传
CREATE POLICY "Engineers and admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ultrasonic-data' AND
  EXISTS (
    SELECT 1 FROM ultrasonic_system_users
    WHERE id = auth.uid() AND role IN ('engineer', 'admin')
  )
);

-- 允许管理员删除
CREATE POLICY "Admins can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ultrasonic-data' AND
  EXISTS (
    SELECT 1 FROM ultrasonic_system_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 5. 创建管理员用户

首先在Supabase Auth中注册用户，然后执行：

```sql
INSERT INTO ultrasonic_system_users (id, email, full_name, role)
VALUES (
  'YOUR_AUTH_USER_ID',  -- 从Supabase Auth获取
  'admin@example.com',
  '系统管理员',
  'admin'
);
```

---

## 本地开发

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:4321

### 开发模式功能

- ✅ 热重载（Hot Module Replacement）
- ✅ 实时错误显示
- ✅ TypeScript类型检查
- ✅ 自动刷新

### 常用开发命令

```bash
# 启动开发服务器
pnpm dev

# TypeScript类型检查
pnpm check

# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 运行测试
pnpm test
```

---

## 生产部署

### 方法1: Netlify CLI部署（推荐）

#### 步骤1: 安装Netlify CLI

```bash
# 全局安装
npm install -g netlify-cli

# 或使用pnpm
pnpm add -g netlify-cli
```

#### 步骤2: 登录Netlify

```bash
netlify login
```

#### 步骤3: 初始化项目

```bash
# 在项目根目录
netlify init
```

选择：
- **Create & configure a new site**: 创建新站点
- 输入站点名称
- 选择团队

#### 步骤4: 配置环境变量

在Netlify控制台：
1. 进入 **Site settings** → **Environment variables**
2. 添加所有必需的环境变量（从 `.env` 复制）

或使用CLI：

```bash
netlify env:set PUBLIC_SUPABASE_URL "your_value"
netlify env:set PUBLIC_SUPABASE_ANON_KEY "your_value"
# ... 添加其他变量
```

#### 步骤5: 构建项目

```bash
pnpm build
```

检查构建输出在 `dist/` 目录。

#### 步骤6: 部署

```bash
# 测试部署（draft deploy）
netlify deploy

# 生产部署
netlify deploy --prod
```

### 方法2: Netlify UI部署

#### 步骤1: 连接Git仓库

1. 登录 [Netlify](https://netlify.com)
2. 点击 **New site from Git**
3. 选择你的Git提供商（GitHub/GitLab/Bitbucket）
4. 授权访问
5. 选择仓库

#### 步骤2: 配置构建设置

- **Build command**: `pnpm build`
- **Publish directory**: `dist`
- **Base directory**: 留空

#### 步骤3: 添加环境变量

在 **Site settings** → **Build & deploy** → **Environment** 中添加所有环境变量。

#### 步骤4: 触发部署

点击 **Deploy site** 按钮。

### 方法3: 手动部署

#### 步骤1: 构建

```bash
# 设置生产环境
export NODE_ENV=production

# 构建项目
pnpm build
```

#### 步骤2: 上传

将 `dist/` 目录的内容上传到：
- Netlify Drop
- Vercel
- 自己的服务器
- 任何静态文件托管服务

---

## 部署后验证

### 1. 功能测试清单

- [ ] 主页加载正常
- [ ] 导航链接工作
- [ ] 数据大屏显示图表
- [ ] 文件管理页面加载
- [ ] 超声图页面渲染
- [ ] 试验管理页面显示

### 2. 数据库连接测试

打开浏览器控制台，执行：

```javascript
// 测试Supabase连接
fetch('https://YOUR_PROJECT_REF.supabase.co/rest/v1/ultrasonic_files', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(res => res.json())
.then(data => console.log('Supabase连接成功', data))
.catch(err => console.error('Supabase连接失败', err));
```

### 3. 性能测试

使用工具：
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- Chrome Lighthouse

目标指标：
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1

---

## 故障排除

### 问题1: 构建失败

**错误**: `pnpm build` 失败

**解决方案**:
1. 检查Node.js版本（需要18+或20+）
2. 清除缓存: `pnpm store prune && pnpm install`
3. 检查TypeScript错误: `pnpm check`
4. 查看错误日志

### 问题2: 环境变量未加载

**症状**: Supabase连接失败，显示undefined

**解决方案**:
1. 确认 `.env` 文件存在
2. 确认环境变量以 `PUBLIC_` 开头（客户端使用）
3. 重启开发服务器
4. 在Netlify上检查环境变量设置

### 问题3: 数据库连接错误

**错误**: `relation "ultrasonic_files" does not exist`

**解决方案**:
1. 确认已执行数据库迁移
2. 检查表名是否正确（使用`ultrasonic_`前缀）
3. 在Supabase控制台验证表是否存在
4. 检查RLS策略是否正确配置

### 问题4: Storage上传失败

**错误**: `new row violates row-level security policy`

**解决方案**:
1. 确认Storage桶 `ultrasonic-data` 已创建
2. 检查Storage策略是否正确配置
3. 确认用户已认证
4. 确认用户角色为engineer或admin

### 问题5: 图表不显示

**症状**: 数据大屏或超声图页面空白

**解决方案**:
1. 打开浏览器控制台查看错误
2. 检查ECharts是否正确加载
3. 确认数据格式正确
4. 清除浏览器缓存

---

## 性能优化

### 1. 图片优化

```bash
# 使用WebP格式
# 压缩图片
# 使用CDN
```

### 2. 代码分割

Astro自动进行代码分割，但可以进一步优化：

```javascript
// 动态导入大型组件
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 3. 缓存策略

在 `netlify.toml` 中配置：

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 4. 压缩

Netlify自动启用Gzip和Brotli压缩。

---

## 监控和日志

### 1. 错误监控

集成Sentry或类似服务：

```bash
pnpm add @sentry/astro
```

### 2. 分析

添加Google Analytics或Plausible：

```html
<!-- 在Layout.astro中 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### 3. 日志

使用Supabase audit_logs表记录所有操作。

---

## 安全检查清单

- [ ] 环境变量安全存储（不提交到Git）
- [ ] service_role key仅在服务端使用
- [ ] RLS策略已启用
- [ ] Storage桶设置为Private
- [ ] HTTPS已启用
- [ ] CORS正确配置
- [ ] 输入验证
- [ ] SQL注入防护（Supabase自动处理）
- [ ] XSS防护

---

## 回滚策略

### Netlify回滚

1. 进入Netlify控制台
2. 选择站点
3. 进入 **Deploys**
4. 找到之前的成功部署
5. 点击 **Publish deploy**

### 数据库回滚

⚠️ **谨慎操作！**

备份数据：

```sql
-- 导出数据
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

-- 恢复数据
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

---

## 持续集成/持续部署 (CI/CD)

### GitHub Actions示例

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
        env:
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod
```

---

## 支持

如有问题：
1. 查看 [README.md](./README.md)
2. 查看 [CHANGELOG.md](./CHANGELOG.md)
3. 查看 [Issues](https://github.com/yourusername/sonardatams/issues)
4. 联系技术支持

---

## 许可证

MIT License
