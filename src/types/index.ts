/**
 * 通用类型定义
 */

export * from './database';

/**
 * CSV数据行类型
 */
export interface CSVDataRow {
  FrameID: number;
  BeamID: number;
  [key: `Pos${number}`]: number; // Pos1-Pos896
}

/**
 * 解析后的CSV数据
 */
export interface ParsedCSVData {
  fileName: string;
  fileSize: number;
  rowCount: number;
  frameCount: number;
  beamCount: number;
  positionCount: number;
  data: CSVDataRow[];
  statistics: {
    maxAmplitude: number;
    minAmplitude: number;
    avgAmplitude: number;
    defectCount: number;
  };
}

/**
 * 文件上传状态
 */
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
}

/**
 * 超声图显示选项
 */
export interface UltrasonicViewOptions {
  viewType: 'A-Scan' | 'B-Scan' | 'C-Scan' | 'S-Scan';
  colorMap: 'gray' | 'jet' | 'hot' | 'cool' | 'rainbow';
  contrastLevel: number; // 0-100
  brightnessLevel: number; // 0-100
  thresholdLevel: number; // 0-255
  showGrid: boolean;
  showScale: boolean;
  showDefects: boolean;
}

/**
 * 缺陷信息
 */
export interface DefectInfo {
  id: string;
  position: {
    frame: number;
    beam: number;
    pos: number;
  };
  amplitude: number;
  type: 'crack' | 'void' | 'inclusion' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  dimensions?: {
    length: number;
    width: number;
    depth: number;
  };
}

/**
 * 试验配置
 */
export interface ExperimentConfig {
  experimentName: string;
  experimentType: 'weld' | 'layered' | 'special';
  standardReference: string;
  specimenInfo: {
    material: string;
    thickness: number;
    dimensions: string;
    surfaceCondition: string;
  };
  deviceParams: {
    frequency: number; // MHz
    angle: number; // degrees
    gain: number; // dB
    probeType: string;
    couplingAgent: string;
  };
  calibrationData: {
    sensitivity: number;
    timeBase: number;
    velocity: number; // m/s
  };
}

/**
 * 统计数据
 */
export interface StatisticsData {
  totalFiles: number;
  totalDetections: number;
  totalDefects: number;
  passRate: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  detectionTypeDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  qualityGradeDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  trend: {
    date: string;
    count: number;
  }[];
}

/**
 * 通知消息
 */
export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * 查询过滤器
 */
export interface QueryFilters {
  detectionType?: string[];
  status?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  uploadUser?: string;
  searchText?: string;
}

