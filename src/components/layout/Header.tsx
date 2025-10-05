/**
 * 顶部导航栏组件
 */

import React from 'react';

interface HeaderProps {
  currentPath?: string;
}

const navItems = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '数据大屏', path: '/dashboard', icon: '📊' },
  { name: '文件管理', path: '/files', icon: '📁' },
  { name: '超声图像', path: '/ultrasonic', icon: '🖼️' },
  { name: '试验管理', path: '/experiments', icon: '🔬' },
];

export const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  return (
    <header className="bg-primary-800 border-b border-primary-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">US</span>
            </div>
            <div>
              <div className="text-xl font-bold text-gradient">超声数据管理系统</div>
              <p className="text-xs text-gray-400">Ultrasonic Data Management System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPath === item.path
                    ? 'bg-secondary text-white'
                    : 'text-gray-300 hover:bg-primary-700 hover:text-white'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-700 hover:bg-primary-600 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">用</span>
              </div>
              <span className="text-sm text-gray-300">用户</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

