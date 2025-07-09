# 第7章：Vue 2 + TypeScript 项目集成

> 学习如何在 Vue 2 项目中集成和使用 TypeScript

## 🎯 学习目标

- 掌握 Vue 2 + TypeScript 项目的配置
- 理解 Vue 组件的 TypeScript 写法
- 学会使用 vue-class-component 和 vue-property-decorator
- 了解 Vue 生态系统的 TypeScript 支持

## 📚 知识点概览

### 7.1 项目配置

#### 基础配置文件

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "checkJs": false,
    "jsx": "preserve",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

**shims-vue.d.ts**
```typescript
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
```

### 7.2 Vue 组件的 TypeScript 写法

#### 选项式 API + TypeScript
```typescript
import Vue from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

export default Vue.extend({
  name: 'UserComponent',
  data(): {
    users: User[];
    loading: boolean;
  } {
    return {
      users: [],
      loading: false
    };
  },
  computed: {
    userCount(): number {
      return this.users.length;
    }
  },
  methods: {
    async fetchUsers(): Promise<void> {
      this.loading = true;
      try {
        // API 调用
        this.users = await this.getUsersFromApi();
      } finally {
        this.loading = false;
      }
    },
    getUsersFromApi(): Promise<User[]> {
      // 模拟 API 调用
      return Promise.resolve([]);
    }
  }
});
```

#### 类式 API + TypeScript
```typescript
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component
export default class UserComponent extends Vue {
  @Prop({ type: String, required: true })
  title!: string;

  users: User[] = [];
  loading: boolean = false;

  get userCount(): number {
    return this.users.length;
  }

  @Watch('title')
  onTitleChanged(newTitle: string, oldTitle: string): void {
    console.log(`Title changed from ${oldTitle} to ${newTitle}`);
  }

  async fetchUsers(): Promise<void> {
    this.loading = true;
    try {
      this.users = await this.getUsersFromApi();
    } finally {
      this.loading = false;
    }
  }

  private getUsersFromApi(): Promise<User[]> {
    return Promise.resolve([]);
  }
}
```

### 7.3 vue-property-decorator 详解

#### 常用装饰器

```typescript
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';

@Component
export default class MyComponent extends Vue {
  // Props
  @Prop({ type: String, default: 'default value' })
  message!: string;

  @Prop({ type: Number, required: true })
  count!: number;

  @Prop({ type: Array, default: () => [] })
  items!: string[];

  // Data
  private internalValue: string = '';

  // Computed
  get displayMessage(): string {
    return `${this.message} (${this.count})`;
  }

  set displayMessage(value: string) {
    this.internalValue = value;
  }

  // Watch
  @Watch('count', { immediate: true, deep: true })
  onCountChanged(newVal: number, oldVal: number): void {
    console.log(`Count changed: ${oldVal} -> ${newVal}`);
  }

  // Emit
  @Emit('update')
  updateValue(value: string): string {
    return value;
  }

  @Emit()
  reset(): void {
    this.internalValue = '';
  }

  // Methods
  handleClick(): void {
    this.updateValue(this.internalValue);
  }
}
```

### 7.4 Vuex + TypeScript

#### Store 类型定义
```typescript
// store/types.ts
export interface RootState {
  user: UserState;
  products: ProductState;
}

export interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
}

// store/modules/user.ts
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

@Module({ namespaced: true })
export default class UserModule extends VuexModule {
  currentUser: User | null = null;
  isLoggedIn: boolean = false;

  get userName(): string {
    return this.currentUser?.name || 'Guest';
  }

  @Mutation
  SET_USER(user: User): void {
    this.currentUser = user;
    this.isLoggedIn = true;
  }

  @Mutation
  LOGOUT(): void {
    this.currentUser = null;
    this.isLoggedIn = false;
  }

  @Action
  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const user = await authApi.login(credentials);
      this.SET_USER(user);
    } catch (error) {
      throw new Error('Login failed');
    }
  }
}
```

### 7.5 Vue Router + TypeScript

```typescript
// router/index.ts
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/views/UserDetail.vue'),
    props: (route) => ({ userId: Number(route.params.id) })
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

// 路由守卫类型
router.beforeEach((to, from, next) => {
  // TypeScript 会提供完整的类型支持
  console.log(`Navigating from ${from.name} to ${to.name}`);
  next();
});
```

## 💻 实践代码

查看以下文件中的实际代码示例：

- `vue-component-examples/` - Vue 组件示例
- `vuex-examples/` - Vuex 状态管理示例
- `router-examples/` - Vue Router 示例
- `practice/` - 练习项目

## 📝 练习题目

1. **组件类型化**: 将现有 Vue 组件迁移到 TypeScript
2. **Vuex 集成**: 创建类型安全的 Vuex store
3. **路由配置**: 配置带类型的 Vue Router
4. **完整项目**: 搭建完整的 Vue 2 + TypeScript 项目

## 🎯 本章小结

- Vue 2 + TypeScript 需要正确的配置和类型声明
- vue-property-decorator 提供了优雅的类式组件写法
- Vuex 和 Vue Router 都有良好的 TypeScript 支持
- 类型安全让 Vue 应用更加健壮

## ➡️ 下一章

[第8章：Vue 组件的 TypeScript 开发](../chapter-08-vue-components/README.md)
