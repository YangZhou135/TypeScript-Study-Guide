# 第5章：泛型编程实践

> 掌握 TypeScript 泛型，编写可重用、类型安全的代码

## 🎯 学习目标

- 理解泛型的概念和作用
- 掌握泛型函数、泛型接口、泛型类的使用
- 学会泛型约束和条件泛型
- 了解泛型在实际项目中的应用

## 📚 知识点概览

### 5.1 泛型基础

泛型允许你编写可重用的代码，同时保持类型安全：

```typescript
// 不使用泛型的问题
function identityString(arg: string): string {
    return arg;
}

function identityNumber(arg: number): number {
    return arg;
}

// 使用泛型的解决方案
function identity<T>(arg: T): T {
    return arg;
}

// 使用
const str = identity<string>("hello"); // string
const num = identity<number>(42); // number
const bool = identity(true); // 类型推断为 boolean
```

### 5.2 泛型函数

```typescript
// 基础泛型函数
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

// 数组操作泛型函数
function getFirst<T>(array: T[]): T | undefined {
    return array[0];
}

function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
}
```

### 5.3 泛型接口

```typescript
// 泛型接口
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}

// 泛型函数接口
interface Transformer<T, U> {
    (input: T): U;
}

// 使用
const stringContainer: Container<string> = {
    value: "hello",
    getValue() {
        return this.value;
    },
    setValue(value: string) {
        this.value = value;
    },
};
```

### 5.4 泛型类

```typescript
class GenericClass<T> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    get(index: number): T | undefined {
        return this.items[index];
    }

    getAll(): T[] {
        return [...this.items];
    }
}

// 使用
const stringList = new GenericClass<string>();
stringList.add("hello");
stringList.add("world");
```

### 5.5 泛型约束

使用 `extends` 关键字约束泛型类型：

```typescript
// 基础约束
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 现在可以访问 length 属性
    return arg;
}

// 键约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// 条件约束
type ApiResponse<T> = T extends string ? { message: T } : { data: T };
```

### 5.6 条件泛型

```typescript
// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;

// 推断类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
```

### 5.7 实用泛型模式

```typescript
// 工厂模式
interface Factory<T> {
    create(...args: any[]): T;
}

// 仓库模式
interface Repository<T, K> {
    findById(id: K): Promise<T | null>;
    save(entity: T): Promise<T>;
    delete(id: K): Promise<boolean>;
}

// 构建器模式
class Builder<T> {
    private partial: Partial<T> = {};

    set<K extends keyof T>(key: K, value: T[K]): Builder<T> {
        this.partial[key] = value;
        return this;
    }

    build(): T {
        return this.partial as T;
    }
}
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `examples.ts` - 泛型基础示例
- `advanced-generics.ts` - 高级泛型应用
- `practice.ts` - 练习题目
- `solutions.ts` - 练习解答

## 📝 练习题目

1. **泛型函数练习**: 实现通用的数组操作函数
2. **泛型类练习**: 创建泛型数据结构
3. **泛型约束练习**: 使用约束解决实际问题
4. **条件泛型练习**: 实现复杂的类型推导

## 🎯 本章小结

- 泛型提供了代码重用和类型安全的完美平衡
- 泛型约束让你能够在保持灵活性的同时添加类型限制
- 条件泛型提供了强大的类型推导能力
- 泛型在设计模式和架构中有广泛应用

## ➡️ 下一章

[第6章：装饰器与元编程](../chapter-06-decorators/README.md)
