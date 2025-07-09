/**
 * 第2章：类型系统深入理解练习题解答
 *
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 展示了类型系统的正确使用方式
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：类型别名练习 - 解答
// ============================================================================

console.log("=== 练习1：类型别名练习 - 解答 ===");

// 1. 定义用户ID类型（可以是数字或字符串）
type UserID = string | number;

// 2. 定义用户状态类型（活跃、非活跃、暂停）
type UserStatus = "active" | "inactive" | "suspended";

// 3. 定义权限级别类型（只读、读写、管理员）
type PermissionLevel = "readonly" | "readwrite" | "admin";

// 4. 定义回调函数类型
type EventCallback = (event: string, data?: any) => void;

// 5. 定义配置对象类型
type AppConfig = {
    apiUrl: string;
    timeout: number;
    debug: boolean;
    retries?: number;
    headers?: Record<string, string>;
};

// 使用类型别名
const userId: UserID = "user_123";
const userStatus: UserStatus = "active";
const permission: PermissionLevel = "admin";

const handleClick: EventCallback = (event: string, data?: any) => {
    console.log("点击事件:", event, data);
};

const config: AppConfig = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    debug: true,
    retries: 3,
};

console.log("用户ID:", userId);
console.log("用户状态:", userStatus);
console.log("权限级别:", permission);
console.log("配置:", config);

// ============================================================================
// 练习2：接口练习 - 解答
// ============================================================================

console.log("\n=== 练习2：接口练习 - 解答 ===");

// 1. 定义基础用户接口
interface User {
    id: UserID;
    name: string;
    email: string;
    status: UserStatus;
    createdAt: Date;
    lastLoginAt?: Date;
}

// 2. 定义地址接口
interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// 3. 定义扩展用户接口（继承User，添加地址信息）
interface UserWithAddress extends User {
    address: Address;
    phone?: string;
}

// 4. 定义产品接口
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    category: string;
    inStock: boolean;
    tags: string[];
    rating?: number;
}

// 5. 定义购物车接口
interface ShoppingCart {
    id: string;
    userId: UserID;
    items: CartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;

    // 方法
    addItem(product: Product, quantity: number): void;
    removeItem(productId: string): void;
    updateQuantity(productId: string, quantity: number): void;
    clear(): void;
    calculateTotal(): number;
}

interface CartItem {
    product: Product;
    quantity: number;
    subtotal: number;
}

// 实现接口
const user: User = {
    id: "user_001",
    name: "张三",
    email: "zhangsan@example.com",
    status: "active",
    createdAt: new Date(),
    lastLoginAt: new Date(),
};

const address: Address = {
    street: "中关村大街1号",
    city: "北京市",
    state: "北京市",
    zipCode: "100000",
    country: "中国",
};

const userWithAddress: UserWithAddress = {
    ...user,
    address,
    phone: "13800138000",
};

const product: Product = {
    id: "prod_001",
    name: "TypeScript 实战指南",
    price: 89.9,
    description: "深入学习 TypeScript 的实用指南",
    category: "书籍",
    inStock: true,
    tags: ["编程", "TypeScript", "前端"],
    rating: 4.8,
};

console.log("用户信息:", user.name, user.email);
console.log("用户地址:", userWithAddress.address.city);
console.log("产品信息:", product.name, product.price);

// ============================================================================
// 练习3：联合类型练习 - 解答
// ============================================================================

console.log("\n=== 练习3：联合类型练习 - 解答 ===");

// 1. 定义主题类型（浅色、深色、自动）
type Theme = "light" | "dark" | "auto";

// 2. 定义响应状态类型（成功、错误、加载中）
type ResponseStatus = "success" | "error" | "loading";

// 3. 定义输入值类型（字符串、数字、布尔值）
type InputValue = string | number | boolean;

// 4. 定义API响应类型
type ApiResponse =
    | { status: "success"; data: any; message?: string }
    | { status: "error"; error: string; code: number }
    | { status: "loading"; progress?: number };

// 5. 定义事件类型
type UIEvent =
    | { type: "click"; target: string; coordinates: { x: number; y: number } }
    | { type: "keypress"; key: string; ctrlKey: boolean; shiftKey: boolean }
    | { type: "scroll"; scrollTop: number; scrollLeft: number }
    | { type: "resize"; width: number; height: number };

// 实现处理联合类型的函数
function setTheme(theme: Theme): void {
    switch (theme) {
        case "light":
            console.log("设置为浅色主题");
            break;
        case "dark":
            console.log("设置为深色主题");
            break;
        case "auto":
            console.log("设置为自动主题");
            break;
        default:
            const exhaustiveCheck: never = theme;
            return exhaustiveCheck;
    }
}

function handleResponse(response: ApiResponse): void {
    switch (response.status) {
        case "success":
            console.log("请求成功:", response.data);
            break;
        case "error":
            console.log("请求失败:", response.error, "错误码:", response.code);
            break;
        case "loading":
            console.log("加载中...", response.progress ? `${response.progress}%` : "");
            break;
        default:
            const exhaustiveCheck: never = response;
            return exhaustiveCheck;
    }
}

function processInput(value: InputValue): string {
    if (typeof value === "string") {
        return `字符串: ${value.toUpperCase()}`;
    } else if (typeof value === "number") {
        return `数字: ${value.toFixed(2)}`;
    } else {
        return `布尔值: ${value ? "真" : "假"}`;
    }
}

function handleEvent(event: UIEvent): void {
    switch (event.type) {
        case "click":
            console.log(
                `点击 ${event.target} 在坐标 (${event.coordinates.x}, ${event.coordinates.y})`
            );
            break;
        case "keypress":
            console.log(
                `按键 ${event.key}`,
                event.ctrlKey ? "(Ctrl)" : "",
                event.shiftKey ? "(Shift)" : ""
            );
            break;
        case "scroll":
            console.log(`滚动到 (${event.scrollLeft}, ${event.scrollTop})`);
            break;
        case "resize":
            console.log(`窗口大小调整为 ${event.width}x${event.height}`);
            break;
        default:
            const exhaustiveCheck: never = event;
            return exhaustiveCheck;
    }
}

// 测试联合类型函数
setTheme("dark");
handleResponse({ status: "success", data: { users: [] } });
console.log(processInput("hello"));
console.log(processInput(42));
console.log(processInput(true));

handleEvent({
    type: "click",
    target: "button",
    coordinates: { x: 100, y: 200 },
});

// ============================================================================
// 练习4：交叉类型练习 - 解答
// ============================================================================

console.log("\n=== 练习4：交叉类型练习 - 解答 ===");

// 1. 定义个人信息类型
type PersonalInfo = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: "male" | "female" | "other";
    nationality: string;
};

// 2. 定义联系信息类型
type ContactInfo = {
    email: string;
    phone: string;
    address: Address;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
};

// 3. 定义工作信息类型
type WorkInfo = {
    jobTitle: string;
    department: string;
    employeeId: string;
    startDate: Date;
    salary: number;
    manager?: string;
};

// 4. 定义时间戳类型
type Timestamps = {
    createdAt: Date;
    updatedAt: Date;
};

// 5. 定义完整用户类型（个人信息 + 联系信息 + 时间戳）
type FullUser = PersonalInfo & ContactInfo & Timestamps;

// 6. 定义员工类型（个人信息 + 联系信息 + 工作信息 + 时间戳）
type Employee = PersonalInfo & ContactInfo & WorkInfo & Timestamps;

// 实现交叉类型对象
const fullUser: FullUser = {
    // PersonalInfo
    firstName: "三",
    lastName: "张",
    dateOfBirth: new Date("1995-06-15"),
    gender: "male",
    nationality: "中国",
    // ContactInfo
    email: "zhangsan@example.com",
    phone: "13800138000",
    address: {
        street: "中关村大街1号",
        city: "北京市",
        state: "北京市",
        zipCode: "100000",
        country: "中国",
    },
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
};

const employee: Employee = {
    ...fullUser,
    // WorkInfo
    jobTitle: "前端工程师",
    department: "技术部",
    employeeId: "EMP001",
    startDate: new Date("2023-01-15"),
    salary: 15000,
    manager: "李经理",
};

// 实现处理交叉类型的函数
function createUserProfile(personal: PersonalInfo, contact: ContactInfo): FullUser {
    return {
        ...personal,
        ...contact,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

function promoteToEmployee(user: FullUser, workInfo: WorkInfo): Employee {
    return {
        ...user,
        ...workInfo,
        updatedAt: new Date(),
    };
}

console.log("完整用户:", `${fullUser.lastName}${fullUser.firstName}`);
console.log("员工信息:", `${employee.jobTitle} - ${employee.department}`);

// ============================================================================
// 练习5：类型断言和类型守卫练习 - 解答
// ============================================================================

console.log("\n=== 练习5：类型断言和类型守卫练习 - 解答 ===");

// 1. 实现字符串类型守卫
function isString(value: unknown): value is string {
    return typeof value === "string";
}

// 2. 实现数字类型守卫
function isNumber(value: unknown): value is number {
    return typeof value === "number" && !isNaN(value);
}

// 3. 实现用户对象类型守卫
function isUser(obj: any): obj is User {
    return (
        obj &&
        typeof obj === "object" &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.email === "string" &&
        ["active", "inactive", "suspended"].includes(obj.status)
    );
}

// 4. 实现数组类型守卫
function isArray<T>(value: unknown): value is T[] {
    return Array.isArray(value);
}

// 实现使用类型守卫的函数
function processUnknownValue(value: unknown): string {
    if (isString(value)) {
        return `字符串值: ${value}`;
    } else if (isNumber(value)) {
        return `数字值: ${value}`;
    } else if (typeof value === "boolean") {
        return `布尔值: ${value}`;
    } else if (value === null) {
        return "空值";
    } else if (value === undefined) {
        return "未定义";
    } else if (isArray(value)) {
        return `数组，长度: ${value.length}`;
    } else if (typeof value === "object") {
        return "对象类型";
    } else {
        return "未知类型";
    }
}

function safeParseJSON(jsonString: string): any {
    try {
        const parsed = JSON.parse(jsonString);
        return parsed;
    } catch (error) {
        console.log("JSON 解析失败:", (error as Error).message);
        return null;
    }
}

function getArrayLength(value: unknown): number {
    if (isArray(value)) {
        return value.length;
    } else if (isString(value)) {
        return value.length;
    } else {
        return 0;
    }
}

// 测试类型守卫
console.log(processUnknownValue("hello"));
console.log(processUnknownValue(42));
console.log(processUnknownValue(true));
console.log(processUnknownValue(null));
console.log(processUnknownValue([1, 2, 3]));

const jsonData = safeParseJSON('{"name": "test", "value": 123}');
console.log("解析的JSON:", jsonData);

console.log("数组长度:", getArrayLength([1, 2, 3, 4, 5]));
console.log("字符串长度:", getArrayLength("hello"));

// ============================================================================
// 练习6：实际应用综合练习 - 解答
// ============================================================================

console.log("\n=== 练习6：实际应用综合练习 - 解答 ===");

// 1. 定义作者类型
interface Author {
    id: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    socialLinks?: {
        twitter?: string;
        github?: string;
        website?: string;
    };
    joinedAt: Date;
}

// 2. 定义文章状态类型
type ArticleStatus = "draft" | "published" | "archived" | "deleted";

// 3. 定义文章类别类型
type ArticleCategory = "technology" | "lifestyle" | "travel" | "food" | "health" | "education";

// 4. 定义文章接口
interface Article {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    author: Author;
    category: ArticleCategory;
    status: ArticleStatus;
    tags: string[];
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    likeCount: number;
    comments: Comment[];
    featuredImage?: string;
}

// 5. 定义评论接口
interface Comment {
    id: string;
    content: string;
    author: {
        name: string;
        email: string;
        avatar?: string;
    };
    articleId: string;
    parentId?: string; // 用于回复评论
    createdAt: Date;
    updatedAt: Date;
    likes: number;
}

// 6. 定义博客配置类型
type BlogConfig = {
    siteName: string;
    description: string;
    baseUrl: string;
    theme: Theme;
    language: string;
    postsPerPage: number;
    enableComments: boolean;
    enableSearch: boolean;
    socialLinks: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    seo: {
        defaultTitle: string;
        defaultDescription: string;
        keywords: string[];
    };
};

// 7. 定义文章操作类型
type ArticleAction =
    | {
          type: "create";
          article: Omit<
              Article,
              "id" | "createdAt" | "updatedAt" | "viewCount" | "likeCount" | "comments"
          >;
      }
    | {
          type: "update";
          id: string;
          updates: Partial<Pick<Article, "title" | "content" | "category" | "tags">>;
      }
    | { type: "publish"; id: string }
    | { type: "archive"; id: string }
    | { type: "delete"; id: string }
    | { type: "like"; id: string }
    | { type: "view"; id: string };

// 8. 定义搜索结果类型
type SearchResult<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
};

// 实现博客系统函数
function createArticle(
    title: string,
    content: string,
    author: Author,
    category: ArticleCategory
): Article {
    return {
        id: `article_${Date.now()}`,
        title,
        content,
        excerpt: content.substring(0, 200) + "...",
        author,
        category,
        status: "draft",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        likeCount: 0,
        comments: [],
    };
}

function updateArticleStatus(article: Article, status: ArticleStatus): Article {
    const updatedArticle = { ...article, status, updatedAt: new Date() };

    if (status === "published" && !article.publishedAt) {
        updatedArticle.publishedAt = new Date();
    }

    return updatedArticle;
}

function addComment(
    article: Article,
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "likes">
): Article {
    const newComment: Comment = {
        ...comment,
        id: `comment_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
    };

    return {
        ...article,
        comments: [...article.comments, newComment],
        updatedAt: new Date(),
    };
}

function searchArticles(
    articles: Article[],
    query: string,
    category?: ArticleCategory,
    page: number = 1,
    pageSize: number = 10
): SearchResult<Article> {
    const filteredArticles = articles.filter((article) => {
        const matchesQuery =
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

        const matchesCategory = !category || article.category === category;

        return matchesQuery && matchesCategory && article.status === "published";
    });

    const total = filteredArticles.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredArticles.slice(startIndex, endIndex);

    return {
        items,
        total,
        page,
        pageSize,
        hasNext: endIndex < total,
        hasPrev: page > 1,
    };
}

function getArticlesByAuthor(articles: Article[], authorId: string): Article[] {
    return articles.filter(
        (article) => article.author.id === authorId && article.status === "published"
    );
}

// 测试博客系统
const author: Author = {
    id: "author_001",
    name: "技术博主",
    email: "blogger@example.com",
    bio: "专注于前端技术分享",
    joinedAt: new Date("2023-01-01"),
};

const article = createArticle(
    "TypeScript 学习指南",
    "这是一篇关于 TypeScript 的详细学习指南，涵盖了从基础语法到高级特性的所有内容...",
    author,
    "technology"
);

const publishedArticle = updateArticleStatus(article, "published");

const articleWithComment = addComment(publishedArticle, {
    content: "这篇文章写得很好，学到了很多！",
    author: {
        name: "读者",
        email: "reader@example.com",
    },
    articleId: article.id,
});

console.log("创建的文章:", article.title);
console.log("文章状态:", publishedArticle.status);
console.log("评论数量:", articleWithComment.comments.length);

// 搜索测试
const searchResult = searchArticles([articleWithComment], "TypeScript", "technology");
console.log("搜索结果:", searchResult.total, "篇文章");

console.log("\n=== 解答完成！ ===");
console.log("💡 学习要点:");
console.log("1. 类型别名让复杂类型更易读和维护");
console.log("2. 接口定义对象结构，支持继承和扩展");
console.log("3. 联合类型处理多种可能性，交叉类型组合类型");
console.log("4. 类型断言和类型守卫提供类型安全保障");
console.log("5. 综合运用各种类型特性可以构建复杂的类型系统");
