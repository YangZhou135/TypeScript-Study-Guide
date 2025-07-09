# 第8章：Vue 组件的 TypeScript 开发

> 深入学习如何用 TypeScript 开发类型安全的 Vue 组件

## 🎯 学习目标

- 掌握 Vue 组件 Props 的类型定义
- 理解组件 Data、Methods、Computed 的类型声明
- 学会组件间通信的类型安全实现
- 了解高阶组件和 Mixin 的 TypeScript 写法

## 📚 知识点概览

### 8.1 Props 类型定义

#### 基础 Props 类型

```typescript
import { Vue, Component, Prop } from "vue-property-decorator";

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

@Component
export default class UserCard extends Vue {
    // 基础类型 Props
    @Prop({ type: String, required: true })
    title!: string;

    @Prop({ type: Number, default: 0 })
    count!: number;

    @Prop({ type: Boolean, default: false })
    disabled!: boolean;

    // 对象类型 Props
    @Prop({ type: Object, required: true })
    user!: User;

    // 数组类型 Props
    @Prop({ type: Array, default: () => [] })
    tags!: string[];

    // 联合类型 Props
    @Prop({ type: [String, Number], default: "medium" })
    size!: "small" | "medium" | "large" | number;

    // 函数类型 Props
    @Prop({ type: Function })
    onClick?: (event: MouseEvent) => void;

    // 自定义验证器
    @Prop({
        type: String,
        validator: (value: string) => ["primary", "secondary", "danger"].includes(value),
    })
    variant!: "primary" | "secondary" | "danger";
}
```

#### 复杂 Props 类型

```typescript
// 定义复杂的 Props 接口
interface TableColumn {
    key: string;
    title: string;
    width?: number;
    sortable?: boolean;
    render?: (value: any, record: any) => string;
}

interface TableProps {
    columns: TableColumn[];
    dataSource: any[];
    loading?: boolean;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
    };
}

@Component
export default class DataTable extends Vue implements TableProps {
    @Prop({ type: Array, required: true })
    columns!: TableColumn[];

    @Prop({ type: Array, required: true })
    dataSource!: any[];

    @Prop({ type: Boolean, default: false })
    loading!: boolean;

    @Prop({ type: Object })
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
    };
}
```

### 8.2 组件状态和方法类型

#### Data 和 Methods 类型

```typescript
@Component
export default class TodoList extends Vue {
    // Data 类型声明
    private todos: Todo[] = [];
    private newTodoText: string = "";
    private filter: "all" | "active" | "completed" = "all";
    private loading: boolean = false;

    // Computed 类型自动推断
    get filteredTodos(): Todo[] {
        switch (this.filter) {
            case "active":
                return this.todos.filter((todo) => !todo.completed);
            case "completed":
                return this.todos.filter((todo) => todo.completed);
            default:
                return this.todos;
        }
    }

    get todoStats(): { total: number; active: number; completed: number } {
        return {
            total: this.todos.length,
            active: this.todos.filter((t) => !t.completed).length,
            completed: this.todos.filter((t) => t.completed).length,
        };
    }

    // Methods 类型声明
    async addTodo(): Promise<void> {
        if (!this.newTodoText.trim()) return;

        const newTodo: Todo = {
            id: Date.now(),
            text: this.newTodoText.trim(),
            completed: false,
            createdAt: new Date(),
        };

        this.todos.push(newTodo);
        this.newTodoText = "";
    }

    toggleTodo(id: number): void {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    }

    removeTodo(id: number): void {
        const index = this.todos.findIndex((t) => t.id === id);
        if (index > -1) {
            this.todos.splice(index, 1);
        }
    }

    setFilter(filter: "all" | "active" | "completed"): void {
        this.filter = filter;
    }
}
```

### 8.3 组件间通信类型

#### 父子组件通信

```typescript
// 子组件 - UserForm.vue
@Component
export default class UserForm extends Vue {
    @Prop({ type: Object })
    initialUser?: Partial<User>;

    private form: UserFormData = {
        name: "",
        email: "",
        age: 0,
    };

    @Watch("initialUser", { immediate: true })
    onInitialUserChanged(user?: Partial<User>): void {
        if (user) {
            this.form = { ...this.form, ...user };
        }
    }

    // 使用 Emit 装饰器
    @Emit("submit")
    handleSubmit(): UserFormData {
        return { ...this.form };
    }

    @Emit("cancel")
    handleCancel(): void {
        // 重置表单
        this.form = { name: "", email: "", age: 0 };
    }

    // 手动 emit 事件
    handleValidationError(errors: ValidationError[]): void {
        this.$emit("validation-error", errors);
    }
}

// 父组件使用
@Component({
    components: { UserForm },
})
export default class UserManagement extends Vue {
    private users: User[] = [];
    private editingUser: User | null = null;

    handleUserSubmit(formData: UserFormData): void {
        if (this.editingUser) {
            // 更新用户
            Object.assign(this.editingUser, formData);
        } else {
            // 创建新用户
            const newUser: User = {
                id: Date.now(),
                ...formData,
            };
            this.users.push(newUser);
        }
    }

    handleFormCancel(): void {
        this.editingUser = null;
    }

    handleValidationError(errors: ValidationError[]): void {
        console.error("Validation errors:", errors);
    }
}
```

#### 兄弟组件通信（Event Bus）

```typescript
// event-bus.ts
import Vue from "vue";

interface EventBus {
    $emit(event: "user-updated", user: User): void;
    $emit(event: "user-deleted", userId: number): void;
    $emit(event: "notification", message: string, type: "success" | "error"): void;

    $on(event: "user-updated", callback: (user: User) => void): void;
    $on(event: "user-deleted", callback: (userId: number) => void): void;
    $on(
        event: "notification",
        callback: (message: string, type: "success" | "error") => void
    ): void;

    $off(event: string, callback?: Function): void;
}

export const eventBus = new Vue() as Vue & EventBus;

// 组件中使用
@Component
export default class UserList extends Vue {
    private users: User[] = [];

    mounted(): void {
        eventBus.$on("user-updated", this.handleUserUpdated);
        eventBus.$on("user-deleted", this.handleUserDeleted);
    }

    beforeDestroy(): void {
        eventBus.$off("user-updated", this.handleUserUpdated);
        eventBus.$off("user-deleted", this.handleUserDeleted);
    }

    private handleUserUpdated(user: User): void {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index > -1) {
            this.$set(this.users, index, user);
        }
    }

    private handleUserDeleted(userId: number): void {
        const index = this.users.findIndex((u) => u.id === userId);
        if (index > -1) {
            this.users.splice(index, 1);
        }
    }
}
```

### 8.4 高阶组件和 Mixin

#### TypeScript Mixin

```typescript
// mixins/loading-mixin.ts
import { Vue, Component } from "vue-property-decorator";

@Component
export default class LoadingMixin extends Vue {
    private loading: boolean = false;

    protected setLoading(loading: boolean): void {
        this.loading = loading;
    }

    protected async withLoading<T>(asyncFn: () => Promise<T>): Promise<T> {
        this.setLoading(true);
        try {
            return await asyncFn();
        } finally {
            this.setLoading(false);
        }
    }
}

// 使用 Mixin
@Component({
    mixins: [LoadingMixin],
})
export default class UserList extends LoadingMixin {
    private users: User[] = [];

    async fetchUsers(): Promise<void> {
        await this.withLoading(async () => {
            this.users = await userApi.getUsers();
        });
    }
}
```

#### 高阶组件

```typescript
// hoc/with-auth.ts
import { Vue, Component } from "vue-property-decorator";

interface AuthProps {
    requireAuth: boolean;
    redirectTo?: string;
}

export function withAuth<T extends Vue>(WrappedComponent: typeof Vue) {
    @Component
    class WithAuthComponent extends Vue {
        @Prop({ type: Boolean, default: true })
        requireAuth!: boolean;

        @Prop({ type: String, default: "/login" })
        redirectTo!: string;

        get isAuthenticated(): boolean {
            return this.$store.getters["auth/isAuthenticated"];
        }

        created(): void {
            if (this.requireAuth && !this.isAuthenticated) {
                this.$router.push(this.redirectTo);
            }
        }

        render() {
            if (this.requireAuth && !this.isAuthenticated) {
                return null;
            }

            return this.$createElement(WrappedComponent, {
                props: this.$props,
                attrs: this.$attrs,
                on: this.$listeners,
            });
        }
    }

    return WithAuthComponent;
}

// 使用高阶组件
const AuthenticatedUserList = withAuth(UserList);
```

### 8.5 组件测试

#### 组件单元测试

```typescript
// tests/UserCard.spec.ts
import { shallowMount, Wrapper } from "@vue/test-utils";
import UserCard from "@/components/UserCard.vue";

describe("UserCard.vue", () => {
    let wrapper: Wrapper<UserCard>;

    const mockUser: User = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
    };

    beforeEach(() => {
        wrapper = shallowMount(UserCard, {
            propsData: {
                user: mockUser,
                title: "User Information",
            },
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it("renders user information correctly", () => {
        expect(wrapper.find(".user-name").text()).toBe(mockUser.name);
        expect(wrapper.find(".user-email").text()).toBe(mockUser.email);
    });

    it("emits click event when clicked", async () => {
        await wrapper.find(".user-card").trigger("click");

        expect(wrapper.emitted("click")).toBeTruthy();
        expect(wrapper.emitted("click")![0]).toEqual([mockUser]);
    });

    it("applies disabled class when disabled prop is true", async () => {
        await wrapper.setProps({ disabled: true });

        expect(wrapper.find(".user-card").classes()).toContain("disabled");
    });
});
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `components/` - 各种类型的组件示例
- `mixins/` - Mixin 示例
- `hoc/` - 高阶组件示例
- `tests/` - 组件测试示例

## 📝 练习题目

1. **Props 类型练习**: 创建复杂 Props 类型的组件
2. **组件通信练习**: 实现类型安全的组件间通信
3. **Mixin 练习**: 创建可重用的 TypeScript Mixin
4. **测试练习**: 为 TypeScript 组件编写单元测试

## 🎯 本章小结

- Props 类型定义确保了组件接口的类型安全
- 组件状态和方法的类型声明提高了代码质量
- 类型安全的组件通信减少了运行时错误
- Mixin 和高阶组件提供了代码复用的方案

## ➡️ 下一章

[第9章：完整项目实战](../chapter-09-project-practice/README.md)
