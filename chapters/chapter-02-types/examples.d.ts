/**
 * 第2章：TypeScript 类型系统示例
 *
 * 本文件展示了 TypeScript 类型系统的各种特性
 * 包括类型别名、接口、联合类型、交叉类型等
 */
type UserID = number;
type UserName = string;
type Email = string;
type User = {
    id: UserID;
    name: UserName;
    email: Email;
    age: number;
    isActive: boolean;
};
type EventHandler = (event: string, data?: any) => void;
type Validator = (value: string) => boolean;
declare let currentUser: User;
declare let clickHandler: EventHandler;
declare let emailValidator: Validator;
interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    readonly category: string;
}
interface ElectronicProduct extends Product {
    warranty: number;
    brand: string;
    powerConsumption?: number;
}
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
}
declare let laptop: ElectronicProduct;
declare let basicCalculator: Calculator;
type Status = "pending" | "success" | "error" | "cancelled";
type Theme = "light" | "dark" | "auto";
type Size = "small" | "medium" | "large";
type ID = string | number;
type Response = string | number | boolean | null;
type PaymentMethod = {
    type: "credit_card";
    cardNumber: string;
    expiryDate: string;
} | {
    type: "paypal";
    email: string;
} | {
    type: "bank_transfer";
    accountNumber: string;
    routingNumber: string;
};
declare function processStatus(status: Status): string;
declare function formatID(id: ID): string;
declare function processPayment(method: PaymentMethod): string;
declare let currentStatus: Status;
declare let userId: ID;
declare let numericId: ID;
declare let payment1: PaymentMethod;
declare let payment2: PaymentMethod;
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
type Staff = Person & Employee;
type TeamLead = Person & Employee & Manager;
declare let developer: Staff;
declare let teamLeader: TeamLead;
declare let userInput: unknown;
declare let userJson: string;
declare let userData: {
    name: string;
    age: number;
};
declare let foundUser: User | undefined;
declare let userName: any;
declare function isString(value: unknown): value is string;
declare function isNumber(value: unknown): value is number;
declare function isUser(obj: any): obj is User;
declare function processValue(value: unknown): string;
declare function processUserData(data: unknown): string;
declare function processPaymentWithGuard(method: PaymentMethod): string;
//# sourceMappingURL=examples.d.ts.map