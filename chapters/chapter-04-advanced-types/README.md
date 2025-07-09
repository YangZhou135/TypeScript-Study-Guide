# 第4章：高级类型与类型操作

> 掌握 TypeScript 的高级类型特性，提升类型编程能力

## 🎯 学习目标

- 掌握映射类型 (Mapped Types) 的使用
- 理解条件类型 (Conditional Types) 的概念
- 学会使用内置工具类型 (Utility Types)
- 了解模板字面量类型的应用

## 📚 知识点概览

### 4.1 映射类型 (Mapped Types)

映射类型允许你基于现有类型创建新类型：

```typescript
// 基础映射类型
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};

// 使用示例
interface User {
    id: number;
    name: string;
    email: string;
}

type ReadonlyUser = Readonly<User>; // 所有属性变为只读
type PartialUser = Partial<User>;   // 所有属性变为可选
```

### 4.2 条件类型 (Conditional Types)

根据条件选择不同的类型：

```typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false;

// 实用的条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;
type StringOrNumberArray = ToArray<string | number>; // string[] | number[]
```

### 4.3 内置工具类型 (Utility Types)

TypeScript 提供了许多内置的工具类型：

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// Pick - 选择部分属性
type UserSummary = Pick<User, 'id' | 'name'>; // { id: number; name: string; }

// Omit - 排除部分属性
type UserWithoutId = Omit<User, 'id'>; // { name: string; email: string; age: number; }

// Record - 创建记录类型
type UserRoles = Record<string, User>; // { [key: string]: User; }

// Required - 所有属性变为必需
type RequiredUser = Required<Partial<User>>;
```

### 4.4 模板字面量类型 (Template Literal Types)

使用模板字符串创建类型：

```typescript
// 基础模板字面量类型
type Greeting = `Hello ${string}`;
type SpecificGreeting = `Hello ${'World' | 'TypeScript'}`;

// 实用示例
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>; // 'onClick'

// 组合使用
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint<T extends string> = `api/${T}`;
type UserEndpoint = ApiEndpoint<'users'>; // 'api/users'
```

### 4.5 keyof 和 typeof 操作符

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// keyof - 获取对象类型的键
type UserKeys = keyof User; // 'id' | 'name' | 'email'

// typeof - 获取值的类型
const user = { id: 1, name: 'John', email: 'john@example.com' };
type UserType = typeof user; // { id: number; name: string; email: string; }

// 组合使用
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
```

### 4.6 索引访问类型 (Indexed Access Types)

```typescript
interface User {
    id: number;
    profile: {
        name: string;
        avatar: string;
    };
    preferences: {
        theme: 'light' | 'dark';
        language: string;
    };
}

// 访问嵌套类型
type UserProfile = User['profile']; // { name: string; avatar: string; }
type Theme = User['preferences']['theme']; // 'light' | 'dark'

// 数组元素类型
type StringArray = string[];
type ArrayElement = StringArray[number]; // string
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `examples.ts` - 高级类型示例
- `practice.ts` - 练习题目
- `solutions.ts` - 练习解答
- `utility-types.ts` - 工具类型详解

## 📝 练习题目

1. **映射类型练习**: 实现自定义的映射类型
2. **条件类型练习**: 创建复杂的条件类型
3. **工具类型练习**: 使用内置工具类型解决实际问题
4. **模板字面量练习**: 创建类型安全的字符串模板

## 🎯 本章小结

- 映射类型让你能够转换现有类型的结构
- 条件类型提供了类型级别的逻辑判断
- 工具类型是 TypeScript 提供的强大类型操作工具
- 模板字面量类型增强了字符串类型的表达能力
- keyof、typeof 等操作符是类型编程的基础工具

## ➡️ 下一章

[第5章：泛型编程实践](../chapter-05-generics/README.md)
