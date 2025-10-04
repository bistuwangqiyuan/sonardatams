/**
 * Vitest测试环境设置
 */

import { vi } from 'vitest';

// Mock环境变量
vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'test_anon_key');
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test_service_role_key');

// Mock navigator
global.navigator = {
  userAgent: 'test-user-agent',
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

