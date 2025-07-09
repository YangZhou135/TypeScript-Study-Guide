/**
 * 第6章：装饰器与元编程练习题
 *
 * 请完成以下练习，实现各种类型的装饰器
 * 包括类装饰器、方法装饰器、属性装饰器、参数装饰器等
 *
 * 注意：需要在 tsconfig.json 中启用 experimentalDecorators 和 emitDecoratorMetadata
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：类装饰器练习
// ============================================================================

console.log("=== 练习1：类装饰器练习 ===");

// TODO: 实现以下类装饰器

// 1. 实现 @singleton 装饰器 - 确保类只有一个实例
// function singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
//     // TODO: 实现单例模式
// }

// 2. 实现 @timestamped 装饰器 - 为类添加创建时间戳
// function timestamped<T extends { new(...args: any[]): {} }>(constructor: T) {
//     // TODO: 添加时间戳属性
// }

// 3. 实现 @serializable 装饰器 - 为类添加序列化方法
// function serializable<T extends { new(...args: any[]): {} }>(constructor: T) {
//     // TODO: 添加 toJSON 和 fromJSON 方法
// }

// 4. 实现 @deprecated 装饰器 - 标记类为已废弃
// function deprecated(message?: string) {
//     return function <T extends { new(...args: any[]): {} }>(constructor: T) {
//         // TODO: 在创建实例时显示废弃警告
//     };
// }

// TODO: 使用你实现的装饰器

// @singleton
// @timestamped
// @serializable
// class ConfigManager {
//     constructor(public config: Record<string, any> = {}) {}
//
//     get(key: string): any {
//         return this.config[key];
//     }
//
//     set(key: string, value: any): void {
//         this.config[key] = value;
//     }
// }

// @deprecated('使用 NewUserService 替代')
// class OldUserService {
//     getUsers() {
//         return ['user1', 'user2'];
//     }
// }

// 测试类装饰器
// const config1 = new ConfigManager();
// const config2 = new ConfigManager();
// console.log('是否为同一实例:', config1 === config2); // 应该是 true（单例）

console.log("类装饰器练习 - 请实现上述装饰器");

// ============================================================================
// 练习2：方法装饰器练习
// ============================================================================

console.log("\n=== 练习2：方法装饰器练习 ===");

// TODO: 实现以下方法装饰器

// 1. 实现 @debounce 装饰器 - 防抖功能
// function debounce(delay: number) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         // TODO: 实现防抖逻辑
//     };
// }

// 2. 实现 @throttle 装饰器 - 节流功能
// function throttle(interval: number) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         // TODO: 实现节流逻辑
//     };
// }

// 3. 实现 @memoize 装饰器 - 记忆化缓存
// function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     // TODO: 实现记忆化缓存
// }

// 4. 实现 @timeout 装饰器 - 超时控制
// function timeout(ms: number) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         // TODO: 实现超时控制
//     };
// }

// 5. 实现 @authorize 装饰器 - 权限检查
// function authorize(roles: string[]) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         // TODO: 实现权限检查
//     };
// }

// TODO: 使用你实现的方法装饰器

class SearchService {
    // @debounce(300)
    search(query: string): void {
        console.log(`搜索: ${query}`);
    }

    // @throttle(1000)
    updateStats(): void {
        console.log("更新统计信息");
    }

    // @memoize
    expensiveCalculation(n: number): number {
        console.log(`计算 ${n} 的阶乘`);
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // @timeout(5000)
    async fetchData(url: string): Promise<string> {
        // 模拟长时间运行的操作
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return `从 ${url} 获取的数据`;
    }

    // @authorize(['admin', 'moderator'])
    deleteUser(userId: string): void {
        console.log(`删除用户: ${userId}`);
    }
}

// 测试方法装饰器
const searchService = new SearchService();

// 测试防抖
// searchService.search('a');
// searchService.search('ab');
// searchService.search('abc'); // 只有这个会执行

// 测试记忆化
// console.log('第一次计算:', searchService.expensiveCalculation(5));
// console.log('第二次计算:', searchService.expensiveCalculation(5)); // 应该使用缓存

console.log("方法装饰器练习 - 请实现上述装饰器");

// ============================================================================
// 练习3：属性装饰器练习
// ============================================================================

console.log("\n=== 练习3：属性装饰器练习 ===");

// TODO: 实现以下属性装饰器

// 1. 实现 @range 装饰器 - 数值范围验证
// function range(min: number, max: number) {
//     return function (target: any, propertyKey: string) {
//         // TODO: 实现范围验证
//     };
// }

// 2. 实现 @length 装饰器 - 字符串长度验证
// function length(min: number, max?: number) {
//     return function (target: any, propertyKey: string) {
//         // TODO: 实现长度验证
//     };
// }

// 3. 实现 @pattern 装饰器 - 正则表达式验证
// function pattern(regex: RegExp, message?: string) {
//     return function (target: any, propertyKey: string) {
//         // TODO: 实现正则验证
//     };
// }

// 4. 实现 @transform 装饰器 - 值转换
// function transform(transformer: (value: any) => any) {
//     return function (target: any, propertyKey: string) {
//         // TODO: 实现值转换
//     };
// }

// 5. 实现 @computed 装饰器 - 计算属性
// function computed(dependencies: string[]) {
//     return function (target: any, propertyKey: string) {
//         // TODO: 实现计算属性
//     };
// }

// TODO: 使用你实现的属性装饰器

class UserProfile {
    // @length(2, 50)
    // @transform((value: string) => value.trim())
    name: string = "";

    // @range(0, 150)
    age: number = 0;

    // @pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '邮箱格式不正确')
    email: string = "";

    // @pattern(/^1[3-9]\d{9}$/, '手机号格式不正确')
    phone: string = "";

    // @computed(['name', 'age'])
    get displayName(): string {
        return `${this.name} (${this.age}岁)`;
    }

    constructor(name: string, age: number, email: string, phone: string) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.phone = phone;
    }
}

// 测试属性装饰器
// const profile = new UserProfile('张三', 25, 'zhangsan@example.com', '13800138000');

// 测试验证
// try {
//     profile.age = 200; // 应该抛出错误
// } catch (error) {
//     console.log('年龄验证错误:', error.message);
// }

console.log("属性装饰器练习 - 请实现上述装饰器");

// ============================================================================
// 练习4：参数装饰器练习
// ============================================================================

console.log("\n=== 练习4：参数装饰器练习 ===");

// TODO: 实现以下参数装饰器

// 1. 实现 @notNull 装饰器 - 非空验证
// function notNull(target: any, propertyKey: string, parameterIndex: number) {
//     // TODO: 标记参数为非空
// }

// 2. 实现 @min 装饰器 - 最小值验证
// function min(value: number) {
//     return function (target: any, propertyKey: string, parameterIndex: number) {
//         // TODO: 标记参数最小值
//     };
// }

// 3. 实现 @max 装饰器 - 最大值验证
// function max(value: number) {
//     return function (target: any, propertyKey: string, parameterIndex: number) {
//         // TODO: 标记参数最大值
//     };
// }

// 4. 实现 @email 装饰器 - 邮箱格式验证
// function email(target: any, propertyKey: string, parameterIndex: number) {
//     // TODO: 标记参数为邮箱格式
// }

// 5. 实现参数验证方法装饰器
// function validateParams(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     // TODO: 实现参数验证逻辑
// }

// TODO: 使用你实现的参数装饰器

class OrderService {
    // @validateParams
    createOrder(
        // @notNull @min(1) orderId: number,
        // @notNull @email customerEmail: string,
        // @min(0.01) @max(10000) amount: number
        orderId: number,
        customerEmail: string,
        amount: number
    ): void {
        console.log(`创建订单: ${orderId}, 客户: ${customerEmail}, 金额: ${amount}`);
    }

    // @validateParams
    updateOrderStatus(
        // @notNull @min(1) orderId: number,
        // @notNull status: string
        orderId: number,
        status: string
    ): void {
        console.log(`更新订单 ${orderId} 状态为: ${status}`);
    }
}

// 测试参数装饰器
const orderService = new OrderService();

// 正常调用
// orderService.createOrder(1, 'customer@example.com', 99.99);

// 测试验证
// try {
//     orderService.createOrder(0, 'invalid-email', -10); // 应该抛出验证错误
// } catch (error) {
//     console.log('参数验证错误:', error.message);
// }

console.log("参数装饰器练习 - 请实现上述装饰器");

// ============================================================================
// 练习5：综合应用练习
// ============================================================================

console.log("\n=== 练习5：综合应用练习 ===");

// 场景：实现一个完整的 API 控制器装饰器系统

// TODO: 实现以下装饰器系统

// 1. 实现 @Controller 装饰器
// function Controller(basePath: string) {
//     return function <T extends { new(...args: any[]): {} }>(constructor: T) {
//         // TODO: 注册控制器基础路径
//     };
// }

// 2. 实现 HTTP 方法装饰器
// function Get(path: string) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         // TODO: 注册 GET 路由
//     };
// }

// function Post(path: string) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         // TODO: 注册 POST 路由
//     };
// }

// 3. 实现 @Middleware 装饰器
// function Middleware(middlewareFn: Function) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         // TODO: 注册中间件
//     };
// }

// 4. 实现 @Body 和 @Param 装饰器
// function Body(target: any, propertyKey: string, parameterIndex: number) {
//     // TODO: 标记参数为请求体
// }

// function Param(name: string) {
//     return function (target: any, propertyKey: string, parameterIndex: number) {
//         // TODO: 标记参数为路径参数
//     };
// }

// 5. 实现路由注册系统
// class Router {
//     private routes: Map<string, any> = new Map();
//
//     register(controller: any): void {
//         // TODO: 注册控制器的所有路由
//     }
//
//     getRoutes(): Map<string, any> {
//         return this.routes;
//     }
// }

// TODO: 使用装饰器系统创建 API 控制器

// 中间件函数
const authMiddleware = (req: any, res: any, next: Function) => {
    console.log("执行认证检查");
    next();
};

const logMiddleware = (req: any, res: any, next: Function) => {
    console.log(`请求: ${req.method} ${req.url}`);
    next();
};

// @Controller('/api/products')
class ProductController {
    // @Get('/')
    // @Middleware(logMiddleware)
    getAllProducts(): any {
        return { products: ["产品1", "产品2", "产品3"] };
    }

    // @Get('/:id')
    // @Middleware(authMiddleware)
    getProductById(
        // @Param('id') id: string
        id: string
    ): any {
        return { id, name: `产品${id}`, price: 99.99 };
    }

    // @Post('/')
    // @Middleware(authMiddleware)
    createProduct(
        // @Body productData: any
        productData: any
    ): any {
        return { id: Date.now(), ...productData };
    }
}

// TODO: 测试装饰器系统
// const router = new Router();
// router.register(ProductController);
// console.log('注册的路由:', Array.from(router.getRoutes().keys()));

console.log("综合应用练习 - 请实现完整的装饰器系统");

console.log("\n=== 练习完成！请检查装饰器实现是否正确 ===");
console.log("运行命令: npx tsc chapters/chapter-06-decorators/practice.ts --noEmit 来检查类型错误");
console.log("注意：某些装饰器功能需要 reflect-metadata 库支持");
