/**
 * 数据库类型定义
 * @description Supabase数据库的TypeScript类型定义
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'admin' | 'engineer' | 'viewer';
export type DetectionType = 'weld' | 'layered' | 'slope' | 'single_layer';
export type FileStatus = 'uploaded' | 'processing' | 'processed' | 'error';
export type ExperimentType = 'weld' | 'layered' | 'special';
export type ExperimentStatus = 'preparing' | 'in_progress' | 'completed' | 'failed';
export type QualityGrade = 'A' | 'B' | 'C' | 'D' | 'reject';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ultrasonic_files: {
        Row: {
          id: string;
          file_name: string;
          file_size: number | null;
          file_path: string;
          upload_user_id: string | null;
          upload_time: string;
          detection_type: DetectionType;
          specimen_info: Json;
          device_params: Json;
          status: FileStatus;
          frame_count: number;
          beam_count: number;
          position_count: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_size?: number | null;
          file_path: string;
          upload_user_id?: string | null;
          upload_time?: string;
          detection_type: DetectionType;
          specimen_info?: Json;
          device_params?: Json;
          status?: FileStatus;
          frame_count?: number;
          beam_count?: number;
          position_count?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          file_size?: number | null;
          file_path?: string;
          upload_user_id?: string | null;
          upload_time?: string;
          detection_type?: DetectionType;
          specimen_info?: Json;
          device_params?: Json;
          status?: FileStatus;
          frame_count?: number;
          beam_count?: number;
          position_count?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      detection_data: {
        Row: {
          id: string;
          file_id: string;
          frame_id: number;
          beam_id: number;
          position_data: Json;
          max_amplitude: number | null;
          min_amplitude: number | null;
          avg_amplitude: number | null;
          defect_detected: boolean;
          defect_position: Json | null;
          defect_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_id: string;
          frame_id: number;
          beam_id: number;
          position_data: Json;
          max_amplitude?: number | null;
          min_amplitude?: number | null;
          avg_amplitude?: number | null;
          defect_detected?: boolean;
          defect_position?: Json | null;
          defect_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          file_id?: string;
          frame_id?: number;
          beam_id?: number;
          position_data?: Json;
          max_amplitude?: number | null;
          min_amplitude?: number | null;
          avg_amplitude?: number | null;
          defect_detected?: boolean;
          defect_position?: Json | null;
          defect_count?: number;
          created_at?: string;
        };
      };
      experiments: {
        Row: {
          id: string;
          experiment_name: string;
          experiment_type: ExperimentType;
          standard_reference: string | null;
          operator_id: string | null;
          specimen_info: Json;
          device_params: Json;
          calibration_data: Json;
          start_time: string;
          end_time: string | null;
          status: ExperimentStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          experiment_name: string;
          experiment_type: ExperimentType;
          standard_reference?: string | null;
          operator_id?: string | null;
          specimen_info?: Json;
          device_params?: Json;
          calibration_data?: Json;
          start_time?: string;
          end_time?: string | null;
          status?: ExperimentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          experiment_name?: string;
          experiment_type?: ExperimentType;
          standard_reference?: string | null;
          operator_id?: string | null;
          specimen_info?: Json;
          device_params?: Json;
          calibration_data?: Json;
          start_time?: string;
          end_time?: string | null;
          status?: ExperimentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      experiment_results: {
        Row: {
          id: string;
          experiment_id: string;
          file_id: string | null;
          defect_count: number;
          defect_details: Json;
          quality_grade: QualityGrade | null;
          pass_rate: number | null;
          conclusion: string | null;
          recommendations: string | null;
          report_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          experiment_id: string;
          file_id?: string | null;
          defect_count?: number;
          defect_details?: Json;
          quality_grade?: QualityGrade | null;
          pass_rate?: number | null;
          conclusion?: string | null;
          recommendations?: string | null;
          report_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          experiment_id?: string;
          file_id?: string | null;
          defect_count?: number;
          defect_details?: Json;
          quality_grade?: QualityGrade | null;
          pass_rate?: number | null;
          conclusion?: string | null;
          recommendations?: string | null;
          report_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          details: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource_type: string;
          resource_id?: string | null;
          details?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource_type?: string;
          resource_id?: string | null;
          details?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      file_statistics: {
        Row: {
          detection_type: DetectionType | null;
          file_count: number | null;
          total_frames: number | null;
          avg_file_size: number | null;
          processed_count: number | null;
          error_count: number | null;
        };
      };
      defect_statistics: {
        Row: {
          detection_type: DetectionType | null;
          files_with_defects: number | null;
          total_defects: number | null;
          avg_max_amplitude: number | null;
          peak_amplitude: number | null;
        };
      };
      experiment_statistics: {
        Row: {
          experiment_type: ExperimentType | null;
          total_experiments: number | null;
          completed_count: number | null;
          failed_count: number | null;
          avg_duration_hours: number | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      detection_type: DetectionType;
      file_status: FileStatus;
      experiment_type: ExperimentType;
      experiment_status: ExperimentStatus;
      quality_grade: QualityGrade;
    };
  };
}

// 导出类型别名以便使用
export type User = Database['public']['Tables']['users']['Row'];
export type UltrasonicFile = Database['public']['Tables']['ultrasonic_files']['Row'];
export type DetectionData = Database['public']['Tables']['detection_data']['Row'];
export type Experiment = Database['public']['Tables']['experiments']['Row'];
export type ExperimentResult = Database['public']['Tables']['experiment_results']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

