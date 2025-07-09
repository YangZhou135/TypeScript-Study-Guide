# 第1章：常见错误和解决方案

> 遇到TypeScript错误不要慌！这里收集了初学者最常遇到的问题和解决方法

## 🚨 常见错误类型

### 1. 类型不匹配错误

#### ❌ 错误示例

```typescript
let age: number = "25"; // Error: Type 'string' is not assignable to type 'number'
```

#### ✅ 解决方案

```typescript
// 方案1：正确的类型
let age: number = 25;

// 方案2：如果确实需要从字符串转换
let ageFromString: number = parseInt("25");

// 方案3：联合类型（如果两种类型都可能）
let age: number | string = "25"; // 这样两种类型都可以
```

#### 💡 理解要点

- TypeScript 是强类型语言，不会自动转换类型
- 检查变量的实际值和声明的类型是否匹配
- 使用 `typeof` 操作符检查值的实际类型

### 2. 对象属性不存在错误

#### ❌ 错误示例

```typescript
let user = { name: "张三", age: 25 };
console.log(user.email); // Error: Property 'email' does not exist on type
```

#### ✅ 解决方案

```typescript
// 方案1：添加可选属性
let user: { name: string; age: number; email?: string } = {
    name: "张三",
    age: 25,
};

// 方案2：检查属性是否存在
if ("email" in user) {
    console.log(user.email);
}

// 方案3：使用可选链操作符（TypeScript 3.7+）
console.log(user.email?.toLowerCase());
```

### 3. 函数参数错误

#### ❌ 错误示例

```typescript
function greet(name: string): string {
    return `Hello, ${name}`;
}

greet(); // Error: Expected 1 arguments, but got 0
greet("张三", "额外参数"); // Error: Expected 1 arguments, but got 2
```

#### ✅ 解决方案

```typescript
// 方案1：可选参数
function greet(name?: string): string {
    return `Hello, ${name || "朋友"}`;
}

// 方案2：默认参数
function greet(name: string = "朋友"): string {
    return `Hello, ${name}`;
}

// 方案3：剩余参数
function greet(name: string, ...otherInfo: string[]): string {
    return `Hello, ${name}. ${otherInfo.join(" ")}`;
}
```

### 4. 数组类型错误

#### ❌ 错误示例

```typescript
let numbers: number[] = [1, 2, "3"]; // Error: Type 'string' is not assignable to type 'number'
```

#### ✅ 解决方案

```typescript
// 方案1：统一类型
let numbers: number[] = [1, 2, 3];

// 方案2：联合类型数组
let mixed: (number | string)[] = [1, 2, "3"];

// 方案3：转换类型
let numbers: number[] = [1, 2, parseInt("3")];
```

## 🔧 调试技巧

### 1. 使用 TypeScript 编译器检查

```bash
# 只检查类型，不生成文件
npx tsc filename.ts --noEmit

# 显示详细错误信息
npx tsc filename.ts --noEmit --pretty

# 检查整个项目
npx tsc --noEmit
```

### 2. 在 VS Code 中调试

1. **查看类型信息**：鼠标悬停在变量上
2. **查看错误详情**：点击红色波浪线查看完整错误信息
3. **使用快捷键**：
    - `F12`：跳转到定义
    - `Shift + F12`：查看所有引用
    - `Ctrl + Space`：代码自动完成

### 3. 渐进式类型添加

```typescript
// 第一步：允许 any 类型（临时）
let userData: any = getUserData();

// 第二步：逐步添加类型
interface User {
    id: number;
    name: string;
    // email?: string; // 先注释可选属性
}

// 第三步：完善类型定义
interface User {
    id: number;
    name: string;
    email?: string; // 添加回可选属性
    createdAt: Date;
}
```

## 🚀 预防错误的最佳实践

### 1. 从简单开始

```typescript
// ✅ 好的做法：先写简单类型
let name: string = "张三";

// ❌ 避免：一开始就写复杂类型
// let user: { name: string; profile: { age: number; skills: string[] } } = ...
```

### 2. 使用类型推断

```typescript
// ✅ 让 TypeScript 推断类型
let count = 0; // 自动推断为 number
let items = ["a", "b", "c"]; // 自动推断为 string[]

// 只在必要时显式声明类型
let result: string | null = getData();
```

### 3. 启用严格模式逐步

```json
// tsconfig.json - 初学者配置
{
    "compilerOptions": {
        "strict": false,
        "noImplicitAny": true // 先启用这一个
    }
}
```

## 📞 获取帮助

### 1. 阅读错误信息

- TypeScript 错误信息通常很详细
- 关注错误码（如 TS2322）可以搜索具体解决方案

### 2. 在线资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play) - 在线测试代码
- Stack Overflow 搜索具体错误信息

### 3. 社区支持

- GitHub Issues
- TypeScript Discord 社区
- 中文 TypeScript 社区

---

记住：**错误是学习的一部分！** 每个错误都能帮助你更好地理解 TypeScript 的类型系统。
