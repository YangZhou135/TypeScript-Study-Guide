module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        // 暂时注释掉，避免配置问题
        // "@typescript-eslint/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    rules: {
        // 通用规则
        "no-console": "off", // 学习项目允许 console
        "prefer-const": "error",
        "no-var": "error",
        "no-unused-vars": "off", // 关闭，使用 TypeScript 的检查
        
        // 注释规范
        "spaced-comment": ["error", "always", { markers: ["/"] }],
    },
    ignorePatterns: ["dist/", "node_modules/", "*.d.ts", "*.js"],
};
