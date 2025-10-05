/**
 * 试验创建向导组件
 * @description 分步骤引导用户创建试验
 */

import React, { useState } from 'react';
import { useExperiments } from '@/hooks/useExperiments';
import type { Experiment } from '@/types/database';

interface ExperimentWizardProps {
  onComplete?: (experimentId: string) => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3 | 4;

export const ExperimentWizard: React.FC<ExperimentWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<Partial<Experiment>>({
    experiment_type: 'weld',
    status: 'preparing',
    specimen_info: {},
    device_params: {},
    calibration_data: {},
  });
  const [loading, setLoading] = useState(false);
  const { createExperiment } = useExperiments();

  const steps = [
    { id: 1, name: '基本信息', icon: '📋' },
    { id: 2, name: '试件信息', icon: '🔧' },
    { id: 3, name: '设备参数', icon: '⚙️' },
    { id: 4, name: '确认创建', icon: '✓' },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const experimentData: Partial<Experiment> = {
        ...formData,
        start_time: new Date().toISOString(),
      };

      const { data, error } = await createExperiment(experimentData);

      if (error) {
        alert(`创建失败: ${error.message}`);
        return;
      }

      if (data) {
        alert('试验创建成功！');
        onComplete?.(data.id);
      }
    } catch (error) {
      console.error('创建试验失败:', error);
      alert('创建试验失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: keyof Experiment, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedData = (parentKey: 'specimen_info' | 'device_params' | 'calibration_data', childKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as Record<string, any>),
        [childKey]: value,
      },
    }));
  };

  return (
    <div className="card max-w-4xl mx-auto">
      {/* 步骤指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-900 text-gray-500'
                  }`}
                >
                  {step.icon}
                </div>
                <span className={`text-sm ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 bg-primary-900 rounded">
                  <div
                    className={`h-full bg-primary-600 rounded transition-all ${
                      currentStep > step.id ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 步骤内容 */}
      <div className="min-h-[400px]">
        {/* 步骤1: 基本信息 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">基本信息</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                试验名称 *
              </label>
              <input
                type="text"
                className="input"
                placeholder="例如：焊缝检测-2025-001"
                value={formData.experiment_name || ''}
                onChange={(e) => updateFormData('experiment_name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                试验类型 *
              </label>
              <select
                className="select"
                value={formData.experiment_type}
                onChange={(e) => updateFormData('experiment_type', e.target.value)}
              >
                <option value="weld">焊缝检测</option>
                <option value="layered">分层检测</option>
                <option value="special">特殊检测</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                标准参考
              </label>
              <input
                type="text"
                className="input"
                placeholder="例如：ISO 16810:2012"
                value={formData.standard_reference || ''}
                onChange={(e) => updateFormData('standard_reference', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                备注
              </label>
              <textarea
                className="input"
                rows={4}
                placeholder="添加试验说明..."
                value={formData.notes || ''}
                onChange={(e) => updateFormData('notes', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 步骤2: 试件信息 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">试件信息</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  试件材料
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="例如：Q235钢"
                  value={(formData.specimen_info as any)?.material || ''}
                  onChange={(e) => updateNestedData('specimen_info', 'material', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  试件厚度 (mm)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="10"
                  value={(formData.specimen_info as any)?.thickness || ''}
                  onChange={(e) => updateNestedData('specimen_info', 'thickness', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  试件长度 (mm)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="100"
                  value={(formData.specimen_info as any)?.length || ''}
                  onChange={(e) => updateNestedData('specimen_info', 'length', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  试件宽度 (mm)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="50"
                  value={(formData.specimen_info as any)?.width || ''}
                  onChange={(e) => updateNestedData('specimen_info', 'width', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                试件描述
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="添加试件详细描述..."
                value={(formData.specimen_info as any)?.description || ''}
                onChange={(e) => updateNestedData('specimen_info', 'description', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 步骤3: 设备参数 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">设备参数</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  探头频率 (MHz)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="5"
                  step="0.1"
                  value={(formData.device_params as any)?.frequency || ''}
                  onChange={(e) => updateNestedData('device_params', 'frequency', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  增益 (dB)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="40"
                  value={(formData.device_params as any)?.gain || ''}
                  onChange={(e) => updateNestedData('device_params', 'gain', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  扫查速度 (mm/s)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="100"
                  value={(formData.device_params as any)?.scan_speed || ''}
                  onChange={(e) => updateNestedData('device_params', 'scan_speed', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  采样率 (MHz)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="100"
                  value={(formData.device_params as any)?.sampling_rate || ''}
                  onChange={(e) => updateNestedData('device_params', 'sampling_rate', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                设备型号
              </label>
              <input
                type="text"
                className="input"
                placeholder="例如：OmniScan X3"
                value={(formData.device_params as any)?.device_model || ''}
                onChange={(e) => updateNestedData('device_params', 'device_model', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 步骤4: 确认创建 */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">确认创建</h2>

            <div className="card bg-primary-900 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">基本信息</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">试验名称:</span> <span className="text-white">{formData.experiment_name || '未填写'}</span></p>
                  <p><span className="text-gray-400">试验类型:</span> <span className="text-white">{formData.experiment_type === 'weld' ? '焊缝检测' : formData.experiment_type === 'layered' ? '分层检测' : '特殊检测'}</span></p>
                  <p><span className="text-gray-400">标准参考:</span> <span className="text-white">{formData.standard_reference || '无'}</span></p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">试件信息</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">材料:</span> <span className="text-white">{(formData.specimen_info as any)?.material || '未填写'}</span></p>
                  <p><span className="text-gray-400">尺寸:</span> <span className="text-white">{(formData.specimen_info as any)?.length || 0} × {(formData.specimen_info as any)?.width || 0} × {(formData.specimen_info as any)?.thickness || 0} mm</span></p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">设备参数</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">探头频率:</span> <span className="text-white">{(formData.device_params as any)?.frequency || 0} MHz</span></p>
                  <p><span className="text-gray-400">增益:</span> <span className="text-white">{(formData.device_params as any)?.gain || 0} dB</span></p>
                  <p><span className="text-gray-400">扫查速度:</span> <span className="text-white">{(formData.device_params as any)?.scan_speed || 0} mm/s</span></p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700 rounded p-4">
              <p className="text-yellow-300 text-sm">
                ⚠️ 请确认以上信息无误后点击"创建试验"按钮。试验创建后可在试验管理页面查看和管理。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-primary-700">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          取消
        </button>

        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="btn-secondary"
            >
              上一步
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
              disabled={currentStep === 1 && !formData.experiment_name}
            >
              下一步
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary"
              disabled={loading || !formData.experiment_name}
            >
              {loading ? '创建中...' : '创建试验'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

