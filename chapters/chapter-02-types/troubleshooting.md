# 第2章：类型系统常见错误和解决方案

> 类型系统虽然强大，但也容易出错。这里是最实用的错误排查指南！

## 🚨 联合类型常见错误

### 1. 联合类型属性访问错误

#### ❌ 错误示例

```typescript
type User = { type: "user"; name: string } | { type: "admin"; name: string; permissions: string[] };

function processUser(user: User) {
    console.log(user.permissions); // Error: Property 'permissions' does not exist on type 'User'
}
```

#### ✅ 解决方案

```typescript
function processUser(user: User) {
    // 方案1：使用类型守卫
    if (user.type === "admin") {
        console.log(user.permissions); // ✅ 现在 TypeScript 知道这是 admin
    }

    // 方案2：使用 in 操作符
    if ("permissions" in user) {
        console.log(user.permissions); // ✅ 可以安全访问
    }
}
```

### 2. 接口合并错误

#### ❌ 错误示例

```typescript
interface User {
    name: string;
}

interface User {
    name: number; // Error: Subsequent property declarations must have the same type
}
```

#### ✅ 解决方案

```typescript
// 方案1：确保同名属性类型一致
interface User {
    name: string;
}

interface User {
    name: string; // ✅ 类型一致
    age: number; // ✅ 新属性
}

// 方案2：使用类型别名避免合并
type UserType = {
    name: string;
};

type ExtendedUserType = UserType & {
    age: number;
};
```

## 🔧 类型断言陷阱

### 1. 错误的类型断言

#### ❌ 危险示例

```typescript
let value: unknown = "123";
let num = value as number; // 编译通过，但运行时可能出错
console.log(num.toFixed(2)); // 运行时错误！
```

#### ✅ 安全解决方案

```typescript
let value: unknown = "123";

// 方案1：使用类型守卫
function isNumber(val: unknown): val is number {
    return typeof val === "number";
}

if (isNumber(value)) {
    console.log(value.toFixed(2)); // ✅ 安全
}

// 方案2：先转换再断言
let num = Number(value);
if (!isNaN(num)) {
    console.log(num.toFixed(2)); // ✅ 安全
}
```

### 2. DOM 元素断言错误

#### ❌ 错误示例

```typescript
// 假设在浏览器环境中
let input = document.getElementById("username") as HTMLInputElement;
input.value = "默认值"; // 可能报错：input 为 null
```

#### ✅ 解决方案

```typescript
// 方案1：非空断言操作符（确定元素存在时）
let input = document.getElementById("username")! as HTMLInputElement;

// 方案2：安全检查（推荐）
let input = document.getElementById("username");
if (input instanceof HTMLInputElement) {
    input.value = "默认值"; // ✅ 安全
}

// 方案3：可选链（TypeScript 3.7+）
let input = document.getElementById("username") as HTMLInputElement | null;
if (input) {
    input.value = "默认值";
}
```

## 🎯 泛型常见错误

### 1. 泛型约束缺失

#### ❌ 错误示例

```typescript
function getProperty<T>(obj: T, key: string) {
    return obj[key]; // Error: Element implicitly has an 'any' type
}
```

#### ✅ 解决方案

```typescript
// 方案1：使用 keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]; // ✅ 类型安全
}

// 方案2：使用索引签名
function getProperty<T extends Record<string, any>>(obj: T, key: string): any {
    return obj[key];
}
```

## 🛠️ 调试高级类型

### 1. 类型太复杂无法显示

#### ❌ 问题现象

```typescript
// VS Code 显示：Type instantiation is excessively deep and possibly infinite
type DeepNested<T> = T extends object ? { [K in keyof T]: DeepNested<T[K]> } : T;
```

#### ✅ 解决方案

```typescript
// 方案1：限制递归深度
type DeepNested<T, Depth = 0> = Depth extends 5
    ? T
    : T extends object
      ? { [K in keyof T]: DeepNested<T[K], [0, ...Depth]> }
      : T;

// 方案2：使用辅助类型分步骤
type Step1<T> = T extends object ? T : never;
type Step2<T> = { [K in keyof T]: T[K] };
type DeepNested<T> = Step2<Step1<T>>;
```

### 2. 使用类型调试技巧

```typescript
// 技巧1：创建类型测试
type Test = DeepNested<{ a: { b: string } }>;
//   ^? 鼠标悬停查看结果类型

// 技巧2：使用条件类型调试
type Debug<T> = T extends infer U ? U : never;
type DebugResult = Debug<ComplexType>;

// 技巧3：强制显示类型
type Expand<T> = T extends (...args: any[]) => any
    ? T
    : T extends object
      ? { [K in keyof T]: T[K] }
      : T;
```

## 🔍 错误排查工具

### 1. TypeScript 编译器选项

```json
// tsconfig.json - 调试配置
{
    "compilerOptions": {
        "noImplicitAny": true, // 发现隐式 any
        "strictNullChecks": true, // 严格空检查
        "noImplicitReturns": true, // 检查函数返回值
        "noUnusedLocals": true, // 发现未使用变量
        "exactOptionalPropertyTypes": true // 精确可选属性
    }
}
```

### 2. 实用调试代码

```typescript
// 类型检查辅助函数
function assertType<T>(): <U extends T>(value: U) => U {
    return (value) => value;
}

// 使用示例
const userChecker = assertType<{ name: string; age: number }>();
const user = userChecker({ name: "张三", age: 25 }); // ✅ 通过类型检查

// 编译时类型测试
type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

// 测试类型是否相等
type Test1 = Equal<string, string>; // true
type Test2 = Equal<string, number>; // false
```

## 📚 学习建议

### 1. 逐步增加复杂度

```typescript
// 第一步：基础类型
let user: { name: string };

// 第二步：添加可选属性
let user: { name: string; age?: number };

// 第三步：使用接口
interface User {
    name: string;
    age?: number;
}

// 第四步：添加联合类型
interface User {
    name: string;
    age?: number;
    role: "admin" | "user";
}
```

### 2. 保存常用代码片段

```typescript
// 常用类型守卫
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isArray<T>(value: unknown): value is T[] {
    return Array.isArray(value);
}

// 常用工具类型
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
```

---

**记住**：复杂的类型错误通常是因为试图一次性解决太多问题。把复杂类型分解成简单的步骤，一步一步调试！
