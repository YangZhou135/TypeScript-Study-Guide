/**
 * 第1章：TypeScript 基础语法示例
 *
 * 本文件包含了 TypeScript 基础语法的实际代码示例
 * 每个示例都有详细的注释说明
 */
declare let userName: string;
declare let greeting: string;
declare let age: number;
declare let salary: number;
declare let hexNumber: number;
declare let isEmployed: boolean;
declare let hasExperience: boolean;
declare let scores: number[];
declare let averageScore: number;
declare let hobbies: string[];
declare let hobbyList: string;
declare let cities: Array<string>;
declare function calculateArea(width: number, height: number): number;
declare let area: number;
declare function formatName(firstName: string, lastName?: string): string;
declare function createMessage(content: string, prefix?: string): string;
declare const multiply: (x: number, y: number) => number;
declare const divide: (x: number, y: number) => number;
declare let employee: {
    id: number;
    name: string;
    department: string;
    salary: number;
};
declare let product: {
    name: string;
    price: number;
    description?: string;
    inStock: boolean;
};
declare let users: Array<{
    id: number;
    username: string;
    email: string;
    age: number;
    isActive: boolean;
}>;
declare function getActiveUsers(
    users: Array<{
        id: number;
        username: string;
        email: string;
        age: number;
        isActive: boolean;
    }>
): Array<{
    id: number;
    username: string;
    email: string;
    age: number;
    isActive: boolean;
}>;
declare function calculateAverageAge(
    users: Array<{
        id: number;
        username: string;
        email: string;
        age: number;
        isActive: boolean;
    }>
): number;
declare let foundUser:
    | {
          id: number;
          username: string;
          email: string;
          age: number;
          isActive: boolean;
      }
    | undefined;
declare let activeUsers: {
    id: number;
    username: string;
    email: string;
    age: number;
    isActive: boolean;
}[];
declare let avgAge: number;
declare let autoString: string;
declare let autoNumber: number;
declare let autoBoolean: boolean;
declare let autoArray: number[];
declare function getRandomNumber(): number;
declare let randomNum: number;
//# sourceMappingURL=examples.d.ts.map
