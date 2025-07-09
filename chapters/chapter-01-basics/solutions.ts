/**
 * 第1章：TypeScript 基础语法练习题解答
 *
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 对比你的答案，看看类型声明是否正确
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：基础类型声明 - 解答
// ============================================================================

console.log("=== 练习1：基础类型声明 - 解答 ===");

// 基础类型声明
const studentName: string = "王小明";
const studentAge: number = 20;
const isGraduated: boolean = false;
const gpa: number = 3.85;

// 数组类型声明
const subjects: string[] = ["数学", "英语", "计算机科学"];
const grades: number[] = [85, 92, 78, 96];
const passedExams: boolean[] = [true, true, false, true];

console.log(`学生: ${studentName}, 年龄: ${studentAge}, 已毕业: ${isGraduated}, GPA: ${gpa}`);
console.log(`科目: ${subjects.join(", ")}`);
console.log(`成绩: ${grades.join(", ")}`);

// ============================================================================
// 练习2：函数类型声明 - 解答
// ============================================================================

console.log("\n=== 练习2：函数类型声明 - 解答 ===");

// 基础函数类型
function calculateTotal(price: number, quantity: number, discount: number): number {
    return price * quantity * (1 - discount);
}

// 包含可选参数的函数
function formatStudentInfo(name: string, age: number, grade?: string): string {
    if (grade) {
        return `${name} (${age}岁) - ${grade}年级`;
    }
    return `${name} (${age}岁)`;
}

// 箭头函数类型
const getFullName = (firstName: string, lastName: string): string => `${firstName} ${lastName}`;

// 包含默认参数的函数
function createCourse(
    name: string,
    credits: number,
    difficulty: string = "中等"
): { name: string; credits: number; difficulty: string } {
    return {
        name: name,
        credits: credits,
        difficulty: difficulty,
    };
}

// 测试函数
const total: number = calculateTotal(100, 2, 0.1);
const studentInfo1: string = formatStudentInfo("张三", 18, "高三");
const studentInfo2: string = formatStudentInfo("李四", 20);
const fullName: string = getFullName("王", "小明");
const course: { name: string; credits: number; difficulty: string } = createCourse(
    "TypeScript入门",
    3
);

console.log(`总价: ¥${total}`);
console.log(`学生信息1: ${studentInfo1}`);
console.log(`学生信息2: ${studentInfo2}`);
console.log(`全名: ${fullName}`);
console.log(`课程:`, course);

// ============================================================================
// 练习3：对象类型声明 - 解答
// ============================================================================

console.log("\n=== 练习3：对象类型声明 - 解答 ===");

// 基础对象类型
const book: {
    title: string;
    author: string;
    pages: number;
    price: number;
    isAvailable: boolean;
} = {
    title: "TypeScript 实战指南",
    author: "张三",
    pages: 350,
    price: 89.9,
    isAvailable: true,
};

// 包含可选属性的对象类型
const course1: {
    id: number;
    name: string;
    instructor: string;
    duration: number;
    description?: string;
} = {
    id: 1,
    name: "JavaScript 基础",
    instructor: "李老师",
    duration: 40,
};

const course2: {
    id: number;
    name: string;
    instructor: string;
    duration: number;
    description?: string;
} = {
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
// 练习4：数组和对象组合 - 解答
// ============================================================================

console.log("\n=== 练习4：数组和对象组合 - 解答 ===");

// 学生对象类型定义
type Student = {
    id: number;
    name: string;
    age: number;
    major: string;
    gpa: number;
    isActive: boolean;
};

// 学生数组类型声明
const students: Student[] = [
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

// 函数类型声明
function findStudentById(students: Student[], id: number): Student | undefined {
    return students.find((student) => student.id === id);
}

function getActiveStudents(students: Student[]): Student[] {
    return students.filter((student) => student.isActive);
}

function calculateAverageGPA(students: Student[]): number {
    if (students.length === 0) return 0;
    const totalGPA: number = students.reduce((sum, student) => sum + student.gpa, 0);
    return totalGPA / students.length;
}

function getStudentsByMajor(students: Student[], major: string): Student[] {
    return students.filter((student) => student.major === major);
}

// 测试函数
const foundStudent: Student | undefined = findStudentById(students, 2);
const activeStudents: Student[] = getActiveStudents(students);
const averageGPA: number = calculateAverageGPA(students);
const csStudents: Student[] = getStudentsByMajor(students, "计算机科学");

console.log(`找到的学生:`, foundStudent ? foundStudent.name : "未找到");
console.log(`活跃学生数量: ${activeStudents.length}`);
console.log(`平均GPA: ${averageGPA.toFixed(2)}`);
console.log(`计算机科学专业学生数量: ${csStudents.length}`);

// ============================================================================
// 练习5：实际场景应用 - 解答
// ============================================================================

console.log("\n=== 练习5：实际场景应用 - 解答 ===");

// 商品类型定义
type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    rating: number;
    description?: string;
};

// 购物车项目类型定义
type CartItem = {
    product: Product;
    quantity: number;
    addedAt: Date;
};

// 商品对象
const product1: Product = {
    id: 1,
    name: "iPhone 14",
    price: 6999,
    category: "电子产品",
    inStock: true,
    rating: 4.8,
};

const product2: Product = {
    id: 2,
    name: "MacBook Pro",
    price: 15999,
    category: "电子产品",
    inStock: false,
    rating: 4.9,
    description: "专业级笔记本电脑",
};

// 购物车项目
const cartItem1: CartItem = {
    product: product1,
    quantity: 2,
    addedAt: new Date(),
};

const cartItem2: CartItem = {
    product: product2,
    quantity: 1,
    addedAt: new Date(),
};

// 购物车
const shoppingCart: CartItem[] = [cartItem1, cartItem2];

// 购物车函数类型声明
function addToCart(cart: CartItem[], product: Product, quantity: number): CartItem[] {
    const existingItem: CartItem | undefined = cart.find((item) => item.product.id === product.id);
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

function calculateCartTotal(cart: CartItem[]): number {
    return cart.reduce((total: number, item: CartItem) => {
        return total + item.product.price * item.quantity;
    }, 0);
}

function getAvailableItems(cart: CartItem[]): CartItem[] {
    return cart.filter((item: CartItem) => item.product.inStock);
}

// 测试购物车功能
const cartTotal: number = calculateCartTotal(shoppingCart);
const availableItems: CartItem[] = getAvailableItems(shoppingCart);

console.log(`购物车总价: ¥${cartTotal}`);
console.log(`可购买商品数量: ${availableItems.length}`);

console.log("\n=== 解答完成！ ===");
console.log("💡 学习要点:");
console.log("1. 基础类型: string, number, boolean, array");
console.log("2. 函数类型: 参数类型、返回值类型、可选参数、默认参数");
console.log("3. 对象类型: 属性类型、可选属性");
console.log("4. 类型别名: 使用 type 关键字定义复杂类型");
console.log("5. 联合类型: 使用 | 表示多种可能的类型");
