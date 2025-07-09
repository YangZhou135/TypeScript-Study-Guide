"use strict";
/**
 * 第2章：TypeScript 类型系统示例
 *
 * 本文件展示了 TypeScript 类型系统的各种特性
 * 包括类型别名、接口、联合类型、交叉类型等
 */
// ============================================================================
// 1. 类型别名 (Type Aliases)
// ============================================================================
console.log("=== 类型别名示例 ===");
// 使用类型别名
let currentUser = {
    id: 1001,
    name: "张三",
    email: "zhangsan@example.com",
    age: 28,
    isActive: true,
};
let clickHandler = (event, data) => {
    console.log(`处理事件: ${event}`, data ? `数据: ${JSON.stringify(data)}` : "");
};
let emailValidator = (email) => {
    return email.includes("@") && email.includes(".");
};
console.log("用户信息:", currentUser);
clickHandler("click", { button: "left", x: 100, y: 200 });
console.log("邮箱验证结果:", emailValidator(currentUser.email));
// ============================================================================
// 2. 接口 (Interfaces)
// ============================================================================
console.log("\n=== 接口示例 ===");
// 实现接口
let laptop = {
    id: 2001,
    name: "MacBook Pro",
    price: 15999,
    category: "笔记本电脑", // 只读属性，初始化后不能修改
    warranty: 12,
    brand: "Apple",
    description: "专业级笔记本电脑",
    powerConsumption: 65,
};
let basicCalculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => {
        if (b === 0) throw new Error("除数不能为零");
        return a / b;
    },
};
console.log("笔记本信息:", laptop);
console.log("计算结果:", {
    add: basicCalculator.add(10, 5),
    subtract: basicCalculator.subtract(10, 5),
    multiply: basicCalculator.multiply(10, 5),
    divide: basicCalculator.divide(10, 5),
});
// ============================================================================
// 3. 联合类型 (Union Types)
// ============================================================================
console.log("\n=== 联合类型示例 ===");
// 处理联合类型的函数
function processStatus(status) {
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
            const exhaustiveCheck = status;
            return exhaustiveCheck;
    }
}
function formatID(id) {
    if (typeof id === "string") {
        return `ID: ${id.toUpperCase()}`;
    } else {
        return `ID: ${id.toString().padStart(6, "0")}`;
    }
}
function processPayment(method) {
    switch (method.type) {
        case "credit_card":
            return `信用卡支付: ****${method.cardNumber.slice(-4)}`;
        case "paypal":
            return `PayPal支付: ${method.email}`;
        case "bank_transfer":
            return `银行转账: ${method.accountNumber}`;
        default:
            const exhaustiveCheck = method;
            return exhaustiveCheck;
    }
}
// 测试联合类型
let currentStatus = "success";
let userId = "USER_12345";
let numericId = 67890;
let payment1 = {
    type: "credit_card",
    cardNumber: "1234567890123456",
    expiryDate: "12/25",
};
let payment2 = {
    type: "paypal",
    email: "user@example.com",
};
console.log("状态处理:", processStatus(currentStatus));
console.log("ID格式化:", formatID(userId), "|", formatID(numericId));
console.log("支付方式:", processPayment(payment1));
console.log("支付方式:", processPayment(payment2));
// ============================================================================
// 4. 交叉类型 (Intersection Types)
// ============================================================================
console.log("\n=== 交叉类型示例 ===");
// 使用交叉类型
let developer = {
    // Person 属性
    name: "李四",
    age: 30,
    email: "lisi@company.com",
    // Employee 属性
    employeeId: "EMP001",
    department: "技术部",
    salary: 15000,
    startDate: new Date("2022-01-15"),
};
let teamLeader = {
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
    budget: 500000,
};
console.log("开发者信息:", {
    name: developer.name,
    department: developer.department,
    salary: developer.salary,
});
console.log("团队负责人信息:", {
    name: teamLeader.name,
    department: teamLeader.department,
    teamSize: teamLeader.teamSize,
    budget: teamLeader.budget,
});
// ============================================================================
// 5. 类型断言 (Type Assertions)
// ============================================================================
console.log("\n=== 类型断言示例 ===");
// 从 unknown 类型断言
let userInput = '{"name": "张三", "age": 25}';
// 使用 as 语法进行类型断言
let userJson = userInput;
let userData = JSON.parse(userJson);
console.log("解析的用户数据:", userData);
// DOM 元素类型断言（在浏览器环境中）
// let inputElement = document.getElementById('username') as HTMLInputElement;
// inputElement.value = 'default value';
// 非空断言操作符 (!)
function findUserById(id) {
    // 模拟查找用户
    if (id === 1001) {
        return currentUser;
    }
    return undefined;
}
let foundUser = findUserById(1001);
// 如果我们确定用户存在，可以使用非空断言
let userName = foundUser.name; // 告诉 TypeScript foundUser 不是 undefined
console.log("找到的用户名:", userName);
// ============================================================================
// 6. 类型守卫 (Type Guards)
// ============================================================================
console.log("\n=== 类型守卫示例 ===");
// 自定义类型守卫
function isString(value) {
    return typeof value === "string";
}
function isNumber(value) {
    return typeof value === "number";
}
function isUser(obj) {
    return (
        obj &&
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.email === "string" &&
        typeof obj.age === "number" &&
        typeof obj.isActive === "boolean"
    );
}
// 使用类型守卫
function processValue(value) {
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
function processUserData(data) {
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
function processPaymentWithGuard(method) {
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
console.log("\n=== 第2章示例代码执行完成 ===");
//# sourceMappingURL=examples.js.map
