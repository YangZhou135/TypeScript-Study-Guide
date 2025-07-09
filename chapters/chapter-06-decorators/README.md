# 第6章：装饰器与元编程

> 掌握 TypeScript 装饰器，实现优雅的元编程

## 🎯 学习目标

- 理解装饰器的概念和作用
- 掌握类装饰器、方法装饰器、属性装饰器、参数装饰器
- 学会装饰器工厂和装饰器组合
- 了解装饰器在实际项目中的应用

## 📚 知识点概览

### 6.1 装饰器基础

装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、访问符、属性或参数上：

```typescript
// 启用装饰器支持需要在 tsconfig.json 中设置
// "experimentalDecorators": true
// "emitDecoratorMetadata": true

// 简单的类装饰器
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

### 6.2 类装饰器

类装饰器在类声明之前被声明：

```typescript
function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    };
}

@classDecorator
class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}
```

### 6.3 方法装饰器

方法装饰器声明在一个方法的声明之前：

```typescript
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

### 6.4 属性装饰器

属性装饰器声明在一个属性声明之前：

```typescript
function format(formatString: string) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];

        const getter = function () {
            return `${formatString} ${value}`;
        };

        const setter = function (newVal: string) {
            value = newVal;
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}

class Greeter {
    @format("Hello")
    greeting: string;
}
```

### 6.5 参数装饰器

参数装饰器声明在一个参数声明之前：

```typescript
function required(target: any, propertyKey: string, parameterIndex: number) {
    let existingRequiredParameters: number[] =
        Reflect.getOwnMetadata("required", target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata("required", existingRequiredParameters, target, propertyKey);
}

class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet(@required name: string) {
        return "Hello " + name + ", " + this.greeting;
    }
}
```

### 6.6 装饰器工厂

装饰器工厂就是一个简单的函数，它返回一个装饰器：

```typescript
function color(value: string) {
    // 这是一个装饰器工厂
    return function (target: any) {
        // 这是装饰器
        // do something with "target" and "value"...
    };
}

@color("red")
class Car {}
```

### 6.7 装饰器组合

多个装饰器可以同时应用到一个声明上：

```typescript
@f @g x

// 等同于
@f
@g
x

// 装饰器的求值方式与复合函数相似
// f(g(x))
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `examples.ts` - 装饰器基础示例
- `advanced-decorators.ts` - 高级装饰器应用
- `practice.ts` - 练习题目
- `solutions.ts` - 练习解答

## 📝 练习题目

1. **类装饰器练习**: 实现日志记录装饰器
2. **方法装饰器练习**: 创建性能监控装饰器
3. **属性装饰器练习**: 实现数据验证装饰器
4. **综合应用练习**: 构建完整的装饰器系统

## 🎯 本章小结

- 装饰器提供了一种优雅的方式来修改类和类成员
- 不同类型的装饰器有不同的用途和参数
- 装饰器工厂增加了装饰器的灵活性
- 装饰器在框架开发中有广泛应用

## ➡️ 下一章

[第7章：Vue 2 + TypeScript 项目集成](../chapter-07-vue-integration/README.md)
