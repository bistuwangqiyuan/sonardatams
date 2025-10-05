# 🧪 本地测试指南

## 准备工作

### 1. 创建 .env 文件

在PowerShell中执行：
```powershell
Copy-Item env-template.txt .env
```

验证.env文件内容：
```powershell
Get-Content .env
```

应该看到：
```
PUBLIC_SUPABASE_URL=https://zzyueuweeoakopuuwfau.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ... 其他配置
```

## 🚀 启动开发环境

### 2. 安装依赖

```powershell
# 如果还没有安装pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 3. 启动开发服务器

```powershell
pnpm dev
```

服务器将在 http://localhost:4321 启动。

预期输出：
```
> astro dev

  🚀  astro  v4.x.x started in XXXms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

### 4. 创建测试用户（可选）

由于用户需要通过Supabase Auth系统注册，您有两个选择：

#### 选项A: 通过Supabase控制台创建用户
1. 访问：https://supabase.com/dashboard/project/zzyueuweeoakopuuwfau/auth/users
2. 点击 **"Add user"** → **"Create new user"**
3. 填写信息：
   - Email: `admin@ultrasonic.com`
   - Password: 设置一个密码
   - Auto Confirm User: ✅ 勾选
4. 点击 **"Create user"**
5. 在SQL Editor中将用户添加到ultrasonic_system_users表：

```sql
-- 获取刚创建的Auth用户ID
SELECT id, email FROM auth.users WHERE email = 'admin@ultrasonic.com';

-- 使用该ID创建系统用户（替换下面的 'USER_ID_HERE'）
INSERT INTO ultrasonic_system_users (id, email, full_name, role)
VALUES (
  '7b77c429-9af0-400b-9e8f-a895a3d9d76f'::uuid,  -- 从上面查询的ID
  'admin@ultrasonic.com',
  '系统管理员',
  'admin'
);
```

#### 选项B: 先不创建用户，使用模拟数据测试
您可以先测试前端页面和可视化功能，暂时不需要登录。

## 📊 测试功能清单

### 基础页面访问
- [ ] **主页** (http://localhost:4321/)
  - 查看首页设计、动画效果
  - 检查导航菜单是否正常
  
- [ ] **数据大屏** (http://localhost:4321/dashboard)
  - 查看ECharts图表渲染
  - 检查统计卡片显示
  
- [ ] **文件管理** (http://localhost:4321/files)
  - 查看文件列表布局
  - 测试筛选和搜索UI
  
- [ ] **超声图像** (http://localhost:4321/ultrasonic)
  - 查看B-Scan热力图
  - 测试控制面板交互
  
- [ ] **试验管理** (http://localhost:4321/experiments)
  - 查看试验卡片布局
  - 测试标签切换

### 功能测试（需要登录）
- [ ] 文件上传
- [ ] 数据解析
- [ ] 图表交互
- [ ] 试验创建

## 🔍 常见问题排查

### 问题1: pnpm命令不存在
```powershell
npm install -g pnpm
```

### 问题2: 端口4321被占用
修改 `astro.config.mjs` 中的端口，或者：
```powershell
pnpm dev --port 3000
```

### 问题3: 依赖安装失败
```powershell
# 清理缓存
pnpm store prune

# 删除node_modules重新安装
Remove-Item -Recurse -Force node_modules
pnpm install
```

### 问题4: Supabase连接错误
检查：
- [ ] .env文件是否存在
- [ ] Supabase URL和密钥是否正确
- [ ] 网络连接是否正常

## ✅ 验证清单

开发服务器启动后，打开浏览器检查：

### 视觉检查
- [ ] 页面样式正常加载（暗色主题）
- [ ] 导航栏显示正常
- [ ] 图表正常渲染
- [ ] 动画效果流畅

### 控制台检查
打开浏览器开发者工具（F12）：
- [ ] Console无报错（除了未登录的提示）
- [ ] Network请求正常
- [ ] 静态资源加载成功

### 功能检查
- [ ] 页面间导航正常
- [ ] 响应式布局正常
- [ ] 交互元素可点击

## 🎯 下一步

测试通过后：

1. **运行构建测试**
   ```powershell
   pnpm build
   ```

2. **预览生产构建**
   ```powershell
   pnpm preview
   ```

3. **准备部署**
   参考 `DEPLOYMENT.md` 进行部署配置

---

## 📝 测试记录

记录测试结果：

| 功能模块 | 状态 | 备注 |
|---------|------|------|
| 主页 | ⬜ |  |
| 数据大屏 | ⬜ |  |
| 文件管理 | ⬜ |  |
| 超声图像 | ⬜ |  |
| 试验管理 | ⬜ |  |
| 文件上传 | ⬜ |  |
| 数据可视化 | ⬜ |  |

---

**祝测试顺利！** 🚀 如有问题请查看 `README.md` 或相关文档。

