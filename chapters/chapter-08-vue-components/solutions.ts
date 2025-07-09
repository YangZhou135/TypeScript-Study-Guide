/**
 * 第8章：Vue 组件的 TypeScript 开发练习题解答
 * 
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 展示了用 TypeScript 开发类型安全的 Vue 组件的最佳实践
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// 模拟 Vue 相关导入
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

// ============================================================================
// 练习1：复杂 Props 类型定义练习 - 解答
// ============================================================================

console.log('=== 练习1：复杂 Props 类型定义练习 - 解答 ===');

// 1. 定义表格列配置类型
interface TableColumn {
    key: string;                                    // 列的唯一标识
    title: string;                                  // 列标题
    width?: number;                                 // 列宽度（可选）
    sortable?: boolean;                             // 是否可排序（可选）
    render?: (value: any, record: any) => string;  // 自定义渲染函数（可选）
}

// 2. 定义分页配置类型
interface PaginationConfig {
    current: number;                // 当前页码
    pageSize: number;               // 每页条数
    total: number;                  // 总条数
    showSizeChanger?: boolean;      // 是否显示页面大小选择器（可选）
    showQuickJumper?: boolean;      // 是否显示快速跳转（可选）
}

// 3. 定义数据表格组件 Props 类型
interface DataTableProps {
    columns: TableColumn[];                                         // 表格列配置
    dataSource: any[];                                             // 数据源
    loading?: boolean;                                             // 加载状态（可选）
    pagination?: PaginationConfig;                                 // 分页配置（可选）
    rowKey?: string;                                               // 行数据的 key（可选，默认为 'id'）
    onRowClick?: (record: any, index: number) => void;            // 行点击事件（可选）
    onSortChange?: (column: TableColumn, order: 'asc' | 'desc' | null) => void; // 排序变化事件（可选）
}

// 4. 实现 DataTable 组件（类组件风格）
@Component
class DataTableComponent extends Vue implements DataTableProps {
    // 使用 @Prop 装饰器定义 props
    @Prop({ type: Array, required: true })
    columns!: TableColumn[];
    
    @Prop({ type: Array, required: true })
    dataSource!: any[];
    
    @Prop({ type: Boolean, default: false })
    loading!: boolean;
    
    @Prop({ type: Object })
    pagination?: PaginationConfig;
    
    @Prop({ type: String, default: 'id' })
    rowKey!: string;
    
    @Prop({ type: Function })
    onRowClick?: (record: any, index: number) => void;
    
    @Prop({ type: Function })
    onSortChange?: (column: TableColumn, order: 'asc' | 'desc' | null) => void;
    
    // 定义组件内部状态
    private sortColumn: string | null = null;
    private sortOrder: 'asc' | 'desc' | null = null;
    
    // 定义计算属性
    get sortedData(): any[] {
        if (!this.sortColumn || !this.sortOrder) {
            return this.dataSource;
        }
        
        return [...this.dataSource].sort((a, b) => {
            const aValue = a[this.sortColumn!];
            const bValue = b[this.sortColumn!];
            
            if (aValue === bValue) return 0;
            
            const result = aValue > bValue ? 1 : -1;
            return this.sortOrder === 'asc' ? result : -result;
        });
    }
    
    get hasData(): boolean {
        return this.dataSource.length > 0;
    }
    
    get sortableColumns(): TableColumn[] {
        return this.columns.filter(col => col.sortable);
    }
    
    // 定义方法
    handleSort(column: TableColumn): void {
        if (!column.sortable) return;
        
        if (this.sortColumn === column.key) {
            // 切换排序顺序：asc -> desc -> null -> asc
            switch (this.sortOrder) {
                case 'asc':
                    this.sortOrder = 'desc';
                    break;
                case 'desc':
                    this.sortOrder = null;
                    this.sortColumn = null;
                    break;
                default:
                    this.sortOrder = 'asc';
                    break;
            }
        } else {
            this.sortColumn = column.key;
            this.sortOrder = 'asc';
        }
        
        // 触发排序变化事件
        if (this.onSortChange) {
            this.onSortChange(column, this.sortOrder);
        }
    }
    
    handleRowClick(record: any, index: number): void {
        if (this.onRowClick) {
            this.onRowClick(record, index);
        }
    }
    
    // 获取行的唯一标识
    getRowKey(record: any, index: number): string | number {
        return record[this.rowKey] || index;
    }
    
    // 渲染单元格内容
    renderCell(column: TableColumn, record: any): string {
        if (column.render) {
            return column.render(record[column.key], record);
        }
        return record[column.key] || '';
    }
    
    // 获取排序图标类名
    getSortIconClass(column: TableColumn): string {
        if (!column.sortable) return '';
        if (this.sortColumn !== column.key) return 'sort-icon';
        
        switch (this.sortOrder) {
            case 'asc':
                return 'sort-icon sort-asc';
            case 'desc':
                return 'sort-icon sort-desc';
            default:
                return 'sort-icon';
        }
    }
}

// ============================================================================
// 练习2：组件间通信练习 - 解答
// ============================================================================

console.log('=== 练习2：组件间通信练习 - 解答 ===');

// 1. 定义用户数据类型
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    isActive: boolean;
    createdAt: Date;
}

// 2. 定义表单数据类型（不包含 id 和 createdAt）
interface UserFormData {
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    isActive: boolean;
}

// 3. 定义验证错误类型
interface ValidationError {
    field: string;
    message: string;
}

// 4. 实现用户表单组件（子组件）
@Component
class UserFormComponent extends Vue {
    // 定义 props
    @Prop({ type: Object })
    initialUser?: Partial<User>;
    
    @Prop({ type: Boolean, default: false })
    loading!: boolean;
    
    // 定义组件状态
    private form: UserFormData = {
        name: '',
        email: '',
        role: 'user',
        isActive: true
    };
    
    private errors: ValidationError[] = [];
    
    // 监听 initialUser 变化
    @Watch('initialUser', { immediate: true })
    onInitialUserChanged(user?: Partial<User>): void {
        if (user) {
            this.form = {
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'user',
                isActive: user.isActive !== undefined ? user.isActive : true
            };
        }
    }
    
    // 定义表单验证方法
    validateForm(): boolean {
        this.errors = [];
        
        // 验证姓名
        if (!this.form.name.trim()) {
            this.errors.push({ field: 'name', message: '姓名不能为空' });
        } else if (this.form.name.length < 2) {
            this.errors.push({ field: 'name', message: '姓名至少需要2个字符' });
        }
        
        // 验证邮箱
        if (!this.form.email.trim()) {
            this.errors.push({ field: 'email', message: '邮箱不能为空' });
        } else if (!this.isValidEmail(this.form.email)) {
            this.errors.push({ field: 'email', message: '邮箱格式不正确' });
        }
        
        // 如果有错误，触发验证错误事件
        if (this.errors.length > 0) {
            this.emitValidationError();
            return false;
        }
        
        return true;
    }
    
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 使用 @Emit 装饰器定义事件
    @Emit('submit')
    handleSubmit(): UserFormData | null {
        if (this.validateForm()) {
            return { ...this.form };
        }
        return null;
    }
    
    @Emit('cancel')
    handleCancel(): void {
        // 重置表单
        this.form = {
            name: '',
            email: '',
            role: 'user',
            isActive: true
        };
        this.errors = [];
    }
    
    @Emit('validation-error')
    emitValidationError(): ValidationError[] {
        return [...this.errors];
    }
    
    // 获取字段错误信息
    getFieldError(field: string): string | null {
        const error = this.errors.find(err => err.field === field);
        return error ? error.message : null;
    }
    
    // 检查字段是否有错误
    hasFieldError(field: string): boolean {
        return this.errors.some(err => err.field === field);
    }
}

// 5. 实现用户列表组件（父组件）
@Component({
    components: { UserForm: UserFormComponent }
})
class UserListComponent extends Vue {
    // 定义组件状态
    private users: User[] = [];
    private editingUser: User | null = null;
    private showForm: boolean = false;
    private formLoading: boolean = false;

    // 定义方法
    async handleUserSubmit(formData: UserFormData): Promise<void> {
        if (!formData) return;

        this.formLoading = true;

        try {
            if (this.editingUser) {
                // 更新现有用户
                const updatedUser: User = {
                    ...this.editingUser,
                    ...formData
                };

                const index = this.users.findIndex(u => u.id === this.editingUser!.id);
                if (index > -1) {
                    this.$set(this.users, index, updatedUser);
                }

                console.log('用户更新成功:', updatedUser);
            } else {
                // 创建新用户
                const newUser: User = {
                    id: Date.now(), // 简单的 ID 生成
                    ...formData,
                    createdAt: new Date()
                };

                this.users.push(newUser);
                console.log('用户创建成功:', newUser);
            }

            // 关闭表单
            this.showForm = false;
            this.editingUser = null;

        } catch (error) {
            console.error('保存用户失败:', error);
        } finally {
            this.formLoading = false;
        }
    }

    handleFormCancel(): void {
        this.showForm = false;
        this.editingUser = null;
        this.formLoading = false;
    }

    handleValidationError(errors: ValidationError[]): void {
        console.error('表单验证错误:', errors);
        // 可以在这里显示全局错误提示
    }

    editUser(user: User): void {
        this.editingUser = user;
        this.showForm = true;
    }

    deleteUser(userId: number): void {
        const index = this.users.findIndex(u => u.id === userId);
        if (index > -1) {
            const deletedUser = this.users.splice(index, 1)[0];
            console.log('用户删除成功:', deletedUser);
        }
    }

    addNewUser(): void {
        this.editingUser = null;
        this.showForm = true;
    }

    // 计算属性
    get activeUsers(): User[] {
        return this.users.filter(user => user.isActive);
    }

    get inactiveUsers(): User[] {
        return this.users.filter(user => !user.isActive);
    }

    get userStats(): { total: number; active: number; inactive: number } {
        return {
            total: this.users.length,
            active: this.activeUsers.length,
            inactive: this.inactiveUsers.length
        };
    }
}

// ============================================================================
// 练习3：Event Bus 类型安全通信练习 - 解答
// ============================================================================

console.log('=== 练习3：Event Bus 类型安全通信练习 - 解答 ===');

// 1. 定义事件类型映射
interface EventMap {
    'user-created': (user: User) => void;
    'user-updated': (user: User) => void;
    'user-deleted': (userId: number) => void;
    'notification': (message: string, type: 'success' | 'error' | 'warning') => void;
    'theme-changed': (theme: 'light' | 'dark') => void;
}

// 2. 实现类型安全的 Event Bus
class TypedEventBus {
    private vue = new Vue();

    emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>): void {
        this.vue.$emit(event, ...args);
    }

    on<K extends keyof EventMap>(event: K, callback: EventMap[K]): void {
        this.vue.$on(event, callback);
    }

    off<K extends keyof EventMap>(event: K, callback?: EventMap[K]): void {
        this.vue.$off(event, callback);
    }

    once<K extends keyof EventMap>(event: K, callback: EventMap[K]): void {
        this.vue.$once(event, callback);
    }

    // 销毁事件总线
    destroy(): void {
        this.vue.$destroy();
    }
}

// 3. 创建全局事件总线实例
export const eventBus = new TypedEventBus();

// 4. 实现使用 Event Bus 的组件
@Component
class NotificationComponent extends Vue {
    // 定义通知状态
    private notifications: Array<{
        id: number;
        message: string;
        type: 'success' | 'error' | 'warning';
        timestamp: Date;
    }> = [];

    private notificationId = 0;

    // 在组件挂载时监听事件
    mounted(): void {
        eventBus.on('notification', this.handleNotification);
        eventBus.on('user-created', this.handleUserCreated);
        eventBus.on('user-updated', this.handleUserUpdated);
        eventBus.on('user-deleted', this.handleUserDeleted);
    }

    // 在组件销毁前移除事件监听
    beforeDestroy(): void {
        eventBus.off('notification', this.handleNotification);
        eventBus.off('user-created', this.handleUserCreated);
        eventBus.off('user-updated', this.handleUserUpdated);
        eventBus.off('user-deleted', this.handleUserDeleted);
    }

    // 定义事件处理方法
    private handleNotification(message: string, type: 'success' | 'error' | 'warning'): void {
        const notification = {
            id: ++this.notificationId,
            message,
            type,
            timestamp: new Date()
        };

        this.notifications.push(notification);

        // 自动移除通知（3秒后）
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 3000);
    }

    private handleUserCreated(user: User): void {
        this.handleNotification(`用户 ${user.name} 创建成功`, 'success');
    }

    private handleUserUpdated(user: User): void {
        this.handleNotification(`用户 ${user.name} 更新成功`, 'success');
    }

    private handleUserDeleted(userId: number): void {
        this.handleNotification(`用户已删除`, 'warning');
    }

    // 移除通知
    removeNotification(id: number): void {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    }

    // 清空所有通知
    clearAllNotifications(): void {
        this.notifications = [];
    }

    // 计算属性
    get hasNotifications(): boolean {
        return this.notifications.length > 0;
    }

    get notificationCount(): number {
        return this.notifications.length;
    }
}

// ============================================================================
// 练习4：TypeScript Mixin 练习 - 解答
// ============================================================================

console.log('=== 练习4：TypeScript Mixin 练习 - 解答 ===');

// 1. 定义加载状态 Mixin
@Component
class LoadingMixin extends Vue {
    // 定义加载状态
    protected loading: boolean = false;

    // 定义设置加载状态的方法
    protected setLoading(loading: boolean): void {
        this.loading = loading;
    }

    // 定义带加载状态的异步方法包装器
    protected async withLoading<T>(asyncFn: () => Promise<T>): Promise<T> {
        this.setLoading(true);
        try {
            return await asyncFn();
        } finally {
            this.setLoading(false);
        }
    }

    // 获取加载状态
    get isLoading(): boolean {
        return this.loading;
    }
}

// 2. 定义表单验证 Mixin
@Component
class FormValidationMixin extends Vue {
    // 定义验证错误状态
    protected validationErrors: Record<string, string> = {};

    // 定义验证规则类型
    protected validationRules: Record<string, Array<(value: any) => string | null>> = {};

    // 定义验证方法
    protected validateField(field: string, value: any): boolean {
        const rules = this.validationRules[field];
        if (!rules) return true;

        for (const rule of rules) {
            const error = rule(value);
            if (error) {
                this.setValidationError(field, error);
                return false;
            }
        }

        this.clearFieldError(field);
        return true;
    }

    protected validateForm(formData: Record<string, any>): boolean {
        let isValid = true;
        this.clearValidationErrors();

        for (const field in formData) {
            if (!this.validateField(field, formData[field])) {
                isValid = false;
            }
        }

        return isValid;
    }

    protected clearValidationErrors(): void {
        this.validationErrors = {};
    }

    protected clearFieldError(field: string): void {
        if (this.validationErrors[field]) {
            this.$delete(this.validationErrors, field);
        }
    }

    protected setValidationError(field: string, message: string): void {
        this.$set(this.validationErrors, field, message);
    }

    // 获取字段错误
    protected getFieldError(field: string): string | null {
        return this.validationErrors[field] || null;
    }

    // 检查是否有错误
    protected hasErrors(): boolean {
        return Object.keys(this.validationErrors).length > 0;
    }

    // 常用验证规则
    protected createRequiredRule(message: string = '此字段为必填项') {
        return (value: any): string | null => {
            if (value === null || value === undefined || value === '') {
                return message;
            }
            return null;
        };
    }

    protected createMinLengthRule(minLength: number, message?: string) {
        return (value: string): string | null => {
            if (value && value.length < minLength) {
                return message || `最少需要 ${minLength} 个字符`;
            }
            return null;
        };
    }

    protected createEmailRule(message: string = '邮箱格式不正确') {
        return (value: string): string | null => {
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return message;
            }
            return null;
        };
    }
}

// 3. 定义权限检查 Mixin
@Component
class PermissionMixin extends Vue {
    // 定义权限检查方法
    protected hasPermission(permission: string): boolean {
        // 这里应该从 Vuex store 或其他地方获取用户权限
        // 为了演示，我们使用模拟数据
        const userPermissions = this.getUserPermissions();
        return userPermissions.includes(permission);
    }

    protected hasRole(role: string): boolean {
        // 检查用户是否有指定角色
        const userRoles = this.getUserRoles();
        return userRoles.includes(role);
    }

    protected requirePermission(permission: string): void {
        if (!this.hasPermission(permission)) {
            throw new Error(`缺少权限: ${permission}`);
        }
    }

    protected requireRole(role: string): void {
        if (!this.hasRole(role)) {
            throw new Error(`缺少角色: ${role}`);
        }
    }

    // 模拟获取用户权限
    private getUserPermissions(): string[] {
        // 实际应用中应该从 store 获取
        return ['user:read', 'user:write', 'post:read'];
    }

    // 模拟获取用户角色
    private getUserRoles(): string[] {
        // 实际应用中应该从 store 获取
        return ['user', 'editor'];
    }

    // 检查是否为管理员
    protected isAdmin(): boolean {
        return this.hasRole('admin');
    }

    // 检查是否为当前用户
    protected isCurrentUser(userId: number): boolean {
        // 实际应用中应该从 store 获取当前用户 ID
        const currentUserId = this.getCurrentUserId();
        return currentUserId === userId;
    }

    private getCurrentUserId(): number {
        // 模拟当前用户 ID
        return 1;
    }
}

// 4. 使用多个 Mixin 的组件
@Component({
    mixins: [LoadingMixin, FormValidationMixin, PermissionMixin]
})
class UserManagementComponent extends mixins(LoadingMixin, FormValidationMixin, PermissionMixin) {
    // 定义组件状态
    private users: User[] = [];
    private userForm: UserFormData = {
        name: '',
        email: '',
        role: 'user',
        isActive: true
    };

    // 在组件创建时检查权限
    created(): void {
        try {
            this.requirePermission('user:read');
            this.setupValidationRules();
        } catch (error) {
            console.error('权限检查失败:', error);
            // 可以跳转到无权限页面
        }
    }

    // 设置验证规则
    private setupValidationRules(): void {
        this.validationRules = {
            name: [
                this.createRequiredRule('姓名不能为空'),
                this.createMinLengthRule(2, '姓名至少需要2个字符')
            ],
            email: [
                this.createRequiredRule('邮箱不能为空'),
                this.createEmailRule()
            ]
        };
    }

    // 使用 Mixin 提供的方法
    async loadUsers(): Promise<void> {
        await this.withLoading(async () => {
            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.users = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'user',
                    isActive: true,
                    createdAt: new Date()
                }
            ];
        });
    }

    async saveUser(): Promise<void> {
        try {
            this.requirePermission('user:write');
        } catch (error) {
            console.error('没有保存权限');
            return;
        }

        if (!this.validateForm(this.userForm)) {
            console.error('表单验证失败');
            return;
        }

        await this.withLoading(async () => {
            // 模拟保存用户
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('用户保存成功');
        });
    }

    // 计算属性
    get canCreateUser(): boolean {
        return this.hasPermission('user:write');
    }

    get canDeleteUser(): boolean {
        return this.hasPermission('user:delete') || this.isAdmin();
    }
}

// ============================================================================
// 练习5：高阶组件练习 - 解答
// ============================================================================

console.log('=== 练习5：高阶组件练习 - 解答 ===');

// 1. 定义权限控制高阶组件
interface WithAuthOptions {
    requiredPermissions?: string[];
    requiredRoles?: string[];
    redirectTo?: string;
    fallbackComponent?: typeof Vue;
}

function withAuth(options: WithAuthOptions = {}) {
    return function<T extends typeof Vue>(WrappedComponent: T): typeof Vue {
        @Component
        class WithAuthComponent extends Vue {
            get hasRequiredPermissions(): boolean {
                if (!options.requiredPermissions) return true;

                // 模拟权限检查
                const userPermissions = ['user:read', 'user:write'];
                return options.requiredPermissions.every(permission =>
                    userPermissions.includes(permission)
                );
            }

            get hasRequiredRoles(): boolean {
                if (!options.requiredRoles) return true;

                // 模拟角色检查
                const userRoles = ['user'];
                return options.requiredRoles.every(role =>
                    userRoles.includes(role)
                );
            }

            get canAccess(): boolean {
                return this.hasRequiredPermissions && this.hasRequiredRoles;
            }

            created(): void {
                if (!this.canAccess && options.redirectTo) {
                    // 在实际应用中，这里应该使用 Vue Router 进行跳转
                    console.log(`重定向到: ${options.redirectTo}`);
                }
            }

            render() {
                if (!this.canAccess) {
                    if (options.fallbackComponent) {
                        return this.$createElement(options.fallbackComponent);
                    }
                    return this.$createElement('div', '无权限访问');
                }

                return this.$createElement(WrappedComponent, {
                    props: this.$props,
                    attrs: this.$attrs,
                    on: this.$listeners
                });
            }
        }

        return WithAuthComponent;
    };
}

// 2. 定义加载状态高阶组件
interface WithLoadingOptions {
    loadingComponent?: typeof Vue;
    delay?: number;
    timeout?: number;
}

function withLoading(options: WithLoadingOptions = {}) {
    return function<T extends typeof Vue>(WrappedComponent: T): typeof Vue {
        @Component
        class WithLoadingComponent extends Vue {
            private loading: boolean = true;
            private timedOut: boolean = false;
            private delayTimer?: number;
            private timeoutTimer?: number;

            created(): void {
                // 延迟显示加载状态
                if (options.delay) {
                    this.delayTimer = window.setTimeout(() => {
                        this.loading = true;
                    }, options.delay);
                }

                // 超时处理
                if (options.timeout) {
                    this.timeoutTimer = window.setTimeout(() => {
                        this.timedOut = true;
                        this.loading = false;
                    }, options.timeout);
                }

                // 模拟异步加载完成
                setTimeout(() => {
                    this.loading = false;
                    this.clearTimers();
                }, 1000);
            }

            beforeDestroy(): void {
                this.clearTimers();
            }

            private clearTimers(): void {
                if (this.delayTimer) {
                    clearTimeout(this.delayTimer);
                }
                if (this.timeoutTimer) {
                    clearTimeout(this.timeoutTimer);
                }
            }

            render() {
                if (this.timedOut) {
                    return this.$createElement('div', '加载超时');
                }

                if (this.loading) {
                    if (options.loadingComponent) {
                        return this.$createElement(options.loadingComponent);
                    }
                    return this.$createElement('div', '加载中...');
                }

                return this.$createElement(WrappedComponent, {
                    props: this.$props,
                    attrs: this.$attrs,
                    on: this.$listeners
                });
            }
        }

        return WithLoadingComponent;
    };
}

// 3. 使用高阶组件
const AuthenticatedUserList = withAuth({
    requiredPermissions: ['user:read'],
    redirectTo: '/login'
})(UserListComponent);

const LoadingUserList = withLoading({
    delay: 200,
    timeout: 10000
})(UserListComponent);

// 组合使用多个高阶组件
const EnhancedUserList = withAuth({
    requiredPermissions: ['user:read']
})(withLoading({
    delay: 200
})(UserListComponent));

// ============================================================================
// 练习6：组件测试练习 - 解答
// ============================================================================

console.log('=== 练习6：组件测试练习 - 解答 ===');

// 1. 定义测试工具类型
interface TestWrapper<T extends Vue> {
    vm: T;
    find(selector: string): Element | null;
    findAll(selector: string): Element[];
    trigger(event: string, data?: any): Promise<void>;
    setProps(props: Partial<T['$props']>): Promise<void>;
    setData(data: Partial<T['$data']>): Promise<void>;
    destroy(): void;
}

// 2. 模拟测试框架函数
function describe(name: string, fn: () => void): void {
    console.log(`\n=== ${name} ===`);
    fn();
}

function it(name: string, fn: () => void): void {
    console.log(`  ✓ ${name}`);
    try {
        fn();
    } catch (error) {
        console.log(`  ✗ ${name}: ${error}`);
    }
}

function beforeEach(fn: () => void): void {
    // 模拟测试前准备
    fn();
}

function afterEach(fn: () => void): void {
    // 模拟测试后清理
    fn();
}

function expect(actual: any) {
    return {
        toBe: (expected: any) => {
            if (actual !== expected) {
                throw new Error(`Expected ${expected}, but got ${actual}`);
            }
        },
        toEqual: (expected: any) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
            }
        },
        toBeTruthy: () => {
            if (!actual) {
                throw new Error(`Expected truthy value, but got ${actual}`);
            }
        },
        toContain: (expected: any) => {
            if (!actual.includes(expected)) {
                throw new Error(`Expected ${actual} to contain ${expected}`);
            }
        }
    };
}

// 模拟 shallowMount 函数
function shallowMount<T extends Vue>(Component: typeof Vue, options?: any): TestWrapper<T> {
    // 这里应该是实际的组件挂载逻辑
    const vm = new Component(options) as T;

    return {
        vm,
        find: (selector: string) => null,
        findAll: (selector: string) => [],
        trigger: async (event: string, data?: any) => {},
        setProps: async (props: any) => {},
        setData: async (data: any) => {},
        destroy: () => {}
    };
}

// 3. 定义测试用例
describe('UserCard Component', () => {
    let wrapper: TestWrapper<UserFormComponent>;
    const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date()
    };

    beforeEach(() => {
        wrapper = shallowMount(UserFormComponent, {
            propsData: {
                initialUser: mockUser,
                loading: false
            }
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('should render user information correctly', () => {
        expect(wrapper.vm.form.name).toBe(mockUser.name);
        expect(wrapper.vm.form.email).toBe(mockUser.email);
        expect(wrapper.vm.form.role).toBe(mockUser.role);
    });

    it('should validate form correctly', () => {
        // 测试空表单验证
        wrapper.vm.form.name = '';
        wrapper.vm.form.email = '';
        expect(wrapper.vm.validateForm()).toBe(false);
        expect(wrapper.vm.errors.length).toBe(2);

        // 测试有效表单
        wrapper.vm.form.name = 'Valid Name';
        wrapper.vm.form.email = 'valid@example.com';
        expect(wrapper.vm.validateForm()).toBe(true);
        expect(wrapper.vm.errors.length).toBe(0);
    });

    it('should emit events correctly', () => {
        // 测试提交事件
        wrapper.vm.form.name = 'Test User';
        wrapper.vm.form.email = 'test@example.com';

        const result = wrapper.vm.handleSubmit();
        expect(result).toBeTruthy();
        expect(result?.name).toBe('Test User');
    });

    it('should handle validation errors', () => {
        wrapper.vm.form.email = 'invalid-email';
        expect(wrapper.vm.validateForm()).toBe(false);
        expect(wrapper.vm.getFieldError('email')).toBe('邮箱格式不正确');
    });
});

// ============================================================================
// 解答总结
// ============================================================================

console.log(`
🎉 第8章练习解答完成！

📚 本章解答涵盖了：

1. 复杂 Props 类型定义
   ✅ 定义了完整的接口类型
   ✅ 实现了类型安全的组件 Props
   ✅ 使用了 @Prop 装饰器

2. 组件间通信
   ✅ 实现了父子组件通信
   ✅ 使用了 @Emit 和 @Watch 装饰器
   ✅ 处理了表单验证和错误处理

3. Event Bus 类型安全通信
   ✅ 实现了类型安全的事件总线
   ✅ 定义了事件类型映射
   ✅ 在组件中正确使用事件通信

4. TypeScript Mixin
   ✅ 实现了可重用的 Mixin
   ✅ 展示了 Mixin 的组合使用
   ✅ 提供了常用的功能模块

5. 高阶组件
   ✅ 实现了权限控制和加载状态的 HOC
   ✅ 展示了 HOC 的组合使用
   ✅ 保持了类型安全

6. 组件测试
   ✅ 提供了测试框架的类型定义
   ✅ 展示了组件测试的最佳实践
   ✅ 涵盖了各种测试场景

💡 关键要点：
- 始终保持类型安全，避免使用 any
- 合理使用装饰器简化代码
- 通过 Mixin 和 HOC 实现代码复用
- 编写全面的测试确保代码质量
- 遵循 Vue 2 + TypeScript 最佳实践
`);
