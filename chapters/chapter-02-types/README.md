# 第2章：类型系统深入理解

> 掌握 TypeScript 强大的类型系统，提升代码质量和开发效率

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

运行时检查类型：

```typescript
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function processValue(value: string | number) {
    if (isString(value)) {
        // 这里 TypeScript 知道 value 是 string
        console.log(value.toUpperCase());
    } else {
        // 这里 TypeScript 知道 value 是 number
        console.log(value.toFixed(2));
    }
}
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `examples.ts` - 类型系统示例
- `practice.ts` - 练习题目
- `solutions.ts` - 练习解答

## 📝 练习题目

1. **类型别名练习**: 为复杂数据结构定义类型别名
2. **接口练习**: 设计和实现接口
3. **联合类型练习**: 处理多种可能的类型
4. **类型守卫练习**: 实现类型安全的函数

## 🎯 本章小结

- 类型别名使复杂类型更易读和维护
- 接口定义对象结构，支持继承和扩展
- 联合类型处理多种可能性，交叉类型组合类型
- 类型断言和类型守卫提供类型安全保障

## ➡️ 下一章

[第3章：从 JavaScript 到 TypeScript 迁移](../chapter-03-migration/README.md)
