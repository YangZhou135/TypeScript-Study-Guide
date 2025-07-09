# 第1章：TypeScript 基础语法入门

> 从 JavaScript 开发者的角度理解 TypeScript 基础语法

## 🎯 学习目标

- 理解 TypeScript 与 JavaScript 的关系
- 掌握 TypeScript 基本语法
- 学会基础类型声明
- 了解编译过程和工具链

## 📚 知识点概览

### 1.1 什么是 TypeScript？

TypeScript 是 JavaScript 的超集，为 JavaScript 添加了静态类型检查。

**JavaScript vs TypeScript 对比：**

```javascript
// JavaScript - 运行时才发现错误
function greet(name) {
    return "Hello, " + name.toUpperCase();
}

greet(123); // 运行时错误：name.toUpperCase is not a function
```

```typescript
// TypeScript - 编译时就能发现错误
function greet(name: string): string {
    return "Hello, " + name.toUpperCase();
}

greet(123); // 编译错误：Argument of type 'number' is not assignable to parameter of type 'string'
```

### 1.2 基础类型

#### 原始类型

```typescript
// 字符串
let userName: string = "张三";
let message: string = `欢迎 ${userName}`;

// 数字
let age: number = 25;
let price: number = 99.99;

// 布尔值
let isActive: boolean = true;
let isCompleted: boolean = false;

// undefined 和 null
let undefinedValue: undefined = undefined;
let nullValue: null = null;
```

#### 数组类型

```typescript
// 方式1：类型[]
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["张三", "李四", "王五"];

// 方式2：Array<类型>
let scores: Array<number> = [85, 92, 78];
let cities: Array<string> = ["北京", "上海", "深圳"];
```

### 1.3 函数类型

```typescript
// 函数参数和返回值类型
function add(a: number, b: number): number {
    return a + b;
}

// 可选参数
function greetUser(name: string, title?: string): string {
    if (title) {
        return `${title} ${name}`;
    }
    return name;
}

// 默认参数
function createUser(name: string, age: number = 18): object {
    return { name, age };
}

// 箭头函数
const multiply = (x: number, y: number): number => x * y;
```

### 1.4 对象类型

```typescript
// 对象类型声明
let user: { name: string; age: number; email: string } = {
    name: "张三",
    age: 25,
    email: "zhangsan@example.com"
};

// 可选属性
let product: { name: string; price: number; description?: string } = {
    name: "iPhone",
    price: 6999
};
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `examples.ts` - 基础语法示例
- `practice.ts` - 练习题目
- `solutions.ts` - 练习解答

## 🔧 编译和运行

```bash
# 编译单个文件
npx tsc examples.ts

# 运行编译后的 JavaScript
node examples.js

# 使用 ts-node 直接运行 TypeScript
npx ts-node examples.ts
```

## 📝 练习题目

1. **类型声明练习**: 为给定的 JavaScript 代码添加类型声明
2. **函数类型练习**: 编写带有类型的函数
3. **对象类型练习**: 定义复杂对象的类型

## 🎯 本章小结

- TypeScript 是 JavaScript 的超集，添加了类型系统
- 基础类型包括：string、number、boolean、数组、对象等
- 函数可以声明参数类型和返回值类型
- 类型检查在编译时进行，提前发现错误

## ➡️ 下一章

[第2章：类型系统深入理解](../chapter-02-types/README.md)
