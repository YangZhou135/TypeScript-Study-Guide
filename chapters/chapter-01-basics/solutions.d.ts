/**
 * 第1章：TypeScript 基础语法练习题解答
 *
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 对比你的答案，看看类型声明是否正确
 */
declare let studentName: string;
declare let studentAge: number;
declare let isGraduated: boolean;
declare let gpa: number;
declare let subjects: string[];
declare let grades: number[];
declare let passedExams: boolean[];
declare const getFullName: (firstName: string, lastName: string) => string;
declare let total: number;
declare let studentInfo1: string;
declare let studentInfo2: string;
declare let fullName: string;
declare let course: {
    name: string;
    credits: number;
    difficulty: string;
};
declare let book: {
    title: string;
    author: string;
    pages: number;
    price: number;
    isAvailable: boolean;
};
declare let course1: {
    id: number;
    name: string;
    instructor: string;
    duration: number;
    description?: string;
};
declare let course2: {
    id: number;
    name: string;
    instructor: string;
    duration: number;
    description?: string;
};
type Student = {
    id: number;
    name: string;
    age: number;
    major: string;
    gpa: number;
    isActive: boolean;
};
declare let students: Student[];
declare let foundStudent: Student | undefined;
declare let activeStudents: Student[];
declare let averageGPA: number;
declare let csStudents: Student[];
type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    rating: number;
    description?: string;
};
type CartItem = {
    product: Product;
    quantity: number;
    addedAt: Date;
};
declare let product1: Product;
declare let product2: Product;
declare let cartItem1: CartItem;
declare let cartItem2: CartItem;
declare let shoppingCart: CartItem[];
declare let cartTotal: number;
declare let availableItems: CartItem[];
//# sourceMappingURL=solutions.d.ts.map