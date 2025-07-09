/**
 * 第1章：TypeScript 基础语法练习题
 *
 * 请完成以下练习题，为代码添加正确的类型声明
 * 完成后可以运行 `npx tsc practice.ts` 检查是否有类型错误
 */
declare let studentName: string;
declare let studentAge: number;
declare let isGraduated: boolean;
declare let gpa: number;
declare let subjects: string[];
declare let grades: number[];
declare let passedExams: boolean[];
declare const getFullName: (firstName: any, lastName: any) => string;
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
};
declare let course2: {
    id: number;
    name: string;
    instructor: string;
    duration: number;
    description: string;
};
declare let students: {
    id: number;
    name: string;
    age: number;
    major: string;
    gpa: number;
    isActive: boolean;
}[];
declare let foundStudent: Student | undefined;
declare let activeStudents: Student[];
declare let averageGPA: number;
declare let csStudents: Student[];
declare let product1: {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    rating: number;
};
declare let product2: {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    rating: number;
    description: string;
};
declare let cartItem1: {
    product: {
        id: number;
        name: string;
        price: number;
        category: string;
        inStock: boolean;
        rating: number;
    };
    quantity: number;
    addedAt: Date;
};
declare let cartItem2: {
    product: {
        id: number;
        name: string;
        price: number;
        category: string;
        inStock: boolean;
        rating: number;
        description: string;
    };
    quantity: number;
    addedAt: Date;
};
declare let shoppingCart: {
    product: {
        id: number;
        name: string;
        price: number;
        category: string;
        inStock: boolean;
        rating: number;
    };
    quantity: number;
    addedAt: Date;
}[];
declare let cartTotal: any;
declare let availableItems: any;
//# sourceMappingURL=practice.d.ts.map