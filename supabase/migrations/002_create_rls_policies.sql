-- 超声数据管理系统 - 行级安全策略（RLS）
-- 创建日期: 2025-10-03
-- 版本: 1.0.0

-- ============================================
-- 启用行级安全
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ultrasonic_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE detection_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 用户表策略
-- ============================================

-- 用户可以查看自己的信息
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 管理员可以查看所有用户
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以更新用户信息
CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 用户可以更新自己的基本信息
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- 不允许用户修改自己的角色
    role = (SELECT role FROM users WHERE id = auth.uid())
  );

-- ============================================
-- 超声文件表策略
-- ============================================

-- 所有认证用户可以查看文件列表
CREATE POLICY "Authenticated users can view files"
  ON ultrasonic_files FOR SELECT
  USING (auth.role() = 'authenticated');

-- 工程师和管理员可以上传文件
CREATE POLICY "Engineers and admins can insert files"
  ON ultrasonic_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role IN ('engineer', 'admin')
    )
  );

-- 文件上传者和管理员可以更新文件
CREATE POLICY "File owners and admins can update files"
  ON ultrasonic_files FOR UPDATE
  USING (
    upload_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以删除文件
CREATE POLICY "Admins can delete files"
  ON ultrasonic_files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 检测数据表策略
-- ============================================

-- 所有认证用户可以查看检测数据
CREATE POLICY "Authenticated users can view detection data"
  ON detection_data FOR SELECT
  USING (auth.role() = 'authenticated');

-- 工程师和管理员可以插入检测数据
CREATE POLICY "Engineers and admins can insert detection data"
  ON detection_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role IN ('engineer', 'admin')
    )
  );

-- 管理员可以更新和删除检测数据
CREATE POLICY "Admins can update detection data"
  ON detection_data FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete detection data"
  ON detection_data FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 试验表策略
-- ============================================

-- 所有认证用户可以查看试验
CREATE POLICY "Authenticated users can view experiments"
  ON experiments FOR SELECT
  USING (auth.role() = 'authenticated');

-- 工程师和管理员可以创建试验
CREATE POLICY "Engineers and admins can insert experiments"
  ON experiments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role IN ('engineer', 'admin')
    )
  );

-- 试验操作者和管理员可以更新试验
CREATE POLICY "Experiment operators and admins can update experiments"
  ON experiments FOR UPDATE
  USING (
    operator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以删除试验
CREATE POLICY "Admins can delete experiments"
  ON experiments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 试验结果表策略
-- ============================================

-- 所有认证用户可以查看试验结果
CREATE POLICY "Authenticated users can view experiment results"
  ON experiment_results FOR SELECT
  USING (auth.role() = 'authenticated');

-- 工程师和管理员可以插入试验结果
CREATE POLICY "Engineers and admins can insert experiment results"
  ON experiment_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role IN ('engineer', 'admin')
    )
  );

-- 管理员可以更新试验结果
CREATE POLICY "Admins can update experiment results"
  ON experiment_results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 审计日志表策略
-- ============================================

-- 管理员可以查看所有审计日志
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 用户可以查看自己的审计日志
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (user_id = auth.uid());

-- 所有认证用户可以插入审计日志
CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Storage 策略（需要在Supabase控制台单独配置）
-- ============================================

-- Bucket: ultrasonic-data
-- 策略说明：
-- 1. 所有认证用户可以读取文件
-- 2. 工程师和管理员可以上传文件
-- 3. 文件所有者和管理员可以更新/删除文件

-- 在Supabase控制台执行以下Storage策略：
-- 
-- Storage Bucket策略:
-- 
-- 1. SELECT (读取):
--    authenticated users can read files
--    auth.role() = 'authenticated'
--
-- 2. INSERT (上传):
--    engineers and admins can upload
--    EXISTS (
--      SELECT 1 FROM users
--      WHERE id = auth.uid() 
--      AND role IN ('engineer', 'admin')
--    )
--
-- 3. UPDATE (更新):
--    file owners and admins can update
--    bucket_id = 'ultrasonic-data' AND (
--      (storage.foldername(name))[1] = auth.uid()::text OR
--      EXISTS (
--        SELECT 1 FROM users
--        WHERE id = auth.uid() AND role = 'admin'
--      )
--    )
--
-- 4. DELETE (删除):
--    admins can delete
--    EXISTS (
--      SELECT 1 FROM users
--      WHERE id = auth.uid() AND role = 'admin'
--    )

