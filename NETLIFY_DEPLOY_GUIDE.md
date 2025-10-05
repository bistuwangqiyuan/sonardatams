# 🚀 Netlify 部署指南

## 快速部署（推荐）

### 1. 安装Netlify CLI
```powershell
npm install -g netlify-cli
```

### 2. 登录Netlify
```powershell
netlify login
```
浏览器会打开，授权登录。

### 3. 初始化Netlify站点
```powershell
netlify init
```

按照提示：
- **Create & configure a new site**: 选择这个
- **Team**: 选择你的团队
- **Site name**: 输入站点名称（如：`ultrasonic-data-ms`）
- **Build command**: `pnpm build`
- **Publish directory**: `dist`

### 4. 配置环境变量
```powershell
netlify env:set PUBLIC_SUPABASE_URL "https://zzyueuweeoakopuuwfau.supabase.co"
netlify env:set PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEzMDEsImV4cCI6MjA1OTk1NzMwMX0.y8V3EXK9QVd3txSWdE3gZrSs96Ao0nvpnd0ntZw_dQ4"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM4MTMwMSwiZXhwIjoyMDU5OTU3MzAxfQ.CTLF9Ahmxt7alyiv-sf_Gl3U6SNIWZ01PapTI92Hg0g"
netlify env:set PUBLIC_APP_URL "https://您的站点名称.netlify.app"
netlify env:set PUBLIC_APP_NAME "超声数据管理系统"
netlify env:set PUBLIC_MAX_FILE_SIZE "524288000"
netlify env:set PUBLIC_ALLOWED_FILE_TYPES "text/csv,application/vnd.ms-excel"
netlify env:set NODE_ENV "production"
```

### 5. 部署到生产环境
```powershell
netlify deploy --prod
```

✅ 部署完成！您的站点将在 `https://您的站点名称.netlify.app` 上线。

---

## 方式B: Netlify Web UI 部署

### 1. 推送代码到Git
```powershell
git add .
git commit -m "准备部署"
git push origin master
```

### 2. 访问Netlify控制台
访问：https://app.netlify.com/

### 3. 导入项目
1. 点击 **"Add new site"** → **"Import an existing project"**
2. 选择Git提供商（GitHub/GitLab/Bitbucket）
3. 选择您的仓库
4. 配置构建设置：
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - **Base directory**: (留空)

### 4. 配置环境变量
在 **Site settings** → **Environment variables** 中添加：

| 变量名 | 值 |
|--------|-----|
| `PUBLIC_SUPABASE_URL` | `https://zzyueuweeoakopuuwfau.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1...` |
| `PUBLIC_APP_URL` | `https://您的站点名称.netlify.app` |
| `PUBLIC_APP_NAME` | `超声数据管理系统` |
| `PUBLIC_MAX_FILE_SIZE` | `524288000` |
| `PUBLIC_ALLOWED_FILE_TYPES` | `text/csv,application/vnd.ms-excel` |
| `NODE_ENV` | `production` |

### 5. 触发部署
1. 点击 **"Deploy site"**
2. 等待构建完成（约2-3分钟）

✅ 部署完成！

---

## 验证部署

### 1. 访问站点
打开 `https://您的站点名称.netlify.app`

### 2. 检查功能
- [ ] 主页加载正常
- [ ] 导航菜单工作
- [ ] 数据大屏显示
- [ ] 文件管理页面
- [ ] 超声图像页面
- [ ] 试验管理页面
- [ ] Supabase连接正常（查看浏览器控制台）

### 3. 性能检查
在浏览器开发者工具中：
- [ ] Network: 检查资源加载
- [ ] Console: 无严重错误
- [ ] Lighthouse: 运行性能测试

---

## 自定义域名（可选）

### 1. 在Netlify添加域名
1. 进入 **Site settings** → **Domain management**
2. 点击 **"Add custom domain"**
3. 输入您的域名

### 2. 配置DNS
根据Netlify提供的DNS记录，在您的域名提供商处配置：
- **A记录**: 指向Netlify的IP
- 或 **CNAME记录**: 指向 `您的站点名称.netlify.app`

### 3. 启用HTTPS
Netlify会自动为您的域名配置Let's Encrypt SSL证书（可能需要几分钟）。

---

## 持续部署

每次推送到master分支，Netlify会自动：
1. 检测代码变更
2. 运行构建命令
3. 部署新版本
4. 发送部署通知

您可以在 **Deploys** 页面查看部署历史和日志。

---

## 故障排查

### 构建失败
1. 查看构建日志
2. 检查环境变量配置
3. 确认依赖版本

### 运行时错误
1. 打开浏览器控制台
2. 检查Network标签
3. 验证Supabase连接

### 环境变量未生效
1. 确认变量名称正确（区分大小写）
2. 重新部署站点
3. 清除浏览器缓存

---

## 🎉 恭喜！

您的超声数据管理系统已成功部署到Netlify！

**下一步**:
- 配置自定义域名
- 设置监控和告警
- 优化性能
- 添加更多功能

**相关文档**:
- [README.md](./README.md) - 项目文档
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 项目总结

