# TypeScript 代码风格和注释规范

> 统一的代码风格有助于提高代码可读性和学习效果

## 📝 注释规范

### 1. 文件头注释

每个TypeScript文件应包含文件头注释：

```typescript
/**
 * 第X章：章节名称
 *
 * 文件描述：简要说明这个文件的作用
 * 学习重点：列出本文件涉及的核心知识点
 *
 * @author TypeScript学习指南
 * @date 创建日期
 */

// 确保文件作为模块，避免全局作用域冲突
export {};
```

### 2. 函数注释

重要函数应包含JSDoc注释：

````typescript
/**
 * 计算两个数的和
 *
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @returns 两个数的和
 *
 * @example
 * ```typescript
 * const result = add(5, 3); // 返回 8
 * ```
 */
function add(a: number, b: number): number {
    return a + b;
}
````

### 3. 类型定义注释

复杂类型应包含说明：

```typescript
/**
 * 用户信息接口
 *
 * @interface User
 */
interface User {
    /** 用户唯一标识符 */
    id: number;

    /** 用户姓名 */
    name: string;

    /** 用户邮箱（可选） */
    email?: string;

    /**
     * 用户角色
     * - 'admin': 管理员
     * - 'user': 普通用户
     */
    role: "admin" | "user";
}
```

### 4. 行内注释

关键逻辑应添加行内注释：

```typescript
function processData(data: unknown): string {
    // 检查数据类型，确保类型安全
    if (typeof data === "string") {
        return data.toUpperCase(); // 转换为大写返回
    }

    // 非字符串类型转换为字符串
    return String(data);
}
```

## 🎨 代码风格规范

### 1. 命名规范

#### 变量和函数：使用 camelCase

```typescript
// ✅ 正确
const userName = "张三";
const isLoggedIn = true;

function getUserInfo(): User {
    // ...
}

// ❌ 错误
const user_name = "张三";
const IsLoggedIn = true;
```

#### 接口和类型：使用 PascalCase

```typescript
// ✅ 正确
interface UserProfile {
    name: string;
    age: number;
}

type ApiResponse = {
    success: boolean;
    data: any;
};

// ❌ 错误
interface userProfile {
    name: string;
    age: number;
}
```

#### 常量：使用 UPPER_CASE

```typescript
// ✅ 正确
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";

// ❌ 错误
const maxRetryCount = 3;
const apiBaseUrl = "https://api.example.com";
```

### 2. 类型声明规范

#### 显式类型声明（学习阶段推荐）

```typescript
// ✅ 学习阶段推荐：显式声明类型
let count: number = 0;
let items: string[] = ["a", "b", "c"];

function process(input: string): string {
    return input.toUpperCase();
}

// ✅ 生产环境可选：利用类型推断
let count = 0; // TypeScript 推断为 number
let items = ["a", "b", "c"]; // 推断为 string[]
```

#### 复杂类型的组织

```typescript
// ✅ 正确：将复杂类型拆分
interface Address {
    street: string;
    city: string;
    zipCode: string;
}

interface User {
    id: number;
    name: string;
    address: Address; // 使用已定义的类型
}

// ❌ 避免：内联复杂类型
interface User {
    id: number;
    name: string;
    address: {
        street: string;
        city: string;
        zipCode: string;
    };
}
```

### 3. 函数参数规范

#### 参数类型和返回值类型

```typescript
// ✅ 正确：明确的参数和返回值类型
function calculateTotal(price: number, quantity: number, discount: number): number {
    return price * quantity * (1 - discount);
}

// ✅ 正确：可选参数放在最后
function greetUser(name: string, title?: string): string {
    return title ? `${title} ${name}` : name;
}

// ✅ 正确：默认参数
function createLogger(level: string = "info"): void {
    console.log(`Logger level: ${level}`);
}
```

### 4. 错误处理规范

```typescript
// ✅ 正确：明确的错误类型
function parseJson<T>(jsonString: string): T | null {
    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error("JSON parsing failed:", error);
        return null;
    }
}

// ✅ 正确：使用联合类型表示可能的失败
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

function safeParseJson<T>(jsonString: string): Result<T> {
    try {
        const data = JSON.parse(jsonString) as T;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}
```

## 🔧 代码组织规范

### 1. 文件内部组织顺序

```typescript
// 1. 文件头注释
/**
 * 第X章：XXX
 */

// 2. 模块导入
import { SomeType } from "./types";

// 3. 类型定义
interface LocalInterface {
    // ...
}

type LocalType = string | number;

// 4. 常量定义
const CONSTANT_VALUE = "some value";

// 5. 主要实现代码
function mainFunction(): void {
    // ...
}

// 6. 模块导出
export { mainFunction, LocalInterface };
```

### 2. 练习文件规范

```typescript
/**
 * 第X章：XXX - 练习题
 *
 * 完成以下练习，运行 `npx tsc practice.ts --noEmit` 检查类型错误
 */

export {}; // 模块化

// ============================================================================
// 练习1：练习名称 (难度：⭐⭐⭐☆☆)
// ============================================================================

console.log("=== 练习1：练习名称 ===");

// TODO: 在这里完成练习
let result: unknown; // 需要添加正确的类型

// 测试代码
console.log("练习1完成");

// ============================================================================
// 练习2：练习名称 (难度：⭐⭐⭐⭐☆)
// ============================================================================

console.log("\n=== 练习2：练习名称 ===");

// TODO: 在这里完成练习
```

## ⚙️ 工具配置

### 1. VS Code 设置

创建 `.vscode/settings.json`：

```json
{
    "typescript.preferences.quoteStyle": "double",
    "typescript.format.semicolons": "insert",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "typescript.suggest.includeCompletionsForModuleExports": true,
    "typescript.inlayHints.parameterNames.enabled": "all",
    "typescript.inlayHints.variableTypes.enabled": true
}
```

### 2. 运行代码格式化

```bash
# 格式化所有代码
npm run format

# 检查代码风格
npm run lint

# 自动修复可修复的风格问题
npm run lint -- --fix
```

## 📚 学习建议

### 1. 渐进式采用

- **第1-2章**：重点关注类型声明的正确性
- **第3-4章**：开始注意命名规范和注释
- **第5-6章**：完全按照规范编写代码
- **第7-9章**：在Vue项目中实践完整规范

### 2. 代码审查检查点

- [ ] 所有函数都有明确的参数和返回值类型
- [ ] 复杂类型有适当的注释说明
- [ ] 变量和函数命名符合规范
- [ ] 文件结构清晰，有适当的分组注释
- [ ] 运行 `npm run lint` 无错误

### 3. 常用快捷键（VS Code）

- `Alt + Shift + F`：格式化当前文件
- `F2`：重命名符号
- `Ctrl + Shift + O`：跳转到文件中的符号
- `Ctrl + Space`：触发自动补全

---

**记住**：好的代码风格不仅让代码更易读，也能帮助你更好地理解TypeScript的类型系统！
