/**
 * 第8章：Vue 组件的 TypeScript 开发示例
 *
 * 本文件展示了如何用 TypeScript 开发类型安全的 Vue 组件
 * 包括 Props 类型定义、组件间通信、Mixin、高阶组件等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. Props 类型定义示例
// ============================================================================

console.log("=== Props 类型定义示例 ===");

// 基础数据类型
interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "user" | "guest";
    isActive: boolean;
    lastLoginAt?: Date;
}

interface UserCardProps {
    user: User;
    showActions: boolean;
    size: "small" | "medium" | "large";
    theme: "light" | "dark";
    onClick?: (user: User) => void;
}

// 模拟 Vue 组件定义
const UserCardComponent = {
    name: "UserCard",

    props: {
        user: {
            type: Object as () => User,
            required: true,
            validator: (user: User) => {
                return user && typeof user.id === "number" && typeof user.name === "string";
            },
        },
        showActions: {
            type: Boolean,
            default: true,
        },
        size: {
            type: String as () => "small" | "medium" | "large",
            default: "medium",
            validator: (value: string) => ["small", "medium", "large"].includes(value),
        },
        theme: {
            type: String as () => "light" | "dark",
            default: "light",
        },
        onClick: {
            type: Function as any,
            default: undefined,
        },
    },

    computed: {
        userDisplayName(): string {
            const user = (this as any).user as User;
            return user.name || "未知用户";
        },

        userStatusClass(): string {
            const user = (this as any).user as User;
            return user.isActive ? "user-active" : "user-inactive";
        },

        cardClasses(): string[] {
            const size = (this as any).size as string;
            const theme = (this as any).theme as string;
            return ["user-card", `user-card--${size}`, `user-card--${theme}`];
        },
    },

    methods: {
        handleClick(): void {
            const user = (this as any).user as User;
            const onClick = (this as any).onClick as ((user: User) => void) | undefined;

            if (onClick) {
                onClick(user);
            } else {
                console.log("用户卡片被点击:", user.name);
                // this.$emit('click', user);
            }
        },

        handleEdit(): void {
            const user = (this as any).user as User;
            console.log("编辑用户:", user.name);
            // this.$emit('edit', user);
        },

        handleDelete(): void {
            const user = (this as any).user as User;
            console.log("删除用户:", user.name);
            // this.$emit('delete', user.id);
        },
    },
};

// 测试 Props 类型
const testUser: User = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    role: "admin",
    isActive: true,
    lastLoginAt: new Date(),
};

console.log("用户卡片组件已定义，测试用户:", testUser.name);

// ============================================================================
// 2. 组件状态和方法类型示例
// ============================================================================

console.log("\n=== 组件状态和方法类型示例 ===");

// 表单数据类型
interface UserFormData {
    name: string;
    email: string;
    role: "admin" | "user" | "guest";
    isActive: boolean;
}

// 验证错误类型
interface ValidationError {
    field: string;
    message: string;
}

// 表单组件状态类型
interface UserFormState {
    formData: UserFormData;
    errors: ValidationError[];
    loading: boolean;
    isDirty: boolean;
}

const UserFormComponent = {
    name: "UserForm",

    props: {
        initialUser: {
            type: Object as () => Partial<User>,
            default: () => ({}),
        },
        mode: {
            type: String as () => "create" | "edit",
            default: "create",
        },
    },

    data(): UserFormState {
        const initialUser = (this as any).initialUser as Partial<User>;
        return {
            formData: {
                name: initialUser.name || "",
                email: initialUser.email || "",
                role: initialUser.role || "user",
                isActive: initialUser.isActive !== undefined ? initialUser.isActive : true,
            },
            errors: [],
            loading: false,
            isDirty: false,
        };
    },

    computed: {
        isValid(): boolean {
            const state = this as any as UserFormState;
            return state.errors.length === 0;
        },

        hasChanges(): boolean {
            const state = this as any as UserFormState;
            return state.isDirty;
        },

        submitButtonText(): string {
            const mode = (this as any).mode as string;
            const loading = (this as any).loading as boolean;

            if (loading) return "保存中...";
            return mode === "create" ? "创建用户" : "更新用户";
        },
    },

    methods: {
        validateField(field: keyof UserFormData, value: any): ValidationError | null {
            switch (field) {
                case "name":
                    if (!value || value.trim().length < 2) {
                        return { field, message: "姓名至少需要2个字符" };
                    }
                    break;
                case "email":
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!value || !emailRegex.test(value)) {
                        return { field, message: "请输入有效的邮箱地址" };
                    }
                    break;
            }
            return null;
        },

        validateForm(): boolean {
            const state = this as any as UserFormState;
            const errors: ValidationError[] = [];

            Object.keys(state.formData).forEach((key) => {
                const field = key as keyof UserFormData;
                const error = this.validateField(field, state.formData[field]);
                if (error) {
                    errors.push(error);
                }
            });

            state.errors = errors;
            return errors.length === 0;
        },

        handleFieldChange(field: keyof UserFormData, value: any): void {
            const state = this as any as UserFormState;
            (state.formData as any)[field] = value;
            state.isDirty = true;

            // 实时验证
            const error = this.validateField(field, value);
            const existingErrorIndex = state.errors.findIndex((e) => e.field === field);

            if (error) {
                if (existingErrorIndex > -1) {
                    state.errors[existingErrorIndex] = error;
                } else {
                    state.errors.push(error);
                }
            } else if (existingErrorIndex > -1) {
                state.errors.splice(existingErrorIndex, 1);
            }
        },

        async handleSubmit(): Promise<void> {
            const state = this as any as UserFormState;

            if (!this.validateForm()) {
                console.log("表单验证失败:", state.errors);
                return;
            }

            state.loading = true;

            try {
                // 模拟 API 调用
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const mode = (this as any).mode as string;
                console.log(`${mode === "create" ? "创建" : "更新"}用户成功:`, state.formData);

                // this.$emit('submit', state.formData);
                state.isDirty = false;
            } catch (error) {
                console.error("保存失败:", error);
                // this.$emit('error', error);
            } finally {
                state.loading = false;
            }
        },

        resetForm(): void {
            const state = this as any as UserFormState;
            const initialUser = (this as any).initialUser as Partial<User>;

            state.formData = {
                name: initialUser.name || "",
                email: initialUser.email || "",
                role: initialUser.role || "user",
                isActive: initialUser.isActive !== undefined ? initialUser.isActive : true,
            };
            state.errors = [];
            state.isDirty = false;
        },
    },

    watch: {
        initialUser: {
            handler(newUser: Partial<User>) {
                if (newUser) {
                    (this as any).resetForm();
                }
            },
            deep: true,
            immediate: true,
        },
    },
};

console.log("用户表单组件已定义");

// ============================================================================
// 3. 组件间通信类型示例
// ============================================================================

console.log("\n=== 组件间通信类型示例 ===");

// 事件类型定义
interface UserListEvents {
    "user-select": (user: User) => void;
    "user-edit": (user: User) => void;
    "user-delete": (userId: number) => void;
    "users-load": (users: User[]) => void;
    "loading-change": (loading: boolean) => void;
}

// 用户列表组件
const UserListComponent = {
    name: "UserList",

    props: {
        users: {
            type: Array as () => User[],
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        selectable: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            selectedUsers: [] as User[],
            sortField: "name" as keyof User,
            sortDirection: "asc" as "asc" | "desc",
        };
    },

    computed: {
        sortedUsers(): User[] {
            const users = (this as any).users as User[];
            const field = (this as any).sortField as keyof User;
            const direction = (this as any).sortDirection as string;

            return [...users].sort((a, b) => {
                const aVal = a[field];
                const bVal = b[field];

                if (aVal != null && bVal != null) {
                    if (aVal < bVal) return direction === "asc" ? -1 : 1;
                    if (aVal > bVal) return direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        },

        hasSelection(): boolean {
            const selectedUsers = (this as any).selectedUsers as User[];
            return selectedUsers.length > 0;
        },
    },

    methods: {
        handleUserClick(user: User): void {
            console.log("用户被点击:", user.name);
            // this.$emit('user-select', user);
        },

        handleUserEdit(user: User): void {
            console.log("编辑用户:", user.name);
            // this.$emit('user-edit', user);
        },

        handleUserDelete(user: User): void {
            console.log("删除用户:", user.name);
            // this.$emit('user-delete', user.id);
        },

        toggleUserSelection(user: User): void {
            const selectedUsers = (this as any).selectedUsers as User[];
            const index = selectedUsers.findIndex((u) => u.id === user.id);

            if (index > -1) {
                selectedUsers.splice(index, 1);
            } else {
                selectedUsers.push(user);
            }
        },

        selectAllUsers(): void {
            const users = (this as any).users as User[];
            (this as any).selectedUsers = [...users];
        },

        clearSelection(): void {
            (this as any).selectedUsers = [];
        },

        sortBy(field: keyof User): void {
            const currentField = (this as any).sortField as keyof User;
            const currentDirection = (this as any).sortDirection as string;

            if (field === currentField) {
                (this as any).sortDirection = currentDirection === "asc" ? "desc" : "asc";
            } else {
                (this as any).sortField = field;
                (this as any).sortDirection = "asc";
            }
        },
    },
};

console.log("用户列表组件已定义");

// ============================================================================
// 4. Mixin 类型示例
// ============================================================================

console.log("\n=== Mixin 类型示例 ===");

// 加载状态 Mixin
interface LoadingMixin {
    data(): {
        loading: boolean;
    };
    methods: {
        setLoading(loading: boolean): void;
        withLoading<T>(asyncFn: () => Promise<T>): Promise<T>;
    };
}

const loadingMixin: LoadingMixin = {
    data() {
        return {
            loading: false,
        };
    },

    methods: {
        setLoading(loading: boolean): void {
            (this as any).loading = loading;
        },

        async withLoading<T>(asyncFn: () => Promise<T>): Promise<T> {
            this.setLoading(true);
            try {
                return await asyncFn();
            } finally {
                this.setLoading(false);
            }
        },
    },
};

// 分页 Mixin
interface PaginationMixin {
    data(): {
        currentPage: number;
        pageSize: number;
        total: number;
    };
    computed: {
        totalPages(): number;
        hasNextPage(): boolean;
        hasPrevPage(): boolean;
    };
    methods: {
        goToPage(page: number): void;
        nextPage(): void;
        prevPage(): void;
        setPageSize(size: number): void;
    };
}

const paginationMixin: PaginationMixin = {
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
        };
    },

    computed: {
        totalPages(): number {
            const total = (this as any).total as number;
            const pageSize = (this as any).pageSize as number;
            return Math.ceil(total / pageSize);
        },

        hasNextPage(): boolean {
            const currentPage = (this as any).currentPage as number;
            return currentPage < (this as any).totalPages;
        },

        hasPrevPage(): boolean {
            const currentPage = (this as any).currentPage as number;
            return currentPage > 1;
        },
    },

    methods: {
        goToPage(page: number): void {
            const totalPages = (this as any).totalPages as number;
            if (page >= 1 && page <= totalPages) {
                (this as any).currentPage = page;
                console.log(`跳转到第 ${page} 页`);
                // this.$emit('page-change', page);
            }
        },

        nextPage(): void {
            if ((this as any).hasNextPage) {
                this.goToPage((this as any).currentPage + 1);
            }
        },

        prevPage(): void {
            if ((this as any).hasPrevPage) {
                this.goToPage((this as any).currentPage - 1);
            }
        },

        setPageSize(size: number): void {
            (this as any).pageSize = size;
            (this as any).currentPage = 1;
            console.log(`设置页面大小: ${size}`);
            // this.$emit('page-size-change', size);
        },
    },
};

// 使用多个 Mixin 的组件
const UserManagementComponent = {
    name: "UserManagement",

    mixins: [loadingMixin, paginationMixin],

    data() {
        return {
            users: [] as User[],
            searchQuery: "",
            selectedUser: null as User | null,
        };
    },

    computed: {
        filteredUsers(): User[] {
            const users = (this as any).users as User[];
            const query = (this as any).searchQuery as string;

            if (!query) return users;

            return users.filter(
                (user) =>
                    user.name.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase())
            );
        },

        paginatedUsers(): User[] {
            const filtered = (this as any).filteredUsers;
            const currentPage = (this as any).currentPage as number;
            const pageSize = (this as any).pageSize as number;
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;

            return filtered.slice(start, end);
        },
    },

    methods: {
        async fetchUsers(): Promise<void> {
            await (this as any).withLoading(async () => {
                // 模拟 API 调用
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const mockUsers: User[] = [
                    {
                        id: 1,
                        name: "张三",
                        email: "zhangsan@example.com",
                        role: "admin",
                        isActive: true,
                    },
                    {
                        id: 2,
                        name: "李四",
                        email: "lisi@example.com",
                        role: "user",
                        isActive: true,
                    },
                    {
                        id: 3,
                        name: "王五",
                        email: "wangwu@example.com",
                        role: "user",
                        isActive: false,
                    },
                ];

                (this as any).users = mockUsers;
                (this as any).total = mockUsers.length;
                console.log("用户数据加载完成");
            });
        },

        handleSearch(query: string): void {
            (this as any).searchQuery = query;
            (this as any).currentPage = 1; // 重置到第一页
            console.log("搜索用户:", query);
        },

        handleUserSelect(user: User): void {
            (this as any).selectedUser = user;
            console.log("选择用户:", user.name);
        },
    },

    async created(): Promise<void> {
        await (this as any).fetchUsers();
    },
};

console.log("用户管理组件已定义（使用多个 Mixin）");

console.log("\n=== 第8章示例代码执行完成 ===");
console.log("💡 提示：");
console.log("1. Props 类型定义确保了组件接口的类型安全");
console.log("2. 组件状态和方法的类型声明提高了代码质量");
console.log("3. 类型安全的组件通信减少了运行时错误");
console.log("4. Mixin 提供了代码复用的优雅方案");
