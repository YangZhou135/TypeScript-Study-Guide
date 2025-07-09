# 实战项目案例：博客管理系统

> 这是一个完整的博客管理系统案例，整合了前面学习的所有TypeScript知识点

## 🎯 项目概述

### 功能需求
- 用户注册和登录
- 文章的增删改查
- 评论系统
- 分类和标签管理
- 用户权限管理

### 技术栈
- **前端**: Vue 2 + TypeScript + Element UI
- **后端**: Node.js + Express + TypeScript
- **数据库**: MongoDB (使用 Mongoose)
- **工具**: Webpack + ESLint + Prettier

## 📁 项目结构

```
blog-management-system/
├── frontend/                    # Vue 2 + TypeScript 前端
│   ├── src/
│   │   ├── types/              # 类型定义
│   │   │   ├── user.ts         # 用户相关类型
│   │   │   ├── article.ts      # 文章相关类型
│   │   │   ├── comment.ts      # 评论相关类型
│   │   │   └── api.ts          # API 响应类型
│   │   ├── components/         # Vue 组件
│   │   ├── views/             # 页面组件
│   │   ├── store/             # Vuex 状态管理
│   │   └── utils/             # 工具函数
│   ├── tsconfig.json          # TypeScript 配置
│   └── package.json
├── backend/                    # Node.js + TypeScript 后端
│   ├── src/
│   │   ├── types/             # 类型定义
│   │   ├── models/            # 数据模型
│   │   ├── controllers/       # 控制器
│   │   ├── routes/            # 路由
│   │   ├── middleware/        # 中间件
│   │   └── utils/             # 工具函数
│   ├── tsconfig.json
│   └── package.json
└── shared/                     # 共享类型定义
    ├── types/
    │   ├── user.ts
    │   ├── article.ts
    │   └── api.ts
    └── package.json
```

## 🏗️ 核心类型定义

### 1. 用户类型定义 (shared/types/user.ts)

```typescript
/**
 * 用户相关类型定义
 */

// 用户角色枚举
export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    AUTHOR = "author",
    READER = "reader"
}

// 用户状态枚举
export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned"
}

// 基础用户接口
export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}

// 用户注册请求
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// 用户登录请求
export interface LoginRequest {
    email: string;
    password: string;
}

// 用户登录响应
export interface LoginResponse {
    user: Omit<User, 'password'>;
    token: string;
    refreshToken: string;
}

// 用户更新请求
export interface UpdateUserRequest {
    username?: string;
    email?: string;
    avatar?: string;
}

// 用户查询参数
export interface UserQueryParams {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
}
```

### 2. 文章类型定义 (shared/types/article.ts)

```typescript
/**
 * 文章相关类型定义
 */

// 文章状态枚举
export enum ArticleStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}

// 文章分类接口
export interface Category {
    id: string;
    name: string;
    description?: string;
    color?: string;
    createdAt: Date;
}

// 文章标签接口
export interface Tag {
    id: string;
    name: string;
    color?: string;
    count: number;
}

// 文章接口
export interface Article {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    status: ArticleStatus;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    category: Category;
    tags: Tag[];
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// 文章创建请求
export interface CreateArticleRequest {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    categoryId: string;
    tagIds: string[];
    status: ArticleStatus;
}

// 文章更新请求
export interface UpdateArticleRequest {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    categoryId?: string;
    tagIds?: string[];
    status?: ArticleStatus;
}

// 文章查询参数
export interface ArticleQueryParams {
    page?: number;
    limit?: number;
    status?: ArticleStatus;
    categoryId?: string;
    tagId?: string;
    authorId?: string;
    search?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount';
    sortOrder?: 'asc' | 'desc';
}

// 文章列表响应
export interface ArticleListResponse {
    articles: Article[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
```

### 3. API 响应类型定义 (shared/types/api.ts)

```typescript
/**
 * API 响应类型定义
 */

// 基础 API 响应
export interface BaseApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: Date;
}

// 成功响应
export interface SuccessResponse<T = any> extends BaseApiResponse<T> {
    success: true;
    data: T;
}

// 错误响应
export interface ErrorResponse extends BaseApiResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
}

// 分页响应
export interface PaginatedResponse<T = any> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// API 响应联合类型
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// 文件上传响应
export interface FileUploadResponse {
    url: string;
    fileName: string;
    size: number;
    mimeType: string;
}

// 统计数据响应
export interface DashboardStatsResponse {
    totalArticles: number;
    totalUsers: number;
    totalComments: number;
    totalViews: number;
    recentArticles: Article[];
    topCategories: Array<{
        category: Category;
        count: number;
    }>;
}
```

## 🔧 实际应用示例

### 1. Vue 组件实现 (frontend/src/components/ArticleList.vue)

```vue
<template>
    <div class="article-list">
        <div class="search-bar">
            <el-input
                v-model="searchQuery"
                placeholder="搜索文章..."
                @input="handleSearch"
                clearable
            />
        </div>

        <div class="filter-bar">
            <el-select v-model="selectedCategory" placeholder="选择分类" clearable>
                <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                />
            </el-select>

            <el-select v-model="selectedStatus" placeholder="选择状态" clearable>
                <el-option
                    v-for="status in statusOptions"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                />
            </el-select>
        </div>

        <div class="article-grid">
            <article-card
                v-for="article in articles"
                :key="article.id"
                :article="article"
                @edit="handleEdit"
                @delete="handleDelete"
            />
        </div>

        <el-pagination
            v-if="pagination.pages > 1"
            :current-page="pagination.page"
            :page-size="pagination.limit"
            :total="pagination.total"
            layout="prev, pager, next, total"
            @current-change="handlePageChange"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { 
    Article, 
    ArticleStatus, 
    Category,
    ArticleQueryParams,
    PaginatedResponse
} from '@/types';
import ArticleCard from './ArticleCard.vue';

const ArticleStore = namespace('article');
const CategoryStore = namespace('category');

interface StatusOption {
    label: string;
    value: ArticleStatus;
}

@Component({
    components: {
        ArticleCard
    }
})
export default class ArticleList extends Vue {
    // 数据属性
    private searchQuery: string = '';
    private selectedCategory: string = '';
    private selectedStatus: ArticleStatus | '' = '';
    private loading: boolean = false;

    // 计算属性
    get statusOptions(): StatusOption[] {
        return [
            { label: '草稿', value: ArticleStatus.DRAFT },
            { label: '已发布', value: ArticleStatus.PUBLISHED },
            { label: '已归档', value: ArticleStatus.ARCHIVED }
        ];
    }

    // Vuex 状态
    @ArticleStore.State('articles')
    articles!: Article[];

    @ArticleStore.State('pagination')
    pagination!: PaginatedResponse<Article>['pagination'];

    @ArticleStore.Action('fetchArticles')
    fetchArticles!: (params: ArticleQueryParams) => Promise<void>;

    @ArticleStore.Action('deleteArticle')
    deleteArticle!: (id: string) => Promise<void>;

    @CategoryStore.State('categories')
    categories!: Category[];

    @CategoryStore.Action('fetchCategories')
    fetchCategories!: () => Promise<void>;

    // 生命周期钩子
    async created(): Promise<void> {
        await this.loadData();
    }

    // 方法
    private async loadData(): Promise<void> {
        this.loading = true;
        try {
            await Promise.all([
                this.fetchArticles(this.buildQueryParams()),
                this.fetchCategories()
            ]);
        } catch (error) {
            this.$message.error('加载数据失败');
        } finally {
            this.loading = false;
        }
    }

    private buildQueryParams(): ArticleQueryParams {
        const params: ArticleQueryParams = {
            page: this.pagination.page,
            limit: this.pagination.limit
        };

        if (this.searchQuery) {
            params.search = this.searchQuery;
        }

        if (this.selectedCategory) {
            params.categoryId = this.selectedCategory;
        }

        if (this.selectedStatus) {
            params.status = this.selectedStatus;
        }

        return params;
    }

    private handleSearch(): void {
        this.fetchArticles(this.buildQueryParams());
    }

    private handlePageChange(page: number): void {
        this.fetchArticles({
            ...this.buildQueryParams(),
            page
        });
    }

    private handleEdit(article: Article): void {
        this.$router.push(`/articles/${article.id}/edit`);
    }

    private async handleDelete(article: Article): Promise<void> {
        try {
            await this.$confirm(
                `确定要删除文章"${article.title}"吗？`,
                '确认删除',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            );

            await this.deleteArticle(article.id);
            this.$message.success('删除成功');
            await this.loadData();
        } catch (error) {
            if (error !== 'cancel') {
                this.$message.error('删除失败');
            }
        }
    }

    // 监听器
    @Watch('selectedCategory')
    onCategoryChange(): void {
        this.fetchArticles(this.buildQueryParams());
    }

    @Watch('selectedStatus')
    onStatusChange(): void {
        this.fetchArticles(this.buildQueryParams());
    }
}
</script>

<style scoped>
.article-list {
    padding: 20px;
}

.search-bar {
    margin-bottom: 20px;
}

.filter-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.article-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}
</style>
```

### 2. Vuex Store 实现 (frontend/src/store/modules/article.ts)

```typescript
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { 
    Article, 
    ArticleQueryParams, 
    CreateArticleRequest, 
    UpdateArticleRequest,
    ArticleListResponse,
    ApiResponse
} from '@/types';
import { articleApi } from '@/api/article';

@Module({ namespaced: true })
export default class ArticleModule extends VuexModule {
    // 状态
    articles: Article[] = [];
    currentArticle: Article | null = null;
    loading: boolean = false;
    pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    };

    // 获取器
    get publishedArticles(): Article[] {
        return this.articles.filter(article => 
            article.status === ArticleStatus.PUBLISHED
        );
    }

    get draftArticles(): Article[] {
        return this.articles.filter(article => 
            article.status === ArticleStatus.DRAFT
        );
    }

    // 突变
    @Mutation
    SET_ARTICLES(response: ArticleListResponse): void {
        this.articles = response.articles;
        this.pagination = response.pagination;
    }

    @Mutation
    SET_CURRENT_ARTICLE(article: Article | null): void {
        this.currentArticle = article;
    }

    @Mutation
    SET_LOADING(loading: boolean): void {
        this.loading = loading;
    }

    @Mutation
    ADD_ARTICLE(article: Article): void {
        this.articles.unshift(article);
        this.pagination.total++;
    }

    @Mutation
    UPDATE_ARTICLE(updatedArticle: Article): void {
        const index = this.articles.findIndex(
            article => article.id === updatedArticle.id
        );
        if (index !== -1) {
            this.articles.splice(index, 1, updatedArticle);
        }
    }

    @Mutation
    REMOVE_ARTICLE(id: string): void {
        const index = this.articles.findIndex(article => article.id === id);
        if (index !== -1) {
            this.articles.splice(index, 1);
            this.pagination.total--;
        }
    }

    // 动作
    @Action
    async fetchArticles(params: ArticleQueryParams): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await articleApi.getArticles(params);
            if (response.success) {
                this.SET_ARTICLES(response.data);
            } else {
                throw new Error(response.error.message);
            }
        } catch (error) {
            console.error('获取文章列表失败:', error);
            throw error;
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async fetchArticle(id: string): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await articleApi.getArticle(id);
            if (response.success) {
                this.SET_CURRENT_ARTICLE(response.data);
            } else {
                throw new Error(response.error.message);
            }
        } catch (error) {
            console.error('获取文章详情失败:', error);
            throw error;
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async createArticle(request: CreateArticleRequest): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await articleApi.createArticle(request);
            if (response.success) {
                this.ADD_ARTICLE(response.data);
                return response.data;
            } else {
                throw new Error(response.error.message);
            }
        } catch (error) {
            console.error('创建文章失败:', error);
            throw error;
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async updateArticle({ id, request }: { id: string; request: UpdateArticleRequest }): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await articleApi.updateArticle(id, request);
            if (response.success) {
                this.UPDATE_ARTICLE(response.data);
                return response.data;
            } else {
                throw new Error(response.error.message);
            }
        } catch (error) {
            console.error('更新文章失败:', error);
            throw error;
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async deleteArticle(id: string): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await articleApi.deleteArticle(id);
            if (response.success) {
                this.REMOVE_ARTICLE(id);
            } else {
                throw new Error(response.error.message);
            }
        } catch (error) {
            console.error('删除文章失败:', error);
            throw error;
        } finally {
            this.SET_LOADING(false);
        }
    }
}
```

## 🎯 学习重点

### 1. 类型系统应用
- **完整的类型定义**: 从基础类型到复杂的业务类型
- **类型复用**: 通过 shared 目录实现前后端类型共享
- **类型安全**: 在 API 调用、状态管理等场景中确保类型安全

### 2. Vue + TypeScript 最佳实践
- **组件类型化**: 使用 vue-property-decorator 实现类型安全的组件
- **Vuex 类型化**: 使用 vuex-module-decorators 实现类型安全的状态管理
- **路由类型化**: 为路由参数和查询参数添加类型定义

### 3. 错误处理和调试
- **类型守卫**: 在 API 响应处理中使用类型守卫确保数据正确性
- **错误边界**: 统一的错误处理机制
- **开发体验**: 完整的 TypeScript 开发环境配置

### 4. 工程化实践
- **代码规范**: ESLint + Prettier 统一代码风格
- **构建配置**: 针对 TypeScript 的构建优化
- **测试覆盖**: 类型安全的单元测试和集成测试

## 🚀 实践建议

1. **从简单开始**: 先实现基础的 CRUD 功能，再逐步增加复杂特性
2. **类型优先**: 在编写代码前先定义好类型，确保类型设计的合理性
3. **持续重构**: 随着对 TypeScript 理解的深入，持续优化类型定义
4. **测试驱动**: 编写类型安全的测试用例，确保代码质量

---

这个项目案例展示了如何在真实项目中应用 TypeScript 的各种特性，从基础类型到高级类型，从单个组件到整个应用架构。通过完整的代码示例，你可以看到 TypeScript 在提高代码质量、开发效率和维护性方面的实际价值。