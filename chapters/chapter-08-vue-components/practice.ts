/**
 * 第8章：Vue 组件的 TypeScript 开发练习题
 * 
 * 请完成以下练习，掌握用 TypeScript 开发类型安全的 Vue 组件
 * 包括 Props 类型定义、组件间通信、Mixin、高阶组件等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：复杂 Props 类型定义练习
// ============================================================================

console.log('=== 练习1：复杂 Props 类型定义练习 ===');

// TODO: 定义以下类型和组件

// 1. 定义表格列配置类型
// interface TableColumn {
//     // TODO: 定义列的属性
//     // key: 列的唯一标识
//     // title: 列标题
//     // width?: 列宽度（可选）
//     // sortable?: 是否可排序（可选）
//     // render?: 自定义渲染函数（可选）
// }

// 2. 定义分页配置类型
// interface PaginationConfig {
//     // TODO: 定义分页属性
//     // current: 当前页码
//     // pageSize: 每页条数
//     // total: 总条数
//     // showSizeChanger?: 是否显示页面大小选择器（可选）
//     // showQuickJumper?: 是否显示快速跳转（可选）
// }

// 3. 定义数据表格组件 Props 类型
// interface DataTableProps {
//     // TODO: 定义组件属性
//     // columns: 表格列配置
//     // dataSource: 数据源
//     // loading?: 加载状态（可选）
//     // pagination?: 分页配置（可选）
//     // rowKey?: 行数据的 key（可选，默认为 'id'）
//     // onRowClick?: 行点击事件（可选）
//     // onSortChange?: 排序变化事件（可选）
// }

// 4. 实现 DataTable 组件（类组件风格）
// @Component
// class DataTableComponent extends Vue {
//     // TODO: 使用 @Prop 装饰器定义 props
//     
//     // TODO: 定义组件内部状态
//     // private sortColumn: string | null = null;
//     // private sortOrder: 'asc' | 'desc' | null = null;
//     
//     // TODO: 定义计算属性
//     // get sortedData(): any[] {
//         // 实现数据排序逻辑
//     // }
//     
//     // TODO: 定义方法
//     // handleSort(column: TableColumn): void {
//         // 实现排序逻辑
//     // }
//     
//     // handleRowClick(record: any, index: number): void {
//         // 实现行点击逻辑
//     // }
// }

// ============================================================================
// 练习2：组件间通信练习
// ============================================================================

console.log('=== 练习2：组件间通信练习 ===');

// TODO: 实现一个用户管理系统的组件通信

// 1. 定义用户数据类型
// interface User {
//     // TODO: 定义用户属性
//     // id: number;
//     // name: string;
//     // email: string;
//     // role: 'admin' | 'user' | 'guest';
//     // isActive: boolean;
//     // createdAt: Date;
// }

// 2. 定义表单数据类型
// interface UserFormData {
//     // TODO: 定义表单数据（不包含 id 和 createdAt）
// }

// 3. 定义验证错误类型
// interface ValidationError {
//     // TODO: 定义验证错误
//     // field: string;
//     // message: string;
// }

// 4. 实现用户表单组件（子组件）
// @Component
// class UserFormComponent extends Vue {
//     // TODO: 定义 props
//     // @Prop({ type: Object })
//     // initialUser?: Partial<User>;
//     
//     // @Prop({ type: Boolean, default: false })
//     // loading!: boolean;
//     
//     // TODO: 定义组件状态
//     // private form: UserFormData = {
//         // name: '',
//         // email: '',
//         // role: 'user',
//         // isActive: true
//     // };
//     
//     // private errors: ValidationError[] = [];
//     
//     // TODO: 监听 initialUser 变化
//     // @Watch('initialUser', { immediate: true })
//     // onInitialUserChanged(user?: Partial<User>): void {
//         // 更新表单数据
//     // }
//     
//     // TODO: 定义表单验证方法
//     // validateForm(): boolean {
//         // 实现表单验证逻辑
//     // }
//     
//     // TODO: 使用 @Emit 装饰器定义事件
//     // @Emit('submit')
//     // handleSubmit(): UserFormData | null {
//         // 验证表单并返回数据
//     // }
//     
//     // @Emit('cancel')
//     // handleCancel(): void {
//         // 重置表单
//     // }
//     
//     // @Emit('validation-error')
//     // emitValidationError(): ValidationError[] {
//         // 返回验证错误
//     // }
// }

// 5. 实现用户列表组件（父组件）
// @Component({
//     components: { UserForm: UserFormComponent }
// })
// class UserListComponent extends Vue {
//     // TODO: 定义组件状态
//     // private users: User[] = [];
//     // private editingUser: User | null = null;
//     // private showForm: boolean = false;
//     // private formLoading: boolean = false;
//     
//     // TODO: 定义方法
//     // async handleUserSubmit(formData: UserFormData): Promise<void> {
//         // 处理用户提交（新增或编辑）
//     // }
//     
//     // handleFormCancel(): void {
//         // 处理表单取消
//     // }
//     
//     // handleValidationError(errors: ValidationError[]): void {
//         // 处理验证错误
//     // }
//     
//     // editUser(user: User): void {
//         // 编辑用户
//     // }
//     
//     // deleteUser(userId: number): void {
//         // 删除用户
//     // }
// }

// ============================================================================
// 练习3：Event Bus 类型安全通信练习
// ============================================================================

console.log('=== 练习3：Event Bus 类型安全通信练习 ===');

// TODO: 实现类型安全的 Event Bus

// 1. 定义事件类型映射
// interface EventMap {
//     // TODO: 定义各种事件及其参数类型
//     // 'user-created': (user: User) => void;
//     // 'user-updated': (user: User) => void;
//     // 'user-deleted': (userId: number) => void;
//     // 'notification': (message: string, type: 'success' | 'error' | 'warning') => void;
//     // 'theme-changed': (theme: 'light' | 'dark') => void;
// }

// 2. 实现类型安全的 Event Bus
// class TypedEventBus {
//     // TODO: 实现类型安全的事件总线
//     // private vue = new Vue();
//     
//     // emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>): void {
//         // 发送事件
//     // }
//     
//     // on<K extends keyof EventMap>(event: K, callback: EventMap[K]): void {
//         // 监听事件
//     // }
//     
//     // off<K extends keyof EventMap>(event: K, callback?: EventMap[K]): void {
//         // 移除事件监听
//     // }
//     
//     // once<K extends keyof EventMap>(event: K, callback: EventMap[K]): void {
//         // 监听一次事件
//     // }
// }

// 3. 创建全局事件总线实例
// export const eventBus = new TypedEventBus();

// 4. 实现使用 Event Bus 的组件
// @Component
// class NotificationComponent extends Vue {
//     // TODO: 定义通知状态
//     // private notifications: Array<{
//         // id: number;
//         // message: string;
//         // type: 'success' | 'error' | 'warning';
//         // timestamp: Date;
//     // }> = [];
//     
//     // TODO: 在组件挂载时监听事件
//     // mounted(): void {
//         // eventBus.on('notification', this.handleNotification);
//         // eventBus.on('user-created', this.handleUserCreated);
//         // eventBus.on('user-updated', this.handleUserUpdated);
//         // eventBus.on('user-deleted', this.handleUserDeleted);
//     // }
//     
//     // TODO: 在组件销毁前移除事件监听
//     // beforeDestroy(): void {
//         // eventBus.off('notification', this.handleNotification);
//         // eventBus.off('user-created', this.handleUserCreated);
//         // eventBus.off('user-updated', this.handleUserUpdated);
//         // eventBus.off('user-deleted', this.handleUserDeleted);
//     // }
//     
//     // TODO: 定义事件处理方法
//     // private handleNotification(message: string, type: 'success' | 'error' | 'warning'): void {
//         // 添加通知
//     // }
//     
//     // private handleUserCreated(user: User): void {
//         // 处理用户创建事件
//     // }
//     
//     // private handleUserUpdated(user: User): void {
//         // 处理用户更新事件
//     // }
//     
//     // private handleUserDeleted(userId: number): void {
//         // 处理用户删除事件
//     // }
// }

// ============================================================================
// 练习4：TypeScript Mixin 练习
// ============================================================================

console.log('=== 练习4：TypeScript Mixin 练习 ===');

// TODO: 实现可重用的 TypeScript Mixin

// 1. 定义加载状态 Mixin
// @Component
// class LoadingMixin extends Vue {
//     // TODO: 定义加载状态
//     // protected loading: boolean = false;
//
//     // TODO: 定义设置加载状态的方法
//     // protected setLoading(loading: boolean): void {
//         // this.loading = loading;
//     // }
//
//     // TODO: 定义带加载状态的异步方法包装器
//     // protected async withLoading<T>(asyncFn: () => Promise<T>): Promise<T> {
//         // this.setLoading(true);
//         // try {
//             // return await asyncFn();
//         // } finally {
//             // this.setLoading(false);
//         // }
//     // }
// }

// 2. 定义表单验证 Mixin
// @Component
// class FormValidationMixin extends Vue {
//     // TODO: 定义验证错误状态
//     // protected validationErrors: Record<string, string> = {};
//
//     // TODO: 定义验证规则类型
//     // protected validationRules: Record<string, Array<(value: any) => string | null>> = {};
//
//     // TODO: 定义验证方法
//     // protected validateField(field: string, value: any): boolean {
//         // 实现字段验证逻辑
//     // }
//
//     // protected validateForm(formData: Record<string, any>): boolean {
//         // 实现整个表单验证逻辑
//     // }
//
//     // protected clearValidationErrors(): void {
//         // 清除验证错误
//     // }
//
//     // protected setValidationError(field: string, message: string): void {
//         // 设置验证错误
//     // }
// }

// 3. 定义权限检查 Mixin
// @Component
// class PermissionMixin extends Vue {
//     // TODO: 定义权限检查方法
//     // protected hasPermission(permission: string): boolean {
//         // 检查用户是否有指定权限
//         // 这里可以从 Vuex store 或其他地方获取用户权限
//     // }
//
//     // protected hasRole(role: string): boolean {
//         // 检查用户是否有指定角色
//     // }
//
//     // protected requirePermission(permission: string): void {
//         // 要求用户有指定权限，否则抛出错误或跳转
//     // }
// }

// 4. 使用多个 Mixin 的组件
// @Component({
//     mixins: [LoadingMixin, FormValidationMixin, PermissionMixin]
// })
// class UserManagementComponent extends mixins(LoadingMixin, FormValidationMixin, PermissionMixin) {
//     // TODO: 定义组件状态
//     // private users: User[] = [];
//     // private userForm: UserFormData = {
//         // name: '',
//         // email: '',
//         // role: 'user',
//         // isActive: true
//     // };
//
//     // TODO: 在组件创建时检查权限
//     // created(): void {
//         // this.requirePermission('user:read');
//     // }
//
//     // TODO: 使用 Mixin 提供的方法
//     // async loadUsers(): Promise<void> {
//         // await this.withLoading(async () => {
//             // 模拟 API 调用
//             // this.users = await userApi.getUsers();
//         // });
//     // }
//
//     // async saveUser(): Promise<void> {
//         // if (!this.hasPermission('user:write')) {
//             // throw new Error('没有权限');
//         // }
//
//         // if (!this.validateForm(this.userForm)) {
//             // return;
//         // }
//
//         // await this.withLoading(async () => {
//             // 保存用户
//         // });
//     // }
// }

// ============================================================================
// 练习5：高阶组件练习
// ============================================================================

console.log('=== 练习5：高阶组件练习 ===');

// TODO: 实现高阶组件

// 1. 定义权限控制高阶组件
// interface WithAuthOptions {
//     // TODO: 定义选项
//     // requiredPermissions?: string[];
//     // requiredRoles?: string[];
//     // redirectTo?: string;
//     // fallbackComponent?: typeof Vue;
// }

// function withAuth(options: WithAuthOptions = {}) {
//     // TODO: 返回高阶组件函数
//     // return function<T extends typeof Vue>(WrappedComponent: T): typeof Vue {
//         // @Component
//         // class WithAuthComponent extends Vue {
//             // TODO: 实现权限检查逻辑
//
//             // get hasRequiredPermissions(): boolean {
//                 // 检查是否有所需权限
//             // }
//
//             // get hasRequiredRoles(): boolean {
//                 // 检查是否有所需角色
//             // }
//
//             // get canAccess(): boolean {
//                 // 综合权限检查
//             // }
//
//             // created(): void {
//                 // 在组件创建时检查权限
//             // }
//
//             // render() {
//                 // 根据权限渲染不同内容
//             // }
//         // }
//
//         // return WithAuthComponent;
//     // };
// }

// 2. 定义加载状态高阶组件
// interface WithLoadingOptions {
//     // TODO: 定义选项
//     // loadingComponent?: typeof Vue;
//     // delay?: number;
//     // timeout?: number;
// }

// function withLoading(options: WithLoadingOptions = {}) {
//     // TODO: 返回高阶组件函数
//     // return function<T extends typeof Vue>(WrappedComponent: T): typeof Vue {
//         // @Component
//         // class WithLoadingComponent extends Vue {
//             // TODO: 实现加载状态管理
//         // }
//
//         // return WithLoadingComponent;
//     // };
// }

// 3. 使用高阶组件
// const AuthenticatedUserList = withAuth({
//     requiredPermissions: ['user:read'],
//     redirectTo: '/login'
// })(UserListComponent);

// const LoadingUserList = withLoading({
//     delay: 200,
//     timeout: 10000
// })(UserListComponent);

// ============================================================================
// 练习6：组件测试练习
// ============================================================================

console.log('=== 练习6：组件测试练习 ===');

// TODO: 为组件编写单元测试

// 1. 定义测试工具类型
// interface TestWrapper<T extends Vue> {
//     // TODO: 定义测试包装器类型
//     // vm: T;
//     // find(selector: string): Element | null;
//     // findAll(selector: string): Element[];
//     // trigger(event: string, data?: any): Promise<void>;
//     // setProps(props: Partial<T['$props']>): Promise<void>;
//     // setData(data: Partial<T['$data']>): Promise<void>;
//     // destroy(): void;
// }

// 2. 定义测试用例
// describe('UserCard Component', () => {
//     // TODO: 定义测试变量
//     // let wrapper: TestWrapper<UserCardComponent>;
//     // const mockUser: User = {
//         // id: 1,
//         // name: 'John Doe',
//         // email: 'john@example.com',
//         // role: 'user',
//         // isActive: true,
//         // createdAt: new Date()
//     // };
//
//     // TODO: 测试前准备
//     // beforeEach(() => {
//         // wrapper = shallowMount(UserCardComponent, {
//             // propsData: {
//                 // user: mockUser,
//                 // showActions: true
//             // }
//         // });
//     // });
//
//     // TODO: 测试后清理
//     // afterEach(() => {
//         // wrapper.destroy();
//     // });
//
//     // TODO: 测试用例
//     // it('should render user information correctly', () => {
//         // 测试用户信息渲染
//     // });
//
//     // it('should emit click event when clicked', async () => {
//         // 测试点击事件
//     // });
//
//     // it('should show/hide actions based on showActions prop', async () => {
//         // 测试条件渲染
//     // });
//
//     // it('should handle user role display correctly', () => {
//         // 测试角色显示
//     // });
// });

// ============================================================================
// 练习完成提示
// ============================================================================

console.log(`
🎯 练习完成指南：

1. 复杂 Props 类型定义练习
   - 定义 TableColumn、PaginationConfig、DataTableProps 接口
   - 实现 DataTableComponent 类组件
   - 使用 @Prop 装饰器定义类型安全的 props

2. 组件间通信练习
   - 定义 User、UserFormData、ValidationError 接口
   - 实现父子组件通信
   - 使用 @Emit 装饰器和 @Watch 装饰器

3. Event Bus 类型安全通信练习
   - 定义 EventMap 接口
   - 实现 TypedEventBus 类
   - 在组件中使用类型安全的事件通信

4. TypeScript Mixin 练习
   - 实现 LoadingMixin、FormValidationMixin、PermissionMixin
   - 在组件中使用多个 Mixin
   - 理解 Mixin 的类型继承

5. 高阶组件练习
   - 实现 withAuth 和 withLoading 高阶组件
   - 使用高阶组件包装现有组件
   - 理解高阶组件的类型定义

6. 组件测试练习
   - 为组件编写单元测试
   - 测试 props、events、computed 等
   - 使用 TypeScript 编写类型安全的测试

💡 提示：
- 注意类型安全，避免使用 any
- 合理使用泛型提高代码复用性
- 遵循 Vue 2 + TypeScript 的最佳实践
- 编写清晰的类型注释和文档
`);
