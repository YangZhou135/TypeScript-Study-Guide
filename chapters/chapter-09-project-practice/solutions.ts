/**
 * 第9章：完整项目实战练习题解答
 *
 * 这里提供了 practice.ts 中博客管理系统练习的标准解答
 * 展示了完整项目开发的最佳实践
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// 模拟相关导入
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

// ============================================================================
// 练习1：博客系统类型定义 - 解答
// ============================================================================

console.log("=== 练习1：博客系统类型定义 - 解答 ===");

// 1. 定义用户类型
interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// 2. 定义用户角色枚举
enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    AUTHOR = "author",
    READER = "reader",
}

// 3. 定义文章类型
interface Article {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    status: ArticleStatus;
    authorId: number;
    categoryId: number;
    tags: string[];
    viewCount: number;
    likeCount: number;
    commentCount: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

// 4. 定义文章状态枚举
enum ArticleStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

// 5. 定义分类类型
interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parentId?: number;
    articleCount: number;
    createdAt: string;
    updatedAt: string;
}

// 6. 定义标签类型
interface Tag {
    id: number;
    name: string;
    slug: string;
    color?: string;
    articleCount: number;
    createdAt: string;
}

// 7. 定义评论类型
interface Comment {
    id: number;
    content: string;
    authorId: number;
    articleId: number;
    parentId?: number;
    isApproved: boolean;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
}

// 8. 定义API响应类型
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

// 9. 定义分页响应类型
interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 10. 定义表单类型
interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface RegisterForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ArticleForm {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    categoryId: number;
    tags: string[];
    status: ArticleStatus;
}

interface CommentForm {
    content: string;
    parentId?: number;
}

// ============================================================================
// 练习2：API 客户端实现 - 解答
// ============================================================================

console.log("=== 练习2：API 客户端实现 - 解答 ===");

// 1. 实现基础HTTP客户端
class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem("auth_token");
    }

    setToken(token: string): void {
        this.token = token;
        localStorage.setItem("auth_token", token);
    }

    clearToken(): void {
        this.token = null;
        localStorage.removeItem("auth_token");
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Request failed");
            }

            return data;
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "GET" });
    }

    async post<T, U = any>(endpoint: string, data?: U): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T, U = any>(endpoint: string, data?: U): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }
}

// 创建API客户端实例
const apiClient = new ApiClient("http://localhost:3000/api");

// 2. 实现认证API
class AuthApi {
    static async login(
        credentials: LoginForm
    ): Promise<ApiResponse<{ user: User; token: string }>> {
        return apiClient.post<{ user: User; token: string }, LoginForm>("/auth/login", credentials);
    }

    static async register(userData: RegisterForm): Promise<ApiResponse<User>> {
        return apiClient.post<User, RegisterForm>("/auth/register", userData);
    }

    static async getProfile(): Promise<ApiResponse<User>> {
        return apiClient.get<User>("/auth/profile");
    }

    static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
        return apiClient.put<User>("/auth/profile", userData);
    }

    static async logout(): Promise<ApiResponse<null>> {
        return apiClient.post<null>("/auth/logout");
    }
}

// 3. 实现文章API
class ArticleApi {
    static async getArticles(params?: {
        page?: number;
        limit?: number;
        status?: ArticleStatus;
        categoryId?: number;
        authorId?: number;
        search?: string;
    }): Promise<PaginatedResponse<Article>> {
        const queryString = params ? new URLSearchParams(params as any).toString() : "";
        return apiClient.get<Article[]>(`/articles${queryString ? `?${queryString}` : ""}`);
    }

    static async getArticle(id: number): Promise<ApiResponse<Article>> {
        return apiClient.get<Article>(`/articles/${id}`);
    }

    static async createArticle(articleData: ArticleForm): Promise<ApiResponse<Article>> {
        return apiClient.post<Article, ArticleForm>("/articles", articleData);
    }

    static async updateArticle(
        id: number,
        articleData: Partial<ArticleForm>
    ): Promise<ApiResponse<Article>> {
        return apiClient.put<Article>(`/articles/${id}`, articleData);
    }

    static async deleteArticle(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete<null>(`/articles/${id}`);
    }

    static async publishArticle(id: number): Promise<ApiResponse<Article>> {
        return apiClient.put<Article>(`/articles/${id}/publish`);
    }

    static async likeArticle(id: number): Promise<ApiResponse<{ likeCount: number }>> {
        return apiClient.post<{ likeCount: number }>(`/articles/${id}/like`);
    }
}

// 4. 实现分类API
class CategoryApi {
    static async getCategories(): Promise<ApiResponse<Category[]>> {
        return apiClient.get<Category[]>("/categories");
    }

    static async getCategory(id: number): Promise<ApiResponse<Category>> {
        return apiClient.get<Category>(`/categories/${id}`);
    }

    static async createCategory(
        categoryData: Omit<Category, "id" | "articleCount" | "createdAt" | "updatedAt">
    ): Promise<ApiResponse<Category>> {
        return apiClient.post<Category>("/categories", categoryData);
    }

    static async updateCategory(
        id: number,
        categoryData: Partial<Category>
    ): Promise<ApiResponse<Category>> {
        return apiClient.put<Category>(`/categories/${id}`, categoryData);
    }

    static async deleteCategory(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete<null>(`/categories/${id}`);
    }
}

// 5. 实现评论API
class CommentApi {
    static async getComments(
        articleId: number,
        params?: {
            page?: number;
            limit?: number;
        }
    ): Promise<PaginatedResponse<Comment>> {
        const queryString = params ? new URLSearchParams(params as any).toString() : "";
        return apiClient.get<Comment[]>(
            `/articles/${articleId}/comments${queryString ? `?${queryString}` : ""}`
        );
    }

    static async createComment(
        articleId: number,
        commentData: CommentForm
    ): Promise<ApiResponse<Comment>> {
        return apiClient.post<Comment, CommentForm>(`/articles/${articleId}/comments`, commentData);
    }

    static async updateComment(
        id: number,
        commentData: Partial<CommentForm>
    ): Promise<ApiResponse<Comment>> {
        return apiClient.put<Comment>(`/comments/${id}`, commentData);
    }

    static async deleteComment(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete<null>(`/comments/${id}`);
    }

    static async approveComment(id: number): Promise<ApiResponse<Comment>> {
        return apiClient.put<Comment>(`/comments/${id}/approve`);
    }

    static async likeComment(id: number): Promise<ApiResponse<{ likeCount: number }>> {
        return apiClient.post<{ likeCount: number }>(`/comments/${id}/like`);
    }
}

// ============================================================================
// 练习3：Vuex 状态管理 - 解答
// ============================================================================

console.log("=== 练习3：Vuex 状态管理 - 解答 ===");

// 1. 实现认证模块
@Module({ namespaced: true })
class AuthModule extends VuexModule {
    user: User | null = null;
    token: string | null = localStorage.getItem("auth_token");
    isLoading: boolean = false;

    // Getters
    get isAuthenticated(): boolean {
        return !!this.token && !!this.user;
    }

    get userName(): string {
        return this.user?.username || "Guest";
    }

    get userRole(): UserRole | null {
        return this.user?.role || null;
    }

    get canWrite(): boolean {
        return (
            this.user?.role === UserRole.ADMIN ||
            this.user?.role === UserRole.EDITOR ||
            this.user?.role === UserRole.AUTHOR
        );
    }

    get canManage(): boolean {
        return this.user?.role === UserRole.ADMIN || this.user?.role === UserRole.EDITOR;
    }

    // Mutations
    @Mutation
    SET_USER(user: User): void {
        this.user = user;
    }

    @Mutation
    SET_TOKEN(token: string): void {
        this.token = token;
        localStorage.setItem("auth_token", token);
        apiClient.setToken(token);
    }

    @Mutation
    SET_LOADING(loading: boolean): void {
        this.isLoading = loading;
    }

    @Mutation
    CLEAR_AUTH(): void {
        this.user = null;
        this.token = null;
        localStorage.removeItem("auth_token");
        apiClient.clearToken();
    }

    // Actions
    @Action
    async login(credentials: LoginForm): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await AuthApi.login(credentials);
            this.SET_TOKEN(response.data.token);
            this.SET_USER(response.data.user);
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async logout(): Promise<void> {
        try {
            await AuthApi.logout();
        } finally {
            this.CLEAR_AUTH();
        }
    }

    @Action
    async fetchProfile(): Promise<void> {
        if (!this.token) return;

        try {
            const response = await AuthApi.getProfile();
            this.SET_USER(response.data);
        } catch (error) {
            this.CLEAR_AUTH();
            throw error;
        }
    }
}

// 2. 实现文章模块
@Module({ namespaced: true })
class ArticleModule extends VuexModule {
    articles: Article[] = [];
    currentArticle: Article | null = null;
    isLoading: boolean = false;
    filters: {
        status?: ArticleStatus;
        categoryId?: number;
        authorId?: number;
        search?: string;
    } = {};
    pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    };

    // Getters
    get publishedArticles(): Article[] {
        return this.articles.filter((article) => article.status === ArticleStatus.PUBLISHED);
    }

    get draftArticles(): Article[] {
        return this.articles.filter((article) => article.status === ArticleStatus.DRAFT);
    }

    get filteredArticles(): Article[] {
        return this.articles.filter((article) => {
            if (this.filters.status && article.status !== this.filters.status) return false;
            if (this.filters.categoryId && article.categoryId !== this.filters.categoryId)
                return false;
            if (this.filters.authorId && article.authorId !== this.filters.authorId) return false;
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                return (
                    article.title.toLowerCase().includes(searchLower) ||
                    article.content.toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    }

    get articleById() {
        return (id: number): Article | undefined => {
            return this.articles.find((article) => article.id === id);
        };
    }

    // Mutations
    @Mutation
    SET_ARTICLES(articles: Article[]): void {
        this.articles = articles;
    }

    @Mutation
    SET_CURRENT_ARTICLE(article: Article | null): void {
        this.currentArticle = article;
    }

    @Mutation
    ADD_ARTICLE(article: Article): void {
        this.articles.push(article);
    }

    @Mutation
    UPDATE_ARTICLE(updatedArticle: Article): void {
        const index = this.articles.findIndex((a) => a.id === updatedArticle.id);
        if (index > -1) {
            this.articles.splice(index, 1, updatedArticle);
        }
    }

    @Mutation
    REMOVE_ARTICLE(articleId: number): void {
        const index = this.articles.findIndex((a) => a.id === articleId);
        if (index > -1) {
            this.articles.splice(index, 1);
        }
    }

    @Mutation
    SET_LOADING(loading: boolean): void {
        this.isLoading = loading;
    }

    @Mutation
    SET_FILTERS(filters: ArticleModule["filters"]): void {
        this.filters = { ...this.filters, ...filters };
    }

    @Mutation
    CLEAR_FILTERS(): void {
        this.filters = {};
    }

    @Mutation
    SET_PAGINATION(pagination: ArticleModule["pagination"]): void {
        this.pagination = pagination;
    }

    // Actions
    @Action
    async fetchArticles(params?: {
        page?: number;
        limit?: number;
        status?: ArticleStatus;
        categoryId?: number;
        authorId?: number;
        search?: string;
    }): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await ArticleApi.getArticles(params);
            this.SET_ARTICLES(response.data);
            this.SET_PAGINATION(response.pagination);
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async fetchArticle(id: number): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await ArticleApi.getArticle(id);
            this.SET_CURRENT_ARTICLE(response.data);
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async createArticle(articleData: ArticleForm): Promise<Article> {
        const response = await ArticleApi.createArticle(articleData);
        this.ADD_ARTICLE(response.data);
        return response.data;
    }

    @Action
    async updateArticle({
        id,
        data,
    }: {
        id: number;
        data: Partial<ArticleForm>;
    }): Promise<Article> {
        const response = await ArticleApi.updateArticle(id, data);
        this.UPDATE_ARTICLE(response.data);
        return response.data;
    }

    @Action
    async deleteArticle(id: number): Promise<void> {
        await ArticleApi.deleteArticle(id);
        this.REMOVE_ARTICLE(id);
    }

    @Action
    async publishArticle(id: number): Promise<Article> {
        const response = await ArticleApi.publishArticle(id);
        this.UPDATE_ARTICLE(response.data);
        return response.data;
    }

    @Action
    async likeArticle(id: number): Promise<void> {
        const response = await ArticleApi.likeArticle(id);
        const article = this.articleById(id);
        if (article) {
            const updatedArticle = { ...article, likeCount: response.data.likeCount };
            this.UPDATE_ARTICLE(updatedArticle);
        }
    }

    @Action
    setFilters(filters: ArticleModule["filters"]): void {
        this.SET_FILTERS(filters);
    }

    @Action
    clearFilters(): void {
        this.CLEAR_FILTERS();
    }
}

// ============================================================================
// 练习4：Vue 组件开发 - 解答
// ============================================================================

console.log("=== 练习4：Vue 组件开发 - 解答 ===");

// 1. 实现文章卡片组件
@Component
class ArticleCard extends Vue {
    @Prop({ type: Object, required: true })
    article!: Article;

    @Prop({ type: Object })
    author?: User;

    @Prop({ type: Object })
    category?: Category;

    @Prop({ type: Boolean, default: true })
    showActions!: boolean;

    // 计算属性
    get statusClass(): string {
        const classMap = {
            [ArticleStatus.DRAFT]: "status-draft",
            [ArticleStatus.PUBLISHED]: "status-published",
            [ArticleStatus.ARCHIVED]: "status-archived",
        };
        return classMap[this.article.status];
    }

    get formattedDate(): string {
        return new Date(this.article.publishedAt || this.article.createdAt).toLocaleDateString(
            "zh-CN"
        );
    }

    get excerpt(): string {
        if (this.article.excerpt) return this.article.excerpt;
        return this.article.content.substring(0, 200) + "...";
    }

    get readingTime(): string {
        const wordsPerMinute = 200;
        const wordCount = this.article.content.length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} 分钟阅读`;
    }

    // 事件处理
    @Emit("click")
    handleClick(): Article {
        return this.article;
    }

    @Emit("like")
    handleLike(): Article {
        return this.article;
    }

    @Emit("edit")
    handleEdit(): Article {
        return this.article;
    }

    @Emit("delete")
    handleDelete(): Article {
        return this.article;
    }
}

// 2. 实现文章编辑器组件
@Component
class ArticleEditor extends Vue {
    @Prop({ type: Object })
    initialArticle?: Article;

    @Prop({ type: Array, default: () => [] })
    categories!: Category[];

    @Prop({ type: Array, default: () => [] })
    tags!: Tag[];

    @Prop({ type: Boolean, default: false })
    loading!: boolean;

    // 表单状态
    private form: ArticleForm = {
        title: "",
        content: "",
        excerpt: "",
        coverImage: "",
        categoryId: 0,
        tags: [],
        status: ArticleStatus.DRAFT,
    };

    private errors: Record<string, string> = {};
    private isDirty: boolean = false;

    // 监听初始文章变化
    @Watch("initialArticle", { immediate: true })
    onInitialArticleChanged(article?: Article): void {
        if (article) {
            this.form = {
                title: article.title,
                content: article.content,
                excerpt: article.excerpt || "",
                coverImage: article.coverImage || "",
                categoryId: article.categoryId,
                tags: [...article.tags],
                status: article.status,
            };
        }
    }

    // 监听表单变化
    @Watch("form", { deep: true })
    onFormChanged(): void {
        this.isDirty = true;
    }

    // 计算属性
    get isEditing(): boolean {
        return !!this.initialArticle;
    }

    get canSave(): boolean {
        return this.form.title.trim() !== "" && this.form.content.trim() !== "";
    }

    get canPublish(): boolean {
        return this.canSave && this.form.categoryId > 0;
    }

    get wordCount(): number {
        return this.form.content.length;
    }

    // 方法
    validateForm(): boolean {
        this.errors = {};

        if (!this.form.title.trim()) {
            this.errors.title = "标题不能为空";
        }

        if (!this.form.content.trim()) {
            this.errors.content = "内容不能为空";
        }

        if (this.form.categoryId === 0) {
            this.errors.categoryId = "请选择分类";
        }

        return Object.keys(this.errors).length === 0;
    }

    @Emit("save")
    handleSave(): ArticleForm | null {
        if (this.validateForm()) {
            this.isDirty = false;
            return { ...this.form };
        }
        return null;
    }

    @Emit("publish")
    handlePublish(): ArticleForm | null {
        if (this.validateForm() && this.canPublish) {
            this.form.status = ArticleStatus.PUBLISHED;
            this.isDirty = false;
            return { ...this.form };
        }
        return null;
    }

    @Emit("cancel")
    handleCancel(): void {
        this.isDirty = false;
    }

    // 生命周期钩子
    beforeRouteLeave(to: any, from: any, next: any): void {
        if (this.isDirty) {
            const answer = window.confirm("您有未保存的更改，确定要离开吗？");
            if (answer) {
                next();
            } else {
                next(false);
            }
        } else {
            next();
        }
    }
}

// ============================================================================
// 练习5：工具函数和类型守卫 - 解答
// ============================================================================

console.log("=== 练习5：工具函数和类型守卫 - 解答 ===");

// 1. 实现类型守卫
function isUser(obj: any): obj is User {
    return (
        obj &&
        typeof obj.id === "number" &&
        typeof obj.username === "string" &&
        typeof obj.email === "string" &&
        Object.values(UserRole).includes(obj.role)
    );
}

function isArticle(obj: any): obj is Article {
    return (
        obj &&
        typeof obj.id === "number" &&
        typeof obj.title === "string" &&
        typeof obj.content === "string" &&
        Object.values(ArticleStatus).includes(obj.status)
    );
}

function isComment(obj: any): obj is Comment {
    return (
        obj &&
        typeof obj.id === "number" &&
        typeof obj.content === "string" &&
        typeof obj.authorId === "number" &&
        typeof obj.articleId === "number"
    );
}

// 2. 实现文本处理工具
class TextUtils {
    // 生成文章摘要
    static generateExcerpt(content: string, maxLength: number = 200): string {
        const plainText = this.stripHtml(content);
        return this.truncate(plainText, maxLength);
    }

    // 计算阅读时间
    static calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
        const wordCount = content.length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    // 高亮搜索关键词
    static highlightKeywords(text: string, keywords: string[]): string {
        let result = text;
        keywords.forEach((keyword) => {
            const regex = new RegExp(`(${keyword})`, "gi");
            result = result.replace(regex, "<mark>$1</mark>");
        });
        return result;
    }

    // 清理HTML标签
    static stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, "");
    }

    // 截断文本
    static truncate(text: string, maxLength: number, suffix: string = "..."): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }
}

// 3. 实现SEO工具
class SeoUtils {
    // 生成URL别名
    static generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    // 生成meta描述
    static generateMetaDescription(content: string, maxLength: number = 160): string {
        const plainText = TextUtils.stripHtml(content);
        return TextUtils.truncate(plainText, maxLength);
    }

    // 提取关键词
    static extractKeywords(content: string, maxCount: number = 10): string[] {
        const words = content
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((word) => word.length > 3);

        const wordCount: Record<string, number> = {};
        words.forEach((word) => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        return Object.entries(wordCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, maxCount)
            .map(([word]) => word);
    }
}

// 4. 实现权限检查工具
class PermissionUtils {
    // 检查用户是否可以编辑文章
    static canEditArticle(user: User, article: Article): boolean {
        if (user.role === UserRole.ADMIN) return true;
        if (user.role === UserRole.EDITOR) return true;
        if (user.role === UserRole.AUTHOR && article.authorId === user.id) return true;
        return false;
    }

    // 检查用户是否可以删除文章
    static canDeleteArticle(user: User, article: Article): boolean {
        if (user.role === UserRole.ADMIN) return true;
        if (user.role === UserRole.EDITOR) return true;
        if (user.role === UserRole.AUTHOR && article.authorId === user.id) return true;
        return false;
    }

    // 检查用户是否可以管理评论
    static canManageComments(user: User): boolean {
        return user.role === UserRole.ADMIN || user.role === UserRole.EDITOR;
    }

    // 检查用户是否可以管理分类
    static canManageCategories(user: User): boolean {
        return user.role === UserRole.ADMIN || user.role === UserRole.EDITOR;
    }
}

// ============================================================================
// 练习6：错误处理和测试 - 解答
// ============================================================================

console.log("=== 练习6：错误处理和测试 - 解答 ===");

// 1. 定义自定义错误类
class BlogError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(message: string, code: string, statusCode: number = 500) {
        super(message);
        this.name = "BlogError";
        this.code = code;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends BlogError {
    public readonly field: string;

    constructor(message: string, field: string) {
        super(message, "VALIDATION_ERROR", 400);
        this.name = "ValidationError";
        this.field = field;
    }
}

class AuthenticationError extends BlogError {
    constructor(message: string = "认证失败") {
        super(message, "AUTHENTICATION_ERROR", 401);
        this.name = "AuthenticationError";
    }
}

class AuthorizationError extends BlogError {
    constructor(message: string = "权限不足") {
        super(message, "AUTHORIZATION_ERROR", 403);
        this.name = "AuthorizationError";
    }
}

// 2. 实现错误处理器
class ErrorHandler {
    static handle(error: Error): void {
        console.error("Error occurred:", error);

        if (error instanceof BlogError) {
            this.handleBlogError(error);
        } else {
            this.handleUnknownError(error);
        }
    }

    private static handleBlogError(error: BlogError): void {
        switch (error.constructor) {
            case ValidationError:
                this.handleValidationError(error as ValidationError);
                break;
            case AuthenticationError:
            case AuthorizationError:
                this.handleAuthError(error);
                break;
            default:
                this.logError(error);
                this.notifyUser(error.message);
        }
    }

    private static handleValidationError(error: ValidationError): void {
        this.notifyUser(`${error.field}: ${error.message}`, "warning");
    }

    private static handleAuthError(error: AuthenticationError | AuthorizationError): void {
        this.notifyUser(error.message, "error");
        // 可能需要重定向到登录页面
    }

    private static handleUnknownError(error: Error): void {
        this.logError(error);
        this.notifyUser("发生了未知错误，请稍后重试");
    }

    private static logError(error: Error): void {
        // 这里应该发送错误到日志服务
        console.error("System Error:", error);
    }

    private static notifyUser(message: string, type: "error" | "warning" = "error"): void {
        // 这里应该调用通知组件显示错误
        console.error(`User ${type}:`, message);
    }
}

// ============================================================================
// 练习7：性能优化 - 解答
// ============================================================================

console.log("=== 练习7：性能优化 - 解答 ===");

// 1. 实现缓存装饰器
function Cache(ttl: number = 300000) {
    // 5分钟默认缓存
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const cache = new Map<string, { value: any; timestamp: number }>();

        descriptor.value = function (...args: any[]) {
            const key = JSON.stringify(args);
            const cached = cache.get(key);

            if (cached && Date.now() - cached.timestamp < ttl) {
                return cached.value;
            }

            const result = originalMethod.apply(this, args);
            cache.set(key, { value: result, timestamp: Date.now() });
            return result;
        };

        return descriptor;
    };
}

// 2. 实现防抖装饰器
function Debounce(delay: number = 300) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let timeoutId: number;

        descriptor.value = function (...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                originalMethod.apply(this, args);
            }, delay);
        };

        return descriptor;
    };
}

// 3. 实现节流装饰器
function Throttle(delay: number = 300) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let lastCall = 0;

        descriptor.value = function (...args: any[]) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                originalMethod.apply(this, args);
            }
        };

        return descriptor;
    };
}

// 4. 实现缓存工具
class CacheUtils {
    private static cache = new Map<string, { value: any; timestamp: number; ttl: number }>();

    static set<T>(key: string, value: T, ttl: number = 300000): void {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl,
        });
    }

    static get<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.value;
    }

    static remove(key: string): void {
        this.cache.delete(key);
    }

    static clear(): void {
        this.cache.clear();
    }

    static isExpired(key: string): boolean {
        const cached = this.cache.get(key);
        if (!cached) return true;
        return Date.now() - cached.timestamp > cached.ttl;
    }
}

// ============================================================================
// 解答总结
// ============================================================================

console.log(`
🎉 第9章博客管理系统练习解答完成！

📚 本解答展示了一个完整的博客管理系统实现，包含：

🏗️ 系统架构：
✅ 完整的 TypeScript 类型定义系统
✅ 模块化的 API 客户端架构
✅ 类型安全的 Vuex 状态管理
✅ 可复用的 Vue 组件设计

🔧 核心功能：
✅ 用户认证和权限管理
✅ 文章的增删改查和发布
✅ 分类和标签管理
✅ 评论系统和审核

🛠️ 工具函数：
✅ 类型守卫和验证
✅ 文本处理和SEO工具
✅ 权限检查工具
✅ 缓存和性能优化

🚨 错误处理：
✅ 自定义错误类体系
✅ 统一错误处理机制
✅ 用户友好的错误提示

⚡ 性能优化：
✅ 缓存装饰器
✅ 防抖和节流装饰器
✅ 内存缓存工具

💡 关键特点：
- 严格的类型安全
- 模块化设计
- 错误边界处理
- 性能优化
- 代码复用

🎯 最佳实践：
1. 类型定义是项目的基础
2. API 设计要考虑类型安全
3. 状态管理需要良好的架构
4. 组件设计要注重复用性
5. 错误处理要全面覆盖
6. 性能优化要适度合理

这个解答整合了前面所有章节的知识点，展示了如何在实际项目中
应用 TypeScript + Vue 2 的最佳实践。

🚀 通过完成这个练习，你已经具备了：
- 完整项目架构设计能力
- 类型安全的前端开发技能
- 复杂状态管理经验
- 性能优化和错误处理能力

恭喜你成为 TypeScript + Vue 专家！🎊
`);
