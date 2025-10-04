# 部署指南

本文档说明如何将超声数据管理系统部署到生产环境。

## 📋 部署前准备

### 1. Supabase数据库配置

#### 执行数据库迁移

登录Supabase控制台，按顺序执行以下SQL文件：

1. `supabase/migrations/001_create_initial_schema.sql`
2. `supabase/migrations/002_create_rls_policies.sql`

#### 创建Storage桶

在Supabase Storage中创建以下桶：

- **桶名**: `ultrasonic-data`
- **公开访问**: 否
- **文件大小限制**: 500MB

#### 配置Storage策略

在Storage桶中配置以下策略：

```sql
-- 读取策略
CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT
USING (auth.role() = 'authenticated');

-- 上传策略
CREATE POLICY "Engineers and admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() 
    AND role IN ('engineer', 'admin')
  )
);

-- 删除策略
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 获取API密钥

从Supabase项目设置中获取：
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Netlify配置

#### 连接Git仓库

1. 登录Netlify控制台
2. 点击"New site from Git"
3. 选择你的Git仓库
4. 配置构建设置：
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20

#### 配置环境变量

在Netlify站点设置中添加以下环境变量：

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
PUBLIC_APP_URL=https://your-site.netlify.app
```

## 🚀 部署方式

### 方式1：通过Git自动部署（推荐）

```bash
# 1. 提交代码到Git
git add .
git commit -m "feat: initial deployment"
git push origin main

# 2. Netlify自动构建和部署
# 查看Netlify控制台的构建日志
```

### 方式2：通过Netlify CLI部署

```bash
# 1. 安装Netlify CLI
npm install -g netlify-cli

# 2. 登录Netlify
netlify login

# 3. 初始化项目
netlify init

# 4. 构建项目
pnpm run build

# 5. 部署到生产
netlify deploy --prod --dir=dist
```

### 方式3：手动上传部署

```bash
# 1. 构建项目
pnpm install
pnpm run build

# 2. 在Netlify控制台选择"Deploy manually"
# 3. 上传dist目录
```

## ✅ 部署后验证

### 1. 检查网站可访问性

```bash
curl -I https://your-site.netlify.app
```

预期响应：HTTP 200 OK

### 2. 测试核心功能

- [ ] 访问首页，检查UI加载
- [ ] 访问数据大屏，检查图表渲染
- [ ] 访问文件管理，测试上传功能
- [ ] 访问超声图像，检查可视化
- [ ] 访问试验管理，测试功能

### 3. 检查数据库连接

在浏览器开发者工具Console中执行：

```javascript
// 检查Supabase连接
console.log(import.meta.env.PUBLIC_SUPABASE_URL);
```

### 4. 监控性能

使用以下工具检查网站性能：

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## 🔧 故障排查

### 问题1：构建失败

**症状**: Netlify构建日志显示错误

**解决方案**:
1. 检查`package.json`依赖版本
2. 确保Node版本为20
3. 查看构建日志详细错误信息

### 问题2：环境变量未生效

**症状**: 应用无法连接到Supabase

**解决方案**:
1. 在Netlify站点设置中检查环境变量
2. 确保变量名以`PUBLIC_`开头（客户端可访问）
3. 重新触发部署

### 问题3：Supabase RLS策略错误

**症状**: 数据获取失败，控制台显示403错误

**解决方案**:
1. 检查RLS策略是否正确应用
2. 验证用户角色设置
3. 测试时暂时禁用RLS（仅开发环境）

### 问题4：大文件上传失败

**症状**: CSV文件上传超时

**解决方案**:
1. 检查Supabase Storage桶配置
2. 增加文件大小限制
3. 实现分片上传

## 📊 性能优化

### 1. CDN配置

Netlify自动提供全球CDN，无需额外配置。

### 2. 资源优化

```bash
# 图片压缩
# 已配置在构建流程中

# JavaScript分割
# Astro自动处理代码分割
```

### 3. 缓存策略

已在`netlify.toml`中配置：
- 静态资源：1年缓存
- HTML：无缓存（动态内容）
- API响应：根据需求配置

## 🔒 安全配置

### 1. HTTPS

Netlify自动提供免费SSL证书，支持HTTPS。

### 2. 安全头部

已在`netlify.toml`中配置：
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 3. 环境变量安全

- 敏感数据使用环境变量
- 不在Git中提交`.env`文件
- 使用`SERVICE_ROLE_KEY`仅在服务端

## 📈 监控和维护

### 1. Netlify Analytics

启用Netlify Analytics查看：
- 页面访问量
- 加载时间
- 错误率

### 2. Supabase Dashboard

监控数据库：
- 查询性能
- 存储使用
- API请求

### 3. 日志监控

查看Netlify Functions日志：
```bash
netlify logs
```

## 🔄 更新部署

### 滚动更新

```bash
# 1. 更新代码
git pull origin main

# 2. 测试本地
pnpm run dev

# 3. 构建验证
pnpm run build

# 4. 提交部署
git add .
git commit -m "feat: update feature"
git push origin main
```

### 回滚

```bash
# 在Netlify控制台
# Deploys -> 选择之前的部署 -> Publish deploy
```

## 📞 技术支持

如遇到部署问题，请：

1. 查看[Netlify文档](https://docs.netlify.com/)
2. 查看[Supabase文档](https://supabase.com/docs)
3. 查看[Astro文档](https://docs.astro.build/)
4. 提交Issue到项目仓库

---

**最后更新**: 2025-10-03

