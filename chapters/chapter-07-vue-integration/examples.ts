/**
 * 第7章：Vue 2 + TypeScript 项目集成示例
 *
 * 本文件展示了如何在 Vue 2 项目中集成和使用 TypeScript
 * 包括组件定义、Vuex 状态管理、Vue Router 等
 *
 * 注意：这些是示例代码，在实际 Vue 项目中需要相应的环境配置
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. Vue 组件类型定义示例
// ============================================================================

console.log("=== Vue 组件类型定义示例 ===");

// 模拟 Vue 相关类型定义（在实际项目中由 vue 包提供）
interface VueComponent {
    name?: string;
    data?(): any;
    props?: any;
    computed?: any;
    methods?: any;
    mixins?: any[];
    mounted?(): void;
    created?(): void;
}

// 用户数据类型
interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    isActive: boolean;
}

// 组件数据类型
interface UserCardData {
    loading: boolean;
    error: string | null;
}

// 组件属性类型
interface UserCardProps {
    user: User;
    showActions: boolean;
    size: "small" | "medium" | "large";
}

// Vue 组件定义（选项式 API）
const UserCardComponent: VueComponent = {
    name: "UserCard",

    // Props 类型定义
    props: {
        user: {
            type: Object as () => User,
            required: true,
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
    },

    // Data 类型定义
    data(): UserCardData {
        return {
            loading: false,
            error: null,
        };
    },

    // Computed 类型定义
    computed: {
        displayName(): string {
            const user = (this as any).user as User;
            return user.name || "未知用户";
        },

        statusClass(): string {
            const user = (this as any).user as User;
            return user.isActive ? "user-active" : "user-inactive";
        },

        cardSizeClass(): string {
            const size = (this as any).size as string;
            return `user-card--${size}`;
        },
    },

    // Methods 类型定义
    methods: {
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

        async loadUserDetails(): Promise<void> {
            const data = this as any;
            data.loading = true;
            data.error = null;

            try {
                // 模拟 API 调用
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("用户详情加载完成");
            } catch (error) {
                data.error = "加载失败";
                console.error("加载用户详情失败:", error);
            } finally {
                data.loading = false;
            }
        },
    },

    // 生命周期钩子
    created(): void {
        console.log("UserCard 组件已创建");
    },

    mounted(): void {
        console.log("UserCard 组件已挂载");
    },
};

// 测试组件
console.log("Vue 组件定义:", UserCardComponent.name);

// ============================================================================
// 2. Vuex 状态管理类型定义
// ============================================================================

console.log("\n=== Vuex 状态管理类型定义 ===");

// 状态类型定义
interface UserState {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

interface RootState {
    user: UserState;
    app: {
        theme: "light" | "dark";
        language: "zh-CN" | "en-US";
        sidebarCollapsed: boolean;
    };
}

// Mutation 类型定义
type UserMutations = {
    SET_USERS: (state: UserState, users: User[]) => void;
    SET_CURRENT_USER: (state: UserState, user: User | null) => void;
    SET_LOADING: (state: UserState, loading: boolean) => void;
    SET_ERROR: (state: UserState, error: string | null) => void;
    ADD_USER: (state: UserState, user: User) => void;
    UPDATE_USER: (state: UserState, payload: { id: number; updates: Partial<User> }) => void;
    REMOVE_USER: (state: UserState, userId: number) => void;
};

// Action 类型定义
interface UserActions {
    fetchUsers: (context: any) => Promise<void>;
    createUser: (context: any, userData: Omit<User, "id">) => Promise<User>;
    updateUser: (context: any, payload: { id: number; updates: Partial<User> }) => Promise<void>;
    deleteUser: (context: any, userId: number) => Promise<void>;
    login: (context: any, credentials: { email: string; password: string }) => Promise<void>;
    logout: (context: any) => Promise<void>;
}

// Getter 类型定义
interface UserGetters {
    activeUsers: (state: UserState) => User[];
    userCount: (state: UserState) => number;
    isLoggedIn: (state: UserState) => boolean;
    getUserById: (state: UserState) => (id: number) => User | undefined;
}

// Vuex Store 模块定义
const userModule = {
    namespaced: true,

    state: (): UserState => ({
        users: [],
        currentUser: null,
        loading: false,
        error: null,
    }),

    mutations: {
        SET_USERS(state: UserState, users: User[]): void {
            state.users = users;
        },

        SET_CURRENT_USER(state: UserState, user: User | null): void {
            state.currentUser = user;
        },

        SET_LOADING(state: UserState, loading: boolean): void {
            state.loading = loading;
        },

        SET_ERROR(state: UserState, error: string | null): void {
            state.error = error;
        },

        ADD_USER(state: UserState, user: User): void {
            state.users.push(user);
        },

        UPDATE_USER(state: UserState, payload: { id: number; updates: Partial<User> }): void {
            const index = state.users.findIndex((u) => u.id === payload.id);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...payload.updates };
            }
        },

        REMOVE_USER(state: UserState, userId: number): void {
            const index = state.users.findIndex((u) => u.id === userId);
            if (index !== -1) {
                state.users.splice(index, 1);
            }
        },
    } as UserMutations,

    actions: {
        async fetchUsers({ commit }: any): Promise<void> {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);

            try {
                // 模拟 API 调用
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const users: User[] = [
                    { id: 1, name: "张三", email: "zhangsan@example.com", isActive: true },
                    { id: 2, name: "李四", email: "lisi@example.com", isActive: false },
                    { id: 3, name: "王五", email: "wangwu@example.com", isActive: true },
                ];

                commit("SET_USERS", users);
                console.log("用户列表加载完成");
            } catch (error) {
                commit("SET_ERROR", "加载用户列表失败");
                console.error("获取用户失败:", error);
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async createUser({ commit }: any, userData: Omit<User, "id">): Promise<User> {
            try {
                // 模拟 API 调用
                await new Promise((resolve) => setTimeout(resolve, 500));
                const newUser: User = {
                    id: Date.now(),
                    ...userData,
                };

                commit("ADD_USER", newUser);
                console.log("用户创建成功:", newUser.name);
                return newUser;
            } catch (error) {
                commit("SET_ERROR", "创建用户失败");
                throw error;
            }
        },

        async login(
            { commit }: any,
            credentials: { email: string; password: string }
        ): Promise<void> {
            commit("SET_LOADING", true);

            try {
                // 模拟登录 API 调用
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const user: User = {
                    id: 1,
                    name: "当前用户",
                    email: credentials.email,
                    isActive: true,
                };

                commit("SET_CURRENT_USER", user);
                console.log("登录成功:", user.name);
            } catch (error) {
                commit("SET_ERROR", "登录失败");
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },
    } as UserActions,

    getters: {
        activeUsers: (state: UserState): User[] => {
            return state.users.filter((user) => user.isActive);
        },

        userCount: (state: UserState): number => {
            return state.users.length;
        },

        isLoggedIn: (state: UserState): boolean => {
            return state.currentUser !== null;
        },

        getUserById:
            (state: UserState) =>
            (id: number): User | undefined => {
                return state.users.find((user) => user.id === id);
            },
    } as UserGetters,
};

// 测试 Vuex 模块
console.log("Vuex 用户模块已定义");

// ============================================================================
// 3. Vue Router 类型定义
// ============================================================================

console.log("\n=== Vue Router 类型定义 ===");

// 路由配置类型
interface RouteConfig {
    path: string;
    name?: string;
    component?: any;
    children?: RouteConfig[];
    meta?: {
        requiresAuth?: boolean;
        title?: string;
        roles?: string[];
    };
    props?: boolean | object | ((route: any) => object);
}

// 路由参数类型
interface RouteParams {
    id?: string;
    userId?: string;
    [key: string]: string | undefined;
}

// 路由查询类型
interface RouteQuery {
    page?: string;
    size?: string;
    search?: string;
    [key: string]: string | undefined;
}

// 路由对象类型
interface Route {
    path: string;
    name?: string;
    params: RouteParams;
    query: RouteQuery;
    meta?: any;
}

// 路由配置
const routes: RouteConfig[] = [
    {
        path: "/",
        name: "Home",
        component: "HomeComponent",
        meta: {
            title: "首页",
        },
    },
    {
        path: "/users",
        name: "UserList",
        component: "UserListComponent",
        meta: {
            title: "用户列表",
            requiresAuth: true,
        },
    },
    {
        path: "/users/:id",
        name: "UserDetail",
        component: "UserDetailComponent",
        props: true,
        meta: {
            title: "用户详情",
            requiresAuth: true,
        },
    },
    {
        path: "/admin",
        name: "Admin",
        component: "AdminComponent",
        meta: {
            title: "管理后台",
            requiresAuth: true,
            roles: ["admin"],
        },
        children: [
            {
                path: "users",
                name: "AdminUsers",
                component: "AdminUsersComponent",
                meta: {
                    title: "用户管理",
                },
            },
            {
                path: "settings",
                name: "AdminSettings",
                component: "AdminSettingsComponent",
                meta: {
                    title: "系统设置",
                },
            },
        ],
    },
    {
        path: "/login",
        name: "Login",
        component: "LoginComponent",
        meta: {
            title: "登录",
        },
    },
];

// 路由守卫类型
type NavigationGuard = (to: Route, from: Route, next: (to?: string | false | void) => void) => void;

// 路由守卫实现
const authGuard: NavigationGuard = (to, from, next) => {
    const requiresAuth = to.meta?.requiresAuth;
    const isLoggedIn = false; // 从 store 获取登录状态

    if (requiresAuth && !isLoggedIn) {
        console.log("需要登录，重定向到登录页");
        next("/login");
    } else {
        next();
    }
};

const roleGuard: NavigationGuard = (to, from, next) => {
    const requiredRoles = to.meta?.roles;
    const userRole = "user"; // 从 store 获取用户角色

    if (requiredRoles && !requiredRoles.includes(userRole)) {
        console.log("权限不足，拒绝访问");
        next(false);
    } else {
        next();
    }
};

// 路由器配置
const routerConfig = {
    mode: "history",
    base: "/",
    routes,

    // 全局前置守卫
    beforeEach: (to: Route, from: Route, next: any) => {
        console.log(`路由跳转: ${from.path} -> ${to.path}`);

        // 设置页面标题
        if (to.meta?.title) {
            document.title = to.meta.title;
        }

        // 执行认证检查
        authGuard(to, from, next);
    },

    // 全局后置钩子
    afterEach: (to: Route, from: Route) => {
        console.log(`路由跳转完成: ${to.path}`);
    },
};

console.log("Vue Router 配置已定义，路由数量:", routes.length);

// ============================================================================
// 4. Vue 插件和混入类型定义
// ============================================================================

console.log("\n=== Vue 插件和混入类型定义 ===");

// 插件类型定义
interface VuePlugin {
    install: (Vue: any, options?: any) => void;
}

// 自定义插件：API 客户端
const ApiPlugin: VuePlugin = {
    install(Vue: any, options: { baseURL: string }) {
        // 添加全局属性
        Vue.prototype.$api = {
            baseURL: options.baseURL,

            async get<T>(url: string): Promise<T> {
                console.log(`GET ${options.baseURL}${url}`);
                // 模拟 API 调用
                return {} as T;
            },

            async post<T>(url: string, data: any): Promise<T> {
                console.log(`POST ${options.baseURL}${url}`, data);
                return {} as T;
            },
        };

        // 添加全局方法
        Vue.prototype.$showMessage = function (
            message: string,
            type: "success" | "error" = "success"
        ) {
            console.log(`[${type.toUpperCase()}] ${message}`);
        };
    },
};

// 混入类型定义
interface LoadingMixin {
    data(): {
        loading: boolean;
    };
    methods: {
        setLoading(loading: boolean): void;
        withLoading<T>(asyncFn: () => Promise<T>): Promise<T>;
    };
}

// 加载状态混入
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

// 使用混入的组件
const UserListComponent: VueComponent = {
    name: "UserList",

    // 使用混入
    mixins: [loadingMixin],

    data() {
        return {
            users: [] as User[],
        };
    },

    methods: {
        async fetchUsers(): Promise<void> {
            await (this as any).withLoading(async () => {
                // 模拟 API 调用
                await new Promise((resolve) => setTimeout(resolve, 1000));
                (this as any).users = [
                    { id: 1, name: "张三", email: "zhangsan@example.com", isActive: true },
                ];
                console.log("用户列表加载完成");
            });
        },
    },

    async created(): Promise<void> {
        await (this as any).fetchUsers();
    },
};

console.log("Vue 插件和混入已定义");

// ============================================================================
// 5. 类型声明文件示例
// ============================================================================

console.log("\n=== 类型声明文件示例 ===");

// 在实际项目中，这些声明会放在 .d.ts 文件中

// 在实际 Vue 项目中，你会这样扩展 Vue 实例类型：
// declare module 'vue/types/vue' {
//     interface Vue {
//         $api: {
//             baseURL: string;
//             get<T>(url: string): Promise<T>;
//             post<T>(url: string, data: any): Promise<T>;
//         };
//         $showMessage(message: string, type?: 'success' | 'error'): void;
//     }
// }

// 全局组件类型声明示例：
// declare module 'vue/types/vue' {
//     interface VueConstructor {
//         component(id: string): VueComponent;
//         component(id: string, definition: VueComponent): VueComponent;
//     }
// }

// 第三方库类型声明示例：
// declare module 'vue-awesome-swiper' {
//     export const Swiper: any;
//     export const SwiperSlide: any;
// }

console.log("类型声明示例已定义");

console.log("\n=== 第7章示例代码执行完成 ===");
console.log("💡 提示：在实际 Vue 项目中，需要安装相应的依赖包：");
console.log("- vue@2.7.x");
console.log("- vue-class-component");
console.log("- vue-property-decorator");
console.log("- vuex@3.x");
console.log("- vue-router@3.x");
