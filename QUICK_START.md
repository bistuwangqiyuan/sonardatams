# ⚡ 快速启动指南

5分钟快速启动超声数据管理系统！

## 📋 前置条件

- ✅ Node.js 18+ 已安装
- ✅ 数据库迁移已完成
- ✅ Storage桶已配置
- ✅ env-template.txt已填入配置

## 🚀 快速启动（3个命令）

### 1️⃣ 创建环境配置
```powershell
Copy-Item env-template.txt .env
```

### 2️⃣ 安装依赖
```powershell
pnpm install
```
> 💡 如果没有pnpm：`npm install -g pnpm`

### 3️⃣ 启动开发服务器
```powershell
pnpm dev
```

## 🎉 完成！

打开浏览器访问：**http://localhost:4321**

## 📖 页面导航

- **主页**: http://localhost:4321/
- **数据大屏**: http://localhost:4321/dashboard
- **文件管理**: http://localhost:4321/files
- **超声图像**: http://localhost:4321/ultrasonic
- **试验管理**: http://localhost:4321/experiments

## 🔧 其他命令

```powershell
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 运行测试
pnpm test

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## 📚 详细文档

- **完整文档**: [README.md](./README.md)
- **本地测试**: [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)
- **部署指南**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **数据库设置**: [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)
- **Storage配置**: [STORAGE_SETUP_GUIDE.md](./STORAGE_SETUP_GUIDE.md)

## ❓ 遇到问题？

查看 [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) 的常见问题排查部分。

---

**祝您开发愉快！** 🎊

