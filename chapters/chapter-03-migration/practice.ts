/**
 * 第3章：从 JavaScript 到 TypeScript 迁移练习题
 * 
 * 请将以下 JavaScript 代码迁移到 TypeScript
 * 添加适当的类型声明、接口定义和类型安全检查
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：基础函数迁移
// ============================================================================

console.log('=== 练习1：基础函数迁移 ===');

// TODO: 为以下 JavaScript 函数添加 TypeScript 类型声明

// 原 JavaScript 代码：
function calculateDiscount(price, discountPercent, memberLevel) {
    let discount = discountPercent;
    
    if (memberLevel === 'gold') {
        discount += 0.05;
    } else if (memberLevel === 'silver') {
        discount += 0.02;
    }
    
    return price * (1 - discount);
}

function formatCurrency(amount, currency, locale) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 测试函数
const finalPrice = calculateDiscount(100, 0.1, 'gold');
const formattedPrice = formatCurrency(finalPrice, 'CNY', 'zh-CN');
const isValidEmail = validateEmail('test@example.com');

console.log('最终价格:', formattedPrice);
console.log('邮箱验证:', isValidEmail);

// ============================================================================
// 练习2：对象和接口迁移
// ============================================================================

console.log('\n=== 练习2：对象和接口迁移 ===');

// TODO: 为以下对象定义 TypeScript 接口

// 原 JavaScript 对象：
const student = {
    id: 1,
    name: '张三',
    age: 20,
    grade: '大二',
    courses: [
        { id: 'CS101', name: '计算机科学导论', credits: 3, score: 85 },
        { id: 'MATH201', name: '高等数学', credits: 4, score: 92 },
        { id: 'ENG101', name: '大学英语', credits: 2, score: 78 }
    ],
    contact: {
        email: 'zhangsan@university.edu',
        phone: '13800138000',
        address: {
            province: '北京市',
            city: '北京市',
            district: '海淀区',
            street: '中关村大街1号'
        }
    },
    isActive: true,
    enrollmentDate: new Date('2022-09-01')
};

// TODO: 定义相关接口并重新声明 student 对象

// 原 JavaScript 函数：
function calculateGPA(student) {
    const totalCredits = student.courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedSum = student.courses.reduce((sum, course) => {
        return sum + (course.score / 100 * 4.0 * course.credits);
    }, 0);
    return weightedSum / totalCredits;
}

function getStudentSummary(student) {
    return {
        name: student.name,
        grade: student.grade,
        gpa: calculateGPA(student),
        courseCount: student.courses.length,
        email: student.contact.email
    };
}

// TODO: 为上述函数添加类型声明

// 测试函数
const gpa = calculateGPA(student);
const summary = getStudentSummary(student);

console.log('学生GPA:', gpa.toFixed(2));
console.log('学生摘要:', summary);

// ============================================================================
// 练习3：数组操作函数迁移
// ============================================================================

console.log('\n=== 练习3：数组操作函数迁移 ===');

// TODO: 为以下数组操作函数添加泛型和类型声明

// 原 JavaScript 代码：
function findById(items, id) {
    return items.find(item => item.id === id);
}

function groupBy(items, keyFn) {
    return items.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}

function sortBy(items, keyFn, direction) {
    return [...items].sort((a, b) => {
        const aVal = keyFn(a);
        const bVal = keyFn(b);
        
        if (direction === 'desc') {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        } else {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
    });
}

function paginate(items, page, pageSize) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
        items: items.slice(startIndex, endIndex),
        currentPage: page,
        totalPages: Math.ceil(items.length / pageSize),
        totalItems: items.length,
        hasNext: endIndex < items.length,
        hasPrev: page > 1
    };
}

// TODO: 为上述函数添加适当的类型声明

// 测试数据
const products = [
    { id: 1, name: 'iPhone', price: 6999, category: '手机' },
    { id: 2, name: 'iPad', price: 3999, category: '平板' },
    { id: 3, name: 'MacBook', price: 12999, category: '电脑' },
    { id: 4, name: 'AirPods', price: 1299, category: '耳机' },
    { id: 5, name: 'Apple Watch', price: 2999, category: '手表' }
];

// 测试函数
const foundProduct = findById(products, 3);
const groupedProducts = groupBy(products, product => product.category);
const sortedProducts = sortBy(products, product => product.price, 'desc');
const paginatedProducts = paginate(products, 1, 3);

console.log('找到的产品:', foundProduct?.name);
console.log('分组产品:', Object.keys(groupedProducts));
console.log('排序后价格:', sortedProducts.map(p => p.price));
console.log('分页结果:', {
    count: paginatedProducts.items.length,
    totalPages: paginatedProducts.totalPages
});

// ============================================================================
// 练习4：类迁移
// ============================================================================

console.log('\n=== 练习4：类迁移 ===');

// TODO: 将以下 JavaScript 类迁移到 TypeScript

// 原 JavaScript 类：
class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }
    
    addTask(title, description, priority, dueDate) {
        const task = {
            id: this.nextId++,
            title: title,
            description: description || '',
            priority: priority || 'medium',
            status: 'pending',
            dueDate: dueDate ? new Date(dueDate) : null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.tasks.push(task);
        return task;
    }
    
    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            throw new Error(`Task with id ${id} not found`);
        }
        
        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updates,
            updatedAt: new Date()
        };
        
        return this.tasks[taskIndex];
    }
    
    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            return false;
        }
        
        this.tasks.splice(taskIndex, 1);
        return true;
    }
    
    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }
    
    getTasksByPriority(priority) {
        return this.tasks.filter(task => task.priority === priority);
    }
    
    getOverdueTasks() {
        const now = new Date();
        return this.tasks.filter(task => 
            task.dueDate && 
            task.dueDate < now && 
            task.status !== 'completed'
        );
    }
}

// TODO: 定义任务相关的接口和类型，然后重写 TaskManager 类

// 测试类
const taskManager = new TaskManager();

const task1 = taskManager.addTask(
    '学习 TypeScript',
    '完成 TypeScript 基础教程',
    'high',
    '2024-12-31'
);

const task2 = taskManager.addTask(
    '写项目文档',
    '为项目编写详细的使用文档',
    'medium'
);

taskManager.updateTask(task1.id, { status: 'in-progress' });

console.log('高优先级任务:', taskManager.getTasksByPriority('high').length);
console.log('进行中的任务:', taskManager.getTasksByStatus('in-progress').length);
console.log('逾期任务:', taskManager.getOverdueTasks().length);

// ============================================================================
// 练习5：配置对象迁移
// ============================================================================

console.log('\n=== 练习5：配置对象迁移 ===');

// TODO: 为以下配置对象定义严格的类型

// 原 JavaScript 配置：
const appConfig = {
    server: {
        host: 'localhost',
        port: 3000,
        ssl: false,
        cors: {
            enabled: true,
            origins: ['http://localhost:8080', 'https://example.com'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    },
    database: {
        type: 'postgresql',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: 'password',
        database: 'myapp',
        ssl: false,
        pool: {
            min: 2,
            max: 10,
            idle: 10000
        }
    },
    auth: {
        jwt: {
            secret: 'your-secret-key',
            expiresIn: '24h',
            algorithm: 'HS256'
        },
        oauth: {
            google: {
                clientId: 'google-client-id',
                clientSecret: 'google-client-secret',
                callbackUrl: '/auth/google/callback'
            },
            github: {
                clientId: 'github-client-id',
                clientSecret: 'github-client-secret',
                callbackUrl: '/auth/github/callback'
            }
        }
    },
    features: {
        enableRegistration: true,
        enablePasswordReset: true,
        enableEmailVerification: false,
        maxLoginAttempts: 5,
        lockoutDuration: 300000
    },
    logging: {
        level: 'info',
        format: 'json',
        outputs: ['console', 'file'],
        file: {
            path: './logs/app.log',
            maxSize: '10MB',
            maxFiles: 5
        }
    }
};

// TODO: 定义配置接口并重新声明 appConfig

// 配置验证函数
function validateConfig(config) {
    // TODO: 添加类型声明和实现配置验证逻辑
    const errors = [];
    
    if (!config.server.host || !config.server.port) {
        errors.push('Server configuration is incomplete');
    }
    
    if (!config.database.host || !config.database.database) {
        errors.push('Database configuration is incomplete');
    }
    
    if (!config.auth.jwt.secret) {
        errors.push('JWT secret is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// TODO: 为 validateConfig 函数添加类型声明

const validation = validateConfig(appConfig);
console.log('配置验证结果:', validation);

console.log('\n=== 练习完成！请检查类型声明是否正确 ===');
console.log('运行命令: npx tsc chapters/chapter-03-migration/practice.ts --noEmit 来检查类型错误');
