/**
 * 第5章：泛型编程实践练习题解答
 *
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 展示了泛型编程的正确实现方式和最佳实践
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：泛型函数练习 - 解答
// ============================================================================

console.log("=== 练习1：泛型函数练习 - 解答 ===");

// 1. 实现 identity 函数 - 返回传入的参数
function identity<T>(arg: T): T {
    return arg;
}

// 2. 实现 swap 函数 - 交换元组的两个元素
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

// 3. 实现 getProperty 函数 - 安全地获取对象属性
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// 4. 实现 filterArray 函数 - 过滤数组元素
function filterArray<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
}

// 5. 实现 mapArray 函数 - 映射数组元素
function mapArray<T, U>(array: T[], transform: (item: T) => U): U[] {
    return array.map(transform);
}

// 6. 实现 reduceArray 函数 - 归约数组
function reduceArray<T, U>(array: T[], reducer: (acc: U, current: T) => U, initial: U): U {
    return array.reduce(reducer, initial);
}

// 测试泛型函数
const numbers = [1, 2, 3, 4, 5];
const strings = ["apple", "banana", "cherry"];

const identityNumber = identity(42);
const identityString = identity("hello");
const swappedTuple = swap(["hello", 42]);
const evenNumbers = filterArray(numbers, (n) => n % 2 === 0);
const doubled = mapArray(numbers, (n) => n * 2);
const sum = reduceArray(numbers, (acc, n) => acc + n, 0);

console.log("身份函数:", { identityNumber, identityString });
console.log("交换元组:", swappedTuple);
console.log("偶数:", evenNumbers);
console.log("翻倍:", doubled);
console.log("求和:", sum);

// ============================================================================
// 练习2：泛型接口练习 - 解答
// ============================================================================

console.log("\n=== 练习2：泛型接口练习 - 解答 ===");

// 1. 定义 Container<T> 接口 - 通用容器
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
    isEmpty(): boolean;
    clear(): void;
}

// 2. 定义 Repository<T, K> 接口 - 数据仓库
interface Repository<T, K> {
    findById(id: K): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: T): Promise<T>;
    update(id: K, entity: Partial<T>): Promise<T>;
    delete(id: K): Promise<boolean>;
}

// 3. 定义 EventEmitter<T> 接口 - 事件发射器
interface EventEmitter<T> {
    on(event: string, listener: (data: T) => void): void;
    off(event: string, listener: (data: T) => void): void;
    emit(event: string, data: T): void;
    once(event: string, listener: (data: T) => void): void;
}

// 4. 定义 Cache<K, V> 接口 - 缓存系统
interface Cache<K, V> {
    get(key: K): V | undefined;
    set(key: K, value: V, ttl?: number): void;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    size(): number;
}

// 5. 定义 Validator<T> 接口 - 验证器
interface Validator<T> {
    validate(value: T): boolean;
    getErrors(value: T): string[];
    isValid(value: T): value is T;
}

// 实现这些接口
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

    clear(): void {
        this.value = undefined as any;
    }
}

class MemoryRepository<T extends { id: K }, K> implements Repository<T, K> {
    private items: Map<K, T> = new Map();

    async findById(id: K): Promise<T | null> {
        return this.items.get(id) || null;
    }

    async findAll(): Promise<T[]> {
        return Array.from(this.items.values());
    }

    async save(entity: T): Promise<T> {
        this.items.set(entity.id, entity);
        return entity;
    }

    async update(id: K, updates: Partial<T>): Promise<T> {
        const existing = this.items.get(id);
        if (!existing) {
            throw new Error(`Entity with id ${id} not found`);
        }
        const updated = { ...existing, ...updates };
        this.items.set(id, updated);
        return updated;
    }

    async delete(id: K): Promise<boolean> {
        return this.items.delete(id);
    }
}

// 测试接口实现
const stringContainer = new SimpleContainer<string>("Hello");
console.log("容器值:", stringContainer.getValue());

interface User {
    id: number;
    name: string;
    email: string;
}

const userRepo = new MemoryRepository<User, number>();
userRepo.save({ id: 1, name: "张三", email: "zhangsan@example.com" });

// ============================================================================
// 练习3：泛型类练习 - 解答
// ============================================================================

console.log("\n=== 练习3：泛型类练习 - 解答 ===");

// 1. 实现 Stack<T> 类 - 栈数据结构
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

    clear(): void {
        this.items = [];
    }
}

// 2. 实现 Queue<T> 类 - 队列数据结构
class Queue<T> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    front(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }
}

// 3. 实现 LinkedList<T> 类 - 链表数据结构
class LinkedListNode<T> {
    constructor(
        public data: T,
        public next: LinkedListNode<T> | null = null
    ) {}
}

class LinkedList<T> {
    private head: LinkedListNode<T> | null = null;
    private count: number = 0;

    append(data: T): void {
        const newNode = new LinkedListNode(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.count++;
    }

    prepend(data: T): void {
        const newNode = new LinkedListNode(data, this.head);
        this.head = newNode;
        this.count++;
    }

    remove(data: T): boolean {
        if (!this.head) return false;

        if (this.head.data === data) {
            this.head = this.head.next;
            this.count--;
            return true;
        }

        let current = this.head;
        while (current.next && current.next.data !== data) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
            this.count--;
            return true;
        }

        return false;
    }

    find(data: T): LinkedListNode<T> | null {
        let current = this.head;
        while (current && current.data !== data) {
            current = current.next;
        }
        return current;
    }

    size(): number {
        return this.count;
    }

    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}

// 4. 实现 EventBus<T> 类 - 事件总线
class EventBus<T> implements EventEmitter<T> {
    private listeners: Map<string, Array<(data: T) => void>> = new Map();

    on(event: string, listener: (data: T) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(listener);
    }

    off(event: string, listener: (data: T) => void): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(listener);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    emit(event: string, data: T): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach((listener) => listener(data));
        }
    }

    once(event: string, listener: (data: T) => void): void {
        const onceListener = (data: T) => {
            listener(data);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
    }
}

// 测试泛型类
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);
console.log("栈顶元素:", numberStack.peek());
console.log("弹出元素:", numberStack.pop());

const stringQueue = new Queue<string>();
stringQueue.enqueue("first");
stringQueue.enqueue("second");
console.log("队首元素:", stringQueue.front());
console.log("出队元素:", stringQueue.dequeue());

const numberList = new LinkedList<number>();
numberList.append(1);
numberList.append(2);
numberList.append(3);
console.log("链表数组:", numberList.toArray());

// ============================================================================
// 练习4：泛型约束练习 - 解答
// ============================================================================

console.log("\n=== 练习4：泛型约束练习 - 解答 ===");

// 1. 实现 getLength 函数 - 获取有 length 属性的对象长度
interface Lengthwise {
    length: number;
}

function getLength<T extends Lengthwise>(arg: T): number {
    return arg.length;
}

// 2. 实现 compare 函数 - 比较可比较的对象
interface Comparable<T> {
    compareTo(other: T): number;
}

function compare<T extends Comparable<T>>(a: T, b: T): number {
    return a.compareTo(b);
}

// 3. 实现 merge 函数 - 合并对象
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

// 4. 实现 pick 函数 - 选择对象属性
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
        result[key] = obj[key];
    });
    return result;
}

// 5. 实现 groupBy 函数 - 按键分组
function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce(
        (groups, item) => {
            const groupKey = String(item[key]);
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        },
        {} as Record<string, T[]>
    );
}

// 测试约束泛型
const testObject = { name: "test", age: 25, city: "Beijing" };
const picked = pick(testObject, ["name", "age"]);
const merged = merge({ a: 1 }, { b: 2 });

console.log("选择属性:", picked);
console.log("合并对象:", merged);
console.log("字符串长度:", getLength("hello world"));
console.log("数组长度:", getLength([1, 2, 3, 4, 5]));

// ============================================================================
// 练习5：条件泛型练习 - 解答
// ============================================================================

console.log("\n=== 练习5：条件泛型练习 - 解答 ===");

// 1. 实现 Flatten<T> - 扁平化数组类型
type Flatten<T> = T extends (infer U)[] ? U : T;

// 2. 实现 DeepFlatten<T> - 深度扁平化
type DeepFlatten<T> = T extends (infer U)[] ? (U extends any[] ? DeepFlatten<U> : U) : T;

// 3. 实现 PromiseType<T> - 提取 Promise 类型
type PromiseType<T> = T extends Promise<infer U> ? U : T;

// 4. 实现 FunctionArgs<T> - 提取函数参数
type FunctionArgs<T> = T extends (...args: infer A) => any ? A : never;

// 5. 实现 DeepReadonly<T> - 深度只读
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 使用条件泛型的函数
function flattenArray<T>(arr: T[]): Flatten<T>[] {
    return arr.flat() as Flatten<T>[];
}

function unwrapPromise<T>(promise: Promise<T>): Promise<PromiseType<Promise<T>>> {
    return promise as Promise<PromiseType<Promise<T>>>;
}

function callWithArgs<T extends (...args: any[]) => any>(
    fn: T,
    args: FunctionArgs<T>
): ReturnType<T> {
    return fn(...args);
}

// 测试条件泛型
type FlatString = Flatten<string[]>; // string
type FlatNumber = Flatten<number>; // number
type PromiseString = PromiseType<Promise<string>>; // string
type TestArgs = FunctionArgs<(a: string, b: number) => boolean>; // [string, number]

const nestedArray = [
    [1, 2],
    [3, 4],
];
const flattened = flattenArray(nestedArray);
console.log("扁平化数组:", flattened);

// ============================================================================
// 练习6：综合应用练习 - 解答
// ============================================================================

console.log("\n=== 练习6：综合应用练习 - 解答 ===");

// 1. 定义 API 相关的泛型类型
interface ApiResponse<T> {
    success: true;
    data: T;
    message?: string;
    timestamp: number;
}

interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: number;
}

type ApiResult<T> = ApiResponse<T> | ApiError;
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestConfig<T = any> {
    headers?: Record<string, string>;
    timeout?: number;
    data?: T;
}

// 实现泛型 API 客户端类
class ApiClient {
    constructor(private baseUrl: string) {}

    async get<T>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
        try {
            // 模拟 API 调用
            console.log(`GET ${this.baseUrl}${url}`);
            return {
                success: true,
                data: {} as T,
                timestamp: Date.now(),
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    code: "NETWORK_ERROR",
                    message: "Network request failed",
                },
                timestamp: Date.now(),
            };
        }
    }

    async post<T, U = any>(url: string, data?: U, config?: RequestConfig): Promise<ApiResult<T>> {
        try {
            console.log(`POST ${this.baseUrl}${url}`, data);
            return {
                success: true,
                data: {} as T,
                timestamp: Date.now(),
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    code: "NETWORK_ERROR",
                    message: "Network request failed",
                },
                timestamp: Date.now(),
            };
        }
    }

    async put<T, U = any>(url: string, data?: U, config?: RequestConfig): Promise<ApiResult<T>> {
        try {
            console.log(`PUT ${this.baseUrl}${url}`, data);
            return {
                success: true,
                data: {} as T,
                timestamp: Date.now(),
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    code: "NETWORK_ERROR",
                    message: "Network request failed",
                },
                timestamp: Date.now(),
            };
        }
    }

    async delete<T>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
        try {
            console.log(`DELETE ${this.baseUrl}${url}`);
            return {
                success: true,
                data: {} as T,
                timestamp: Date.now(),
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    code: "NETWORK_ERROR",
                    message: "Network request failed",
                },
                timestamp: Date.now(),
            };
        }
    }
}

// 定义具体的 API 接口类型
interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateUserRequest {
    name: string;
    email: string;
}

interface UpdateUserRequest {
    name?: string;
    email?: string;
}

// 实现类型安全的 API 服务类
class UserService {
    constructor(private apiClient: ApiClient) {}

    async getUser(id: number): Promise<ApiResult<User>> {
        return this.apiClient.get<User>(`/users/${id}`);
    }

    async createUser(userData: CreateUserRequest): Promise<ApiResult<User>> {
        return this.apiClient.post<User, CreateUserRequest>("/users", userData);
    }

    async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResult<User>> {
        return this.apiClient.put<User, UpdateUserRequest>(`/users/${id}`, userData);
    }

    async deleteUser(id: number): Promise<ApiResult<void>> {
        return this.apiClient.delete<void>(`/users/${id}`);
    }
}

// 测试 API 客户端
const apiClient = new ApiClient("https://api.example.com");
const userService = new UserService(apiClient);

// 模拟 API 调用
async function testApiClient() {
    const userResult = await userService.getUser(1);
    const createResult = await userService.createUser({
        name: "张三",
        email: "zhangsan@example.com",
    });

    console.log("API 客户端测试完成");
}

testApiClient();

console.log("\n=== 解答完成！ ===");
console.log("💡 学习要点:");
console.log("1. 泛型提供了代码重用和类型安全的完美平衡");
console.log("2. 泛型约束让你能够在保持灵活性的同时添加类型限制");
console.log("3. 条件泛型提供了强大的类型推导能力");
console.log("4. 泛型在数据结构和 API 设计中有广泛应用");
console.log("5. 合理使用泛型可以构建高度可重用的代码库");
