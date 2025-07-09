/**
 * 第3章：从 JavaScript 到 TypeScript 迁移示例
 * 
 * 本文件展示了如何将 JavaScript 代码迁移到 TypeScript
 * 包括渐进式迁移策略、常见问题解决方案等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. 基础迁移示例：从 JavaScript 到 TypeScript
// ============================================================================

console.log('=== 基础迁移示例 ===');

// JavaScript 原代码示例
/*
// user-manager.js (原 JavaScript 代码)
function createUser(name, age, email) {
    return {
        id: Date.now(),
        name: name,
        age: age,
        email: email,
        createdAt: new Date(),
        isActive: true
    };
}

function validateUser(user) {
    if (!user.name || user.name.length < 2) {
        return { valid: false, error: "姓名至少需要2个字符" };
    }
    if (!user.age || user.age < 0 || user.age > 150) {
        return { valid: false, error: "年龄必须在0-150之间" };
    }
    if (!user.email || !user.email.includes('@')) {
        return { valid: false, error: "邮箱格式不正确" };
    }
    return { valid: true };
}

function getUsersByAge(users, minAge, maxAge) {
    return users.filter(user => user.age >= minAge && user.age <= maxAge);
}
*/

// TypeScript 迁移后的代码
interface User {
    id: number;
    name: string;
    age: number;
    email: string;
    createdAt: Date;
    isActive: boolean;
}

interface ValidationResult {
    valid: boolean;
    error?: string;
}

function createUser(name: string, age: number, email: string): User {
    return {
        id: Date.now(),
        name,
        age,
        email,
        createdAt: new Date(),
        isActive: true
    };
}

function validateUser(user: User): ValidationResult {
    if (!user.name || user.name.length < 2) {
        return { valid: false, error: "姓名至少需要2个字符" };
    }
    if (!user.age || user.age < 0 || user.age > 150) {
        return { valid: false, error: "年龄必须在0-150之间" };
    }
    if (!user.email || !user.email.includes('@')) {
        return { valid: false, error: "邮箱格式不正确" };
    }
    return { valid: true };
}

function getUsersByAge(users: User[], minAge: number, maxAge: number): User[] {
    return users.filter(user => user.age >= minAge && user.age <= maxAge);
}

// 测试迁移后的代码
const user1 = createUser("张三", 25, "zhangsan@example.com");
const user2 = createUser("李四", 30, "lisi@example.com");
const user3 = createUser("王五", 35, "wangwu@example.com");

const users = [user1, user2, user3];

console.log('创建的用户:', users.map(u => `${u.name} (${u.age}岁)`));

const validation = validateUser(user1);
console.log('用户验证结果:', validation);

const youngUsers = getUsersByAge(users, 20, 30);
console.log('20-30岁用户:', youngUsers.map(u => u.name));

// ============================================================================
// 2. 渐进式迁移策略示例
// ============================================================================

console.log('\n=== 渐进式迁移策略示例 ===');

// 步骤1：添加基础类型注解
function calculatePrice(basePrice: number, discount: number = 0, tax: number = 0.1): number {
    const discountedPrice = basePrice * (1 - discount);
    return discountedPrice * (1 + tax);
}

// 步骤2：定义接口替代对象字面量
interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

interface OrderItem {
    product: Product;
    quantity: number;
    discount?: number;
}

// 步骤3：使用联合类型和字面量类型
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';

interface Order {
    id: string;
    items: OrderItem[];
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

// 步骤4：实现类型安全的业务逻辑
function createOrder(items: OrderItem[], paymentMethod: PaymentMethod): Order {
    const totalAmount = items.reduce((sum, item) => {
        const itemPrice = calculatePrice(
            item.product.price * item.quantity,
            item.discount || 0
        );
        return sum + itemPrice;
    }, 0);

    return {
        id: `ORDER_${Date.now()}`,
        items,
        status: 'pending',
        paymentMethod,
        totalAmount,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

function updateOrderStatus(order: Order, newStatus: OrderStatus): Order {
    return {
        ...order,
        status: newStatus,
        updatedAt: new Date()
    };
}

// 测试订单系统
const product: Product = {
    id: 1,
    name: "TypeScript 实战指南",
    price: 89.9,
    category: "书籍",
    inStock: true
};

const orderItem: OrderItem = {
    product,
    quantity: 2,
    discount: 0.1
};

const order = createOrder([orderItem], 'credit_card');
console.log('创建订单:', {
    id: order.id,
    totalAmount: order.totalAmount.toFixed(2),
    status: order.status
});

const updatedOrder = updateOrderStatus(order, 'processing');
console.log('更新订单状态:', updatedOrder.status);

// ============================================================================
// 3. 处理第三方库和类型声明
// ============================================================================

console.log('\n=== 第三方库类型处理示例 ===');

// 模拟第三方库的类型声明（在实际项目中，这些会放在 .d.ts 文件中）
interface LibraryConfig {
    locale: string;
    timezone: string;
}

// 在实际项目中，你会这样声明第三方库类型：
// declare module 'legacy-library' {
//     export function formatDate(date: Date, format: string): string;
//     export function parseDate(dateString: string): Date;
//     export interface LibraryConfig {
//         locale: string;
//         timezone: string;
//     }
//     export class DateFormatter {
//         constructor(config: LibraryConfig);
//         format(date: Date): string;
//         parse(dateString: string): Date;
//     }
// }

// 模拟使用第三方库
class DateUtils {
    private config: { locale: string; timezone: string };

    constructor(locale: string = 'zh-CN', timezone: string = 'Asia/Shanghai') {
        this.config = { locale, timezone };
    }

    formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
        // 模拟第三方库的功能
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', String(year))
            .replace('MM', month)
            .replace('DD', day);
    }

    parseDate(dateString: string): Date {
        // 简单的日期解析实现
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
}

const dateUtils = new DateUtils();
const formattedDate = dateUtils.formatDate(new Date(), 'YYYY-MM-DD');
console.log('格式化日期:', formattedDate);

// ============================================================================
// 4. 常见迁移问题和解决方案
// ============================================================================

console.log('\n=== 常见迁移问题解决方案 ===');

// 问题1：any 类型的使用和避免
// 不好的做法
function processDataBad(data: any): any {
    return data.someProperty?.value || 'default';
}

// 好的做法：使用泛型和类型守卫
function isValidData(data: unknown): data is { someProperty?: { value: string } } {
    return typeof data === 'object' && data !== null;
}

function processDataGood<T extends { someProperty?: { value: string } }>(data: T): string {
    if (isValidData(data)) {
        return data.someProperty?.value || 'default';
    }
    return 'default';
}

// 问题2：处理动态属性访问
interface DynamicObject {
    [key: string]: unknown;
}

function getProperty<T>(obj: DynamicObject, key: string): T | undefined {
    const value = obj[key];
    return value as T | undefined;
}

function setProperty(obj: DynamicObject, key: string, value: unknown): void {
    obj[key] = value;
}

// 问题3：处理回调函数类型
type EventCallback<T = unknown> = (data: T) => void;
type ErrorCallback = (error: Error) => void;

class EventEmitter<T = unknown> {
    private listeners: EventCallback<T>[] = [];
    private errorHandlers: ErrorCallback[] = [];

    on(callback: EventCallback<T>): void {
        this.listeners.push(callback);
    }

    onError(callback: ErrorCallback): void {
        this.errorHandlers.push(callback);
    }

    emit(data: T): void {
        try {
            this.listeners.forEach(callback => callback(data));
        } catch (error) {
            this.errorHandlers.forEach(handler => handler(error as Error));
        }
    }
}

// 测试事件系统
const userEventEmitter = new EventEmitter<User>();

userEventEmitter.on((user: User) => {
    console.log('用户事件:', user.name);
});

userEventEmitter.onError((error: Error) => {
    console.error('事件错误:', error.message);
});

userEventEmitter.emit(user1);

// ============================================================================
// 5. 配置文件迁移示例
// ============================================================================

console.log('\n=== 配置文件迁移示例 ===');

// 原 JavaScript 配置
/*
// config.js
module.exports = {
    api: {
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3
    },
    features: {
        enableAuth: true,
        enableCache: false,
        enableLogging: true
    },
    ui: {
        theme: 'light',
        language: 'zh-CN'
    }
};
*/

// TypeScript 配置接口
interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
}

interface FeatureFlags {
    enableAuth: boolean;
    enableCache: boolean;
    enableLogging: boolean;
}

interface UIConfig {
    theme: 'light' | 'dark';
    language: 'zh-CN' | 'en-US';
}

interface AppConfig {
    api: ApiConfig;
    features: FeatureFlags;
    ui: UIConfig;
}

// 类型安全的配置
const appConfig: AppConfig = {
    api: {
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3
    },
    features: {
        enableAuth: true,
        enableCache: false,
        enableLogging: true
    },
    ui: {
        theme: 'light',
        language: 'zh-CN'
    }
};

// 配置验证函数
function validateConfig(config: AppConfig): boolean {
    try {
        // 验证 API 配置
        if (!config.api.baseUrl || config.api.timeout <= 0 || config.api.retries < 0) {
            return false;
        }
        
        // 验证 UI 配置
        const validThemes: Array<UIConfig['theme']> = ['light', 'dark'];
        const validLanguages: Array<UIConfig['language']> = ['zh-CN', 'en-US'];
        
        if (!validThemes.includes(config.ui.theme) || !validLanguages.includes(config.ui.language)) {
            return false;
        }
        
        return true;
    } catch {
        return false;
    }
}

console.log('配置验证结果:', validateConfig(appConfig));
console.log('应用配置:', {
    apiUrl: appConfig.api.baseUrl,
    theme: appConfig.ui.theme,
    authEnabled: appConfig.features.enableAuth
});

console.log('\n=== 第3章示例代码执行完成 ===');
