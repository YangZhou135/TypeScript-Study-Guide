/**
 * 第2章：TypeScript 类型系统示例
 *
 * 本文件展示了 TypeScript 类型系统的各种特性
 * 包括类型别名、接口、联合类型、交叉类型等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. 类型别名 (Type Aliases)
// ============================================================================

console.log('=== 类型别名示例 ===');

// 基础类型别名
type UserID = number;
type UserName = string;
type Email = string;

// 对象类型别名
type User = {
    id: UserID;
    name: UserName;
    email: Email;
    age: number;
    isActive: boolean;
};

// 函数类型别名
type EventHandler = (event: string, data?: any) => void;
type Validator = (value: string) => boolean;

// 使用类型别名
let currentUser: User = {
    id: 1001,
    name: "张三",
    email: "zhangsan@example.com",
    age: 28,
    isActive: true
};

let clickHandler: EventHandler = (event: string, data?: any) => {
    console.log(`处理事件: ${event}`, data ? `数据: ${JSON.stringify(data)}` : '');
};

let emailValidator: Validator = (email: string): boolean => {
    return email.includes('@') && email.includes('.');
};

console.log('用户信息:', currentUser);
clickHandler('click', { button: 'left', x: 100, y: 200 });
console.log('邮箱验证结果:', emailValidator(currentUser.email));

// ============================================================================
// 2. 接口 (Interfaces)
// ============================================================================

console.log('\n=== 接口示例 ===');

// 基础接口
interface ProductInterface {
    id: number;
    name: string;
    price: number;
    description?: string; // 可选属性
    readonly category: string; // 只读属性
    inStock: boolean;
    rating: number;
}

// 接口继承
interface ElectronicProduct extends ProductInterface {
    warranty: number; // 保修期（月）
    brand: string;
    powerConsumption?: number; // 功耗（瓦特）
}

// 函数接口
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
}

// 实现接口
let laptop: ElectronicProduct = {
    id: 2001,
    name: "MacBook Pro",
    price: 15999,
    category: "笔记本电脑", // 只读属性，初始化后不能修改
    inStock: true,
    rating: 4.8,
    warranty: 12,
    brand: "Apple",
    description: "专业级笔记本电脑",
    powerConsumption: 65
};

let basicCalculator: Calculator = {
    add: (a: number, b: number): number => a + b,
    subtract: (a: number, b: number): number => a - b,
    multiply: (a: number, b: number): number => a * b,
    divide: (a: number, b: number): number => {
        if (b === 0) throw new Error("除数不能为零");
        return a / b;
    }
};

console.log('笔记本信息:', laptop);
console.log('计算结果:', {
    add: basicCalculator.add(10, 5),
    subtract: basicCalculator.subtract(10, 5),
    multiply: basicCalculator.multiply(10, 5),
    divide: basicCalculator.divide(10, 5)
});

// ============================================================================
// 3. 联合类型 (Union Types)
// ============================================================================

console.log('\n=== 联合类型示例 ===');

// 字符串字面量联合类型
type Status = "pending" | "success" | "error" | "cancelled";
type Theme = "light" | "dark" | "auto";
type Size = "small" | "medium" | "large";

// 基础类型联合
type ID = string | number;
type ApiResponse = string | number | boolean | null;

// 对象联合类型
type PaymentMethod = 
    | { type: "credit_card"; cardNumber: string; expiryDate: string }
    | { type: "paypal"; email: string }
    | { type: "bank_transfer"; accountNumber: string; routingNumber: string };

// 处理联合类型的函数
function processStatus(status: Status): string {
    switch (status) {
        case "pending":
            return "⏳ 处理中...";
        case "success":
            return "✅ 成功完成";
        case "error":
            return "❌ 处理失败";
        case "cancelled":
            return "🚫 已取消";
        default:
            // TypeScript 会检查是否处理了所有情况
            const exhaustiveCheck: never = status;
            return exhaustiveCheck;
    }
}

function formatID(id: ID): string {
    if (typeof id === "string") {
        return `ID: ${id.toUpperCase()}`;
    } else {
        return `ID: ${id.toString().padStart(6, '0')}`;
    }
}

function processPayment(method: PaymentMethod): string {
    switch (method.type) {
        case "credit_card":
            return `信用卡支付: ****${method.cardNumber.slice(-4)}`;
        case "paypal":
            return `PayPal支付: ${method.email}`;
        case "bank_transfer":
            return `银行转账: ${method.accountNumber}`;
        default:
            const exhaustiveCheck: never = method;
            return exhaustiveCheck;
    }
}

// 测试联合类型
let currentStatus: Status = "success";
let userId: ID = "USER_12345";
let numericId: ID = 67890;

let payment1: PaymentMethod = {
    type: "credit_card",
    cardNumber: "1234567890123456",
    expiryDate: "12/25"
};

let payment2: PaymentMethod = {
    type: "paypal",
    email: "user@example.com"
};

console.log('状态处理:', processStatus(currentStatus));
console.log('ID格式化:', formatID(userId), '|', formatID(numericId));
console.log('支付方式:', processPayment(payment1));
console.log('支付方式:', processPayment(payment2));

// ============================================================================
// 4. 交叉类型 (Intersection Types)
// ============================================================================

console.log('\n=== 交叉类型示例 ===');

// 基础类型定义
type Person = {
    name: string;
    age: number;
    email: string;
};

type Employee = {
    employeeId: string;
    department: string;
    salary: number;
    startDate: Date;
};

type Manager = {
    teamSize: number;
    budget: number;
};

// 交叉类型组合
type Staff = Person & Employee; // 员工 = 个人信息 + 员工信息
type TeamLead = Person & Employee & Manager; // 团队负责人 = 个人 + 员工 + 管理者

// 使用交叉类型
let developer: Staff = {
    // Person 属性
    name: "李四",
    age: 30,
    email: "lisi@company.com",
    // Employee 属性
    employeeId: "EMP001",
    department: "技术部",
    salary: 15000,
    startDate: new Date("2022-01-15")
};

let teamLeader: TeamLead = {
    // Person 属性
    name: "王五",
    age: 35,
    email: "wangwu@company.com",
    // Employee 属性
    employeeId: "EMP002",
    department: "技术部",
    salary: 25000,
    startDate: new Date("2020-03-01"),
    // Manager 属性
    teamSize: 8,
    budget: 500000
};

console.log('开发者信息:', {
    name: developer.name,
    department: developer.department,
    salary: developer.salary
});

console.log('团队负责人信息:', {
    name: teamLeader.name,
    department: teamLeader.department,
    teamSize: teamLeader.teamSize,
    budget: teamLeader.budget
});

// ============================================================================
// 5. 类型断言 (Type Assertions)
// ============================================================================

console.log('\n=== 类型断言示例 ===');

// 从 unknown 类型断言
let userInput: unknown = '{"name": "张三", "age": 25}';

// 使用 as 语法进行类型断言
let userJson = userInput as string;
let userData = JSON.parse(userJson) as { name: string; age: number };

console.log('解析的用户数据:', userData);

// DOM 元素类型断言（在浏览器环境中）
// let inputElement = document.getElementById('username') as HTMLInputElement;
// inputElement.value = 'default value';

// 非空断言操作符 (!)
function findUserById(id: number): User | undefined {
    // 模拟查找用户
    if (id === 1001) {
        return currentUser;
    }
    return undefined;
}

let foundUser = findUserById(1001);
// 如果我们确定用户存在，可以使用非空断言
let userName = foundUser!.name; // 告诉 TypeScript foundUser 不是 undefined

console.log('找到的用户名:', userName);

// ============================================================================
// 6. 类型守卫 (Type Guards)
// ============================================================================

console.log('\n=== 类型守卫示例 ===');

// 自定义类型守卫
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

function isUser(obj: any): obj is User {
    return obj && 
           typeof obj.id === "number" &&
           typeof obj.name === "string" &&
           typeof obj.email === "string" &&
           typeof obj.age === "number" &&
           typeof obj.isActive === "boolean";
}

// 使用类型守卫
function processValue(value: unknown): string {
    if (isString(value)) {
        // TypeScript 知道这里 value 是 string
        return `字符串: ${value.toUpperCase()}`;
    } else if (isNumber(value)) {
        // TypeScript 知道这里 value 是 number
        return `数字: ${value.toFixed(2)}`;
    } else {
        return `未知类型: ${typeof value}`;
    }
}

function processUserData(data: unknown): string {
    if (isUser(data)) {
        // TypeScript 知道这里 data 是 User 类型
        return `用户: ${data.name} (${data.age}岁) - ${data.email}`;
    } else {
        return "无效的用户数据";
    }
}

// 测试类型守卫
console.log(processValue("hello world"));
console.log(processValue(123.456));
console.log(processValue(true));

console.log(processUserData(currentUser));
console.log(processUserData({ name: "无效用户" }));

// in 操作符类型守卫
function processPaymentWithGuard(method: PaymentMethod): string {
    if ("cardNumber" in method) {
        // TypeScript 知道这是 credit_card 类型
        return `信用卡: ${method.cardNumber}`;
    } else if ("email" in method) {
        // TypeScript 知道这是 paypal 类型
        return `PayPal: ${method.email}`;
    } else {
        // TypeScript 知道这是 bank_transfer 类型
        return `银行转账: ${method.accountNumber}`;
    }
}

console.log(processPaymentWithGuard(payment1));

console.log('\n=== 第2章示例代码执行完成 ===');
