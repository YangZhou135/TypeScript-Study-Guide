# 第3章：从 JavaScript 到 TypeScript 迁移

> 学习如何将现有的 JavaScript 项目逐步迁移到 TypeScript

## 🎯 学习目标

- 掌握 JavaScript 到 TypeScript 的迁移策略
- 了解渐进式迁移的最佳实践
- 学会处理常见的迁移问题
- 理解如何配置 TypeScript 编译器

## 📚 知识点概览

### 3.1 迁移策略

#### 渐进式迁移
1. **文件重命名**: `.js` → `.ts`
2. **添加类型声明**: 逐步为变量、函数添加类型
3. **启用严格模式**: 逐步开启 TypeScript 严格检查
4. **重构优化**: 利用类型系统重构代码

#### 迁移步骤
```bash
# 1. 安装 TypeScript
npm install -D typescript @types/node

# 2. 创建 tsconfig.json
npx tsc --init

# 3. 重命名文件
mv app.js app.ts

# 4. 逐步添加类型
```

### 3.2 TypeScript 配置

#### 基础配置 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,  // 初期设为 false
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 渐进式严格配置
```json
{
  "compilerOptions": {
    // 第一阶段：基础配置
    "noImplicitAny": false,
    "strictNullChecks": false,
    
    // 第二阶段：启用部分严格检查
    "noImplicitAny": true,
    "strictNullChecks": false,
    
    // 第三阶段：完全严格模式
    "strict": true
  }
}
```

### 3.3 常见迁移模式

#### 模式1：函数迁移
```javascript
// JavaScript 原代码
function calculatePrice(basePrice, discount, tax) {
    const discountedPrice = basePrice * (1 - discount);
    return discountedPrice * (1 + tax);
}
```

```typescript
// TypeScript 迁移后
function calculatePrice(
    basePrice: number, 
    discount: number, 
    tax: number
): number {
    const discountedPrice: number = basePrice * (1 - discount);
    return discountedPrice * (1 + tax);
}
```

#### 模式2：对象迁移
```javascript
// JavaScript 原代码
const user = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    preferences: {
        theme: "dark",
        language: "zh-CN"
    }
};
```

```typescript
// TypeScript 迁移后
interface UserPreferences {
    theme: "light" | "dark";
    language: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    preferences: UserPreferences;
}

const user: User = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    preferences: {
        theme: "dark",
        language: "zh-CN"
    }
};
```

### 3.4 处理第三方库

#### 安装类型声明
```bash
# 安装常用库的类型声明
npm install -D @types/lodash
npm install -D @types/express
npm install -D @types/node
```

#### 自定义类型声明
```typescript
// types/custom.d.ts
declare module 'some-library' {
    export function someFunction(param: string): number;
}
```

### 3.5 迁移检查清单

- [ ] 安装 TypeScript 和相关工具
- [ ] 配置 tsconfig.json
- [ ] 重命名 .js 文件为 .ts
- [ ] 添加基础类型声明
- [ ] 处理编译错误
- [ ] 安装第三方库类型声明
- [ ] 逐步启用严格模式
- [ ] 重构和优化代码

## 💻 实践代码

查看以下文件中的实际迁移示例：

- `before-migration/` - 迁移前的 JavaScript 代码
- `after-migration/` - 迁移后的 TypeScript 代码
- `migration-steps.md` - 详细迁移步骤

## 📝 练习题目

1. **基础迁移**: 将简单的 JavaScript 函数迁移到 TypeScript
2. **对象迁移**: 为复杂对象添加类型定义
3. **模块迁移**: 迁移包含多个模块的项目
4. **配置优化**: 优化 TypeScript 编译配置

## 🎯 本章小结

- 迁移应该是渐进式的，不要一次性改变所有代码
- 先关闭严格模式，逐步启用各项检查
- 利用 TypeScript 的类型推断，减少手动类型声明
- 为第三方库安装类型声明文件

## ➡️ 下一章

[第4章：高级类型与类型操作](../chapter-04-advanced-types/README.md)
