# Supabase 数据库迁移指南

## 概述

本指南说明如何为超声数据管理系统设置Supabase数据库。由于项目使用共享的Supabase实例，我们为超声系统创建了专用的表和类型。

## 前置要求

1. Supabase账号和项目
2. Supabase项目的数据库访问权限
3. 环境变量配置（参考 `env-template.txt`）

## 迁移步骤

### 方法1: 使用Supabase控制台（推荐）

1. 登录 [Supabase控制台](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 复制并执行 `supabase/migrations/create_ultrasonic_system_schema.sql` 中的SQL语句
5. 执行 `supabase/migrations/create_ultrasonic_rls_policies.sql` 中的RLS策略

### 方法2: 使用Supabase CLI

```bash
# 安装Supabase CLI（如果未安装）
npm install -g supabase

# 登录
supabase login

# 链接到你的项目
supabase link --project-ref YOUR_PROJECT_REF

# 执行迁移
supabase db push
```

## 数据库架构

### 创建的表

1. **ultrasonic_system_users** - 超声系统用户表
   - 存储用户信息和角色（admin, engineer, viewer）

2. **ultrasonic_files** - 超声文件元数据表
   - 存储CSV文件信息和上传记录

3. **ultrasonic_detection_data** - 检测数据表
   - 存储帧-波束级别的检测数据（896个位置点）

4. **ultrasonic_experiments** - 试验表
   - 存储检测试验信息

5. **ultrasonic_experiment_results** - 试验结果表
   - 存储试验分析结果和报告

6. **ultrasonic_audit_logs** - 审计日志表
   - 记录所有用户操作

### 创建的枚举类型

- `ultrasonic_user_role`: 用户角色（admin, engineer, viewer）
- `ultrasonic_detection_type`: 检测类型（weld, layered, slope, single_layer）
- `ultrasonic_file_status`: 文件状态（uploaded, processing, processed, error）
- `ultrasonic_experiment_type`: 试验类型（weld, layered, special）
- `ultrasonic_experiment_status`: 试验状态（preparing, in_progress, completed, failed）
- `ultrasonic_quality_grade`: 质量等级（A, B, C, D, reject）

### 创建的视图

- `ultrasonic_file_statistics`: 文件统计视图
- `ultrasonic_defect_statistics`: 缺陷统计视图
- `ultrasonic_experiment_statistics`: 试验统计视图

## Storage 桶配置

### 创建 Storage 桶

1. 在Supabase控制台进入 **Storage**
2. 点击 **New Bucket**
3. 创建名为 `ultrasonic-data` 的桶
4. 设置为 **Private**（不公开）

### 配置 Storage 策略

在SQL Editor中执行以下策略：

```sql
-- 允许认证用户读取文件
CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ultrasonic-data' AND
  auth.role() = 'authenticated'
);

-- 允许工程师和管理员上传文件
CREATE POLICY "Engineers and admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ultrasonic-data' AND
  EXISTS (
    SELECT 1 FROM ultrasonic_system_users
    WHERE id = auth.uid() 
    AND role IN ('engineer', 'admin')
  )
);

-- 允许管理员删除文件
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

## 行级安全（RLS）策略

所有表都已启用RLS策略。主要策略包括：

1. **用户表**
   - 用户可以查看自己的信息
   - 管理员可以查看所有用户
   - 管理员可以更新用户信息

2. **文件表**
   - 所有认证用户可以查看文件
   - 工程师和管理员可以上传文件
   - 管理员可以删除文件

3. **检测数据表**
   - 所有认证用户可以查看检测数据
   - 工程师和管理员可以插入数据

4. **试验表**
   - 所有认证用户可以查看试验
   - 工程师和管理员可以创建试验
   - 试验操作者和管理员可以更新试验

5. **审计日志表**
   - 管理员可以查看所有日志
   - 用户可以查看自己的日志

## 初始数据

### 创建管理员用户

在Supabase Auth中注册用户后，执行以下SQL添加到系统用户表：

```sql
INSERT INTO ultrasonic_system_users (id, email, full_name, role)
VALUES (
  'YOUR_AUTH_USER_ID', 
  'admin@example.com', 
  '系统管理员', 
  'admin'
);
```

## 验证迁移

执行以下查询验证迁移是否成功：

```sql
-- 检查所有表是否创建
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'ultrasonic%'
ORDER BY table_name;

-- 检查RLS是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'ultrasonic%';

-- 检查视图
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE 'ultrasonic%';
```

## 故障排除

### 问题: 枚举类型已存在

如果看到 "type already exists" 错误，说明枚举类型已经创建。可以安全地忽略这个错误，或者删除重建：

```sql
-- 删除现有枚举（谨慎！）
DROP TYPE IF EXISTS ultrasonic_user_role CASCADE;
-- 然后重新创建
```

### 问题: 权限错误

如果遇到权限错误，确保：
1. 使用的是项目的service_role密钥（用于迁移）
2. RLS策略正确配置
3. auth.uid()能正确返回当前用户ID

### 问题: 外键约束错误

确保按顺序执行迁移：
1. 先创建枚举类型
2. 再创建基础表（users）
3. 然后创建依赖表（files, detection_data等）
4. 最后创建视图和策略

## 下一步

迁移完成后：

1. 配置环境变量（`.env`文件）
2. 创建Storage桶 `ultrasonic-data`
3. 创建至少一个管理员用户
4. 测试文件上传功能
5. 运行应用程序并验证所有功能

## 参考资料

- [Supabase文档](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Database Migrations](https://supabase.com/docs/guides/database/migrations)

