# 贡献指南

感谢你考虑为超声数据管理系统做出贡献！

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试要求](#测试要求)

## 🤝 行为准则

本项目遵循 [Contributor Covenant](https://www.contributor-covenant.org/) 行为准则。参与本项目即表示你同意遵守其条款。

## 🎯 如何贡献

### 报告Bug

在提交Bug报告前，请：

1. 检查[现有Issues](https://github.com/your-username/sonardatams/issues)
2. 确保使用最新版本
3. 收集相关信息（浏览器、操作系统、错误日志）

提交Bug时请包含：

- 清晰的标题和描述
- 重现步骤
- 预期行为和实际行为
- 截图或视频（如适用）
- 环境信息

### 功能建议

提交功能建议时请说明：

- 功能的使用场景
- 预期的用户价值
- 可能的实现方案
- 相关的截图或原型

### 代码贡献

欢迎提交Pull Request！请确保：

- 代码符合项目规范
- 包含必要的测试
- 更新相关文档
- 通过所有CI检查

## 🔄 开发流程

### 1. Fork和Clone

```bash
# Fork项目到你的GitHub账号
# 然后克隆你的fork
git clone https://github.com/YOUR_USERNAME/sonardatams.git
cd sonardatams

# 添加上游远程仓库
git remote add upstream https://github.com/original/sonardatams.git
```

### 2. 创建分支

```bash
# 从main分支创建新分支
git checkout -b feature/your-feature-name

# 或修复bug
git checkout -b fix/bug-description
```

分支命名规范：

- `feature/` - 新功能
- `fix/` - Bug修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建/工具更新

### 3. 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 运行测试
pnpm run test

# 代码检查
pnpm run lint
```

### 4. 提交代码

```bash
# 添加更改
git add .

# 提交（遵循提交规范）
git commit -m "feat: add new feature"

# 推送到你的fork
git push origin feature/your-feature-name
```

### 5. 创建Pull Request

1. 访问你的fork页面
2. 点击 "Compare & pull request"
3. 填写PR描述
4. 提交PR

## 📐 代码规范

### TypeScript

```typescript
// ✅ 推荐
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function getUserProfile(id: string): UserProfile {
  // 实现
}

// ❌ 避免
function getUser(id) {
  // 缺少类型
}
```

### React组件

```tsx
// ✅ 推荐
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled} className="btn">
      {label}
    </button>
  );
};

// ❌ 避免
export const Button = (props) => {
  return <button>{props.label}</button>;
};
```

### 命名规范

- **组件**: PascalCase (`UserProfile.tsx`)
- **工具函数**: camelCase (`formatDate.ts`)
- **常量**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **类型**: PascalCase (`UserRole`)

### 注释规范

```typescript
/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串
 * @example
 * formatFileSize(1024) // "1 KB"
 */
export function formatFileSize(bytes: number): string {
  // 实现
}
```

## 📝 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具更新
- `perf`: 性能优化

### 示例

```bash
# 新功能
git commit -m "feat: add CSV export functionality"

# Bug修复
git commit -m "fix: resolve file upload timeout issue"

# 文档更新
git commit -m "docs: update installation guide"

# 带作用域
git commit -m "feat(dashboard): add real-time data refresh"

# 带详细描述
git commit -m "fix: resolve memory leak in chart component

- Remove event listeners on component unmount
- Implement proper cleanup in useEffect
- Add memory profiling tests

Fixes #123"
```

## 🧪 测试要求

### 运行测试

```bash
# 运行所有测试
pnpm run test

# 监听模式
pnpm run test:watch

# 生成覆盖率报告
pnpm run test:coverage
```

### 测试覆盖率

新代码应保持：

- 语句覆盖率 > 80%
- 分支覆盖率 > 75%
- 函数覆盖率 > 80%
- 行覆盖率 > 80%

### 编写测试

```typescript
// tests/myFeature.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/myFeature';

describe('myFunction', () => {
  it('should handle normal case', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge case', () => {
    const result = myFunction('');
    expect(result).toBe('');
  });

  it('should throw on invalid input', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

## 🔍 代码审查

PR将经过以下审查：

- ✅ 代码质量和风格
- ✅ 测试覆盖率
- ✅ 文档完整性
- ✅ 性能影响
- ✅ 安全性

## 📚 资源

- [项目文档](./README.md)
- [PRD文档](./PRD.md)
- [部署指南](./DEPLOYMENT.md)
- [更新日志](./CHANGELOG.md)

## ❓ 问题求助

- 查看[文档](./README.md)
- 搜索[Issues](https://github.com/your-username/sonardatams/issues)
- 创建新Issue
- 联系维护者

## 🎉 贡献者

感谢所有贡献者！

---

再次感谢你的贡献！ 💙

