/**
 * 第6章：装饰器与元编程练习题解答
 * 
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 展示了装饰器的正确实现方式和最佳实践
 * 
 * 注意：需要在 tsconfig.json 中启用 experimentalDecorators 和 emitDecoratorMetadata
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：类装饰器练习 - 解答
// ============================================================================

console.log('=== 练习1：类装饰器练习 - 解答 ===');

// 1. 实现 @singleton 装饰器 - 确保类只有一个实例
function singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
    let instance: any;
    
    return class extends constructor {
        constructor(...args: any[]) {
            if (instance) {
                return instance;
            }
            super(...args);
            instance = this;
            return instance;
        }
    };
}

// 2. 实现 @timestamped 装饰器 - 为类添加创建时间戳
function timestamped<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        createdAt: Date = new Date();
        
        getCreatedAt(): Date {
            return this.createdAt;
        }
        
        getAge(): number {
            return Date.now() - this.createdAt.getTime();
        }
    };
}

// 3. 实现 @serializable 装饰器 - 为类添加序列化方法
function serializable<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        toJSON(): string {
            const obj: any = {};
            for (const key in this) {
                if (this.hasOwnProperty(key) && typeof this[key] !== 'function') {
                    obj[key] = this[key];
                }
            }
            return JSON.stringify(obj);
        }
        
        static fromJSON(json: string): any {
            try {
                const data = JSON.parse(json);
                const instance = new this();
                Object.assign(instance, data);
                return instance;
            } catch (error) {
                throw new Error('Invalid JSON format');
            }
        }
    };
}

// 4. 实现 @deprecated 装饰器 - 标记类为已废弃
function deprecated(message?: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                console.warn(`⚠️  ${constructor.name} 已废弃: ${message || '请使用新的替代方案'}`);
                super(...args);
            }
        };
    };
}

// 使用类装饰器
@singleton
@timestamped
@serializable
class ConfigManager {
    constructor(public config: Record<string, any> = {}) {}
    
    get(key: string): any {
        return this.config[key];
    }
    
    set(key: string, value: any): void {
        this.config[key] = value;
    }
}

@deprecated('使用 NewUserService 替代')
class OldUserService {
    getUsers() {
        return ['user1', 'user2'];
    }
}

// 测试类装饰器
const config1 = new ConfigManager() as any;
const config2 = new ConfigManager() as any;
console.log('是否为同一实例:', config1 === config2); // true（单例）
console.log('创建时间:', config1.getCreatedAt());
console.log('序列化:', config1.toJSON());

const oldService = new OldUserService(); // 会显示废弃警告

// ============================================================================
// 练习2：方法装饰器练习 - 解答
// ============================================================================

console.log('\n=== 练习2：方法装饰器练习 - 解答 ===');

// 1. 实现 @debounce 装饰器 - 防抖功能
function debounce(delay: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let timeoutId: NodeJS.Timeout;
        
        descriptor.value = function (...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                originalMethod.apply(this, args);
            }, delay);
        };
        
        return descriptor;
    };
}

// 2. 实现 @throttle 装饰器 - 节流功能
function throttle(interval: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let lastCallTime = 0;
        
        descriptor.value = function (...args: any[]) {
            const now = Date.now();
            if (now - lastCallTime >= interval) {
                lastCallTime = now;
                return originalMethod.apply(this, args);
            }
        };
        
        return descriptor;
    };
}

// 3. 实现 @memoize 装饰器 - 记忆化缓存
function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map();
    
    descriptor.value = function (...args: any[]) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log(`缓存命中: ${propertyKey}`);
            return cache.get(key);
        }
        
        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        console.log(`缓存存储: ${propertyKey}`);
        return result;
    };
    
    return descriptor;
}

// 4. 实现 @timeout 装饰器 - 超时控制
function timeout(ms: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function (...args: any[]) {
            return Promise.race([
                originalMethod.apply(this, args),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`方法 ${propertyKey} 执行超时 (${ms}ms)`)), ms);
                })
            ]);
        };
        
        return descriptor;
    };
}

// 5. 实现 @authorize 装饰器 - 权限检查
function authorize(roles: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = function (...args: any[]) {
            // 模拟获取当前用户角色
            const currentUserRole = 'admin'; // 在实际应用中，这应该从上下文获取
            
            if (!roles.includes(currentUserRole)) {
                throw new Error(`权限不足: 需要角色 [${roles.join(', ')}]，当前角色: ${currentUserRole}`);
            }
            
            return originalMethod.apply(this, args);
        };
        
        return descriptor;
    };
}

// 使用方法装饰器
class SearchService {
    @debounce(300)
    search(query: string): void {
        console.log(`搜索: ${query}`);
    }
    
    @throttle(1000)
    updateStats(): void {
        console.log('更新统计信息');
    }
    
    @memoize
    expensiveCalculation(n: number): number {
        console.log(`计算 ${n} 的阶乘`);
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    @timeout(5000)
    async fetchData(url: string): Promise<string> {
        // 模拟长时间运行的操作
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `从 ${url} 获取的数据`;
    }
    
    @authorize(['admin', 'moderator'])
    deleteUser(userId: string): void {
        console.log(`删除用户: ${userId}`);
    }
}

// 测试方法装饰器
const searchService = new SearchService();

// 测试记忆化
console.log('第一次计算:', searchService.expensiveCalculation(5));
console.log('第二次计算:', searchService.expensiveCalculation(5)); // 使用缓存

// 测试权限
try {
    searchService.deleteUser('user123');
} catch (error) {
    console.log('权限错误:', (error as Error).message);
}

// ============================================================================
// 练习3：属性装饰器练习 - 解答
// ============================================================================

console.log('\n=== 练习3：属性装饰器练习 - 解答 ===');

// 1. 实现 @range 装饰器 - 数值范围验证
function range(min: number, max: number) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];
        
        Object.defineProperty(target, propertyKey, {
            get() {
                return value;
            },
            set(newValue: number) {
                if (typeof newValue !== 'number' || newValue < min || newValue > max) {
                    throw new Error(`${propertyKey} 必须在 ${min} 到 ${max} 之间`);
                }
                value = newValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// 2. 实现 @length 装饰器 - 字符串长度验证
function length(min: number, max?: number) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];
        
        Object.defineProperty(target, propertyKey, {
            get() {
                return value;
            },
            set(newValue: string) {
                if (typeof newValue !== 'string') {
                    throw new Error(`${propertyKey} 必须是字符串类型`);
                }
                if (newValue.length < min) {
                    throw new Error(`${propertyKey} 长度不能少于 ${min} 个字符`);
                }
                if (max && newValue.length > max) {
                    throw new Error(`${propertyKey} 长度不能超过 ${max} 个字符`);
                }
                value = newValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// 3. 实现 @pattern 装饰器 - 正则表达式验证
function pattern(regex: RegExp, message?: string) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];
        
        Object.defineProperty(target, propertyKey, {
            get() {
                return value;
            },
            set(newValue: string) {
                if (typeof newValue !== 'string' || !regex.test(newValue)) {
                    throw new Error(message || `${propertyKey} 格式不正确`);
                }
                value = newValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// 4. 实现 @transform 装饰器 - 值转换
function transform(transformer: (value: any) => any) {
    return function (target: any, propertyKey: string) {
        let value = target[propertyKey];
        
        Object.defineProperty(target, propertyKey, {
            get() {
                return transformer(value);
            },
            set(newValue: any) {
                value = newValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// 5. 实现 @computed 装饰器 - 计算属性
function computed(dependencies: string[]) {
    return function (target: any, propertyKey: string) {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        const getter = descriptor?.get;
        
        if (!getter) {
            throw new Error(`${propertyKey} 必须是一个 getter 属性`);
        }
        
        let cachedValue: any;
        let isDirty = true;
        
        // 监听依赖属性的变化
        dependencies.forEach(dep => {
            const depDescriptor = Object.getOwnPropertyDescriptor(target, dep);
            if (depDescriptor) {
                let depValue = depDescriptor.value;
                
                Object.defineProperty(target, dep, {
                    get() {
                        return depValue;
                    },
                    set(newValue: any) {
                        depValue = newValue;
                        isDirty = true; // 标记计算属性需要重新计算
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        });
        
        Object.defineProperty(target, propertyKey, {
            get() {
                if (isDirty) {
                    cachedValue = getter.call(this);
                    isDirty = false;
                }
                return cachedValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// 使用属性装饰器
class UserProfile {
    @length(2, 50)
    @transform((value: string) => value.trim())
    name: string = '';
    
    @range(0, 150)
    age: number = 0;
    
    @pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '邮箱格式不正确')
    email: string = '';
    
    @pattern(/^1[3-9]\d{9}$/, '手机号格式不正确')
    phone: string = '';
    
    @computed(['name', 'age'])
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
const profile = new UserProfile('张三', 25, 'zhangsan@example.com', '13800138000');
console.log('用户档案:', profile.displayName);

// 测试验证
try {
    profile.age = 200; // 应该抛出错误
} catch (error) {
    console.log('年龄验证错误:', (error as Error).message);
}

// ============================================================================
// 练习4：参数装饰器练习 - 解答
// ============================================================================

console.log('\n=== 练习4：参数装饰器练习 - 解答 ===');

// 参数验证元数据键
const VALIDATION_METADATA_KEY = Symbol('validation');

interface ValidationRule {
    parameterIndex: number;
    type: 'notNull' | 'min' | 'max' | 'email';
    value?: any;
}

// 1. 实现 @notNull 装饰器 - 非空验证
function notNull(target: any, propertyKey: string, parameterIndex: number) {
    const existingRules: ValidationRule[] = Reflect.getMetadata(VALIDATION_METADATA_KEY, target, propertyKey) || [];
    existingRules.push({ parameterIndex, type: 'notNull' });
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, existingRules, target, propertyKey);
}

// 2. 实现 @min 装饰器 - 最小值验证
function min(value: number) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        const existingRules: ValidationRule[] = Reflect.getMetadata(VALIDATION_METADATA_KEY, target, propertyKey) || [];
        existingRules.push({ parameterIndex, type: 'min', value });
        Reflect.defineMetadata(VALIDATION_METADATA_KEY, existingRules, target, propertyKey);
    };
}

// 3. 实现 @max 装饰器 - 最大值验证
function max(value: number) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        const existingRules: ValidationRule[] = Reflect.getMetadata(VALIDATION_METADATA_KEY, target, propertyKey) || [];
        existingRules.push({ parameterIndex, type: 'max', value });
        Reflect.defineMetadata(VALIDATION_METADATA_KEY, existingRules, target, propertyKey);
    };
}

// 4. 实现 @email 装饰器 - 邮箱格式验证
function email(target: any, propertyKey: string, parameterIndex: number) {
    const existingRules: ValidationRule[] = Reflect.getMetadata(VALIDATION_METADATA_KEY, target, propertyKey) || [];
    existingRules.push({ parameterIndex, type: 'email' });
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, existingRules, target, propertyKey);
}

// 5. 实现参数验证方法装饰器
function validateParams(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
        const validationRules: ValidationRule[] = Reflect.getMetadata(VALIDATION_METADATA_KEY, target, propertyKey) || [];
        
        for (const rule of validationRules) {
            const value = args[rule.parameterIndex];
            
            switch (rule.type) {
                case 'notNull':
                    if (value === null || value === undefined) {
                        throw new Error(`参数 ${rule.parameterIndex} 不能为空`);
                    }
                    break;
                    
                case 'min':
                    if (typeof value === 'number' && value < rule.value) {
                        throw new Error(`参数 ${rule.parameterIndex} 不能小于 ${rule.value}`);
                    }
                    break;
                    
                case 'max':
                    if (typeof value === 'number' && value > rule.value) {
                        throw new Error(`参数 ${rule.parameterIndex} 不能大于 ${rule.value}`);
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (typeof value === 'string' && !emailRegex.test(value)) {
                        throw new Error(`参数 ${rule.parameterIndex} 必须是有效的邮箱地址`);
                    }
                    break;
            }
        }
        
        return originalMethod.apply(this, args);
    };
    
    return descriptor;
}

// 模拟 Reflect.getMetadata 和 Reflect.defineMetadata（简化版本）
if (!(global as any).Reflect) {
    (global as any).Reflect = {
        metadata: new WeakMap(),
        getMetadata(key: any, target: any, propertyKey?: string) {
            const targetKey = propertyKey ? `${target.constructor.name}.${propertyKey}` : target;
            return this.metadata.get(targetKey)?.[key];
        },
        defineMetadata(key: any, value: any, target: any, propertyKey?: string) {
            const targetKey = propertyKey ? `${target.constructor.name}.${propertyKey}` : target;
            if (!this.metadata.has(targetKey)) {
                this.metadata.set(targetKey, {});
            }
            this.metadata.get(targetKey)[key] = value;
        }
    };
}

// 使用参数装饰器
class OrderService {
    @validateParams
    createOrder(
        @notNull @min(1) orderId: number,
        @notNull @email customerEmail: string,
        @min(0.01) @max(10000) amount: number
    ): void {
        console.log(`创建订单: ${orderId}, 客户: ${customerEmail}, 金额: ${amount}`);
    }
    
    @validateParams
    updateOrderStatus(
        @notNull @min(1) orderId: number,
        @notNull status: string
    ): void {
        console.log(`更新订单 ${orderId} 状态为: ${status}`);
    }
}

// 测试参数装饰器
const orderService = new OrderService();

// 正常调用
orderService.createOrder(1, 'customer@example.com', 99.99);

// 测试验证
try {
    orderService.createOrder(0, 'invalid-email', -10); // 应该抛出验证错误
} catch (error) {
    console.log('参数验证错误:', (error as Error).message);
}

console.log('\n=== 解答完成！ ===');
console.log('💡 学习要点:');
console.log('1. 类装饰器可以修改或扩展类的行为');
console.log('2. 方法装饰器适合添加横切关注点（如缓存、日志）');
console.log('3. 属性装饰器可以实现数据验证和转换');
console.log('4. 参数装饰器配合方法装饰器实现参数验证');
console.log('5. 装饰器组合使用可以构建强大的元编程系统');
