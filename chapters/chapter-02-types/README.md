# 第2章：类型系统深入理解

> 掌握 TypeScript 强大的类型系统，提升代码质量和开发效率

## 🔄 前置知识回顾

在开始本章学习前，请确保您已经掌握了以下概念：

- ✅ **基础类型**：`string`、`number`、`boolean`、数组类型的使用
- ✅ **函数类型**：参数类型、返回值类型、可选参数的声明
- ✅ **对象类型**：基本对象类型声明和可选属性
- ✅ **类型推断**：理解 TypeScript 如何自动推断类型

💡 **快速检验**：如果您对以下代码感到陌生，建议先复习第1章：

```typescript
let user: { name: string; age: number; email?: string } = {
    name: "张三",
    age: 25,
};

function greet(name: string): string {
    return `Hello, ${name}`;
}
```

## 🎯 学习目标

- 理解 TypeScript 类型系统的核心概念
- 掌握联合类型、交叉类型等高级类型
- 学会使用类型别名和接口
- 了解类型断言和类型守卫

## 📚 知识点概览

### 2.1 类型别名 (Type Aliases)

使用 `type` 关键字为复杂类型创建别名：

```typescript
// 基础类型别名
type UserID = number;
type UserName = string;

// 对象类型别名
type User = {
    id: UserID;
    name: UserName;
    email: string;
    age: number;
};

// 函数类型别名
type EventHandler = (event: string) => void;
```

### 2.2 接口 (Interfaces)

接口定义对象的结构：

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
    description?: string; // 可选属性
    readonly category: string; // 只读属性
}

// 接口继承
interface ElectronicProduct extends Product {
    warranty: number;
    brand: string;
}
```

### 2.3 联合类型 (Union Types)

使用 `|` 表示多种可能的类型：

```typescript
type Status = "pending" | "success" | "error";
type ID = string | number;

function processResult(result: string | number | boolean) {
    if (typeof result === "string") {
        return result.toUpperCase();
    } else if (typeof result === "number") {
        return result.toFixed(2);
    } else {
        return result ? "是" : "否";
    }
}
```

### 2.4 交叉类型 (Intersection Types)

使用 `&` 组合多个类型：

```typescript
type Person = {
    name: string;
    age: number;
};

type Employee = {
    employeeId: string;
    department: string;
};

type Staff = Person & Employee; // 包含两个类型的所有属性
```

### 2.5 字面量类型 (Literal Types)

具体的值作为类型：

```typescript
type Direction = "up" | "down" | "left" | "right";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
```

### 2.6 类型断言 (Type Assertions)

告诉编译器变量的具体类型：

```typescript
// 方式1：尖括号语法
let someValue: unknown = "这是一个字符串";
let strLength: number = (<string>someValue).length;

// 方式2：as 语法（推荐）
let strLength2: number = (someValue as string).length;
```

### 2.7 类型守卫 (Type Guards)

类型守卫帮助我们在运行时安全地检查和使用类型。让我们逐步学习：

#### 第一步：理解问题

```typescript
// 问题：我们不确定 value 的具体类型
function processValue(value: string | number) {
    // ❌ 错误：TypeScript 不知道 value 是什么类型
    // console.log(value.toUpperCase()); // 如果是 number 会报错
    // console.log(value.toFixed(2));    // 如果是 string 会报错
}
```

#### 第二步：使用 typeof 类型守卫（内置）

```typescript
function processValue(value: string | number) {
    if (typeof value === "string") {
        // ✅ TypeScript 知道这里 value 是 string
        console.log(value.toUpperCase());
    } else {
        // ✅ TypeScript 知道这里 value 是 number
        console.log(value.toFixed(2));
    }
}
```

#### 第三步：自定义类型守卫（进阶）

```typescript
// 自定义类型守卫函数
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function safeProcessValue(value: unknown) {
    if (isString(value)) {
        // ✅ TypeScript 知道 value 是 string
        console.log(value.toUpperCase());
    } else {
        console.log("不是字符串类型");
    }
}
```

#### 实际应用示例

```typescript
// 处理 API 响应的真实场景
type ApiResponse = { success: true; data: any } | { success: false; error: string };

function handleApiResponse(response: ApiResponse) {
    if (response.success) {
        // TypeScript 知道这里 response 有 data 属性
        console.log("数据:", response.data);
    } else {
        // TypeScript 知道这里 response 有 error 属性
        console.log("错误:", response.error);
    }
}
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `examples.ts` - 类型系统示例
- `practice.ts` - 练习题目
- `solutions.ts` - 练习解答
- `troubleshooting.md` - 🆕 类型系统错误排除指南

## 🔧 遇到复杂类型错误？

类型系统可能比较复杂，如果遇到错误请查看 [类型系统故障排除指南](./troubleshooting.md)：

- 联合类型和交叉类型常见错误
- 类型断言安全使用方法
- 泛型错误排查技巧
- 高级类型调试方法

## 📝 练习题目

### 🟢 初级练习（必做）
1. **类型别名练习**: 为复杂数据结构定义类型别名
   - 难度：⭐⭐⭐☆☆
   - 预计时间：15分钟
   - 涵盖：type关键字、基础类型别名

2. **接口基础练习**: 设计和实现基础接口
   - 难度：⭐⭐⭐☆☆
   - 预计时间：20分钟
   - 涵盖：interface定义、可选属性、只读属性

### 🟡 中级练习（推荐）
3. **联合类型练习**: 处理多种可能的类型
   - 难度：⭐⭐⭐⭐☆
   - 预计时间：25分钟
   - 涵盖：联合类型、字面量类型、类型守卫

4. **交叉类型练习**: 组合多个类型
   - 难度：⭐⭐⭐⭐☆
   - 预计时间：20分钟
   - 涵盖：交叉类型、类型组合、实际应用

### 🟠 高级练习（挑战）
5. **类型守卫练习**: 实现类型安全的函数
   - 难度：⭐⭐⭐⭐⭐
   - 预计时间：30分钟
   - 涵盖：自定义类型守卫、类型断言、类型安全

6. **综合应用**: 完整的API响应类型系统
   - 难度：⭐⭐⭐⭐⭐
   - 预计时间：45分钟
   - 涵盖：所有类型系统概念的综合应用

💡 **进阶学习建议**：
- 从简单的类型别名开始，逐步接触复杂的类型操作
- 每个练习都要运行 `npx tsc --noEmit` 检查类型正确性
- 理解每种类型的使用场景和最佳实践
- 重点关注类型守卫的实际应用价值

## 🎯 本章小结

- 类型别名使复杂类型更易读和维护
- 接口定义对象结构，支持继承和扩展
- 联合类型处理多种可能性，交叉类型组合类型
- 类型断言和类型守卫提供类型安全保障

## ➡️ 下一章

[第3章：从 JavaScript 到 TypeScript 迁移](../chapter-03-migration/README.md)
