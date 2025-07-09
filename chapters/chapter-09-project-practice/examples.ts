/**
 * 第9章：完整项目实战示例
 *
 * 本文件展示了一个完整的任务管理系统的 TypeScript 实现
 * 整合了前面所有章节的知识点，展示最佳实践
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 1. 核心类型定义
// ============================================================================

console.log("=== 1. 核心类型定义 ===");

// 用户相关类型
interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user",
}

// 项目相关类型
interface Project {
    id: number;
    name: string;
    description?: string;
    color: string;
    ownerId: number;
    memberIds: number[];
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}

enum ProjectStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    DELETED = "deleted",
}

// 任务相关类型
interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: number;
    assigneeId?: number;
    creatorId: number;
    dueDate?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    DONE = "done",
}

enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
}

// API 响应类型
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 表单类型
interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface TaskForm {
    title: string;
    description?: string;
    priority: TaskPriority;
    assigneeId?: number;
    dueDate?: string;
}

interface ProjectForm {
    name: string;
    description?: string;
    color: string;
    memberIds: number[];
}

// ============================================================================
// 2. API 客户端实现
// ============================================================================

console.log("=== 2. API 客户端实现 ===");

// HTTP 客户端类
class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem("auth_token");
    }

    // 设置认证令牌
    setToken(token: string): void {
        this.token = token;
        localStorage.setItem("auth_token", token);
    }

    // 清除认证令牌
    clearToken(): void {
        this.token = null;
        localStorage.removeItem("auth_token");
    }

    // 通用请求方法
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
            const response = await fetch(url, {
                ...options,
                headers,
            });

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

    // GET 请求
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "GET" });
    }

    // POST 请求
    async post<T, U = any>(endpoint: string, data?: U): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PUT 请求
    async put<T, U = any>(endpoint: string, data?: U): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // DELETE 请求
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }
}

// 创建 API 客户端实例
const apiClient = new ApiClient("http://localhost:3000/api");

// ============================================================================
// 3. 具体 API 服务
// ============================================================================

console.log("=== 3. 具体 API 服务 ===");

// 认证 API
class AuthApi {
    // 登录
    static async login(
        credentials: LoginForm
    ): Promise<ApiResponse<{ user: User; token: string }>> {
        return apiClient.post<{ user: User; token: string }, LoginForm>("/auth/login", credentials);
    }

    // 注册
    static async register(
        userData: Omit<User, "id" | "createdAt" | "updatedAt">
    ): Promise<ApiResponse<User>> {
        return apiClient.post<User>("/auth/register", userData);
    }

    // 获取当前用户信息
    static async getProfile(): Promise<ApiResponse<User>> {
        return apiClient.get<User>("/auth/profile");
    }

    // 登出
    static async logout(): Promise<ApiResponse<null>> {
        return apiClient.post<null>("/auth/logout");
    }

    // 刷新令牌
    static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
        return apiClient.post<{ token: string }>("/auth/refresh");
    }
}

// 用户 API
class UserApi {
    // 获取用户列表
    static async getUsers(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<PaginatedResponse<User>> {
        const queryString = params ? new URLSearchParams(params as any).toString() : "";
        return apiClient.get<User[]>(`/users${queryString ? `?${queryString}` : ""}`);
    }

    // 获取单个用户
    static async getUser(id: number): Promise<ApiResponse<User>> {
        return apiClient.get<User>(`/users/${id}`);
    }

    // 更新用户
    static async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
        return apiClient.put<User>(`/users/${id}`, userData);
    }

    // 删除用户
    static async deleteUser(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete<null>(`/users/${id}`);
    }
}

// 项目 API
class ProjectApi {
    // 获取项目列表
    static async getProjects(params?: {
        page?: number;
        limit?: number;
        status?: ProjectStatus;
    }): Promise<PaginatedResponse<Project>> {
        const queryString = params ? new URLSearchParams(params as any).toString() : "";
        return apiClient.get<Project[]>(`/projects${queryString ? `?${queryString}` : ""}`);
    }

    // 获取单个项目
    static async getProject(id: number): Promise<ApiResponse<Project>> {
        return apiClient.get<Project>(`/projects/${id}`);
    }

    // 创建项目
    static async createProject(projectData: ProjectForm): Promise<ApiResponse<Project>> {
        return apiClient.post<Project, ProjectForm>("/projects", projectData);
    }

    // 更新项目
    static async updateProject(
        id: number,
        projectData: Partial<ProjectForm>
    ): Promise<ApiResponse<Project>> {
        return apiClient.put<Project>(`/projects/${id}`, projectData);
    }

    // 删除项目
    static async deleteProject(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete<null>(`/projects/${id}`);
    }

    // 添加项目成员
    static async addMember(projectId: number, userId: number): Promise<ApiResponse<Project>> {
        return apiClient.post<Project>(`/projects/${projectId}/members`, { userId });
    }

    // 移除项目成员
    static async removeMember(projectId: number, userId: number): Promise<ApiResponse<Project>> {
        return apiClient.delete<Project>(`/projects/${projectId}/members/${userId}`);
    }
}

// 任务 API
class TaskApi {
    // 获取任务列表
    static async getTasks(params?: {
        page?: number;
        limit?: number;
        projectId?: number;
        status?: TaskStatus;
        assigneeId?: number;
    }): Promise<PaginatedResponse<Task>> {
        const queryString = params ? new URLSearchParams(params as any).toString() : "";
        return apiClient.get<Task[]>(`/tasks${queryString ? `?${queryString}` : ""}`);
    }

    // 获取单个任务
    static async getTask(id: number): Promise<ApiResponse<Task>> {
        return apiClient.get<Task>(`/tasks/${id}`);
    }

    // 创建任务
    static async createTask(
        taskData: TaskForm & { projectId: number }
    ): Promise<ApiResponse<Task>> {
        return apiClient.post<Task>("/tasks", taskData);
    }

    // 更新任务
    static async updateTask(id: number, taskData: Partial<TaskForm>): Promise<ApiResponse<Task>> {
        return apiClient.put<Task>(`/tasks/${id}`, taskData);
    }

    // 删除任务
    static async deleteTask(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete<null>(`/tasks/${id}`);
    }

    // 更新任务状态
    static async updateTaskStatus(id: number, status: TaskStatus): Promise<ApiResponse<Task>> {
        return apiClient.put<Task>(`/tasks/${id}/status`, { status });
    }

    // 分配任务
    static async assignTask(id: number, assigneeId: number): Promise<ApiResponse<Task>> {
        return apiClient.put<Task>(`/tasks/${id}/assign`, { assigneeId });
    }
}

// ============================================================================
// 4. Vuex 状态管理
// ============================================================================

console.log("=== 4. Vuex 状态管理 ===");

// 模拟 Vuex 相关导入
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

// 认证模块状态
interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// 认证模块
@Module({ namespaced: true })
class AuthModule extends VuexModule implements AuthState {
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

    get isAdmin(): boolean {
        return this.user?.role === UserRole.ADMIN;
    }

    get isManager(): boolean {
        return this.user?.role === UserRole.MANAGER || this.isAdmin;
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

    @Action
    async refreshToken(): Promise<void> {
        try {
            const response = await AuthApi.refreshToken();
            this.SET_TOKEN(response.data.token);
        } catch (error) {
            this.CLEAR_AUTH();
            throw error;
        }
    }
}

// 项目模块状态
interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 项目模块
@Module({ namespaced: true })
class ProjectModule extends VuexModule implements ProjectState {
    projects: Project[] = [];
    currentProject: Project | null = null;
    isLoading: boolean = false;
    pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    };

    // Getters
    get activeProjects(): Project[] {
        return this.projects.filter((p) => p.status === ProjectStatus.ACTIVE);
    }

    get archivedProjects(): Project[] {
        return this.projects.filter((p) => p.status === ProjectStatus.ARCHIVED);
    }

    get projectById() {
        return (id: number): Project | undefined => {
            return this.projects.find((p) => p.id === id);
        };
    }

    get userProjects() {
        return (userId: number): Project[] => {
            return this.projects.filter(
                (p) => p.ownerId === userId || p.memberIds.includes(userId)
            );
        };
    }

    // Mutations
    @Mutation
    SET_PROJECTS(projects: Project[]): void {
        this.projects = projects;
    }

    @Mutation
    SET_CURRENT_PROJECT(project: Project | null): void {
        this.currentProject = project;
    }

    @Mutation
    ADD_PROJECT(project: Project): void {
        this.projects.push(project);
    }

    @Mutation
    UPDATE_PROJECT(updatedProject: Project): void {
        const index = this.projects.findIndex((p) => p.id === updatedProject.id);
        if (index > -1) {
            this.projects.splice(index, 1, updatedProject);
        }
    }

    @Mutation
    REMOVE_PROJECT(projectId: number): void {
        const index = this.projects.findIndex((p) => p.id === projectId);
        if (index > -1) {
            this.projects.splice(index, 1);
        }
    }

    @Mutation
    SET_LOADING(loading: boolean): void {
        this.isLoading = loading;
    }

    @Mutation
    SET_PAGINATION(pagination: ProjectState["pagination"]): void {
        this.pagination = pagination;
    }

    // Actions
    @Action
    async fetchProjects(params?: {
        page?: number;
        limit?: number;
        status?: ProjectStatus;
    }): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await ProjectApi.getProjects(params);
            this.SET_PROJECTS(response.data);
            this.SET_PAGINATION(response.pagination);
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async fetchProject(id: number): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await ProjectApi.getProject(id);
            this.SET_CURRENT_PROJECT(response.data);
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async createProject(projectData: ProjectForm): Promise<Project> {
        const response = await ProjectApi.createProject(projectData);
        this.ADD_PROJECT(response.data);
        return response.data;
    }

    @Action
    async updateProject({
        id,
        data,
    }: {
        id: number;
        data: Partial<ProjectForm>;
    }): Promise<Project> {
        const response = await ProjectApi.updateProject(id, data);
        this.UPDATE_PROJECT(response.data);
        return response.data;
    }

    @Action
    async deleteProject(id: number): Promise<void> {
        await ProjectApi.deleteProject(id);
        this.REMOVE_PROJECT(id);
    }

    @Action
    async addMember({ projectId, userId }: { projectId: number; userId: number }): Promise<void> {
        const response = await ProjectApi.addMember(projectId, userId);
        this.UPDATE_PROJECT(response.data);
    }

    @Action
    async removeMember({
        projectId,
        userId,
    }: {
        projectId: number;
        userId: number;
    }): Promise<void> {
        const response = await ProjectApi.removeMember(projectId, userId);
        this.UPDATE_PROJECT(response.data);
    }
}

// 任务模块状态
interface TaskState {
    tasks: Task[];
    currentTask: Task | null;
    isLoading: boolean;
    filters: {
        projectId?: number;
        status?: TaskStatus;
        assigneeId?: number;
        priority?: TaskPriority;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 任务模块
@Module({ namespaced: true })
class TaskModule extends VuexModule implements TaskState {
    tasks: Task[] = [];
    currentTask: Task | null = null;
    isLoading: boolean = false;
    filters: TaskState["filters"] = {};
    pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    };

    // Getters
    get filteredTasks(): Task[] {
        return this.tasks.filter((task) => {
            if (this.filters.projectId && task.projectId !== this.filters.projectId) return false;
            if (this.filters.status && task.status !== this.filters.status) return false;
            if (this.filters.assigneeId && task.assigneeId !== this.filters.assigneeId)
                return false;
            if (this.filters.priority && task.priority !== this.filters.priority) return false;
            return true;
        });
    }

    get tasksByStatus() {
        return (status: TaskStatus): Task[] => {
            return this.tasks.filter((task) => task.status === status);
        };
    }

    get tasksByProject() {
        return (projectId: number): Task[] => {
            return this.tasks.filter((task) => task.projectId === projectId);
        };
    }

    get tasksByAssignee() {
        return (assigneeId: number): Task[] => {
            return this.tasks.filter((task) => task.assigneeId === assigneeId);
        };
    }

    get overdueTasks(): Task[] {
        const now = new Date();
        return this.tasks.filter((task) => {
            if (!task.dueDate || task.status === TaskStatus.DONE) return false;
            return new Date(task.dueDate) < now;
        });
    }

    get taskStats(): {
        total: number;
        todo: number;
        inProgress: number;
        review: number;
        done: number;
    } {
        return {
            total: this.tasks.length,
            todo: this.tasksByStatus(TaskStatus.TODO).length,
            inProgress: this.tasksByStatus(TaskStatus.IN_PROGRESS).length,
            review: this.tasksByStatus(TaskStatus.REVIEW).length,
            done: this.tasksByStatus(TaskStatus.DONE).length,
        };
    }

    // Mutations
    @Mutation
    SET_TASKS(tasks: Task[]): void {
        this.tasks = tasks;
    }

    @Mutation
    SET_CURRENT_TASK(task: Task | null): void {
        this.currentTask = task;
    }

    @Mutation
    ADD_TASK(task: Task): void {
        this.tasks.push(task);
    }

    @Mutation
    UPDATE_TASK(updatedTask: Task): void {
        const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
        if (index > -1) {
            this.tasks.splice(index, 1, updatedTask);
        }
    }

    @Mutation
    REMOVE_TASK(taskId: number): void {
        const index = this.tasks.findIndex((t) => t.id === taskId);
        if (index > -1) {
            this.tasks.splice(index, 1);
        }
    }

    @Mutation
    SET_LOADING(loading: boolean): void {
        this.isLoading = loading;
    }

    @Mutation
    SET_FILTERS(filters: TaskState["filters"]): void {
        this.filters = { ...this.filters, ...filters };
    }

    @Mutation
    CLEAR_FILTERS(): void {
        this.filters = {};
    }

    @Mutation
    SET_PAGINATION(pagination: TaskState["pagination"]): void {
        this.pagination = pagination;
    }

    // Actions
    @Action
    async fetchTasks(params?: {
        page?: number;
        limit?: number;
        projectId?: number;
        status?: TaskStatus;
        assigneeId?: number;
    }): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await TaskApi.getTasks(params);
            this.SET_TASKS(response.data);
            this.SET_PAGINATION(response.pagination);
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async fetchTask(id: number): Promise<void> {
        this.SET_LOADING(true);
        try {
            const response = await TaskApi.getTask(id);
            this.SET_CURRENT_TASK(response.data);
        } finally {
            this.SET_LOADING(false);
        }
    }

    @Action
    async createTask(taskData: TaskForm & { projectId: number }): Promise<Task> {
        const response = await TaskApi.createTask(taskData);
        this.ADD_TASK(response.data);
        return response.data;
    }

    @Action
    async updateTask({ id, data }: { id: number; data: Partial<TaskForm> }): Promise<Task> {
        const response = await TaskApi.updateTask(id, data);
        this.UPDATE_TASK(response.data);
        return response.data;
    }

    @Action
    async deleteTask(id: number): Promise<void> {
        await TaskApi.deleteTask(id);
        this.REMOVE_TASK(id);
    }

    @Action
    async updateTaskStatus({ id, status }: { id: number; status: TaskStatus }): Promise<Task> {
        const response = await TaskApi.updateTaskStatus(id, status);
        this.UPDATE_TASK(response.data);
        return response.data;
    }

    @Action
    async assignTask({ id, assigneeId }: { id: number; assigneeId: number }): Promise<Task> {
        const response = await TaskApi.assignTask(id, assigneeId);
        this.UPDATE_TASK(response.data);
        return response.data;
    }

    @Action
    setFilters(filters: TaskState["filters"]): void {
        this.SET_FILTERS(filters);
    }

    @Action
    clearFilters(): void {
        this.CLEAR_FILTERS();
    }
}

// ============================================================================
// 5. Vue 组件示例
// ============================================================================

console.log("=== 5. Vue 组件示例 ===");

// 模拟 Vue 相关导入
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

// 获取 Vuex 模块
const authModule = namespace("auth");
const projectModule = namespace("projects");
const taskModule = namespace("tasks");

// 任务卡片组件
@Component
class TaskCard extends Vue {
    @Prop({ type: Object, required: true })
    task!: Task;

    @Prop({ type: Object })
    assignee?: User;

    @Prop({ type: Boolean, default: true })
    showActions!: boolean;

    @Prop({ type: Boolean, default: false })
    draggable!: boolean;

    // 计算属性
    get priorityClass(): string {
        const classMap = {
            [TaskPriority.LOW]: "priority-low",
            [TaskPriority.MEDIUM]: "priority-medium",
            [TaskPriority.HIGH]: "priority-high",
            [TaskPriority.URGENT]: "priority-urgent",
        };
        return classMap[this.task.priority];
    }

    get statusClass(): string {
        const classMap = {
            [TaskStatus.TODO]: "status-todo",
            [TaskStatus.IN_PROGRESS]: "status-progress",
            [TaskStatus.REVIEW]: "status-review",
            [TaskStatus.DONE]: "status-done",
        };
        return classMap[this.task.status];
    }

    get isOverdue(): boolean {
        if (!this.task.dueDate || this.task.status === TaskStatus.DONE) return false;
        return new Date(this.task.dueDate) < new Date();
    }

    get dueDateText(): string {
        if (!this.task.dueDate) return "";

        const dueDate = new Date(this.task.dueDate);
        const now = new Date();
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `逾期 ${Math.abs(diffDays)} 天`;
        if (diffDays === 0) return "今天到期";
        if (diffDays === 1) return "明天到期";
        return `${diffDays} 天后到期`;
    }

    get priorityText(): string {
        const textMap = {
            [TaskPriority.LOW]: "低",
            [TaskPriority.MEDIUM]: "中",
            [TaskPriority.HIGH]: "高",
            [TaskPriority.URGENT]: "紧急",
        };
        return textMap[this.task.priority];
    }

    get statusText(): string {
        const textMap = {
            [TaskStatus.TODO]: "待办",
            [TaskStatus.IN_PROGRESS]: "进行中",
            [TaskStatus.REVIEW]: "待审核",
            [TaskStatus.DONE]: "已完成",
        };
        return textMap[this.task.status];
    }

    // 事件处理
    @Emit("click")
    handleClick(): Task {
        return this.task;
    }

    @Emit("edit")
    handleEdit(): Task {
        return this.task;
    }

    @Emit("delete")
    handleDelete(): Task {
        return this.task;
    }

    @Emit("status-change")
    handleStatusChange(newStatus: TaskStatus): { task: Task; status: TaskStatus } {
        return { task: this.task, status: newStatus };
    }

    @Emit("assign")
    handleAssign(assigneeId: number): { task: Task; assigneeId: number } {
        return { task: this.task, assigneeId };
    }

    // 拖拽事件
    @Emit("drag-start")
    handleDragStart(event: DragEvent): Task {
        if (event.dataTransfer) {
            event.dataTransfer.setData("text/plain", this.task.id.toString());
        }
        return this.task;
    }

    @Emit("drag-end")
    handleDragEnd(): Task {
        return this.task;
    }

    // 格式化日期
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("zh-CN");
    }

    // 获取优先级颜色
    getPriorityColor(): string {
        const colorMap = {
            [TaskPriority.LOW]: "#52c41a",
            [TaskPriority.MEDIUM]: "#faad14",
            [TaskPriority.HIGH]: "#fa8c16",
            [TaskPriority.URGENT]: "#f5222d",
        };
        return colorMap[this.task.priority];
    }
}

// 任务看板组件
@Component({
    components: { TaskCard },
})
class TaskBoard extends Vue {
    @Prop({ type: Number, required: true })
    projectId!: number;

    @taskModule.State
    tasks!: Task[];

    @taskModule.State
    isLoading!: boolean;

    @taskModule.Getter
    tasksByStatus!: (status: TaskStatus) => Task[];

    @taskModule.Action
    fetchTasks!: (params?: any) => Promise<void>;

    @taskModule.Action
    updateTaskStatus!: (params: { id: number; status: TaskStatus }) => Promise<Task>;

    // 组件状态
    private draggedTask: Task | null = null;

    // 生命周期
    async mounted(): Promise<void> {
        await this.loadTasks();
    }

    // 计算属性
    get todoTasks(): Task[] {
        return this.tasksByStatus(TaskStatus.TODO);
    }

    get inProgressTasks(): Task[] {
        return this.tasksByStatus(TaskStatus.IN_PROGRESS);
    }

    get reviewTasks(): Task[] {
        return this.tasksByStatus(TaskStatus.REVIEW);
    }

    get doneTasks(): Task[] {
        return this.tasksByStatus(TaskStatus.DONE);
    }

    get columns(): Array<{ status: TaskStatus; title: string; tasks: Task[] }> {
        return [
            { status: TaskStatus.TODO, title: "待办", tasks: this.todoTasks },
            { status: TaskStatus.IN_PROGRESS, title: "进行中", tasks: this.inProgressTasks },
            { status: TaskStatus.REVIEW, title: "待审核", tasks: this.reviewTasks },
            { status: TaskStatus.DONE, title: "已完成", tasks: this.doneTasks },
        ];
    }

    // 方法
    async loadTasks(): Promise<void> {
        await this.fetchTasks({ projectId: this.projectId });
    }

    // 拖拽处理
    handleDragStart(task: Task): void {
        this.draggedTask = task;
    }

    handleDragEnd(): void {
        this.draggedTask = null;
    }

    handleDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    async handleDrop(event: DragEvent, targetStatus: TaskStatus): Promise<void> {
        event.preventDefault();

        if (!this.draggedTask || this.draggedTask.status === targetStatus) return;

        try {
            await this.updateTaskStatus({
                id: this.draggedTask.id,
                status: targetStatus,
            });
        } catch (error) {
            console.error("更新任务状态失败:", error);
        }
    }

    // 任务事件处理
    @Emit("task-click")
    handleTaskClick(task: Task): Task {
        return task;
    }

    @Emit("task-edit")
    handleTaskEdit(task: Task): Task {
        return task;
    }

    @Emit("task-delete")
    handleTaskDelete(task: Task): Task {
        return task;
    }

    async handleTaskStatusChange({
        task,
        status,
    }: {
        task: Task;
        status: TaskStatus;
    }): Promise<void> {
        try {
            await this.updateTaskStatus({ id: task.id, status });
        } catch (error) {
            console.error("更新任务状态失败:", error);
        }
    }
}

// 任务表单组件
@Component
class TaskForm extends Vue {
    @Prop({ type: Object })
    initialTask?: Task;

    @Prop({ type: Number, required: true })
    projectId!: number;

    @Prop({ type: Array, default: () => [] })
    users!: User[];

    @Prop({ type: Boolean, default: false })
    loading!: boolean;

    // 表单数据
    private form: TaskForm = {
        title: "",
        description: "",
        priority: TaskPriority.MEDIUM,
        assigneeId: undefined,
        dueDate: undefined,
    };

    private errors: Record<string, string> = {};

    // 监听初始任务变化
    @Watch("initialTask", { immediate: true })
    onInitialTaskChanged(task?: Task): void {
        if (task) {
            this.form = {
                title: task.title,
                description: task.description,
                priority: task.priority,
                assigneeId: task.assigneeId,
                dueDate: task.dueDate,
            };
        }
    }

    // 计算属性
    get isEditing(): boolean {
        return !!this.initialTask;
    }

    get submitButtonText(): string {
        return this.isEditing ? "更新任务" : "创建任务";
    }

    get priorityOptions(): Array<{ value: TaskPriority; label: string }> {
        return [
            { value: TaskPriority.LOW, label: "低" },
            { value: TaskPriority.MEDIUM, label: "中" },
            { value: TaskPriority.HIGH, label: "高" },
            { value: TaskPriority.URGENT, label: "紧急" },
        ];
    }

    get assigneeOptions(): Array<{ value: number; label: string }> {
        return this.users.map((user) => ({
            value: user.id,
            label: user.username,
        }));
    }

    // 表单验证
    validateForm(): boolean {
        this.errors = {};

        if (!this.form.title.trim()) {
            this.errors.title = "任务标题不能为空";
        }

        if (this.form.title.length > 100) {
            this.errors.title = "任务标题不能超过100个字符";
        }

        if (this.form.description && this.form.description.length > 500) {
            this.errors.description = "任务描述不能超过500个字符";
        }

        if (this.form.dueDate) {
            const dueDate = new Date(this.form.dueDate);
            const now = new Date();
            if (dueDate < now) {
                this.errors.dueDate = "截止日期不能早于当前时间";
            }
        }

        return Object.keys(this.errors).length === 0;
    }

    // 事件处理
    @Emit("submit")
    handleSubmit(): TaskForm | null {
        if (this.validateForm()) {
            return { ...this.form };
        }
        return null;
    }

    @Emit("cancel")
    handleCancel(): void {
        this.resetForm();
    }

    // 重置表单
    resetForm(): void {
        this.form = {
            title: "",
            description: "",
            priority: TaskPriority.MEDIUM,
            assigneeId: undefined,
            dueDate: undefined,
        };
        this.errors = {};
    }

    // 获取字段错误
    getFieldError(field: string): string | null {
        return this.errors[field] || null;
    }

    // 检查字段是否有错误
    hasFieldError(field: string): boolean {
        return !!this.errors[field];
    }
}

// ============================================================================
// 6. 工具函数和类型守卫
// ============================================================================

console.log("=== 6. 工具函数和类型守卫 ===");

// 类型守卫
function isUser(obj: any): obj is User {
    return (
        obj &&
        typeof obj.id === "number" &&
        typeof obj.username === "string" &&
        typeof obj.email === "string" &&
        Object.values(UserRole).includes(obj.role)
    );
}

function isTask(obj: any): obj is Task {
    return (
        obj &&
        typeof obj.id === "number" &&
        typeof obj.title === "string" &&
        Object.values(TaskStatus).includes(obj.status) &&
        Object.values(TaskPriority).includes(obj.priority)
    );
}

function isProject(obj: any): obj is Project {
    return (
        obj &&
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        Object.values(ProjectStatus).includes(obj.status)
    );
}

// 日期工具函数
class DateUtils {
    // 格式化日期
    static formatDate(date: Date | string, format: string = "YYYY-MM-DD"): string {
        const d = typeof date === "string" ? new Date(date) : date;

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");

        return format
            .replace("YYYY", year.toString())
            .replace("MM", month)
            .replace("DD", day)
            .replace("HH", hours)
            .replace("mm", minutes)
            .replace("ss", seconds);
    }

    // 计算相对时间
    static getRelativeTime(date: Date | string): string {
        const d = typeof date === "string" ? new Date(date) : date;
        const now = new Date();
        const diffTime = now.getTime() - d.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffDays > 0) return `${diffDays}天前`;
        if (diffHours > 0) return `${diffHours}小时前`;
        if (diffMinutes > 0) return `${diffMinutes}分钟前`;
        return "刚刚";
    }

    // 检查是否为今天
    static isToday(date: Date | string): boolean {
        const d = typeof date === "string" ? new Date(date) : date;
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }

    // 检查是否逾期
    static isOverdue(date: Date | string): boolean {
        const d = typeof date === "string" ? new Date(date) : date;
        return d < new Date();
    }
}

// 颜色工具函数
class ColorUtils {
    // 生成随机颜色
    static generateRandomColor(): string {
        const colors = [
            "#f56565",
            "#ed8936",
            "#ecc94b",
            "#48bb78",
            "#38b2ac",
            "#4299e1",
            "#667eea",
            "#9f7aea",
            "#ed64a6",
            "#a0aec0",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 根据字符串生成一致的颜色
    static getColorFromString(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    }

    // 判断颜色是否为深色
    static isDarkColor(color: string): boolean {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    }
}

// 存储工具函数
class StorageUtils {
    // 设置本地存储
    static setItem<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("设置本地存储失败:", error);
        }
    }

    // 获取本地存储
    static getItem<T>(key: string, defaultValue?: T): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue || null;
        } catch (error) {
            console.error("获取本地存储失败:", error);
            return defaultValue || null;
        }
    }

    // 移除本地存储
    static removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error("移除本地存储失败:", error);
        }
    }

    // 清空本地存储
    static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error("清空本地存储失败:", error);
        }
    }
}

// 验证工具函数
class ValidationUtils {
    // 邮箱验证
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 密码强度验证
    static isStrongPassword(password: string): boolean {
        // 至少8位，包含大小写字母、数字和特殊字符
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongRegex.test(password);
    }

    // URL验证
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // 手机号验证（中国）
    static isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
}

// 防抖和节流工具
class ThrottleUtils {
    // 防抖函数
    static debounce<T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: number;
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func(...args), delay);
        };
    }

    // 节流函数
    static throttle<T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let lastCall = 0;
        return (...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    }
}

// ============================================================================
// 7. 错误处理和日志
// ============================================================================

console.log("=== 7. 错误处理和日志 ===");

// 自定义错误类
class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        code: string = "UNKNOWN_ERROR",
        statusCode: number = 500,
        isOperational: boolean = true
    ) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

// API 错误类
class ApiError extends AppError {
    constructor(message: string, statusCode: number = 500) {
        super(message, "API_ERROR", statusCode);
        this.name = "ApiError";
    }
}

// 验证错误类
class ValidationError extends AppError {
    public readonly field: string;

    constructor(message: string, field: string) {
        super(message, "VALIDATION_ERROR", 400);
        this.name = "ValidationError";
        this.field = field;
    }
}

// 错误处理器
class ErrorHandler {
    // 处理错误
    static handle(error: Error): void {
        console.error("Error occurred:", error);

        if (error instanceof AppError) {
            this.handleAppError(error);
        } else {
            this.handleUnknownError(error);
        }
    }

    // 处理应用错误
    private static handleAppError(error: AppError): void {
        if (error.isOperational) {
            // 可操作的错误，显示给用户
            this.showErrorToUser(error.message);
        } else {
            // 程序错误，记录日志
            this.logError(error);
        }
    }

    // 处理未知错误
    private static handleUnknownError(error: Error): void {
        this.logError(error);
        this.showErrorToUser("发生了未知错误，请稍后重试");
    }

    // 显示错误给用户
    private static showErrorToUser(message: string): void {
        // 这里应该调用通知组件显示错误
        console.error("User Error:", message);
    }

    // 记录错误日志
    private static logError(error: Error): void {
        // 这里应该发送错误到日志服务
        console.error("System Error:", error);
    }
}

// 日志工具
class Logger {
    private static level: "debug" | "info" | "warn" | "error" = "info";

    static setLevel(level: "debug" | "info" | "warn" | "error"): void {
        this.level = level;
    }

    static debug(message: string, ...args: any[]): void {
        if (this.shouldLog("debug")) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    static info(message: string, ...args: any[]): void {
        if (this.shouldLog("info")) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    static warn(message: string, ...args: any[]): void {
        if (this.shouldLog("warn")) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    static error(message: string, ...args: any[]): void {
        if (this.shouldLog("error")) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }

    private static shouldLog(level: string): boolean {
        const levels = ["debug", "info", "warn", "error"];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }
}

// ============================================================================
// 8. 项目实战总结
// ============================================================================

console.log(`
🎉 第9章项目实战示例完成！

📚 本示例展示了一个完整的任务管理系统，包含：

🏗️ 架构设计：
✅ 完整的类型定义系统
✅ 模块化的 API 客户端
✅ 类型安全的 Vuex 状态管理
✅ 可复用的 Vue 组件

🔧 核心功能：
✅ 用户认证和权限管理
✅ 项目和任务管理
✅ 实时状态更新
✅ 拖拽式任务看板

🛠️ 工具函数：
✅ 类型守卫和验证
✅ 日期和颜色工具
✅ 本地存储管理
✅ 防抖和节流

🚨 错误处理：
✅ 自定义错误类
✅ 统一错误处理
✅ 日志记录系统

💡 最佳实践：
- 严格的类型安全
- 模块化设计
- 错误边界处理
- 性能优化
- 代码复用

这个示例整合了前面所有章节的知识点，展示了如何在实际项目中
应用 TypeScript + Vue 2 的最佳实践。

🎯 关键要点：
1. 类型定义是项目的基础
2. API 设计要考虑类型安全
3. 状态管理需要良好的架构
4. 组件设计要注重复用性
5. 错误处理要全面覆盖
6. 工具函数要类型安全
`);
