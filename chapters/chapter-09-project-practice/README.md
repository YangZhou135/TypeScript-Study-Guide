# 第9章：完整项目实战

> 通过完整的项目实战，综合运用 TypeScript + Vue 2 的所有知识

## 🎯 学习目标

- 搭建完整的 Vue 2 + TypeScript 项目架构
- 实现类型安全的前端应用
- 掌握项目开发的最佳实践
- 学会项目部署和优化

## 📚 项目概览

### 项目介绍：任务管理系统

我们将构建一个功能完整的任务管理系统，包含以下功能：

- 用户认证（登录/注册）
- 任务管理（增删改查）
- 项目分组
- 任务状态跟踪
- 数据可视化
- 响应式设计

### 技术栈

- **前端框架**: Vue 2.7 + TypeScript
- **状态管理**: Vuex 4 + vuex-module-decorators
- **路由管理**: Vue Router 3
- **UI 组件库**: Element UI
- **HTTP 客户端**: Axios
- **构建工具**: Vue CLI 4
- **代码规范**: ESLint + Prettier
- **测试框架**: Jest + Vue Test Utils

## 🏗️ 项目架构

### 目录结构
```
task-manager/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/                 # API 接口
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   └── projects.ts
│   ├── components/          # 通用组件
│   │   ├── common/
│   │   ├── forms/
│   │   └── charts/
│   ├── views/              # 页面组件
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── tasks/
│   ├── store/              # Vuex 状态管理
│   │   ├── modules/
│   │   └── index.ts
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── types/              # 类型定义
│   │   ├── api.ts
│   │   ├── store.ts
│   │   └── components.ts
│   ├── utils/              # 工具函数
│   │   ├── request.ts
│   │   ├── storage.ts
│   │   └── validators.ts
│   ├── styles/             # 样式文件
│   ├── App.vue
│   └── main.ts
├── tests/                  # 测试文件
├── tsconfig.json
├── vue.config.js
└── package.json
```

### 核心类型定义

```typescript
// types/api.ts
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  ownerId: number;
  memberIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  assigneeId?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 状态管理架构

```typescript
// store/modules/auth.ts
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { User } from '@/types/api';
import authApi from '@/api/auth';

@Module({ namespaced: true })
export default class AuthModule extends VuexModule {
  user: User | null = null;
  token: string | null = localStorage.getItem('token');
  isLoading: boolean = false;

  get isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  get userName(): string {
    return this.user?.username || 'Guest';
  }

  @Mutation
  SET_USER(user: User): void {
    this.user = user;
  }

  @Mutation
  SET_TOKEN(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  @Mutation
  SET_LOADING(loading: boolean): void {
    this.isLoading = loading;
  }

  @Mutation
  CLEAR_AUTH(): void {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
  }

  @Action
  async login(credentials: LoginCredentials): Promise<void> {
    this.SET_LOADING(true);
    try {
      const response = await authApi.login(credentials);
      this.SET_TOKEN(response.data.token);
      this.SET_USER(response.data.user);
    } finally {
      this.SET_LOADING(false);
    }
  }

  @Action
  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      this.CLEAR_AUTH();
    }
  }

  @Action
  async fetchProfile(): Promise<void> {
    if (!this.token) return;
    
    try {
      const response = await authApi.getProfile();
      this.SET_USER(response.data);
    } catch (error) {
      this.CLEAR_AUTH();
      throw error;
    }
  }
}
```

### API 客户端

```typescript
// utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/api';
import store from '@/store';

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = store.state.auth.token;
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          store.dispatch('auth/logout');
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T, U>(url: string, data?: T, config?: AxiosRequestConfig): Promise<ApiResponse<U>> {
    const response = await this.instance.post<ApiResponse<U>>(url, data, config);
    return response.data;
  }

  async put<T, U>(url: string, data?: T, config?: AxiosRequestConfig): Promise<ApiResponse<U>> {
    const response = await this.instance.put<ApiResponse<U>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient(process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api');
```

### 组件开发示例

```typescript
// components/TaskCard.vue
<template>
  <div class="task-card" :class="taskCardClass" @click="handleClick">
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <el-dropdown @command="handleMenuCommand">
        <el-button type="text" icon="el-icon-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="edit">编辑</el-dropdown-item>
          <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    
    <p v-if="task.description" class="task-description">
      {{ task.description }}
    </p>
    
    <div class="task-meta">
      <el-tag :type="priorityTagType" size="mini">
        {{ priorityText }}
      </el-tag>
      
      <span v-if="task.dueDate" class="due-date" :class="dueDateClass">
        {{ formatDate(task.dueDate) }}
      </span>
    </div>
    
    <div v-if="assignee" class="task-assignee">
      <el-avatar :size="24" :src="assignee.avatar">
        {{ assignee.username.charAt(0).toUpperCase() }}
      </el-avatar>
      <span class="assignee-name">{{ assignee.username }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Task, TaskPriority, User } from '@/types/api';
import { formatDistanceToNow, parseISO, isBefore } from 'date-fns';
import { zhCN } from 'date-fns/locale';

type MenuCommand = 'edit' | 'delete';

@Component
export default class TaskCard extends Vue {
  @Prop({ type: Object, required: true })
  task!: Task;

  @Prop({ type: Object })
  assignee?: User;

  get taskCardClass(): Record<string, boolean> {
    return {
      'task-card--overdue': this.isOverdue,
      'task-card--high-priority': this.task.priority === TaskPriority.HIGH,
      'task-card--urgent': this.task.priority === TaskPriority.URGENT
    };
  }

  get priorityTagType(): string {
    const typeMap = {
      [TaskPriority.LOW]: '',
      [TaskPriority.MEDIUM]: 'warning',
      [TaskPriority.HIGH]: 'danger',
      [TaskPriority.URGENT]: 'danger'
    };
    return typeMap[this.task.priority];
  }

  get priorityText(): string {
    const textMap = {
      [TaskPriority.LOW]: '低',
      [TaskPriority.MEDIUM]: '中',
      [TaskPriority.HIGH]: '高',
      [TaskPriority.URGENT]: '紧急'
    };
    return textMap[this.task.priority];
  }

  get isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    return isBefore(parseISO(this.task.dueDate), new Date());
  }

  get dueDateClass(): Record<string, boolean> {
    return {
      'due-date--overdue': this.isOverdue
    };
  }

  @Emit('click')
  handleClick(): Task {
    return this.task;
  }

  @Emit('edit')
  handleEdit(): Task {
    return this.task;
  }

  @Emit('delete')
  handleDelete(): Task {
    return this.task;
  }

  handleMenuCommand(command: MenuCommand): void {
    switch (command) {
      case 'edit':
        this.handleEdit();
        break;
      case 'delete':
        this.handleDelete();
        break;
    }
  }

  formatDate(dateString: string): string {
    return formatDistanceToNow(parseISO(dateString), {
      addSuffix: true,
      locale: zhCN
    });
  }
}
</script>
```

## 🚀 开发流程

### 1. 项目初始化
```bash
# 创建项目
vue create task-manager --preset typescript

# 安装依赖
npm install element-ui vue-class-component vue-property-decorator vuex-module-decorators axios date-fns

# 安装开发依赖
npm install --save-dev @types/jest @vue/test-utils
```

### 2. 配置文件设置
- TypeScript 配置
- Vue CLI 配置
- ESLint 和 Prettier 配置
- 环境变量配置

### 3. 开发步骤
1. 设计数据模型和类型定义
2. 搭建项目架构
3. 实现状态管理
4. 开发 API 客户端
5. 创建通用组件
6. 实现页面功能
7. 编写单元测试
8. 性能优化

### 4. 部署和优化
- 构建优化
- 代码分割
- 缓存策略
- 部署配置

## 💻 实践代码

查看以下文件中的完整项目代码：

- `task-manager/` - 完整的项目源码
- `docs/` - 项目文档
- `deployment/` - 部署配置

## 📝 练习任务

1. **项目搭建**: 从零搭建 Vue 2 + TypeScript 项目
2. **功能实现**: 实现任务管理的核心功能
3. **测试编写**: 为关键组件编写单元测试
4. **性能优化**: 优化项目性能和用户体验

## 🎯 本章小结

- 完整项目实战整合了前面所有章节的知识
- 项目架构设计是成功的关键
- 类型安全贯穿整个开发流程
- 测试和优化确保项目质量

## 🎉 课程总结

恭喜你完成了 TypeScript 学习指引！通过这9个章节的学习，你已经：

- ✅ 掌握了 TypeScript 的核心语法和类型系统
- ✅ 学会了高级类型操作和泛型编程
- ✅ 理解了装饰器和元编程概念
- ✅ 能够在 Vue 2 项目中熟练使用 TypeScript
- ✅ 具备了开发完整 TypeScript 项目的能力

继续保持学习和实践，TypeScript 将成为你开发高质量前端应用的强大工具！
