/**
 * 第6章：装饰器与元编程示例
 * 
 * 本文件展示了 TypeScript 装饰器的各种用法
 * 包括类装饰器、方法装饰器、属性装饰器、参数装饰器等
 * 
 * 注意：需要在 tsconfig.json 中启用 experimentalDecorators 和 emitDecoratorMetadata
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. 类装饰器示例
// ============================================================================

console.log('=== 类装饰器示例 ===');

// 简单的类装饰器
function sealed(constructor: Function) {
    console.log('应用 @sealed 装饰器');
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

// 装饰器工厂
function component(name: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        console.log(`注册组件: ${name}`);
        
        // 返回一个新的构造函数，扩展原有功能
        return class extends constructor {
            componentName = name;
            createdAt = new Date();
            
            getInfo() {
                return `组件 ${this.componentName} 创建于 ${this.createdAt}`;
            }
        };
    };
}

// 日志装饰器
function logged<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            console.log(`创建了 ${constructor.name} 实例`);
        }
    };
}

@sealed
@component('UserCard')
@logged
class UserCard {
    constructor(public name: string, public email: string) {}
    
    render() {
        return `<div>用户: ${this.name} (${this.email})</div>`;
    }
}

// 测试类装饰器
const userCard = new UserCard('张三', 'zhangsan@example.com') as any;
console.log('用户卡片:', userCard.render());
console.log('组件信息:', userCard.getInfo());

// ============================================================================
// 2. 方法装饰器示例
// ============================================================================

console.log('\n=== 方法装饰器示例 ===');

// 性能监控装饰器
function performance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`方法 ${propertyKey} 执行时间: ${(end - start).toFixed(2)}ms`);
        return result;
    };
    
    return descriptor;
}

// 缓存装饰器
function cache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cacheMap = new Map();
    
    descriptor.value = function (...args: any[]) {
        const key = JSON.stringify(args);
        
        if (cacheMap.has(key)) {
            console.log(`缓存命中: ${propertyKey}`);
            return cacheMap.get(key);
        }
        
        const result = originalMethod.apply(this, args);
        cacheMap.set(key, result);
        console.log(`缓存存储: ${propertyKey}`);
        return result;
    };
    
    return descriptor;
}

// 重试装饰器
function retry(maxAttempts: number = 3) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function (...args: any[]) {
            let lastError: any;
            
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    lastError = error;
                    console.log(`方法 ${propertyKey} 第 ${attempt} 次尝试失败`);
                    
                    if (attempt === maxAttempts) {
                        throw lastError;
                    }
                    
                    // 等待一段时间后重试
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        };
        
        return descriptor;
    };
}

class DataService {
    @performance
    @cache
    calculateExpensiveOperation(n: number): number {
        // 模拟耗时操作
        let result = 0;
        for (let i = 0; i < n * 1000000; i++) {
            result += Math.random();
        }
        return result;
    }
    
    @retry(3)
    async fetchDataFromAPI(url: string): Promise<string> {
        // 模拟可能失败的 API 调用
        if (Math.random() < 0.7) {
            throw new Error('网络错误');
        }
        return `从 ${url} 获取的数据`;
    }
    
    @performance
    processData(data: any[]): any[] {
        return data.map(item => ({ ...item, processed: true }));
    }
}

// 测试方法装饰器
const dataService = new DataService();

// 测试缓存装饰器
console.log('第一次计算:');
dataService.calculateExpensiveOperation(10);
console.log('第二次计算（应该使用缓存）:');
dataService.calculateExpensiveOperation(10);

// 测试性能装饰器
const testData = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item${i}` }));
dataService.processData(testData);

// ============================================================================
// 3. 属性装饰器示例
// ============================================================================

console.log('\n=== 属性装饰器示例 ===');

// 验证装饰器
function validate(validator: (value: any) => boolean, message: string) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];
        
        Object.defineProperty(target, propertyKey, {
            get() {
                return value;
            },
            set(newValue) {
                if (!validator(newValue)) {
                    throw new Error(`${propertyKey}: ${message}`);
                }
                value = newValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// 格式化装饰器
function format(formatter: (value: any) => any) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];
        
        Object.defineProperty(target, propertyKey, {
            get() {
                return formatter(value);
            },
            set(newValue) {
                value = newValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// 只读装饰器
function readonly(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
        writable: false,
        configurable: false
    });
}

// 观察者装饰器
function observable(target: any, propertyKey: string) {
    let value = target[propertyKey];
    const observers: Array<(newValue: any, oldValue: any) => void> = [];
    
    Object.defineProperty(target, propertyKey, {
        get() {
            return value;
        },
        set(newValue) {
            const oldValue = value;
            value = newValue;
            observers.forEach(observer => observer(newValue, oldValue));
        },
        enumerable: true,
        configurable: true
    });
    
    // 添加观察者方法
    const observerMethodName = `observe${propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1)}`;
    target[observerMethodName] = function(observer: (newValue: any, oldValue: any) => void) {
        observers.push(observer);
    };
}

class User {
    @readonly
    id: number = Math.floor(Math.random() * 1000);
    
    @validate((value: string) => value.length >= 2, '姓名至少需要2个字符')
    @format((value: string) => value.trim().toLowerCase())
    name: string = '';
    
    @validate((value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), '邮箱格式不正确')
    email: string = '';
    
    @observable
    status: 'active' | 'inactive' = 'inactive';
    
    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}

// 测试属性装饰器
const user = new User('张三', 'zhangsan@example.com') as any;

// 测试观察者
user.observeStatus((newValue: string, oldValue: string) => {
    console.log(`用户状态从 ${oldValue} 变更为 ${newValue}`);
});

console.log('用户信息:', { id: user.id, name: user.name, email: user.email });

// 测试状态变更观察
user.status = 'active';

// 测试验证
try {
    user.name = 'a'; // 应该抛出错误
} catch (error) {
    console.log('验证错误:', (error as Error).message);
}

// ============================================================================
// 4. 参数装饰器示例
// ============================================================================

console.log('\n=== 参数装饰器示例 ===');

// 参数验证装饰器
function required(target: any, propertyKey: string, parameterIndex: number) {
    const existingRequiredParameters: number[] = Reflect.getMetadata('required', target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata('required', existingRequiredParameters, target, propertyKey);
}

// 参数类型验证装饰器
function validateType(expectedType: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        const existingValidations: Array<{index: number, type: string}> = 
            Reflect.getMetadata('validateTypes', target, propertyKey) || [];
        existingValidations.push({ index: parameterIndex, type: expectedType });
        Reflect.defineMetadata('validateTypes', existingValidations, target, propertyKey);
    };
}

// 方法验证装饰器（配合参数装饰器使用）
function validateMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
        // 检查必需参数
        const requiredParameters: number[] = Reflect.getMetadata('required', target, propertyKey) || [];
        for (const parameterIndex of requiredParameters) {
            if (args[parameterIndex] === undefined || args[parameterIndex] === null) {
                throw new Error(`参数 ${parameterIndex} 是必需的`);
            }
        }
        
        // 检查参数类型
        const typeValidations: Array<{index: number, type: string}> = 
            Reflect.getMetadata('validateTypes', target, propertyKey) || [];
        for (const validation of typeValidations) {
            const actualType = typeof args[validation.index];
            if (actualType !== validation.type) {
                throw new Error(`参数 ${validation.index} 应该是 ${validation.type} 类型，实际是 ${actualType}`);
            }
        }
        
        return originalMethod.apply(this, args);
    };
    
    return descriptor;
}

class Calculator {
    @validateMethod
    add(
        @required @validateType('number') a: number,
        @required @validateType('number') b: number
    ): number {
        return a + b;
    }
    
    @validateMethod
    divide(
        @required @validateType('number') dividend: number,
        @required @validateType('number') divisor: number
    ): number {
        if (divisor === 0) {
            throw new Error('除数不能为零');
        }
        return dividend / divisor;
    }
}

// 测试参数装饰器
const calculator = new Calculator();

try {
    console.log('正常计算:', calculator.add(5, 3));
    console.log('正常除法:', calculator.divide(10, 2));
    
    // 测试参数验证
    // calculator.add(5); // 应该抛出错误：缺少必需参数
    // calculator.add(5, "3" as any); // 应该抛出错误：类型不匹配
} catch (error) {
    console.log('参数验证错误:', (error as Error).message);
}

// ============================================================================
// 5. 装饰器组合和实际应用
// ============================================================================

console.log('\n=== 装饰器组合和实际应用 ===');

// API 控制器装饰器
function controller(basePath: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        Reflect.defineMetadata('basePath', basePath, constructor);
        console.log(`注册控制器: ${constructor.name} -> ${basePath}`);
        return constructor;
    };
}

// HTTP 方法装饰器
function httpMethod(method: string, path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('httpMethod', method, target, propertyKey);
        Reflect.defineMetadata('path', path, target, propertyKey);
        console.log(`注册路由: ${method} ${path} -> ${propertyKey}`);
        return descriptor;
    };
}

// 中间件装饰器
function middleware(middlewareFn: Function) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const existingMiddlewares: Function[] = Reflect.getMetadata('middlewares', target, propertyKey) || [];
        existingMiddlewares.push(middlewareFn);
        Reflect.defineMetadata('middlewares', existingMiddlewares, target, propertyKey);
        return descriptor;
    };
}

// 认证中间件
const authMiddleware = (req: any, res: any, next: Function) => {
    console.log('执行认证检查');
    next();
};

// 日志中间件
const logMiddleware = (req: any, res: any, next: Function) => {
    console.log(`请求日志: ${req.method} ${req.url}`);
    next();
};

@controller('/api/users')
class UserController {
    @httpMethod('GET', '/')
    @middleware(logMiddleware)
    @performance
    getAllUsers() {
        console.log('获取所有用户');
        return { users: ['张三', '李四', '王五'] };
    }
    
    @httpMethod('GET', '/:id')
    @middleware(authMiddleware)
    @middleware(logMiddleware)
    @cache
    getUserById(@required @validateType('string') id: string) {
        console.log(`获取用户: ${id}`);
        return { id, name: `用户${id}`, email: `user${id}@example.com` };
    }
    
    @httpMethod('POST', '/')
    @middleware(authMiddleware)
    @retry(2)
    async createUser(@required userData: any) {
        console.log('创建用户:', userData);
        // 模拟可能失败的操作
        if (Math.random() < 0.3) {
            throw new Error('创建用户失败');
        }
        return { id: Date.now(), ...userData };
    }
}

// 测试装饰器组合
const userController = new UserController();

console.log('获取所有用户:', userController.getAllUsers());
console.log('获取特定用户:', userController.getUserById('123'));

// 模拟创建用户
userController.createUser({ name: '新用户', email: 'newuser@example.com' })
    .then(result => console.log('用户创建成功:', result))
    .catch(error => console.log('用户创建失败:', error.message));

console.log('\n=== 第6章示例代码执行完成 ===');

// 注意：由于某些装饰器依赖 reflect-metadata，在实际项目中需要安装并导入：
// npm install reflect-metadata
// import 'reflect-metadata';
