/**
 * 第4章：TypeScript 高级类型示例
 *
 * 本文件展示了 TypeScript 高级类型特性
 * 包括映射类型、条件类型、工具类型、模板字面量类型等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. 映射类型 (Mapped Types)
// ============================================================================

console.log("=== 映射类型示例 ===");

// 基础接口
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// 自定义映射类型
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};

type MyPartial<T> = {
    [P in keyof T]?: T[P];
};

type MyRequired<T> = {
    [P in keyof T]-?: T[P]; // -? 移除可选修饰符
};

// 使用映射类型
type ReadonlyUser = MyReadonly<User>;
type PartialUser = MyPartial<User>;
type RequiredUser = MyRequired<PartialUser>;

// 实际使用示例
const readonlyUser: ReadonlyUser = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    age: 25,
};

// readonlyUser.name = "李四"; // 错误：无法分配到 "name" ，因为它是只读属性

const partialUser: PartialUser = {
    name: "李四", // 只需要部分属性
};

console.log("只读用户:", readonlyUser);
console.log("部分用户:", partialUser);

// 高级映射类型：添加前缀
type AddPrefix<T, P extends string> = {
    [K in keyof T as `${P}${string & K}`]: T[K];
};

type PrefixedUser = AddPrefix<User, "user_">;
// 结果: { user_id: number; user_name: string; user_email: string; user_age: number; }

// ============================================================================
// 2. 条件类型 (Conditional Types)
// ============================================================================

console.log("\n=== 条件类型示例 ===");

// 基础条件类型
type IsString<T> = T extends string ? true : false;
type IsNumber<T> = T extends number ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
type Test3 = IsNumber<42>; // true

// 实用条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type SafeString = NonNullable<string | null | undefined>; // string

// 提取函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUserInfo(): { id: number; name: string } {
    return { id: 1, name: "张三" };
}

type UserInfo = ReturnType<typeof getUserInfo>; // { id: number; name: string }

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;
type StringOrNumberArray = ToArray<string | number>; // string[] | number[]

// 实际使用
function processValue<T>(value: T): ToArray<T> {
    return [value] as ToArray<T>;
}

const stringArray = processValue("hello"); // string[]
const numberArray = processValue(42); // number[]

console.log("字符串数组:", stringArray);
console.log("数字数组:", numberArray);

// ============================================================================
// 3. 内置工具类型 (Utility Types)
// ============================================================================

console.log("\n=== 工具类型示例 ===");

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    category: string;
    inStock: boolean;
}

// Pick - 选择特定属性
type ProductSummary = Pick<Product, "id" | "name" | "price">;
const productSummary: ProductSummary = {
    id: 1,
    name: "iPhone 14",
    price: 6999,
};

// Omit - 排除特定属性
type ProductWithoutId = Omit<Product, "id">;
const newProduct: ProductWithoutId = {
    name: "iPad Pro",
    price: 8999,
    category: "平板电脑",
    inStock: true,
    description: "专业级平板电脑",
};

// Record - 创建记录类型
type ProductCatalog = Record<string, Product>;
const catalog: ProductCatalog = {
    iphone: {
        id: 1,
        name: "iPhone 14",
        price: 6999,
        category: "手机",
        inStock: true,
    },
    ipad: {
        id: 2,
        name: "iPad Pro",
        price: 8999,
        category: "平板电脑",
        inStock: true,
    },
};

// Exclude 和 Extract
type AllTypes = string | number | boolean | null;
type StringOrNumber = Exclude<AllTypes, boolean | null>; // string | number
type OnlyBoolean = Extract<AllTypes, boolean>; // boolean

console.log("产品摘要:", productSummary);
console.log("新产品:", newProduct);
console.log("产品目录:", Object.keys(catalog));

// ============================================================================
// 4. 模板字面量类型 (Template Literal Types)
// ============================================================================

console.log("\n=== 模板字面量类型示例 ===");

// 基础模板字面量类型
type Greeting = `Hello ${string}`;
type SpecificGreeting = `Hello ${"World" | "TypeScript" | "JavaScript"}`;

// 事件名称生成
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // 'onClick'
type MouseEvent = EventName<"mouseOver">; // 'onMouseOver'

// API 端点生成
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint<T extends string> = `api/v1/${T}`;
type UserEndpoint = ApiEndpoint<"users">; // 'api/v1/users'
type ProductEndpoint = ApiEndpoint<"products">; // 'api/v1/products'

// CSS 属性生成
type CSSProperty<T extends string> = `--${T}`;
type ColorProperty = CSSProperty<"primary-color">; // '--primary-color'

// 实际使用示例
interface EventHandlers {
    onClick: () => void;
    onMouseOver: () => void;
    onFocus: () => void;
}

const handlers: EventHandlers = {
    onClick: () => console.log("点击事件"),
    onMouseOver: () => console.log("鼠标悬停事件"),
    onFocus: () => console.log("焦点事件"),
};

// 路径参数类型
type PathParams<T extends string> = T extends `${string}:${infer P}/${infer Rest}`
    ? P | PathParams<Rest>
    : T extends `${string}:${infer P}`
      ? P
      : never;

type UserPath = "/users/:id/posts/:postId";
type UserPathParams = PathParams<UserPath>; // 'id' | 'postId'

console.log("事件处理器已注册");

// ============================================================================
// 5. keyof 和 typeof 操作符
// ============================================================================

console.log("\n=== keyof 和 typeof 示例 ===");

// keyof 操作符
type UserKeys = keyof User; // 'id' | 'name' | 'email' | 'age'

// 安全的属性访问
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user: User = {
    id: 1,
    name: "王五",
    email: "wangwu@example.com",
    age: 30,
};

const userName = getProperty(user, "name"); // string
const userAge = getProperty(user, "age"); // number

// typeof 操作符
const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    features: {
        auth: true,
        cache: false,
    },
} as const; // as const 确保字面量类型

type Config = typeof config;
type ApiUrl = typeof config.apiUrl; // "https://api.example.com"
type Features = typeof config.features; // { readonly auth: true; readonly cache: false; }

console.log("用户名:", userName);
console.log("用户年龄:", userAge);
console.log("配置类型已定义");

// ============================================================================
// 6. 索引访问类型 (Indexed Access Types)
// ============================================================================

console.log("\n=== 索引访问类型示例 ===");

interface Company {
    name: string;
    employees: {
        id: number;
        name: string;
        position: string;
        department: {
            name: string;
            budget: number;
        };
    }[];
    headquarters: {
        address: string;
        country: string;
    };
}

// 访问嵌套类型
type Employee = Company["employees"][number]; // 数组元素类型
type Department = Employee["department"]; // { name: string; budget: number; }
type Headquarters = Company["headquarters"]; // { address: string; country: string; }

// 动态访问类型
type GetProperty<T, K extends keyof T> = T[K];
type CompanyName = GetProperty<Company, "name">; // string

// 实际使用
const company: Company = {
    name: "科技有限公司",
    employees: [
        {
            id: 1,
            name: "张三",
            position: "前端工程师",
            department: {
                name: "技术部",
                budget: 1000000,
            },
        },
        {
            id: 2,
            name: "李四",
            position: "后端工程师",
            department: {
                name: "技术部",
                budget: 1000000,
            },
        },
    ],
    headquarters: {
        address: "北京市朝阳区",
        country: "中国",
    },
};

function getEmployeeInfo(company: Company, index: number): Employee {
    return company.employees[index];
}

const firstEmployee = getEmployeeInfo(company, 0);
console.log("第一个员工:", firstEmployee.name, "-", firstEmployee.position);

// ============================================================================
// 7. 实际应用：API 响应类型生成
// ============================================================================

console.log("\n=== 实际应用示例 ===");

// 基础 API 响应类型
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp: number;
}

// 分页响应类型
interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 错误响应类型
interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: number;
}

// 联合响应类型
type ApiResult<T> = ApiResponse<T> | ErrorResponse;

// 使用示例
type UserListResponse = PaginatedResponse<User>;
type UserDetailResponse = ApiResult<User>;

// 模拟 API 响应
const userListResponse: UserListResponse = {
    success: true,
    data: [user],
    message: "获取用户列表成功",
    timestamp: Date.now(),
    pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
    },
};

console.log("API 响应示例:", {
    success: userListResponse.success,
    dataCount: userListResponse.data.length,
    currentPage: userListResponse.pagination.page,
});

console.log("\n=== 第4章示例代码执行完成 ===");
