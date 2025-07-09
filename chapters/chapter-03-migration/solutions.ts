/**
 * 第3章：从 JavaScript 到 TypeScript 迁移练习题解答
 *
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 展示了如何正确地将 JavaScript 代码迁移到 TypeScript
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：基础函数迁移 - 解答
// ============================================================================

console.log("=== 练习1：基础函数迁移 - 解答 ===");

// 定义会员等级类型
type MemberLevel = "bronze" | "silver" | "gold" | "platinum";

// 定义货币类型
type Currency = "CNY" | "USD" | "EUR" | "JPY";

// 定义地区类型
type Locale = "zh-CN" | "en-US" | "ja-JP" | "de-DE";

function calculateDiscount(
    price: number,
    discountPercent: number,
    memberLevel: MemberLevel
): number {
    let discount = discountPercent;

    if (memberLevel === "gold") {
        discount += 0.05;
    } else if (memberLevel === "silver") {
        discount += 0.02;
    } else if (memberLevel === "platinum") {
        discount += 0.1;
    }

    return price * (1 - discount);
}

function formatCurrency(amount: number, currency: Currency, locale: Locale): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 测试函数
const finalPrice: number = calculateDiscount(100, 0.1, "gold");
const formattedPrice: string = formatCurrency(finalPrice, "CNY", "zh-CN");
const isValidEmail: boolean = validateEmail("test@example.com");

console.log("最终价格:", formattedPrice);
console.log("邮箱验证:", isValidEmail);

// ============================================================================
// 练习2：对象和接口迁移 - 解答
// ============================================================================

console.log("\n=== 练习2：对象和接口迁移 - 解答 ===");

// 定义地址接口
interface Address {
    province: string;
    city: string;
    district: string;
    street: string;
}

// 定义联系方式接口
interface Contact {
    email: string;
    phone: string;
    address: Address;
}

// 定义课程接口
interface Course {
    id: string;
    name: string;
    credits: number;
    score: number;
}

// 定义学生接口
interface Student {
    id: number;
    name: string;
    age: number;
    grade: string;
    courses: Course[];
    contact: Contact;
    isActive: boolean;
    enrollmentDate: Date;
}

// 定义学生摘要接口
interface StudentSummary {
    name: string;
    grade: string;
    gpa: number;
    courseCount: number;
    email: string;
}

const student: Student = {
    id: 1,
    name: "张三",
    age: 20,
    grade: "大二",
    courses: [
        { id: "CS101", name: "计算机科学导论", credits: 3, score: 85 },
        { id: "MATH201", name: "高等数学", credits: 4, score: 92 },
        { id: "ENG101", name: "大学英语", credits: 2, score: 78 },
    ],
    contact: {
        email: "zhangsan@university.edu",
        phone: "13800138000",
        address: {
            province: "北京市",
            city: "北京市",
            district: "海淀区",
            street: "中关村大街1号",
        },
    },
    isActive: true,
    enrollmentDate: new Date("2022-09-01"),
};

function calculateGPA(student: Student): number {
    const totalCredits = student.courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedSum = student.courses.reduce((sum, course) => {
        return sum + (course.score / 100) * 4.0 * course.credits;
    }, 0);
    return weightedSum / totalCredits;
}

function getStudentSummary(student: Student): StudentSummary {
    return {
        name: student.name,
        grade: student.grade,
        gpa: calculateGPA(student),
        courseCount: student.courses.length,
        email: student.contact.email,
    };
}

// 测试函数
const gpa: number = calculateGPA(student);
const summary: StudentSummary = getStudentSummary(student);

console.log("学生GPA:", gpa.toFixed(2));
console.log("学生摘要:", summary);

// ============================================================================
// 练习3：数组操作函数迁移 - 解答
// ============================================================================

console.log("\n=== 练习3：数组操作函数迁移 - 解答 ===");

// 定义具有 id 属性的对象类型
interface Identifiable {
    id: number | string;
}

// 定义排序方向类型
type SortDirection = "asc" | "desc";

// 定义分页结果接口
interface PaginationResult<T> {
    items: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
}

function findById<T extends Identifiable>(items: T[], id: number | string): T | undefined {
    return items.find((item) => item.id === id);
}

function groupBy<T, K extends string | number | symbol>(
    items: T[],
    keyFn: (item: T) => K
): Record<K, T[]> {
    return items.reduce(
        (groups, item) => {
            const key = keyFn(item);
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        },
        {} as Record<K, T[]>
    );
}

function sortBy<T>(
    items: T[],
    keyFn: (item: T) => string | number,
    direction: SortDirection = "asc"
): T[] {
    return [...items].sort((a, b) => {
        const aVal = keyFn(a);
        const bVal = keyFn(b);

        if (direction === "desc") {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        } else {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
    });
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
        items: items.slice(startIndex, endIndex),
        currentPage: page,
        totalPages: Math.ceil(items.length / pageSize),
        totalItems: items.length,
        hasNext: endIndex < items.length,
        hasPrev: page > 1,
    };
}

// 定义产品接口
interface Product extends Identifiable {
    id: number;
    name: string;
    price: number;
    category: string;
}

// 测试数据
const products: Product[] = [
    { id: 1, name: "iPhone", price: 6999, category: "手机" },
    { id: 2, name: "iPad", price: 3999, category: "平板" },
    { id: 3, name: "MacBook", price: 12999, category: "电脑" },
    { id: 4, name: "AirPods", price: 1299, category: "耳机" },
    { id: 5, name: "Apple Watch", price: 2999, category: "手表" },
];

// 测试函数
const foundProduct: Product | undefined = findById(products, 3);
const groupedProducts: Record<string, Product[]> = groupBy(products, (product) => product.category);
const sortedProducts: Product[] = sortBy(products, (product) => product.price, "desc");
const paginatedProducts: PaginationResult<Product> = paginate(products, 1, 3);

console.log("找到的产品:", foundProduct?.name);
console.log("分组产品:", Object.keys(groupedProducts));
console.log(
    "排序后价格:",
    sortedProducts.map((p) => p.price)
);
console.log("分页结果:", {
    count: paginatedProducts.items.length,
    totalPages: paginatedProducts.totalPages,
});

// ============================================================================
// 练习4：类迁移 - 解答
// ============================================================================

console.log("\n=== 练习4：类迁移 - 解答 ===");

// 定义任务优先级类型
type TaskPriority = "low" | "medium" | "high" | "urgent";

// 定义任务状态类型
type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled";

// 定义任务接口
interface Task {
    id: number;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// 定义任务更新接口
interface TaskUpdate {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: Date | null;
}

class TaskManager {
    private tasks: Task[] = [];
    private nextId: number = 1;

    addTask(
        title: string,
        description?: string,
        priority: TaskPriority = "medium",
        dueDate?: string | Date
    ): Task {
        const task: Task = {
            id: this.nextId++,
            title,
            description: description || "",
            priority,
            status: "pending",
            dueDate: dueDate ? new Date(dueDate) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.tasks.push(task);
        return task;
    }

    updateTask(id: number, updates: TaskUpdate): Task {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
            throw new Error(`Task with id ${id} not found`);
        }

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updates,
            updatedAt: new Date(),
        };

        return this.tasks[taskIndex];
    }

    deleteTask(id: number): boolean {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
            return false;
        }

        this.tasks.splice(taskIndex, 1);
        return true;
    }

    getTasksByStatus(status: TaskStatus): Task[] {
        return this.tasks.filter((task) => task.status === status);
    }

    getTasksByPriority(priority: TaskPriority): Task[] {
        return this.tasks.filter((task) => task.priority === priority);
    }

    getOverdueTasks(): Task[] {
        const now = new Date();
        return this.tasks.filter(
            (task) => task.dueDate && task.dueDate < now && task.status !== "completed"
        );
    }

    getAllTasks(): Task[] {
        return [...this.tasks];
    }

    getTaskById(id: number): Task | undefined {
        return this.tasks.find((task) => task.id === id);
    }
}

// 测试类
const taskManager = new TaskManager();

const task1: Task = taskManager.addTask(
    "学习 TypeScript",
    "完成 TypeScript 基础教程",
    "high",
    "2024-12-31"
);

const task2: Task = taskManager.addTask("写项目文档", "为项目编写详细的使用文档", "medium");

taskManager.updateTask(task1.id, { status: "in-progress" });

console.log("高优先级任务:", taskManager.getTasksByPriority("high").length);
console.log("进行中的任务:", taskManager.getTasksByStatus("in-progress").length);
console.log("逾期任务:", taskManager.getOverdueTasks().length);

// ============================================================================
// 练习5：配置对象迁移 - 解答
// ============================================================================

console.log("\n=== 练习5：配置对象迁移 - 解答 ===");

// 定义 HTTP 方法类型
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

// 定义数据库类型
type DatabaseType = "postgresql" | "mysql" | "sqlite" | "mongodb";

// 定义 JWT 算法类型
type JwtAlgorithm = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512";

// 定义日志级别类型
type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

// 定义日志格式类型
type LogFormat = "json" | "text" | "simple";

// 定义日志输出类型
type LogOutput = "console" | "file" | "syslog";

// 定义 CORS 配置接口
interface CorsConfig {
    enabled: boolean;
    origins: string[];
    methods: HttpMethod[];
    credentials: boolean;
}

// 定义服务器配置接口
interface ServerConfig {
    host: string;
    port: number;
    ssl: boolean;
    cors: CorsConfig;
}

// 定义数据库连接池配置接口
interface DatabasePoolConfig {
    min: number;
    max: number;
    idle: number;
}

// 定义数据库配置接口
interface DatabaseConfig {
    type: DatabaseType;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    pool: DatabasePoolConfig;
}

// 定义 JWT 配置接口
interface JwtConfig {
    secret: string;
    expiresIn: string;
    algorithm: JwtAlgorithm;
}

// 定义 OAuth 提供商配置接口
interface OAuthProviderConfig {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
}

// 定义 OAuth 配置接口
interface OAuthConfig {
    google: OAuthProviderConfig;
    github: OAuthProviderConfig;
}

// 定义认证配置接口
interface AuthConfig {
    jwt: JwtConfig;
    oauth: OAuthConfig;
}

// 定义功能特性配置接口
interface FeatureConfig {
    enableRegistration: boolean;
    enablePasswordReset: boolean;
    enableEmailVerification: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
}

// 定义日志文件配置接口
interface LogFileConfig {
    path: string;
    maxSize: string;
    maxFiles: number;
}

// 定义日志配置接口
interface LoggingConfig {
    level: LogLevel;
    format: LogFormat;
    outputs: LogOutput[];
    file: LogFileConfig;
}

// 定义应用配置接口
interface AppConfig {
    server: ServerConfig;
    database: DatabaseConfig;
    auth: AuthConfig;
    features: FeatureConfig;
    logging: LoggingConfig;
}

// 定义配置验证结果接口
interface ConfigValidationResult {
    isValid: boolean;
    errors: string[];
}

const appConfig: AppConfig = {
    server: {
        host: "localhost",
        port: 3000,
        ssl: false,
        cors: {
            enabled: true,
            origins: ["http://localhost:8080", "https://example.com"],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    },
    database: {
        type: "postgresql",
        host: "localhost",
        port: 5432,
        username: "admin",
        password: "password",
        database: "myapp",
        ssl: false,
        pool: {
            min: 2,
            max: 10,
            idle: 10000,
        },
    },
    auth: {
        jwt: {
            secret: "your-secret-key",
            expiresIn: "24h",
            algorithm: "HS256",
        },
        oauth: {
            google: {
                clientId: "google-client-id",
                clientSecret: "google-client-secret",
                callbackUrl: "/auth/google/callback",
            },
            github: {
                clientId: "github-client-id",
                clientSecret: "github-client-secret",
                callbackUrl: "/auth/github/callback",
            },
        },
    },
    features: {
        enableRegistration: true,
        enablePasswordReset: true,
        enableEmailVerification: false,
        maxLoginAttempts: 5,
        lockoutDuration: 300000,
    },
    logging: {
        level: "info",
        format: "json",
        outputs: ["console", "file"],
        file: {
            path: "./logs/app.log",
            maxSize: "10MB",
            maxFiles: 5,
        },
    },
};

function validateConfig(config: AppConfig): ConfigValidationResult {
    const errors: string[] = [];

    // 验证服务器配置
    if (!config.server.host || !config.server.port) {
        errors.push("Server configuration is incomplete");
    }

    if (config.server.port < 1 || config.server.port > 65535) {
        errors.push("Server port must be between 1 and 65535");
    }

    // 验证数据库配置
    if (!config.database.host || !config.database.database) {
        errors.push("Database configuration is incomplete");
    }

    if (config.database.port < 1 || config.database.port > 65535) {
        errors.push("Database port must be between 1 and 65535");
    }

    // 验证认证配置
    if (!config.auth.jwt.secret || config.auth.jwt.secret.length < 32) {
        errors.push("JWT secret must be at least 32 characters long");
    }

    // 验证功能配置
    if (config.features.maxLoginAttempts < 1) {
        errors.push("Max login attempts must be at least 1");
    }

    if (config.features.lockoutDuration < 0) {
        errors.push("Lockout duration cannot be negative");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

const validation: ConfigValidationResult = validateConfig(appConfig);
console.log("配置验证结果:", validation);

console.log("\n=== 解答完成！ ===");
console.log("💡 学习要点:");
console.log("1. 使用联合类型定义有限的选项集合");
console.log("2. 定义清晰的接口来描述复杂对象结构");
console.log("3. 使用泛型来创建可重用的函数");
console.log("4. 为类添加适当的访问修饰符和类型声明");
console.log("5. 配置对象应该有严格的类型定义以避免配置错误");
