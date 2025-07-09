/**
 * 第5章：TypeScript 泛型编程示例
 *
 * 本文件展示了 TypeScript 泛型的各种用法
 * 包括泛型函数、泛型接口、泛型类、泛型约束等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. 泛型基础
// ============================================================================

console.log("=== 泛型基础示例 ===");

// 问题：没有泛型的重复代码
function identityString(arg: string): string {
    return arg;
}

function identityNumber(arg: number): number {
    return arg;
}

function identityBoolean(arg: boolean): boolean {
    return arg;
}

// 解决方案：使用泛型
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型函数
const str = identity<string>("Hello TypeScript");
const num = identity<number>(42);
const bool = identity(true); // 类型推断，不需要显式指定类型

console.log("字符串身份:", str);
console.log("数字身份:", num);
console.log("布尔身份:", bool);

// 泛型数组操作
function getFirst<T>(array: T[]): T | undefined {
    return array.length > 0 ? array[0] : undefined;
}

function getLast<T>(array: T[]): T | undefined {
    return array.length > 0 ? array[array.length - 1] : undefined;
}

const numbers = [1, 2, 3, 4, 5];
const strings = ["apple", "banana", "cherry"];

console.log("第一个数字:", getFirst(numbers)); // number | undefined
console.log("最后一个字符串:", getLast(strings)); // string | undefined

// ============================================================================
// 2. 泛型函数
// ============================================================================

console.log("\n=== 泛型函数示例 ===");

// 交换元组元素
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

const originalTuple: [string, number] = ["hello", 42];
const swappedTuple = swap(originalTuple); // [number, string]

console.log("原始元组:", originalTuple);
console.log("交换后元组:", swappedTuple);

// 泛型过滤函数
function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
}

const evenNumbers = filter(numbers, (n) => n % 2 === 0);
const longStrings = filter(strings, (s) => s.length > 5);

console.log("偶数:", evenNumbers);
console.log("长字符串:", longStrings);

// 泛型映射函数
function map<T, U>(array: T[], transform: (item: T) => U): U[] {
    return array.map(transform);
}

const doubled = map(numbers, (n) => n * 2);
const lengths = map(strings, (s) => s.length);

console.log("翻倍数字:", doubled);
console.log("字符串长度:", lengths);

// 泛型归约函数
function reduce<T, U>(array: T[], reducer: (acc: U, current: T) => U, initial: U): U {
    return array.reduce(reducer, initial);
}

const sum = reduce(numbers, (acc, n) => acc + n, 0);
const concatenated = reduce(strings, (acc, s) => acc + s, "");

console.log("数字总和:", sum);
console.log("连接字符串:", concatenated);

// ============================================================================
// 3. 泛型接口
// ============================================================================

console.log("\n=== 泛型接口示例 ===");

// 泛型容器接口
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
    isEmpty(): boolean;
}

// 实现泛型接口
class SimpleContainer<T> implements Container<T> {
    constructor(public value: T) {}

    getValue(): T {
        return this.value;
    }

    setValue(value: T): void {
        this.value = value;
    }

    isEmpty(): boolean {
        return this.value === null || this.value === undefined;
    }
}

const stringContainer = new SimpleContainer<string>("Hello");
const numberContainer = new SimpleContainer<number>(42);

console.log("字符串容器值:", stringContainer.getValue());
console.log("数字容器值:", numberContainer.getValue());

// 泛型函数接口
interface Transformer<T, U> {
    (input: T): U;
}

interface Validator<T> {
    (value: T): boolean;
}

const stringToNumber: Transformer<string, number> = (str) => parseInt(str, 10);
const isPositive: Validator<number> = (num) => num > 0;

console.log("字符串转数字:", stringToNumber("123"));
console.log("是否为正数:", isPositive(42));

// 泛型键值对接口
interface KeyValuePair<K, V> {
    key: K;
    value: V;
}

interface Dictionary<T> {
    [key: string]: T;
}

const userAge: KeyValuePair<string, number> = {
    key: "age",
    value: 25,
};

const userInfo: Dictionary<string | number> = {
    name: "张三",
    age: 25,
    city: "北京",
};

console.log("键值对:", userAge);
console.log("用户信息:", userInfo);

// ============================================================================
// 4. 泛型类
// ============================================================================

console.log("\n=== 泛型类示例 ===");

// 泛型列表类
class GenericList<T> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    remove(index: number): T | undefined {
        if (index >= 0 && index < this.items.length) {
            return this.items.splice(index, 1)[0];
        }
        return undefined;
    }

    get(index: number): T | undefined {
        return this.items[index];
    }

    getAll(): T[] {
        return [...this.items];
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }

    find(predicate: (item: T) => boolean): T | undefined {
        return this.items.find(predicate);
    }
}

// 使用泛型列表
const stringList = new GenericList<string>();
stringList.add("apple");
stringList.add("banana");
stringList.add("cherry");

const numberList = new GenericList<number>();
numberList.add(1);
numberList.add(2);
numberList.add(3);

console.log("字符串列表:", stringList.getAll());
console.log("数字列表:", numberList.getAll());
console.log(
    "找到的水果:",
    stringList.find((fruit) => fruit.startsWith("b"))
);

// 泛型栈类
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);

console.log("栈顶元素:", numberStack.peek());
console.log("弹出元素:", numberStack.pop());
console.log("栈大小:", numberStack.size());

// ============================================================================
// 5. 泛型约束
// ============================================================================

console.log("\n=== 泛型约束示例 ===");

// 长度约束
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(`长度: ${arg.length}`);
    return arg;
}

// 可以传入有 length 属性的类型
logLength("hello world"); // string 有 length 属性
logLength([1, 2, 3, 4]); // array 有 length 属性
logLength({ length: 10, value: "test" }); // 对象有 length 属性

// 键约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person = {
    name: "张三",
    age: 25,
    city: "北京",
};

const personName = getProperty(person, "name"); // string
const personAge = getProperty(person, "age"); // number
// const invalid = getProperty(person, "invalid"); // 编译错误

console.log("人员姓名:", personName);
console.log("人员年龄:", personAge);

// 类型约束
interface Comparable<T> {
    compareTo(other: T): number;
}

class Version implements Comparable<Version> {
    constructor(private version: string) {}

    compareTo(other: Version): number {
        return this.version.localeCompare(other.version);
    }

    toString(): string {
        return this.version;
    }
}

function sort<T extends Comparable<T>>(items: T[]): T[] {
    return items.sort((a, b) => a.compareTo(b));
}

const versions = [new Version("1.2.0"), new Version("1.1.0"), new Version("1.3.0")];

const sortedVersions = sort(versions);
console.log(
    "排序后的版本:",
    sortedVersions.map((v) => v.toString())
);

// ============================================================================
// 6. 条件泛型
// ============================================================================

console.log("\n=== 条件泛型示例 ===");

// 基础条件类型
type IsString<T> = T extends string ? true : false;
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
type Test3 = IsArray<string[]>; // true

// 非空类型
type NonNullable<T> = T extends null | undefined ? never : T;
type SafeString = NonNullable<string | null | undefined>; // string

// 提取数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type StringArrayElement = ArrayElement<string[]>; // string
type NumberArrayElement = ArrayElement<number[]>; // number

// 提取函数返回值类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
    return "hello";
}

function getNumber(): number {
    return 42;
}

type StringReturn = MyReturnType<typeof getString>; // string
type NumberReturn = MyReturnType<typeof getNumber>; // number

// 实际使用条件泛型
function processValue<T>(
    value: T
): T extends string ? string : T extends number ? number : unknown {
    if (typeof value === "string") {
        return value.toUpperCase() as any;
    } else if (typeof value === "number") {
        return (value * 2) as any;
    }
    return value as any;
}

const processedString = processValue("hello"); // string
const processedNumber = processValue(42); // number
const processedOther = processValue(true); // unknown

console.log("处理后的字符串:", processedString);
console.log("处理后的数字:", processedNumber);
console.log("处理后的其他:", processedOther);

// ============================================================================
// 7. 实际应用：API 客户端
// ============================================================================

console.log("\n=== 实际应用示例：泛型 API 客户端 ===");

// API 响应类型
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

interface ApiError {
    success: false;
    error: string;
    code: number;
}

type ApiResult<T> = ApiResponse<T> | ApiError;

// 泛型 API 客户端
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<ApiResult<T>> {
        try {
            // 模拟 API 调用
            console.log(`GET ${this.baseUrl}${endpoint}`);

            // 模拟成功响应
            return {
                success: true,
                data: {} as T, // 实际应用中这里会是真实的 API 响应
                message: "请求成功",
            };
        } catch (error) {
            return {
                success: false,
                error: "网络错误",
                code: 500,
            };
        }
    }

    async post<T, U>(endpoint: string, data: T): Promise<ApiResult<U>> {
        try {
            console.log(`POST ${this.baseUrl}${endpoint}`, data);

            return {
                success: true,
                data: {} as U,
                message: "创建成功",
            };
        } catch (error) {
            return {
                success: false,
                error: "创建失败",
                code: 400,
            };
        }
    }
}

// 使用泛型 API 客户端
interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateUserRequest {
    name: string;
    email: string;
}

const apiClient = new ApiClient("https://api.example.com");

// 类型安全的 API 调用
async function demonstrateApiClient() {
    const userResult = await apiClient.get<User>("/users/1");
    const createResult = await apiClient.post<CreateUserRequest, User>("/users", {
        name: "新用户",
        email: "newuser@example.com",
    });

    console.log("API 客户端演示完成");
}

demonstrateApiClient();

console.log("\n=== 第5章示例代码执行完成 ===");
