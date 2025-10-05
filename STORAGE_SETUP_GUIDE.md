# Supabase Storage 配置指南

## 📦 创建Storage桶

### 1. 访问Supabase控制台
访问：https://supabase.com/dashboard/project/zzyueuweeoakopuuwfau/storage/buckets

### 2. 创建 `ultrasonic-data` 桶

1. 点击 **"New Bucket"** 按钮
2. 填写信息：
   - **Name**: `ultrasonic-data`
   - **Public**: ❌ 取消勾选（私有桶）
   - **File size limit**: `524288000` (500MB)
   - **Allowed MIME types**: 
     - `text/csv`
     - `application/vnd.ms-excel`
     - `text/plain`
3. 点击 **"Create bucket"**

### 3. 配置Storage策略

创建桶后，点击桶名称进入设置，然后点击 **"Policies"** 标签页。

#### 策略1: 认证用户可以上传文件
```sql
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ultrasonic-data');
```

#### 策略2: 用户可以读取自己上传的文件
```sql
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'ultrasonic-data' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### 策略3: 管理员可以读取所有文件
```sql
CREATE POLICY "Admins can read all files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'ultrasonic-data' 
  AND EXISTS (
    SELECT 1 FROM ultrasonic_system_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 策略4: 用户可以删除自己的文件
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ultrasonic-data' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. 验证配置

完成后，您应该能在Storage页面看到：
- ✅ `ultrasonic-data` 桶已创建
- ✅ 桶为私有（Public: false）
- ✅ 4条策略已启用

## 🎯 快速配置步骤

如果您希望快速配置，可以：

1. 在Supabase控制台创建桶（手动操作）
2. 在SQL Editor中执行以下SQL创建所有策略：

```sql
-- 策略1: 认证用户可以上传
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ultrasonic-data');

-- 策略2: 用户读取自己的文件
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'ultrasonic-data' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 策略3: 管理员读取所有文件
CREATE POLICY "Admins can read all files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'ultrasonic-data' 
  AND EXISTS (
    SELECT 1 FROM ultrasonic_system_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 策略4: 删除自己的文件
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ultrasonic-data' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## ✅ 完成确认

配置完成后，请确认：
- [ ] `ultrasonic-data` 桶已创建
- [ ] 桶设置为私有（非公开）
- [ ] 文件大小限制：500MB
- [ ] MIME类型限制：CSV相关格式
- [ ] 4条Storage策略已启用

---

**下一步**: 配置完成后，继续执行本地测试和开发。

