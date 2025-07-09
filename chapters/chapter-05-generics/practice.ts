/**
 * 第5章：泛型编程实践练习题
 *
 * 请完成以下练习，掌握泛型函数、泛型类、泛型约束等概念
 * 通过实际编程练习理解泛型的强大功能
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：泛型函数练习
// ============================================================================

console.log("=== 练习1：泛型函数练习 ===");

// TODO: 实现以下泛型函数

// 1. 实现 identity 函数 - 返回传入的参数
// function identity<T>(arg: T): T {
//     // TODO: 实现
// }

// 2. 实现 swap 函数 - 交换元组的两个元素
// function swap<T, U>(tuple: [T, U]): [U, T] {
//     // TODO: 实现
// }

// 3. 实现 getProperty 函数 - 安全地获取对象属性
// function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
//     // TODO: 实现
// }

// 4. 实现 filterArray 函数 - 过滤数组元素
// function filterArray<T>(array: T[], predicate: (item: T) => boolean): T[] {
//     // TODO: 实现
// }

// 5. 实现 mapArray 函数 - 映射数组元素
// function mapArray<T, U>(array: T[], transform: (item: T) => U): U[] {
//     // TODO: 实现
// }

// 6. 实现 reduceArray 函数 - 归约数组
// function reduceArray<T, U>(array: T[], reducer: (acc: U, current: T) => U, initial: U): U {
//     // TODO: 实现
// }

// TODO: 测试你的泛型函数
const numbers = [1, 2, 3, 4, 5];
const strings = ["apple", "banana", "cherry"];

// const identityNumber = identity(42);
// const identityString = identity("hello");
// const swappedTuple = swap(["hello", 42]);
// const evenNumbers = filterArray(numbers, n => n % 2 === 0);
// const doubled = mapArray(numbers, n => n * 2);
// const sum = reduceArray(numbers, (acc, n) => acc + n, 0);

console.log("泛型函数练习 - 请实现上述函数");

// ============================================================================
// 练习2：泛型接口练习
// ============================================================================

console.log("\n=== 练习2：泛型接口练习 ===");

// TODO: 定义以下泛型接口

// 1. 定义 Container<T> 接口 - 通用容器
// interface Container<T> {
//     // TODO: 定义属性和方法
// }

// 2. 定义 Repository<T, K> 接口 - 数据仓库
// interface Repository<T, K> {
//     // TODO: 定义 CRUD 方法
// }

// 3. 定义 EventEmitter<T> 接口 - 事件发射器
// interface EventEmitter<T> {
//     // TODO: 定义事件相关方法
// }

// 4. 定义 Cache<K, V> 接口 - 缓存系统
// interface Cache<K, V> {
//     // TODO: 定义缓存操作方法
// }

// 5. 定义 Validator<T> 接口 - 验证器
// interface Validator<T> {
//     // TODO: 定义验证方法
// }

// TODO: 实现这些接口

// class SimpleContainer<T> implements Container<T> {
//     // TODO: 实现
// }

// class MemoryRepository<T, K> implements Repository<T, K> {
//     // TODO: 实现
// }

console.log("泛型接口练习 - 请定义并实现上述接口");

// ============================================================================
// 练习3：泛型类练习
// ============================================================================

console.log("\n=== 练习3：泛型类练习 ===");

// TODO: 实现以下泛型类

// 1. 实现 Stack<T> 类 - 栈数据结构
// class Stack<T> {
//     private items: T[] = [];
//
//     // TODO: 实现 push, pop, peek, isEmpty, size 方法
// }

// 2. 实现 Queue<T> 类 - 队列数据结构
// class Queue<T> {
//     private items: T[] = [];
//
//     // TODO: 实现 enqueue, dequeue, front, isEmpty, size 方法
// }

// 3. 实现 LinkedList<T> 类 - 链表数据结构
// class LinkedListNode<T> {
//     // TODO: 定义节点结构
// }
//
// class LinkedList<T> {
//     // TODO: 实现链表操作
// }

// 4. 实现 BinaryTree<T> 类 - 二叉树数据结构
// class TreeNode<T> {
//     // TODO: 定义树节点
// }
//
// class BinaryTree<T> {
//     // TODO: 实现二叉树操作
// }

// 5. 实现 EventBus<T> 类 - 事件总线
// class EventBus<T> {
//     // TODO: 实现事件发布订阅
// }

// TODO: 测试你的泛型类
// const numberStack = new Stack<number>();
// const stringQueue = new Queue<string>();

console.log("泛型类练习 - 请实现上述类");

// ============================================================================
// 练习4：泛型约束练习
// ============================================================================

console.log("\n=== 练习4：泛型约束练习 ===");

// TODO: 实现带约束的泛型函数

// 1. 实现 getLength 函数 - 获取有 length 属性的对象长度
// interface Lengthwise {
//     length: number;
// }
//
// function getLength<T extends Lengthwise>(arg: T): number {
//     // TODO: 实现
// }

// 2. 实现 compare 函数 - 比较可比较的对象
// interface Comparable<T> {
//     compareTo(other: T): number;
// }
//
// function compare<T extends Comparable<T>>(a: T, b: T): number {
//     // TODO: 实现
// }

// 3. 实现 merge 函数 - 合并对象
// function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
//     // TODO: 实现
// }

// 4. 实现 pick 函数 - 选择对象属性
// function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
//     // TODO: 实现
// }

// 5. 实现 groupBy 函数 - 按键分组
// function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
//     // TODO: 实现
// }

// TODO: 测试约束泛型
const testObject = { name: "test", age: 25, city: "Beijing" };
// const picked = pick(testObject, ["name", "age"]);
// const merged = merge({ a: 1 }, { b: 2 });

console.log("泛型约束练习 - 请实现上述函数");

// ============================================================================
// 练习5：条件泛型练习
// ============================================================================

console.log("\n=== 练习5：条件泛型练习 ===");

// TODO: 实现以下条件泛型

// 1. 实现 Flatten<T> - 扁平化数组类型
// type Flatten<T> = T extends (infer U)[] ? U : T;

// 2. 实现 DeepFlatten<T> - 深度扁平化
// type DeepFlatten<T> = T extends (infer U)[]
//     ? U extends any[]
//         ? DeepFlatten<U>
//         : U
//     : T;

// 3. 实现 PromiseType<T> - 提取 Promise 类型
// type PromiseType<T> = T extends Promise<infer U> ? U : T;

// 4. 实现 FunctionArgs<T> - 提取函数参数
// type FunctionArgs<T> = T extends (...args: infer A) => any ? A : never;

// 5. 实现 DeepReadonly<T> - 深度只读
// type DeepReadonly<T> = {
//     readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
// };

// TODO: 实现使用条件泛型的函数

// function flattenArray<T>(arr: T[]): Flatten<T>[] {
//     // TODO: 实现
// }

// function unwrapPromise<T>(promise: Promise<T>): Promise<PromiseType<Promise<T>>> {
//     // TODO: 实现
// }

// function callWithArgs<T extends (...args: any[]) => any>(
//     fn: T,
//     args: FunctionArgs<T>
// ): ReturnType<T> {
//     // TODO: 实现
// }

console.log("条件泛型练习 - 请实现上述类型和函数");

// ============================================================================
// 练习6：综合应用练习
// ============================================================================

console.log("\n=== 练习6：综合应用练习 ===");

// 场景：实现一个类型安全的 API 客户端

// TODO: 定义 API 相关的泛型类型

// 1. 定义 ApiResponse<T> 类型
// interface ApiResponse<T> {
//     // TODO: 定义响应结构
// }

// 2. 定义 ApiError 类型
// interface ApiError {
//     // TODO: 定义错误结构
// }

// 3. 定义 ApiResult<T> 类型
// type ApiResult<T> = ApiResponse<T> | ApiError;

// 4. 定义 HttpMethod 类型
// type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 5. 定义 RequestConfig<T> 类型
// interface RequestConfig<T = any> {
//     // TODO: 定义请求配置
// }

// TODO: 实现泛型 API 客户端类

// class ApiClient {
//     private baseUrl: string;
//
//     constructor(baseUrl: string) {
//         this.baseUrl = baseUrl;
//     }
//
//     // TODO: 实现 get 方法
//     async get<T>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
//         // TODO: 实现
//     }
//
//     // TODO: 实现 post 方法
//     async post<T, U = any>(url: string, data?: U, config?: RequestConfig): Promise<ApiResult<T>> {
//         // TODO: 实现
//     }
//
//     // TODO: 实现 put 方法
//     async put<T, U = any>(url: string, data?: U, config?: RequestConfig): Promise<ApiResult<T>> {
//         // TODO: 实现
//     }
//
//     // TODO: 实现 delete 方法
//     async delete<T>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
//         // TODO: 实现
//     }
// }

// TODO: 定义具体的 API 接口类型

// interface User {
//     id: number;
//     name: string;
//     email: string;
// }

// interface CreateUserRequest {
//     name: string;
//     email: string;
// }

// interface UpdateUserRequest {
//     name?: string;
//     email?: string;
// }

// TODO: 实现类型安全的 API 服务类

// class UserService {
//     constructor(private apiClient: ApiClient) {}
//
//     // TODO: 实现用户相关的 API 方法
//     async getUser(id: number): Promise<ApiResult<User>> {
//         // TODO: 实现
//     }
//
//     async createUser(userData: CreateUserRequest): Promise<ApiResult<User>> {
//         // TODO: 实现
//     }
//
//     async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResult<User>> {
//         // TODO: 实现
//     }
//
//     async deleteUser(id: number): Promise<ApiResult<void>> {
//         // TODO: 实现
//     }
// }

// TODO: 测试 API 客户端
// const apiClient = new ApiClient('https://api.example.com');
// const userService = new UserService(apiClient);

console.log("综合应用练习 - 请实现类型安全的 API 客户端");

console.log("\n=== 练习完成！请检查泛型实现是否正确 ===");
console.log("运行命令: npx tsc chapters/chapter-05-generics/practice.ts --noEmit 来检查类型错误");
