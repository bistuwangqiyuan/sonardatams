/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1a2332', // 主色
          900: '#102a43',
        },
        secondary: {
          DEFAULT: '#00a8ff', // 科技蓝
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#00a8ff',
          700: '#0086cc',
          800: '#006699',
          900: '#004466',
        },
        accent: {
          DEFAULT: '#ff6b35', // 强调橙
          50: '#fff3ed',
          100: '#ffe2d1',
          200: '#ffc9a3',
          300: '#ffaa75',
          400: '#ff8a4d',
          500: '#ff6b35',
          600: '#e64d1a',
          700: '#c23e11',
          800: '#9e320e',
          900: '#7a260b',
        },
        danger: {
          DEFAULT: '#ef4444',
          600: '#dc2626',
          900: '#7f1d1d',
        },
        warning: {
          DEFAULT: '#f59e0b',
          600: '#d97706',
          900: '#78350f',
        },
        success: {
          DEFAULT: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover':
          '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
