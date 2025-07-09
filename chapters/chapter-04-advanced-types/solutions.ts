/**
 * 第4章：高级类型与类型操作练习题解答
 *
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 展示了高级类型操作的正确实现方式
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：映射类型练习 - 解答
// ============================================================================

console.log("=== 练习1：映射类型练习 - 解答 ===");

// 基础接口
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    isActive: boolean;
}

// 1. 实现 MyOptional<T> - 将所有属性变为可选
type MyOptional<T> = {
    [P in keyof T]?: T[P];
};

// 2. 实现 MyRequired<T> - 将所有属性变为必需
type MyRequired<T> = {
    [P in keyof T]-?: T[P];
};

// 3. 实现 MyReadonly<T> - 将所有属性变为只读
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 4. 实现 Nullable<T> - 将所有属性变为可空
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

// 5. 实现 DeepReadonly<T> - 深度只读（递归处理嵌套对象）
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 使用映射类型
type OptionalUser = MyOptional<User>;
type RequiredUser = MyRequired<Partial<User>>;
type ReadonlyUser = MyReadonly<User>;
type NullableUser = Nullable<User>;

// 测试映射类型
interface NestedObject {
    user: User;
    settings: {
        theme: string;
        notifications: {
            email: boolean;
            push: boolean;
        };
    };
}

type DeepReadonlyNested = DeepReadonly<NestedObject>;

// 实际使用示例
const optionalUser: OptionalUser = { name: "张三" }; // 只需要部分属性
const readonlyUser: ReadonlyUser = {
    id: 1,
    name: "李四",
    email: "lisi@example.com",
    age: 25,
    isActive: true,
};
// readonlyUser.name = "王五"; // 错误：无法分配到只读属性

console.log("映射类型示例:", { optionalUser, readonlyUser });

// ============================================================================
// 练习2：条件类型练习 - 解答
// ============================================================================

console.log("\n=== 练习2：条件类型练习 - 解答 ===");

// 1. 实现 IsArray<T> - 判断类型是否为数组
type IsArray<T> = T extends any[] ? true : false;

// 2. 实现 IsFunction<T> - 判断类型是否为函数
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

// 3. 实现 ArrayElement<T> - 提取数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// 4. 实现 FunctionReturnType<T> - 提取函数返回值类型
type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 5. 实现 FunctionParameters<T> - 提取函数参数类型
type FunctionParameters<T> = T extends (...args: infer P) => any ? P : never;

// 6. 实现 NonNullable<T> - 排除 null 和 undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;

// 测试条件类型
function testFunction(a: string, b: number): boolean {
    return a.length > b;
}

type TestArray = IsArray<string[]>; // true
type TestFunction = IsFunction<typeof testFunction>; // true
type TestElement = ArrayElement<User[]>; // User
type TestReturn = FunctionReturnType<typeof testFunction>; // boolean
type TestParams = FunctionParameters<typeof testFunction>; // [string, number]
type TestNonNull = MyNonNullable<string | null | undefined>; // string

// 验证类型
const testArray: TestArray = true;
const testFunction: TestFunction = true;
const testReturn: TestReturn = true;

console.log("条件类型验证:", { testArray, testFunction, testReturn });

// ============================================================================
// 练习3：工具类型应用练习 - 解答
// ============================================================================

console.log("\n=== 练习3：工具类型应用练习 - 解答 ===");

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    inStock: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

// 1. 创建产品摘要类型（只包含 id, name, price）
type ProductSummary = Pick<Product, "id" | "name" | "price">;

// 2. 创建产品创建类型（排除 id, createdAt, updatedAt）
type CreateProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

// 3. 创建产品更新类型（所有字段可选，但排除 id, createdAt, updatedAt）
type UpdateProduct = Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;

// 4. 创建产品状态类型（只包含 id, inStock, updatedAt）
type ProductStatus = Pick<Product, "id" | "inStock" | "updatedAt">;

// 5. 创建产品分类映射类型
type ProductsByCategory = Record<string, Product[]>;

// 实现函数
function createProduct(productData: CreateProduct): Product {
    return {
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...productData,
    };
}

function updateProduct(id: number, updates: UpdateProduct): Partial<Product> {
    return {
        id,
        updatedAt: new Date(),
        ...updates,
    };
}

function getProductSummary(product: Product): ProductSummary {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
    };
}

// 测试函数
const newProduct = createProduct({
    name: "TypeScript 指南",
    price: 99.9,
    description: "学习 TypeScript 的最佳指南",
    category: "书籍",
    inStock: true,
    tags: ["编程", "TypeScript", "前端"],
});

const productSummary = getProductSummary(newProduct);
console.log("产品摘要:", productSummary);

// ============================================================================
// 练习4：模板字面量类型练习 - 解答
// ============================================================================

console.log("\n=== 练习4：模板字面量类型练习 - 解答 ===");

// 1. 实现事件名称生成器
type EventName<T extends string> = `on${Capitalize<T>}`;

// 2. 实现 CSS 类名生成器
type CSSClass<T extends string> = `btn-${T}`;

// 3. 实现 API 端点生成器
type ApiEndpoint<T extends string> = `/api/v1/${T}`;

// 4. 实现路径参数提取器
type ExtractParams<T extends string> = T extends `${string}:${infer P}/${infer Rest}`
    ? P | ExtractParams<Rest>
    : T extends `${string}:${infer P}`
      ? P
      : never;

// 5. 实现 Getter 方法名生成器
type GetterName<T extends string> = `get${Capitalize<T>}`;

// 使用模板字面量类型
type ClickEvent = EventName<"click">; // 'onClick'
type ButtonClass = CSSClass<"button">; // 'btn-button'
type UsersEndpoint = ApiEndpoint<"users">; // '/api/v1/users'
type UserParams = ExtractParams<"/users/:id/profile/:section">; // 'id' | 'section'
type GetUserName = GetterName<"userName">; // 'getUserName'

// 实际应用示例
interface EventHandlers {
    [K in EventName<"click" | "hover" | "focus">]: () => void;
}

const eventHandlers: EventHandlers = {
    onClick: () => console.log("点击事件"),
    onHover: () => console.log("悬停事件"),
    onFocus: () => console.log("焦点事件"),
};

// 验证类型
const clickEvent: ClickEvent = "onClick";
const buttonClass: ButtonClass = "btn-button";
const usersEndpoint: UsersEndpoint = "/api/v1/users";

console.log("模板字面量类型:", { clickEvent, buttonClass, usersEndpoint });

// ============================================================================
// 练习5：综合应用练习 - 解答
// ============================================================================

console.log("\n=== 练习5：综合应用练习 - 解答 ===");

// 场景：实现一个类型安全的状态管理系统
interface AppState {
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    products: Product[];
    cart: {
        items: Array<{
            productId: number;
            quantity: number;
        }>;
        total: number;
    };
    ui: {
        loading: boolean;
        error: string | null;
        theme: "light" | "dark";
    };
}

// 1. 实现 StateKeys<T> - 提取状态的所有键路径
type StateKeys<T> = keyof T;

// 2. 实现 DeepPick<T, K> - 深度选择属性
type DeepPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// 3. 实现 StateSelector<T, K> - 状态选择器类型
type StateSelector<T, K extends keyof T> = (state: T) => T[K];

// 4. 实现 ActionType<T> - 动作类型生成器
type ActionType<T extends string> = T;

// 5. 实现 ActionCreator<T, P> - 动作创建器类型
type ActionCreator<T extends string, P = void> = P extends void
    ? () => { type: T }
    : (payload: P) => { type: T; payload: P };

// 使用类型
type UserState = DeepPick<AppState, "user">;
type CartState = DeepPick<AppState, "cart">;

type SetUserAction = ActionType<"SET_USER">;
type AddToCartAction = ActionType<"ADD_TO_CART">;

type SetUserCreator = ActionCreator<"SET_USER", AppState["user"]>;
type AddToCartCreator = ActionCreator<"ADD_TO_CART", { productId: number; quantity: number }>;

// 实现状态管理器
class StateManager<T> {
    private state: T;
    private listeners: Array<(state: T) => void> = [];

    constructor(initialState: T) {
        this.state = initialState;
    }

    getState(): T {
        return this.state;
    }

    setState(updates: Partial<T>): void {
        this.state = { ...this.state, ...updates };
        this.listeners.forEach((listener) => listener(this.state));
    }

    select<K extends keyof T>(key: K): T[K] {
        return this.state[key];
    }

    subscribe(listener: (state: T) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    createSelector<K extends keyof T>(key: K): StateSelector<T, K> {
        return (state: T) => state[key];
    }
}

// 动作创建器实现
const setUser: SetUserCreator = (payload) => ({
    type: "SET_USER",
    payload,
});

const addToCart: AddToCartCreator = (payload) => ({
    type: "ADD_TO_CART",
    payload,
});

// 测试状态管理器
const initialState: AppState = {
    user: null,
    products: [],
    cart: {
        items: [],
        total: 0,
    },
    ui: {
        loading: false,
        error: null,
        theme: "light",
    },
};

const stateManager = new StateManager(initialState);

// 创建选择器
const userSelector = stateManager.createSelector("user");
const uiSelector = stateManager.createSelector("ui");

// 订阅状态变化
const unsubscribe = stateManager.subscribe((state) => {
    console.log("状态更新:", state.ui.theme);
});

// 更新状态
stateManager.setState({
    user: { id: 1, name: "张三", email: "zhangsan@example.com" },
});

stateManager.setState({
    ui: { ...stateManager.select("ui"), theme: "dark" },
});

console.log("当前用户:", userSelector(stateManager.getState()));
console.log("当前主题:", uiSelector(stateManager.getState()).theme);

// 测试动作创建器
const userAction = setUser({ id: 2, name: "李四", email: "lisi@example.com" });
const cartAction = addToCart({ productId: 1, quantity: 2 });

console.log("用户动作:", userAction);
console.log("购物车动作:", cartAction);

console.log("\n=== 解答完成！ ===");
console.log("💡 学习要点:");
console.log("1. 映射类型用于转换现有类型的结构");
console.log("2. 条件类型提供类型级别的逻辑判断");
console.log("3. 工具类型是 TypeScript 内置的强大类型操作工具");
console.log("4. 模板字面量类型增强字符串类型的表达能力");
console.log("5. 高级类型组合使用可以构建复杂的类型系统");
