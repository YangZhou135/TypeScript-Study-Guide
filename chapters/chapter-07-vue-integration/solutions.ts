/**
 * 第7章：Vue 2 + TypeScript 项目集成练习题解答
 *
 * 这里提供了 practice.ts 中所有练习题的正确答案
 * 展示了在 Vue 2 项目中正确使用 TypeScript 的方法
 */

// 将此文件作为模块，避免全局作用域冲突
export {};

// ============================================================================
// 练习1：Vue 组件类型定义练习 - 解答
// ============================================================================

console.log("=== 练习1：Vue 组件类型定义练习 - 解答 ===");

// 1. 定义产品数据类型
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
    inStock: boolean;
    stockCount: number;
    rating: number;
    tags: string[];
    createdAt: Date;
}

// 2. 定义组件 Props 类型
interface ProductCardProps {
    product: Product;
    showActions: boolean;
    size: "small" | "medium" | "large";
    discount?: number;
}

// 3. 定义组件 Data 类型
interface ProductCardData {
    loading: boolean;
    error: string | null;
    quantity: number;
    isFavorite: boolean;
}

// 4. 实现 ProductCard 组件（选项式 API）
const ProductCardComponent = {
    name: "ProductCard",

    props: {
        product: {
            type: Object as () => Product,
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
        discount: {
            type: Number,
            default: 0,
            validator: (value: number) => value >= 0 && value <= 1,
        },
    },

    data(): ProductCardData {
        return {
            loading: false,
            error: null,
            quantity: 1,
            isFavorite: false,
        };
    },

    computed: {
        formattedPrice(): string {
            const product = (this as any).product as Product;
            const discount = (this as any).discount as number;
            const finalPrice = product.price * (1 - discount);
            return `¥${finalPrice.toFixed(2)}`;
        },

        originalPrice(): string {
            const product = (this as any).product as Product;
            return `¥${product.price.toFixed(2)}`;
        },

        stockStatus(): string {
            const product = (this as any).product as Product;
            if (!product.inStock) return "缺货";
            if (product.stockCount < 10) return "库存紧张";
            return "有库存";
        },

        cardClass(): string {
            const size = (this as any).size as string;
            const product = (this as any).product as Product;
            return [
                "product-card",
                `product-card--${size}`,
                !product.inStock ? "product-card--out-of-stock" : "",
            ]
                .filter(Boolean)
                .join(" ");
        },

        hasDiscount(): boolean {
            const discount = (this as any).discount as number;
            return discount > 0;
        },
    },

    methods: {
        addToCart(): void {
            const product = (this as any).product as Product;
            const quantity = (this as any).quantity as number;

            if (!product.inStock) {
                (this as any).error = "商品缺货，无法添加到购物车";
                return;
            }

            console.log(`添加到购物车: ${product.name} x ${quantity}`);
            // this.$emit('add-to-cart', { product, quantity });
        },

        viewDetails(): void {
            const product = (this as any).product as Product;
            console.log(`查看商品详情: ${product.name}`);
            // this.$emit('view-details', product.id);
        },

        toggleFavorite(): void {
            const data = this as any;
            data.isFavorite = !data.isFavorite;
            const product = data.product as Product;
            console.log(
                `${data.isFavorite ? "添加到" : "从"}收藏夹${data.isFavorite ? "" : "移除"}: ${product.name}`
            );
            // this.$emit('toggle-favorite', { productId: product.id, isFavorite: data.isFavorite });
        },

        updateQuantity(newQuantity: number): void {
            const data = this as any;
            const product = data.product as Product;

            if (newQuantity < 1) {
                data.quantity = 1;
            } else if (newQuantity > product.stockCount) {
                data.quantity = product.stockCount;
                data.error = `最多只能购买 ${product.stockCount} 件`;
            } else {
                data.quantity = newQuantity;
                data.error = null;
            }
        },
    },

    created(): void {
        const product = (this as any).product as Product;
        console.log(`ProductCard 组件已创建: ${product.name}`);
    },
};

// 测试组件
const testProduct: Product = {
    id: 1,
    name: "TypeScript 实战指南",
    price: 89.9,
    description: "深入学习 TypeScript 的实用指南",
    category: "书籍",
    imageUrl: "/images/typescript-guide.jpg",
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    tags: ["编程", "TypeScript", "前端"],
    createdAt: new Date(),
};

console.log("产品卡片组件已定义，测试产品:", testProduct.name);

// ============================================================================
// 练习2：Vuex 状态管理练习 - 解答
// ============================================================================

console.log("\n=== 练习2：Vuex 状态管理练习 - 解答 ===");

// 1. 定义购物车项目类型
interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    addedAt: Date;
}

// 2. 定义购物车状态类型
interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    discountCode: string | null;
    discountAmount: number;
    loading: boolean;
    error: string | null;
}

// 3. 定义 Mutation 类型
type CartMutations = {
    ADD_ITEM: (state: CartState, payload: { product: Product; quantity: number }) => void;
    REMOVE_ITEM: (state: CartState, itemId: string) => void;
    UPDATE_QUANTITY: (state: CartState, payload: { itemId: string; quantity: number }) => void;
    CLEAR_CART: (state: CartState) => void;
    SET_DISCOUNT: (state: CartState, payload: { code: string; amount: number }) => void;
    REMOVE_DISCOUNT: (state: CartState) => void;
    SET_LOADING: (state: CartState, loading: boolean) => void;
    SET_ERROR: (state: CartState, error: string | null) => void;
    CALCULATE_TOTALS: (state: CartState) => void;
};

// 4. 定义 Action 类型
interface CartActions {
    addToCart: (context: any, payload: { product: Product; quantity: number }) => Promise<void>;
    removeFromCart: (context: any, itemId: string) => Promise<void>;
    updateItemQuantity: (
        context: any,
        payload: { itemId: string; quantity: number }
    ) => Promise<void>;
    clearCart: (context: any) => Promise<void>;
    applyDiscount: (context: any, discountCode: string) => Promise<void>;
    removeDiscount: (context: any) => Promise<void>;
    checkout: (context: any) => Promise<{ orderId: string; total: number }>;
}

// 5. 定义 Getter 类型
interface CartGetters {
    itemCount: (state: CartState) => number;
    subtotal: (state: CartState) => number;
    finalTotal: (state: CartState) => number;
    isEmpty: (state: CartState) => boolean;
    getItemById: (state: CartState) => (itemId: string) => CartItem | undefined;
    hasDiscount: (state: CartState) => boolean;
}

// 6. 实现购物车 Vuex 模块
const cartModule = {
    namespaced: true,

    state: (): CartState => ({
        items: [],
        totalAmount: 0,
        totalItems: 0,
        discountCode: null,
        discountAmount: 0,
        loading: false,
        error: null,
    }),

    mutations: {
        ADD_ITEM(state: CartState, payload: { product: Product; quantity: number }): void {
            const existingItem = state.items.find((item) => item.product.id === payload.product.id);

            if (existingItem) {
                existingItem.quantity += payload.quantity;
            } else {
                const newItem: CartItem = {
                    id: `cart_${Date.now()}_${payload.product.id}`,
                    product: payload.product,
                    quantity: payload.quantity,
                    addedAt: new Date(),
                };
                state.items.push(newItem);
            }
        },

        REMOVE_ITEM(state: CartState, itemId: string): void {
            const index = state.items.findIndex((item) => item.id === itemId);
            if (index > -1) {
                state.items.splice(index, 1);
            }
        },

        UPDATE_QUANTITY(state: CartState, payload: { itemId: string; quantity: number }): void {
            const item = state.items.find((item) => item.id === payload.itemId);
            if (item) {
                if (payload.quantity <= 0) {
                    const index = state.items.findIndex((item) => item.id === payload.itemId);
                    state.items.splice(index, 1);
                } else {
                    item.quantity = payload.quantity;
                }
            }
        },

        CLEAR_CART(state: CartState): void {
            state.items = [];
            state.discountCode = null;
            state.discountAmount = 0;
        },

        SET_DISCOUNT(state: CartState, payload: { code: string; amount: number }): void {
            state.discountCode = payload.code;
            state.discountAmount = payload.amount;
        },

        REMOVE_DISCOUNT(state: CartState): void {
            state.discountCode = null;
            state.discountAmount = 0;
        },

        SET_LOADING(state: CartState, loading: boolean): void {
            state.loading = loading;
        },

        SET_ERROR(state: CartState, error: string | null): void {
            state.error = error;
        },

        CALCULATE_TOTALS(state: CartState): void {
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
            );
        },
    } as CartMutations,

    actions: {
        async addToCart(
            { commit }: any,
            payload: { product: Product; quantity: number }
        ): Promise<void> {
            try {
                commit("SET_ERROR", null);

                if (!payload.product.inStock) {
                    throw new Error("商品缺货");
                }

                if (payload.quantity > payload.product.stockCount) {
                    throw new Error(`库存不足，最多只能购买 ${payload.product.stockCount} 件`);
                }

                commit("ADD_ITEM", payload);
                commit("CALCULATE_TOTALS");

                console.log(`已添加到购物车: ${payload.product.name} x ${payload.quantity}`);
            } catch (error) {
                commit("SET_ERROR", (error as Error).message);
                throw error;
            }
        },

        async removeFromCart({ commit }: any, itemId: string): Promise<void> {
            try {
                commit("REMOVE_ITEM", itemId);
                commit("CALCULATE_TOTALS");
                console.log("商品已从购物车移除");
            } catch (error) {
                commit("SET_ERROR", "移除商品失败");
                throw error;
            }
        },

        async updateItemQuantity(
            { commit }: any,
            payload: { itemId: string; quantity: number }
        ): Promise<void> {
            try {
                commit("UPDATE_QUANTITY", payload);
                commit("CALCULATE_TOTALS");
                console.log("购物车数量已更新");
            } catch (error) {
                commit("SET_ERROR", "更新数量失败");
                throw error;
            }
        },

        async clearCart({ commit }: any): Promise<void> {
            try {
                commit("CLEAR_CART");
                commit("CALCULATE_TOTALS");
                console.log("购物车已清空");
            } catch (error) {
                commit("SET_ERROR", "清空购物车失败");
                throw error;
            }
        },

        async applyDiscount({ commit }: any, discountCode: string): Promise<void> {
            commit("SET_LOADING", true);
            try {
                // 模拟验证优惠码
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const discountMap: Record<string, number> = {
                    SAVE10: 0.1,
                    SAVE20: 0.2,
                    WELCOME: 0.15,
                };

                const discountAmount = discountMap[discountCode];
                if (!discountAmount) {
                    throw new Error("无效的优惠码");
                }

                commit("SET_DISCOUNT", { code: discountCode, amount: discountAmount });
                console.log(
                    `优惠码 ${discountCode} 已应用，折扣 ${(discountAmount * 100).toFixed(0)}%`
                );
            } catch (error) {
                commit("SET_ERROR", (error as Error).message);
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async checkout({ commit, state }: any): Promise<{ orderId: string; total: number }> {
            commit("SET_LOADING", true);
            try {
                if (state.items.length === 0) {
                    throw new Error("购物车为空");
                }

                // 模拟结算过程
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const orderId = `ORDER_${Date.now()}`;
                const total = state.totalAmount * (1 - state.discountAmount);

                commit("CLEAR_CART");
                commit("CALCULATE_TOTALS");

                console.log(`订单创建成功: ${orderId}, 总金额: ¥${total.toFixed(2)}`);
                return { orderId, total };
            } catch (error) {
                commit("SET_ERROR", (error as Error).message);
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },
    } as CartActions,

    getters: {
        itemCount: (state: CartState): number => {
            return state.totalItems;
        },

        subtotal: (state: CartState): number => {
            return state.totalAmount;
        },

        finalTotal: (state: CartState): number => {
            return state.totalAmount * (1 - state.discountAmount);
        },

        isEmpty: (state: CartState): boolean => {
            return state.items.length === 0;
        },

        getItemById:
            (state: CartState) =>
            (itemId: string): CartItem | undefined => {
                return state.items.find((item) => item.id === itemId);
            },

        hasDiscount: (state: CartState): boolean => {
            return state.discountCode !== null && state.discountAmount > 0;
        },
    } as CartGetters,
};

console.log("购物车 Vuex 模块已定义");

console.log("\n=== 解答完成！ ===");
console.log("💡 学习要点:");
console.log("1. Vue 组件的 TypeScript 类型定义提供了完整的类型安全");
console.log("2. Vuex 状态管理的类型定义确保了状态操作的类型安全");
console.log("3. 合理的类型设计让代码更易维护和调试");
console.log("4. Vue + TypeScript 的组合提供了优秀的开发体验");
