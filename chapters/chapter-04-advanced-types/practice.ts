/**
 * 第4章：高级类型与类型操作练习题
 *
 * 请完成以下练习，实现各种高级类型操作
 * 包括映射类型、条件类型、工具类型、模板字面量类型等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：映射类型练习
// ============================================================================

console.log("=== 练习1：映射类型练习 ===");

// 基础接口
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    isActive: boolean;
}

// TODO: 实现以下映射类型

// 1. 实现 MyOptional<T> - 将所有属性变为可选
// type MyOptional<T> = ?

// 2. 实现 MyRequired<T> - 将所有属性变为必需
// type MyRequired<T> = ?

// 3. 实现 MyReadonly<T> - 将所有属性变为只读
// type MyReadonly<T> = ?

// 4. 实现 Nullable<T> - 将所有属性变为可空
// type Nullable<T> = ?

// 5. 实现 DeepReadonly<T> - 深度只读（递归处理嵌套对象）
// type DeepReadonly<T> = ?

// TODO: 使用你实现的映射类型
// type OptionalUser = MyOptional<User>;
// type RequiredUser = MyRequired<Partial<User>>;
// type ReadonlyUser = MyReadonly<User>;
// type NullableUser = Nullable<User>;

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

// type DeepReadonlyNested = DeepReadonly<NestedObject>;

console.log("映射类型练习 - 请实现上述类型");

// ============================================================================
// 练习2：条件类型练习
// ============================================================================

console.log("\n=== 练习2：条件类型练习 ===");

// TODO: 实现以下条件类型

// 1. 实现 IsArray<T> - 判断类型是否为数组
// type IsArray<T> = ?

// 2. 实现 IsFunction<T> - 判断类型是否为函数
// type IsFunction<T> = ?

// 3. 实现 ArrayElement<T> - 提取数组元素类型
// type ArrayElement<T> = ?

// 4. 实现 FunctionReturnType<T> - 提取函数返回值类型
// type FunctionReturnType<T> = ?

// 5. 实现 FunctionParameters<T> - 提取函数参数类型
// type FunctionParameters<T> = ?

// 6. 实现 NonNullable<T> - 排除 null 和 undefined
// type MyNonNullable<T> = ?

// TODO: 测试你的条件类型
function testFunction(a: string, b: number): boolean {
    return a.length > b;
}

// type TestArray = IsArray<string[]>; // 应该是 true
// type TestFunction = IsFunction<typeof testFunction>; // 应该是 true
// type TestElement = ArrayElement<User[]>; // 应该是 User
// type TestReturn = FunctionReturnType<typeof testFunction>; // 应该是 boolean
// type TestParams = FunctionParameters<typeof testFunction>; // 应该是 [string, number]
// type TestNonNull = MyNonNullable<string | null | undefined>; // 应该是 string

console.log("条件类型练习 - 请实现上述类型");

// ============================================================================
// 练习3：工具类型应用练习
// ============================================================================

console.log("\n=== 练习3：工具类型应用练习 ===");

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

// TODO: 使用内置工具类型完成以下类型定义

// 1. 创建产品摘要类型（只包含 id, name, price）
// type ProductSummary = ?

// 2. 创建产品创建类型（排除 id, createdAt, updatedAt）
// type CreateProduct = ?

// 3. 创建产品更新类型（所有字段可选，但排除 id, createdAt, updatedAt）
// type UpdateProduct = ?

// 4. 创建产品状态类型（只包含 id, inStock, updatedAt）
// type ProductStatus = ?

// 5. 创建产品分类映射类型
// type ProductsByCategory = Record<string, Product[]>;

// TODO: 实现以下函数，使用你定义的类型

function createProduct(productData: any): Product {
    // TODO: 添加正确的参数类型
    return {
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...productData,
    };
}

function updateProduct(id: number, updates: any): Partial<Product> {
    // TODO: 添加正确的参数类型
    return {
        id,
        updatedAt: new Date(),
        ...updates,
    };
}

function getProductSummary(product: Product): any {
    // TODO: 添加正确的返回类型
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

console.log("创建产品:", newProduct.name);

// ============================================================================
// 练习4：模板字面量类型练习
// ============================================================================

console.log("\n=== 练习4：模板字面量类型练习 ===");

// TODO: 实现以下模板字面量类型

// 1. 实现事件名称生成器
// type EventName<T extends string> = ?
// 例如：EventName<'click'> 应该是 'onClick'

// 2. 实现 CSS 类名生成器
// type CSSClass<T extends string> = ?
// 例如：CSSClass<'button'> 应该是 'btn-button'

// 3. 实现 API 端点生成器
// type ApiEndpoint<T extends string> = ?
// 例如：ApiEndpoint<'users'> 应该是 '/api/v1/users'

// 4. 实现路径参数提取器
// type ExtractParams<T extends string> = ?
// 例如：ExtractParams<'/users/:id/posts/:postId'> 应该是 'id' | 'postId'

// 5. 实现 Getter 方法名生成器
// type GetterName<T extends string> = ?
// 例如：GetterName<'userName'> 应该是 'getUserName'

// TODO: 使用你的模板字面量类型

// type ClickEvent = EventName<'click'>;
// type ButtonClass = CSSClass<'button'>;
// type UsersEndpoint = ApiEndpoint<'users'>;
// type UserParams = ExtractParams<'/users/:id/profile/:section'>;
// type GetUserName = GetterName<'userName'>;

// 实际应用示例
interface EventHandlers {
    // TODO: 使用 EventName 类型生成事件处理器
    // [K in EventName<'click' | 'hover' | 'focus'>]: () => void;
}

console.log("模板字面量类型练习 - 请实现上述类型");

// ============================================================================
// 练习5：综合应用练习
// ============================================================================

console.log("\n=== 练习5：综合应用练习 ===");

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

// TODO: 实现以下高级类型

// 1. 实现 StateKeys<T> - 提取状态的所有键路径
// type StateKeys<T> = ?
// 例如：StateKeys<AppState> 应该包含 'user', 'products', 'cart', 'ui' 等

// 2. 实现 DeepPick<T, K> - 深度选择属性
// type DeepPick<T, K extends keyof T> = ?

// 3. 实现 StateSelector<T, K> - 状态选择器类型
// type StateSelector<T, K extends string> = ?

// 4. 实现 ActionType<T> - 动作类型生成器
// type ActionType<T extends string> = ?
// 例如：ActionType<'SET_USER'> 应该是 'SET_USER'

// 5. 实现 ActionCreator<T, P> - 动作创建器类型
// type ActionCreator<T extends string, P = void> = ?

// TODO: 使用你的类型实现状态管理

// type UserState = DeepPick<AppState, 'user'>;
// type CartState = DeepPick<AppState, 'cart'>;

// type SetUserAction = ActionType<'SET_USER'>;
// type AddToCartAction = ActionType<'ADD_TO_CART'>;

// type SetUserCreator = ActionCreator<'SET_USER', AppState['user']>;
// type AddToCartCreator = ActionCreator<'ADD_TO_CART', { productId: number; quantity: number }>;

// 实现状态管理器
class StateManager<T> {
    private state: T;

    constructor(initialState: T) {
        this.state = initialState;
    }

    // TODO: 添加类型安全的 getState 方法
    getState(): T {
        return this.state;
    }

    // TODO: 添加类型安全的 setState 方法
    setState(updates: any): void {
        // TODO: 实现类型安全的状态更新
        this.state = { ...this.state, ...updates };
    }

    // TODO: 添加类型安全的 select 方法
    select<K extends keyof T>(key: K): T[K] {
        return this.state[key];
    }
}

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
console.log("初始状态:", stateManager.select("ui").theme);

console.log("\n=== 练习完成！请检查类型实现是否正确 ===");
console.log(
    "运行命令: npx tsc chapters/chapter-04-advanced-types/practice.ts --noEmit 来检查类型错误"
);
