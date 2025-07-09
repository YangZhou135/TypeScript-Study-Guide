/**
 * 第7章：Vue 2 + TypeScript 项目集成练习题
 *
 * 请完成以下练习，掌握在 Vue 2 项目中使用 TypeScript 的方法
 * 包括组件类型定义、Vuex 状态管理、Vue Router 等
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：Vue 组件类型定义练习
// ============================================================================

console.log("=== 练习1：Vue 组件类型定义练习 ===");

// TODO: 定义以下类型和组件

// 1. 定义产品数据类型
// interface Product {
//     // TODO: 定义产品属性
// }

// 2. 定义组件 Props 类型
// interface ProductCardProps {
//     // TODO: 定义组件属性
// }

// 3. 定义组件 Data 类型
// interface ProductCardData {
//     // TODO: 定义组件数据
// }

// 4. 实现 ProductCard 组件（选项式 API）
// const ProductCardComponent = {
//     name: 'ProductCard',
//
//     // TODO: 定义 props
//     props: {
//         // TODO: 实现
//     },
//
//     // TODO: 定义 data
//     data(): ProductCardData {
//         // TODO: 实现
//     },
//
//     // TODO: 定义 computed
//     computed: {
//         // TODO: 实现价格格式化、库存状态等计算属性
//     },
//
//     // TODO: 定义 methods
//     methods: {
//         // TODO: 实现添加到购物车、查看详情等方法
//     },
//
//     // TODO: 定义生命周期钩子
//     created() {
//         // TODO: 实现
//     }
// };

// TODO: 测试组件
// const testProduct: Product = {
//     // TODO: 创建测试产品数据
// };

console.log("Vue 组件类型定义练习 - 请实现上述组件");

// ============================================================================
// 练习2：Vuex 状态管理练习
// ============================================================================

console.log("\n=== 练习2：Vuex 状态管理练习 ===");

// TODO: 定义购物车状态管理

// 1. 定义购物车项目类型
// interface CartItem {
//     // TODO: 定义购物车项目属性
// }

// 2. 定义购物车状态类型
// interface CartState {
//     // TODO: 定义购物车状态
// }

// 3. 定义 Mutation 类型
// type CartMutations = {
//     // TODO: 定义购物车相关的 mutations
// };

// 4. 定义 Action 类型
// interface CartActions {
//     // TODO: 定义购物车相关的 actions
// }

// 5. 定义 Getter 类型
// interface CartGetters {
//     // TODO: 定义购物车相关的 getters
// }

// 6. 实现购物车 Vuex 模块
// const cartModule = {
//     namespaced: true,
//
//     state: (): CartState => ({
//         // TODO: 实现初始状态
//     }),
//
//     mutations: {
//         // TODO: 实现 mutations
//     } as CartMutations,
//
//     actions: {
//         // TODO: 实现 actions
//     } as CartActions,
//
//     getters: {
//         // TODO: 实现 getters
//     } as CartGetters
// };

console.log("Vuex 状态管理练习 - 请实现购物车模块");

// ============================================================================
// 练习3：Vue Router 类型定义练习
// ============================================================================

console.log("\n=== 练习3：Vue Router 类型定义练习 ===");

// TODO: 定义电商网站的路由配置

// 1. 定义路由元信息类型
// interface RouteMeta {
//     // TODO: 定义路由元信息
// }

// 2. 定义路由配置类型
// interface RouteConfig {
//     // TODO: 定义路由配置
// }

// 3. 定义电商网站路由
// const ecommerceRoutes: RouteConfig[] = [
//     // TODO: 定义以下路由：
//     // - 首页 (/)
//     // - 产品列表 (/products)
//     // - 产品详情 (/products/:id)
//     // - 购物车 (/cart)
//     // - 用户中心 (/profile)
//     // - 订单列表 (/orders)
//     // - 登录 (/login)
//     // - 注册 (/register)
// ];

// 4. 定义路由守卫
// const authGuard = (to: any, from: any, next: any) => {
//     // TODO: 实现认证守卫
// };

// const guestGuard = (to: any, from: any, next: any) => {
//     // TODO: 实现访客守卫（已登录用户不能访问登录页）
// };

// 5. 定义路由器配置
// const routerConfig = {
//     // TODO: 实现路由器配置
// };

console.log("Vue Router 类型定义练习 - 请实现电商路由");

// ============================================================================
// 练习4：Vue 插件开发练习
// ============================================================================

console.log("\n=== 练习4：Vue 插件开发练习 ===");

// TODO: 开发一个通知插件

// 1. 定义通知类型
// interface Notification {
//     // TODO: 定义通知属性
// }

// 2. 定义通知选项类型
// interface NotificationOptions {
//     // TODO: 定义通知选项
// }

// 3. 定义插件类型
// interface NotificationPlugin {
//     // TODO: 定义插件接口
// }

// 4. 实现通知插件
// const NotificationPlugin: NotificationPlugin = {
//     install(Vue: any, options?: any) {
//         // TODO: 实现插件安装逻辑
//
//         // 添加全局方法
//         Vue.prototype.$notify = {
//             // TODO: 实现通知方法
//         };
//
//         // 添加全局组件
//         Vue.component('Notification', {
//             // TODO: 实现通知组件
//         });
//     }
// };

// 5. 定义 Vue 实例类型扩展
// declare module 'vue/types/vue' {
//     interface Vue {
//         $notify: {
//             // TODO: 定义通知方法类型
//         };
//     }
// }

console.log("Vue 插件开发练习 - 请实现通知插件");

// ============================================================================
// 练习5：Vue 混入练习
// ============================================================================

console.log("\n=== 练习5：Vue 混入练习 ===");

// TODO: 实现常用的混入

// 1. 实现表单验证混入
// interface FormValidationMixin {
//     // TODO: 定义混入接口
// }

// const formValidationMixin: FormValidationMixin = {
//     // TODO: 实现表单验证混入
// };

// 2. 实现分页混入
// interface PaginationMixin {
//     // TODO: 定义分页混入接口
// }

// const paginationMixin: PaginationMixin = {
//     // TODO: 实现分页混入
// };

// 3. 实现权限检查混入
// interface PermissionMixin {
//     // TODO: 定义权限混入接口
// }

// const permissionMixin: PermissionMixin = {
//     // TODO: 实现权限检查混入
// };

// 4. 使用混入的组件示例
// const UserManagementComponent = {
//     name: 'UserManagement',
//
//     // TODO: 使用多个混入
//     mixins: [
//         // TODO: 添加混入
//     ],
//
//     // TODO: 实现组件逻辑
// };

console.log("Vue 混入练习 - 请实现常用混入");

// ============================================================================
// 练习6：综合应用练习
// ============================================================================

console.log("\n=== 练习6：综合应用练习 ===");

// 场景：实现一个完整的用户管理页面

// TODO: 综合运用前面的知识，实现以下功能：

// 1. 用户列表组件
// const UserListComponent = {
//     // TODO: 实现用户列表组件
//     // 要求：
//     // - 使用 TypeScript 类型定义
//     // - 集成 Vuex 状态管理
//     // - 支持分页和搜索
//     // - 包含用户操作（编辑、删除）
// };

// 2. 用户表单组件
// const UserFormComponent = {
//     // TODO: 实现用户表单组件
//     // 要求：
//     // - 支持新增和编辑模式
//     // - 表单验证
//     // - 类型安全的表单数据
// };

// 3. 用户详情组件
// const UserDetailComponent = {
//     // TODO: 实现用户详情组件
//     // 要求：
//     // - 从路由参数获取用户ID
//     // - 显示用户详细信息
//     // - 支持编辑跳转
// };

// 4. 用户管理页面路由配置
// const userManagementRoutes = [
//     // TODO: 配置用户管理相关路由
// ];

// 5. 用户管理 Vuex 模块
// const userManagementModule = {
//     // TODO: 实现完整的用户管理状态
// };

console.log("综合应用练习 - 请实现完整的用户管理功能");

console.log("\n=== 练习完成！请检查 Vue + TypeScript 集成是否正确 ===");
console.log("💡 提示：");
console.log("1. 在实际项目中需要安装相应的 Vue 2 依赖包");
console.log("2. 配置 tsconfig.json 以支持 Vue 文件");
console.log("3. 创建 shims-vue.d.ts 文件声明 .vue 文件类型");
console.log("4. 使用 vue-class-component 可以获得更好的 TypeScript 支持");
