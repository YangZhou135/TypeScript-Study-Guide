"use strict";
/**
 * 第1章：TypeScript 基础语法示例
 *
 * 本文件包含了 TypeScript 基础语法的实际代码示例
 * 每个示例都有详细的注释说明
 */
// ============================================================================
// 1. 基础类型示例
// ============================================================================
console.log("=== 基础类型示例 ===");
// 字符串类型
let userName = "张三";
let greeting = `你好，${userName}！`;
console.log(greeting);
// 数字类型
let age = 25;
let salary = 8500.5;
let hexNumber = 0xff; // 十六进制
console.log(`年龄: ${age}, 薪资: ${salary}, 十六进制数: ${hexNumber}`);
// 布尔类型
let isEmployed = true;
let hasExperience = age > 22;
console.log(`是否就业: ${isEmployed}, 是否有经验: ${hasExperience}`);
// ============================================================================
// 2. 数组类型示例
// ============================================================================
console.log("\n=== 数组类型示例 ===");
// 数字数组
let scores = [85, 92, 78, 96, 88];
let averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
console.log(`成绩: [${scores.join(", ")}], 平均分: ${averageScore.toFixed(2)}`);
// 字符串数组
let hobbies = ["编程", "阅读", "旅行"];
let hobbyList = hobbies.join("、");
console.log(`爱好: ${hobbyList}`);
// 使用 Array<T> 语法
let cities = ["北京", "上海", "深圳", "杭州"];
console.log(`城市列表: ${cities.join(" -> ")}`);
// ============================================================================
// 3. 函数类型示例
// ============================================================================
console.log("\n=== 函数类型示例 ===");
// 基础函数
function calculateArea(width, height) {
    return width * height;
}
let area = calculateArea(10, 20);
console.log(`矩形面积: ${area}`);
// 可选参数函数
function formatName(firstName, lastName) {
    if (lastName) {
        return `${lastName} ${firstName}`;
    }
    return firstName;
}
console.log(`格式化姓名1: ${formatName("小明")}`);
console.log(`格式化姓名2: ${formatName("小明", "张")}`);
// 默认参数函数
function createMessage(content, prefix = "[INFO]") {
    return `${prefix} ${content}`;
}
console.log(createMessage("系统启动成功"));
console.log(createMessage("用户登录", "[USER]"));
// 箭头函数
const multiply = (x, y) => x * y;
const divide = (x, y) => {
    if (y === 0) {
        throw new Error("除数不能为零");
    }
    return x / y;
};
console.log(`乘法: 6 * 7 = ${multiply(6, 7)}`);
console.log(`除法: 15 / 3 = ${divide(15, 3)}`);
// ============================================================================
// 4. 对象类型示例
// ============================================================================
console.log("\n=== 对象类型示例 ===");
// 基础对象类型
let employee = {
    id: 1001,
    name: "李四",
    department: "技术部",
    salary: 12000,
};
console.log(
    `员工信息: ${employee.name} (${employee.id}) - ${employee.department} - ¥${employee.salary}`
);
// 包含可选属性的对象
let product = {
    name: "MacBook Pro",
    price: 15999,
    inStock: true,
};
// 添加可选属性
product.description = "苹果笔记本电脑，适合开发者使用";
console.log(`产品: ${product.name} - ¥${product.price}`);
console.log(`描述: ${product.description || "暂无描述"}`);
console.log(`库存状态: ${product.inStock ? "有货" : "缺货"}`);
// ============================================================================
// 5. 实际应用示例：用户管理系统
// ============================================================================
console.log("\n=== 实际应用示例：用户管理系统 ===");
// 用户对象类型
let users = [
    { id: 1, username: "zhangsan", email: "zhangsan@example.com", age: 25, isActive: true },
    { id: 2, username: "lisi", email: "lisi@example.com", age: 30, isActive: false },
    { id: 3, username: "wangwu", email: "wangwu@example.com", age: 28, isActive: true },
];
// 查找用户函数
function findUserById(users, id) {
    return users.find((user) => user.id === id);
}
// 获取活跃用户函数
function getActiveUsers(users) {
    return users.filter((user) => user.isActive);
}
// 计算平均年龄函数
function calculateAverageAge(users) {
    if (users.length === 0) return 0;
    const totalAge = users.reduce((sum, user) => sum + user.age, 0);
    return totalAge / users.length;
}
// 测试函数
let foundUser = findUserById(users, 2);
console.log(`查找用户 ID=2:`, foundUser ? `${foundUser.username} (${foundUser.email})` : "未找到");
let activeUsers = getActiveUsers(users);
console.log(`活跃用户数量: ${activeUsers.length}`);
activeUsers.forEach((user) => {
    console.log(`  - ${user.username} (${user.age}岁)`);
});
let avgAge = calculateAverageAge(users);
console.log(`用户平均年龄: ${avgAge.toFixed(1)}岁`);
// ============================================================================
// 6. 类型推断示例
// ============================================================================
console.log("\n=== 类型推断示例 ===");
// TypeScript 可以自动推断类型
let autoString = "这是自动推断的字符串类型"; // 推断为 string
let autoNumber = 42; // 推断为 number
let autoBoolean = true; // 推断为 boolean
let autoArray = [1, 2, 3]; // 推断为 number[]
console.log(`自动推断的类型演示:`);
console.log(`字符串: ${autoString}`);
console.log(`数字: ${autoNumber}`);
console.log(`布尔值: ${autoBoolean}`);
console.log(`数组: [${autoArray.join(", ")}]`);
// 函数返回值类型推断
function getRandomNumber() {
    return Math.floor(Math.random() * 100);
}
let randomNum = getRandomNumber(); // 自动推断为 number
console.log(`随机数: ${randomNum}`);
console.log("\n=== 第1章示例代码执行完成 ===");
//# sourceMappingURL=examples.js.map
