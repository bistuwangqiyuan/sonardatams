-- 超声数据管理系统 - 数据库架构
-- 创建日期: 2025-10-04
-- 版本: 1.0.0
-- 说明: 为超声数据管理系统创建专用表，使用ultrasonic_前缀避免与现有表冲突

-- 启用UUID扩展（如果尚未启用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建枚举类型（使用IF NOT EXISTS避免冲突）
DO $$ BEGIN
  CREATE TYPE ultrasonic_user_role AS ENUM ('admin', 'engineer', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ultrasonic_detection_type AS ENUM ('weld', 'layered', 'slope', 'single_layer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ultrasonic_file_status AS ENUM ('uploaded', 'processing', 'processed', 'error');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ultrasonic_experiment_type AS ENUM ('weld', 'layered', 'special');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ultrasonic_experiment_status AS ENUM ('preparing', 'in_progress', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ultrasonic_quality_grade AS ENUM ('A', 'B', 'C', 'D', 'reject');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 核心数据表
-- ============================================

-- 超声系统用户表
CREATE TABLE IF NOT EXISTS ultrasonic_system_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role ultrasonic_user_role DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ultrasonic_system_users IS '超声系统用户表 - 存储系统用户信息和角色';
COMMENT ON COLUMN ultrasonic_system_users.role IS '用户角色: admin(管理员), engineer(检测工程师), viewer(查看者)';

-- 超声文件表
CREATE TABLE IF NOT EXISTS ultrasonic_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_path TEXT NOT NULL,
  upload_user_id UUID REFERENCES ultrasonic_system_users(id) ON DELETE SET NULL,
  upload_time TIMESTAMPTZ DEFAULT NOW(),
  detection_type ultrasonic_detection_type NOT NULL,
  specimen_info JSONB DEFAULT '{}'::jsonb,
  device_params JSONB DEFAULT '{}'::jsonb,
  status ultrasonic_file_status DEFAULT 'uploaded',
  frame_count INTEGER DEFAULT 0,
  beam_count INTEGER DEFAULT 0,
  position_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ultrasonic_files IS '超声文件元数据表 - 存储CSV文件信息';
COMMENT ON COLUMN ultrasonic_files.detection_type IS '检测类型: weld(焊缝), layered(分层), slope(斜坡), single_layer(单层)';
COMMENT ON COLUMN ultrasonic_files.specimen_info IS '样品信息JSON: {material, thickness, dimensions, etc}';
COMMENT ON COLUMN ultrasonic_files.device_params IS '设备参数JSON: {frequency, angle, gain, etc}';

-- 检测数据表
CREATE TABLE IF NOT EXISTS ultrasonic_detection_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID REFERENCES ultrasonic_files(id) ON DELETE CASCADE,
  frame_id INTEGER NOT NULL,
  beam_id INTEGER NOT NULL,
  position_data JSONB NOT NULL,
  max_amplitude FLOAT,
  min_amplitude FLOAT,
  avg_amplitude FLOAT,
  defect_detected BOOLEAN DEFAULT FALSE,
  defect_position JSONB,
  defect_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(file_id, frame_id, beam_id)
);

COMMENT ON TABLE ultrasonic_detection_data IS '检测数据表 - 存储帧-波束级别的检测数据（896个位置点）';
COMMENT ON COLUMN ultrasonic_detection_data.position_data IS '位置数据JSON: {pos1, pos2, ..., pos896}';
COMMENT ON COLUMN ultrasonic_detection_data.defect_position IS '缺陷位置JSON: [{position, amplitude, type}, ...]';

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_ultrasonic_detection_data_file_id ON ultrasonic_detection_data(file_id);
CREATE INDEX IF NOT EXISTS idx_ultrasonic_detection_data_frame_beam ON ultrasonic_detection_data(frame_id, beam_id);
CREATE INDEX IF NOT EXISTS idx_ultrasonic_detection_data_defect ON ultrasonic_detection_data(defect_detected) WHERE defect_detected = TRUE;
CREATE INDEX IF NOT EXISTS idx_ultrasonic_files_type ON ultrasonic_files(detection_type);
CREATE INDEX IF NOT EXISTS idx_ultrasonic_files_upload_time ON ultrasonic_files(upload_time DESC);

-- 试验表
CREATE TABLE IF NOT EXISTS ultrasonic_experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_name TEXT NOT NULL,
  experiment_type ultrasonic_experiment_type NOT NULL,
  standard_reference TEXT,
  operator_id UUID REFERENCES ultrasonic_system_users(id) ON DELETE SET NULL,
  specimen_info JSONB DEFAULT '{}'::jsonb,
  device_params JSONB DEFAULT '{}'::jsonb,
  calibration_data JSONB DEFAULT '{}'::jsonb,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  status ultrasonic_experiment_status DEFAULT 'preparing',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ultrasonic_experiments IS '试验表 - 存储检测试验信息';
COMMENT ON COLUMN ultrasonic_experiments.standard_reference IS '标准参考: ISO 16810, ASTM E2700等';
COMMENT ON COLUMN ultrasonic_experiments.calibration_data IS '校准数据JSON: {sensitivity, time_base, etc}';

-- 试验结果表
CREATE TABLE IF NOT EXISTS ultrasonic_experiment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES ultrasonic_experiments(id) ON DELETE CASCADE,
  file_id UUID REFERENCES ultrasonic_files(id) ON DELETE SET NULL,
  defect_count INTEGER DEFAULT 0,
  defect_details JSONB DEFAULT '[]'::jsonb,
  quality_grade ultrasonic_quality_grade,
  pass_rate FLOAT,
  conclusion TEXT,
  recommendations TEXT,
  report_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ultrasonic_experiment_results IS '试验结果表 - 存储试验分析结果和报告';
COMMENT ON COLUMN ultrasonic_experiment_results.quality_grade IS '质量等级: A(优秀), B(良好), C(合格), D(基本合格), reject(不合格)';

-- 审计日志表
CREATE TABLE IF NOT EXISTS ultrasonic_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES ultrasonic_system_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ultrasonic_audit_logs IS '审计日志表 - 记录所有用户操作';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_ultrasonic_audit_logs_user_id ON ultrasonic_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ultrasonic_audit_logs_resource ON ultrasonic_audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_ultrasonic_audit_logs_created_at ON ultrasonic_audit_logs(created_at DESC);

-- ============================================
-- 触发器和函数
-- ============================================

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION ultrasonic_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_ultrasonic_system_users_updated_at ON ultrasonic_system_users;
  CREATE TRIGGER update_ultrasonic_system_users_updated_at
    BEFORE UPDATE ON ultrasonic_system_users
    FOR EACH ROW EXECUTE FUNCTION ultrasonic_update_updated_at_column();
    
  DROP TRIGGER IF EXISTS update_ultrasonic_files_updated_at ON ultrasonic_files;
  CREATE TRIGGER update_ultrasonic_files_updated_at
    BEFORE UPDATE ON ultrasonic_files
    FOR EACH ROW EXECUTE FUNCTION ultrasonic_update_updated_at_column();
    
  DROP TRIGGER IF EXISTS update_ultrasonic_experiments_updated_at ON ultrasonic_experiments;
  CREATE TRIGGER update_ultrasonic_experiments_updated_at
    BEFORE UPDATE ON ultrasonic_experiments
    FOR EACH ROW EXECUTE FUNCTION ultrasonic_update_updated_at_column();
    
  DROP TRIGGER IF EXISTS update_ultrasonic_experiment_results_updated_at ON ultrasonic_experiment_results;
  CREATE TRIGGER update_ultrasonic_experiment_results_updated_at
    BEFORE UPDATE ON ultrasonic_experiment_results
    FOR EACH ROW EXECUTE FUNCTION ultrasonic_update_updated_at_column();
END $$;

-- ============================================
-- 统计视图
-- ============================================

-- 文件统计视图
CREATE OR REPLACE VIEW ultrasonic_file_statistics AS
SELECT 
  detection_type,
  COUNT(*) as file_count,
  SUM(frame_count) as total_frames,
  AVG(file_size) as avg_file_size,
  COUNT(CASE WHEN status = 'processed' THEN 1 END) as processed_count,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as error_count
FROM ultrasonic_files
GROUP BY detection_type;

COMMENT ON VIEW ultrasonic_file_statistics IS '文件统计视图 - 按检测类型统计文件';

-- 缺陷统计视图
CREATE OR REPLACE VIEW ultrasonic_defect_statistics AS
SELECT 
  f.detection_type,
  COUNT(DISTINCT d.file_id) as files_with_defects,
  SUM(d.defect_count) as total_defects,
  AVG(d.max_amplitude) as avg_max_amplitude,
  MAX(d.max_amplitude) as peak_amplitude
FROM ultrasonic_detection_data d
JOIN ultrasonic_files f ON d.file_id = f.id
WHERE d.defect_detected = TRUE
GROUP BY f.detection_type;

COMMENT ON VIEW ultrasonic_defect_statistics IS '缺陷统计视图 - 按检测类型统计缺陷';

-- 试验统计视图
CREATE OR REPLACE VIEW ultrasonic_experiment_statistics AS
SELECT 
  experiment_type,
  COUNT(*) as total_experiments,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
  AVG(CASE WHEN end_time IS NOT NULL THEN EXTRACT(EPOCH FROM (end_time - start_time))/3600 END) as avg_duration_hours
FROM ultrasonic_experiments
GROUP BY experiment_type;

COMMENT ON VIEW ultrasonic_experiment_statistics IS '试验统计视图 - 按试验类型统计';

