/**
 * 第2章：类型系统深入理解练习题
 * 
 * 请完成以下练习，掌握类型别名、接口、联合类型、交叉类型等概念
 * 完成后可以运行 `npx tsc practice.ts --noEmit` 检查是否有类型错误
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：类型别名练习
// ============================================================================

console.log('=== 练习1：类型别名练习 ===');

// TODO: 定义以下类型别名

// 1. 定义用户ID类型（可以是数字或字符串）
// type UserID = ?

// 2. 定义用户状态类型（活跃、非活跃、暂停）
// type UserStatus = ?

// 3. 定义权限级别类型（只读、读写、管理员）
// type PermissionLevel = ?

// 4. 定义回调函数类型
// type EventCallback = ?

// 5. 定义配置对象类型
// type AppConfig = ?

// TODO: 使用你定义的类型别名

// const userId: UserID = "user_123";
// const userStatus: UserStatus = "active";
// const permission: PermissionLevel = "admin";

// const handleClick: EventCallback = (event) => {
//     console.log('点击事件:', event);
// };

// const config: AppConfig = {
//     apiUrl: "https://api.example.com",
//     timeout: 5000,
//     debug: true
// };

console.log('类型别名练习 - 请定义上述类型别名');

// ============================================================================
// 练习2：接口练习
// ============================================================================

console.log('\n=== 练习2：接口练习 ===');

// TODO: 定义以下接口

// 1. 定义基础用户接口
// interface User {
//     // TODO: 添加用户属性
// }

// 2. 定义地址接口
// interface Address {
//     // TODO: 添加地址属性
// }

// 3. 定义扩展用户接口（继承User，添加地址信息）
// interface UserWithAddress extends User {
//     // TODO: 添加地址属性
// }

// 4. 定义产品接口
// interface Product {
//     // TODO: 添加产品属性，包括可选属性
// }

// 5. 定义购物车接口
// interface ShoppingCart {
//     // TODO: 添加购物车属性和方法
// }

// TODO: 实现接口

// const user: User = {
//     // TODO: 实现用户对象
// };

// const userWithAddress: UserWithAddress = {
//     // TODO: 实现带地址的用户对象
// };

// const product: Product = {
//     // TODO: 实现产品对象
// };

console.log('接口练习 - 请定义并实现上述接口');

// ============================================================================
// 练习3：联合类型练习
// ============================================================================

console.log('\n=== 练习3：联合类型练习 ===');

// TODO: 定义以下联合类型

// 1. 定义主题类型（浅色、深色、自动）
// type Theme = ?

// 2. 定义响应状态类型（成功、错误、加载中）
// type ResponseStatus = ?

// 3. 定义输入值类型（字符串、数字、布尔值）
// type InputValue = ?

// 4. 定义API响应类型
// type ApiResponse = ?

// 5. 定义事件类型
// type UIEvent = ?

// TODO: 实现处理联合类型的函数

// function setTheme(theme: Theme): void {
//     // TODO: 实现主题设置逻辑
// }

// function handleResponse(response: ApiResponse): void {
//     // TODO: 实现响应处理逻辑
// }

// function processInput(value: InputValue): string {
//     // TODO: 实现输入处理逻辑
// }

// function handleEvent(event: UIEvent): void {
//     // TODO: 实现事件处理逻辑
// }

// TODO: 测试联合类型函数

// setTheme("dark");
// processInput("hello");
// processInput(42);
// processInput(true);

console.log('联合类型练习 - 请定义上述联合类型和函数');

// ============================================================================
// 练习4：交叉类型练习
// ============================================================================

console.log('\n=== 练习4：交叉类型练习 ===');

// TODO: 定义基础类型用于交叉

// 1. 定义个人信息类型
// type PersonalInfo = ?

// 2. 定义联系信息类型
// type ContactInfo = ?

// 3. 定义工作信息类型
// type WorkInfo = ?

// 4. 定义时间戳类型
// type Timestamps = ?

// TODO: 使用交叉类型组合

// 5. 定义完整用户类型（个人信息 + 联系信息 + 时间戳）
// type FullUser = ?

// 6. 定义员工类型（个人信息 + 联系信息 + 工作信息 + 时间戳）
// type Employee = ?

// TODO: 实现交叉类型对象

// const fullUser: FullUser = {
//     // TODO: 实现完整用户对象
// };

// const employee: Employee = {
//     // TODO: 实现员工对象
// };

// TODO: 实现处理交叉类型的函数

// function createUserProfile(
//     personal: PersonalInfo,
//     contact: ContactInfo
// ): FullUser {
//     // TODO: 实现用户档案创建
// }

// function promoteToEmployee(
//     user: FullUser,
//     workInfo: WorkInfo
// ): Employee {
//     // TODO: 实现用户升级为员工
// }

console.log('交叉类型练习 - 请定义上述交叉类型');

// ============================================================================
// 练习5：类型断言和类型守卫练习
// ============================================================================

console.log('\n=== 练习5：类型断言和类型守卫练习 ===');

// TODO: 实现类型守卫函数

// 1. 实现字符串类型守卫
// function isString(value: unknown): value is string {
//     // TODO: 实现
// }

// 2. 实现数字类型守卫
// function isNumber(value: unknown): value is number {
//     // TODO: 实现
// }

// 3. 实现用户对象类型守卫
// function isUser(obj: any): obj is User {
//     // TODO: 实现
// }

// 4. 实现数组类型守卫
// function isArray<T>(value: unknown): value is T[] {
//     // TODO: 实现
// }

// TODO: 实现使用类型守卫的函数

// function processUnknownValue(value: unknown): string {
//     // TODO: 使用类型守卫处理未知类型值
// }

// function safeParseJSON(jsonString: string): any {
//     // TODO: 安全解析JSON，使用类型断言
// }

// function getArrayLength(value: unknown): number {
//     // TODO: 安全获取数组长度
// }

// TODO: 测试类型守卫

// console.log(processUnknownValue("hello"));
// console.log(processUnknownValue(42));
// console.log(processUnknownValue(true));
// console.log(processUnknownValue(null));

console.log('类型守卫练习 - 请实现上述类型守卫函数');

// ============================================================================
// 练习6：实际应用综合练习
// ============================================================================

console.log('\n=== 练习6：实际应用综合练习 ===');

// 场景：设计一个博客系统的类型系统

// TODO: 定义博客系统相关类型

// 1. 定义作者类型
// interface Author {
//     // TODO: 定义作者属性
// }

// 2. 定义文章状态类型
// type ArticleStatus = ?

// 3. 定义文章类别类型
// type ArticleCategory = ?

// 4. 定义文章接口
// interface Article {
//     // TODO: 定义文章属性
// }

// 5. 定义评论接口
// interface Comment {
//     // TODO: 定义评论属性
// }

// 6. 定义博客配置类型
// type BlogConfig = ?

// TODO: 定义操作相关类型

// 7. 定义文章操作类型
// type ArticleAction = ?

// 8. 定义搜索结果类型
// type SearchResult<T> = ?

// TODO: 实现博客系统函数

// function createArticle(
//     title: string,
//     content: string,
//     author: Author,
//     category: ArticleCategory
// ): Article {
//     // TODO: 实现文章创建
// }

// function updateArticleStatus(
//     article: Article,
//     status: ArticleStatus
// ): Article {
//     // TODO: 实现文章状态更新
// }

// function addComment(
//     article: Article,
//     comment: Omit<Comment, 'id' | 'createdAt'>
// ): Article {
//     // TODO: 实现添加评论
// }

// function searchArticles(
//     articles: Article[],
//     query: string,
//     category?: ArticleCategory
// ): SearchResult<Article> {
//     // TODO: 实现文章搜索
// }

// function getArticlesByAuthor(
//     articles: Article[],
//     authorId: string
// ): Article[] {
//     // TODO: 实现按作者查找文章
// }

// TODO: 测试博客系统

// const author: Author = {
//     // TODO: 创建作者对象
// };

// const article = createArticle(
//     "TypeScript 学习指南",
//     "这是一篇关于 TypeScript 的文章...",
//     author,
//     "technology"
// );

// console.log('创建的文章:', article.title);

console.log('综合练习 - 请设计完整的博客系统类型');

console.log('\n=== 练习完成！请检查类型定义是否正确 ===');
console.log('运行命令: npx tsc chapters/chapter-02-types/practice.ts --noEmit 来检查类型错误');
