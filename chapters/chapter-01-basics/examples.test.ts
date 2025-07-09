/**
 * 第1章：TypeScript 基础语法测试
 * 
 * 这个测试文件验证第1章示例代码的正确性
 * 运行命令：npm test -- examples.test.ts
 */

// ============================================================================
// 测试基础类型
// ============================================================================

describe('第1章：基础类型测试', () => {
  test('字符串类型应该正确工作', () => {
    const userName: string = "张三";
    const greeting: string = `你好，${userName}！`;
    
    expect(typeof userName).toBe('string');
    expect(greeting).toBe('你好，张三！');
  });

  test('数字类型应该正确工作', () => {
    const age: number = 25;
    const salary: number = 8500.50;
    
    expect(typeof age).toBe('number');
    expect(typeof salary).toBe('number');
    expect(age).toBe(25);
    expect(salary).toBe(8500.50);
  });

  test('布尔类型应该正确工作', () => {
    const isEmployed: boolean = true;
    const hasExperience: boolean = 25 > 22;
    
    expect(typeof isEmployed).toBe('boolean');
    expect(typeof hasExperience).toBe('boolean');
    expect(isEmployed).toBe(true);
    expect(hasExperience).toBe(true);
  });

  test('数组类型应该正确工作', () => {
    const scores: number[] = [85, 92, 78, 96, 88];
    const hobbies: string[] = ["编程", "阅读", "旅行"];
    
    expect(Array.isArray(scores)).toBe(true);
    expect(Array.isArray(hobbies)).toBe(true);
    expect(scores.length).toBe(5);
    expect(hobbies.length).toBe(3);
    expect(scores[0]).toBe(85);
    expect(hobbies[0]).toBe("编程");
  });
});

// ============================================================================
// 测试函数类型
// ============================================================================

describe('第1章：函数类型测试', () => {
  // 基础函数
  function calculateArea(width: number, height: number): number {
    return width * height;
  }

  // 可选参数函数
  function formatName(firstName: string, lastName?: string): string {
    if (lastName) {
      return `${lastName} ${firstName}`;
    }
    return firstName;
  }

  // 默认参数函数
  function createMessage(content: string, prefix: string = "[INFO]"): string {
    return `${prefix} ${content}`;
  }

  // 箭头函数
  const multiply = (x: number, y: number): number => x * y;

  test('基础函数应该正确计算', () => {
    const area = calculateArea(10, 20);
    expect(area).toBe(200);
  });

  test('可选参数函数应该正确工作', () => {
    const name1 = formatName("小明");
    const name2 = formatName("小明", "张");
    
    expect(name1).toBe("小明");
    expect(name2).toBe("张 小明");
  });

  test('默认参数函数应该正确工作', () => {
    const message1 = createMessage("系统启动成功");
    const message2 = createMessage("用户登录", "[USER]");
    
    expect(message1).toBe("[INFO] 系统启动成功");
    expect(message2).toBe("[USER] 用户登录");
  });

  test('箭头函数应该正确工作', () => {
    const result = multiply(6, 7);
    expect(result).toBe(42);
  });
});

// ============================================================================
// 测试对象类型
// ============================================================================

describe('第1章：对象类型测试', () => {
  interface Employee {
    id: number;
    name: string;
    department: string;
    salary: number;
  }

  interface Product {
    name: string;
    price: number;
    description?: string;
    inStock: boolean;
  }

  test('员工对象应该符合类型定义', () => {
    const employee: Employee = {
      id: 1001,
      name: "李四",
      department: "技术部",
      salary: 12000
    };

    expect(employee.id).toBe(1001);
    expect(employee.name).toBe("李四");
    expect(employee.department).toBe("技术部");
    expect(employee.salary).toBe(12000);
  });

  test('产品对象应该支持可选属性', () => {
    const product1: Product = {
      name: "MacBook Pro",
      price: 15999,
      inStock: true
    };

    const product2: Product = {
      name: "iPhone",
      price: 6999,
      description: "苹果手机",
      inStock: true
    };

    expect(product1.description).toBeUndefined();
    expect(product2.description).toBe("苹果手机");
  });
});

// ============================================================================
// 测试实际应用场景
// ============================================================================

describe('第1章：实际应用测试', () => {
  interface User {
    id: number;
    username: string;
    email: string;
    age: number;
    isActive: boolean;
  }

  const users: User[] = [
    { id: 1, username: "zhangsan", email: "zhangsan@example.com", age: 25, isActive: true },
    { id: 2, username: "lisi", email: "lisi@example.com", age: 30, isActive: false },
    { id: 3, username: "wangwu", email: "wangwu@example.com", age: 28, isActive: true }
  ];

  function findUserById(users: User[], id: number): User | undefined {
    return users.find(user => user.id === id);
  }

  function getActiveUsers(users: User[]): User[] {
    return users.filter(user => user.isActive);
  }

  function calculateAverageAge(users: User[]): number {
    if (users.length === 0) return 0;
    const totalAge = users.reduce((sum, user) => sum + user.age, 0);
    return totalAge / users.length;
  }

  test('查找用户功能应该正确工作', () => {
    const foundUser = findUserById(users, 2);
    const notFoundUser = findUserById(users, 999);

    expect(foundUser).toBeDefined();
    expect(foundUser?.username).toBe("lisi");
    expect(notFoundUser).toBeUndefined();
  });

  test('获取活跃用户功能应该正确工作', () => {
    const activeUsers = getActiveUsers(users);
    
    expect(activeUsers.length).toBe(2);
    expect(activeUsers[0].username).toBe("zhangsan");
    expect(activeUsers[1].username).toBe("wangwu");
  });

  test('计算平均年龄功能应该正确工作', () => {
    const avgAge = calculateAverageAge(users);
    const expectedAge = (25 + 30 + 28) / 3;
    
    expect(avgAge).toBeCloseTo(expectedAge, 2);
  });

  test('空数组应该返回0平均年龄', () => {
    const avgAge = calculateAverageAge([]);
    expect(avgAge).toBe(0);
  });
});

// ============================================================================
// 测试类型推断
// ============================================================================

describe('第1章：类型推断测试', () => {
  test('TypeScript应该能够自动推断类型', () => {
    const autoString = "这是自动推断的字符串类型";
    const autoNumber = 42;
    const autoBoolean = true;
    const autoArray = [1, 2, 3];

    // 虽然我们没有显式声明类型，但 TypeScript 会自动推断
    expect(typeof autoString).toBe('string');
    expect(typeof autoNumber).toBe('number');
    expect(typeof autoBoolean).toBe('boolean');
    expect(Array.isArray(autoArray)).toBe(true);
  });

  test('函数返回值类型应该能够自动推断', () => {
    function getRandomNumber() {
      return Math.floor(Math.random() * 100);
    }

    const randomNum = getRandomNumber();
    expect(typeof randomNum).toBe('number');
    expect(randomNum).toBeGreaterThanOrEqual(0);
    expect(randomNum).toBeLessThan(100);
  });
});
