"use strict";
/**
 * 第1章：TypeScript 基础语法练习题
 *
 * 请完成以下练习题，为代码添加正确的类型声明
 * 完成后可以运行 `npx tsc practice.ts` 检查是否有类型错误
 */
// ============================================================================
// 练习1：基础类型声明
// ============================================================================
console.log("=== 练习1：基础类型声明 ===");
// TODO: 为以下变量添加正确的类型声明
let studentName = "王小明";
let studentAge = 20;
let isGraduated = false;
let gpa = 3.85;
// TODO: 为以下数组添加类型声明
let subjects = ["数学", "英语", "计算机科学"];
let grades = [85, 92, 78, 96];
let passedExams = [true, true, false, true];
console.log(`学生: ${studentName}, 年龄: ${studentAge}, 已毕业: ${isGraduated}, GPA: ${gpa}`);
console.log(`科目: ${subjects.join(", ")}`);
console.log(`成绩: ${grades.join(", ")}`);
// ============================================================================
// 练习2：函数类型声明
// ============================================================================
console.log("\n=== 练习2：函数类型声明 ===");
// TODO: 为以下函数添加参数类型和返回值类型
function calculateTotal(price, quantity, discount) {
    return price * quantity * (1 - discount);
}
// TODO: 为以下函数添加类型，包括可选参数
function formatStudentInfo(name, age, grade) {
    if (grade) {
        return `${name} (${age}岁) - ${grade}年级`;
    }
    return `${name} (${age}岁)`;
}
// TODO: 为以下箭头函数添加类型
const getFullName = (firstName, lastName) => `${firstName} ${lastName}`;
// TODO: 为以下函数添加类型，包括默认参数
function createCourse(name, credits, difficulty) {
    return {
        name: name,
        credits: credits,
        difficulty: difficulty,
    };
}
// 测试函数
let total = calculateTotal(100, 2, 0.1);
let studentInfo1 = formatStudentInfo("张三", 18, "高三");
let studentInfo2 = formatStudentInfo("李四", 20);
let fullName = getFullName("王", "小明");
let course = createCourse("TypeScript入门", 3);
console.log(`总价: ¥${total}`);
console.log(`学生信息1: ${studentInfo1}`);
console.log(`学生信息2: ${studentInfo2}`);
console.log(`全名: ${fullName}`);
console.log(`课程:`, course);
// ============================================================================
// 练习3：对象类型声明
// ============================================================================
console.log("\n=== 练习3：对象类型声明 ===");
// TODO: 为以下对象添加类型声明
let book = {
    title: "TypeScript 实战指南",
    author: "张三",
    pages: 350,
    price: 89.9,
    isAvailable: true,
};
// TODO: 为以下对象添加类型声明，包含可选属性
let course1 = {
    id: 1,
    name: "JavaScript 基础",
    instructor: "李老师",
    duration: 40,
};
let course2 = {
    id: 2,
    name: "Vue.js 进阶",
    instructor: "王老师",
    duration: 60,
    description: "深入学习 Vue.js 框架的高级特性",
};
console.log(`书籍: ${book.title} - ${book.author} (${book.pages}页, ¥${book.price})`);
console.log(`课程1: ${course1.name} - ${course1.instructor} (${course1.duration}小时)`);
console.log(`课程2: ${course2.name} - ${course2.instructor} (${course2.duration}小时)`);
// ============================================================================
// 练习4：数组和对象组合
// ============================================================================
console.log("\n=== 练习4：数组和对象组合 ===");
// TODO: 为以下学生数组添加正确的类型声明
let students = [
    {
        id: 1,
        name: "张三",
        age: 20,
        major: "计算机科学",
        gpa: 3.8,
        isActive: true,
    },
    {
        id: 2,
        name: "李四",
        age: 19,
        major: "软件工程",
        gpa: 3.6,
        isActive: false,
    },
    {
        id: 3,
        name: "王五",
        age: 21,
        major: "数据科学",
        gpa: 3.9,
        isActive: true,
    },
];
// TODO: 为以下函数添加类型声明
function findStudentById(students, id) {
    return students.find((student) => student.id === id);
}
function getActiveStudents(students) {
    return students.filter((student) => student.isActive);
}
function calculateAverageGPA(students) {
    if (students.length === 0) return 0;
    const totalGPA = students.reduce((sum, student) => sum + student.gpa, 0);
    return totalGPA / students.length;
}
function getStudentsByMajor(students, major) {
    return students.filter((student) => student.major === major);
}
// 测试函数
let foundStudent = findStudentById(students, 2);
let activeStudents = getActiveStudents(students);
let averageGPA = calculateAverageGPA(students);
let csStudents = getStudentsByMajor(students, "计算机科学");
console.log(`找到的学生:`, foundStudent ? foundStudent.name : "未找到");
console.log(`活跃学生数量: ${activeStudents.length}`);
console.log(`平均GPA: ${averageGPA.toFixed(2)}`);
console.log(`计算机科学专业学生数量: ${csStudents.length}`);
// ============================================================================
// 练习5：实际场景应用
// ============================================================================
console.log("\n=== 练习5：实际场景应用 ===");
// TODO: 为购物车系统添加类型声明
// 商品对象
let product1 = {
    id: 1,
    name: "iPhone 14",
    price: 6999,
    category: "电子产品",
    inStock: true,
    rating: 4.8,
};
let product2 = {
    id: 2,
    name: "MacBook Pro",
    price: 15999,
    category: "电子产品",
    inStock: false,
    rating: 4.9,
    description: "专业级笔记本电脑",
};
// 购物车项目
let cartItem1 = {
    product: product1,
    quantity: 2,
    addedAt: new Date(),
};
let cartItem2 = {
    product: product2,
    quantity: 1,
    addedAt: new Date(),
};
// 购物车
let shoppingCart = [cartItem1, cartItem2];
// TODO: 为以下函数添加类型声明
function addToCart(cart, product, quantity) {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            product: product,
            quantity: quantity,
            addedAt: new Date(),
        });
    }
    return cart;
}
function calculateCartTotal(cart) {
    return cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
}
function getAvailableItems(cart) {
    return cart.filter((item) => item.product.inStock);
}
// 测试购物车功能
let cartTotal = calculateCartTotal(shoppingCart);
let availableItems = getAvailableItems(shoppingCart);
console.log(`购物车总价: ¥${cartTotal}`);
console.log(`可购买商品数量: ${availableItems.length}`);
console.log("\n=== 练习完成！请检查类型声明是否正确 ===");
console.log("运行命令: npx tsc practice.ts --noEmit 来检查类型错误");
//# sourceMappingURL=practice.js.map
