#!/usr/bin/env node

/**
 * TypeScript 学习项目设置脚本
 *
 * 这个脚本帮助用户快速设置学习环境
 * 运行命令：node scripts/setup.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 TypeScript 学习项目设置开始...\n");

// 检查 Node.js 版本
function checkNodeVersion() {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

    console.log(`📋 检查 Node.js 版本: ${nodeVersion}`);

    if (majorVersion < 16) {
        console.error("❌ 错误: 需要 Node.js v16 或更高版本");
        console.error("   请访问 https://nodejs.org/ 下载最新版本");
        process.exit(1);
    }

    console.log("✅ Node.js 版本检查通过\n");
}

// 检查必要的文件
function checkRequiredFiles() {
    console.log("📋 检查项目文件...");

    const requiredFiles = [
        "package.json",
        "tsconfig.json",
        "chapters/chapter-01-basics/README.md",
        "chapters/chapter-01-basics/examples.ts",
    ];

    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            console.error(`❌ 错误: 缺少必要文件 ${file}`);
            process.exit(1);
        }
    }

    console.log("✅ 项目文件检查通过\n");
}

// 安装依赖
function installDependencies() {
    console.log("📦 安装项目依赖...");

    try {
        // 检查是否已经安装了依赖
        if (fs.existsSync("node_modules")) {
            console.log("📦 依赖已存在，跳过安装");
            return;
        }

        console.log("📦 正在安装依赖，请稍候...");
        execSync("npm install", { stdio: "inherit" });
        console.log("✅ 依赖安装完成\n");
    } catch (error) {
        console.error("❌ 依赖安装失败:", error.message);
        console.error("   请手动运行: npm install");
        process.exit(1);
    }
}

// 验证 TypeScript 安装
function verifyTypeScript() {
    console.log("📋 验证 TypeScript 安装...");

    try {
        const tsVersion = execSync("npx tsc --version", { encoding: "utf8" }).trim();
        console.log(`✅ TypeScript 版本: ${tsVersion}\n`);
    } catch (error) {
        console.error("❌ TypeScript 验证失败:", error.message);
        process.exit(1);
    }
}

// 运行第一个示例
function runFirstExample() {
    console.log("🎯 运行第一个 TypeScript 示例...");

    try {
        console.log("📝 编译并运行 chapter-01-basics/examples.ts:\n");
        console.log("=".repeat(50));

        execSync("npx ts-node chapters/chapter-01-basics/examples.ts", {
            stdio: "inherit",
            cwd: process.cwd(),
        });

        console.log("=".repeat(50));
        console.log("✅ 第一个示例运行成功！\n");
    } catch (error) {
        console.error("❌ 示例运行失败:", error.message);
        console.error("   请检查代码是否有语法错误");
    }
}

// 运行测试
function runTests() {
    console.log("🧪 运行测试验证...");

    try {
        console.log("🧪 运行第一章测试:\n");
        execSync("npm test -- chapters/chapter-01-basics/examples.test.ts", {
            stdio: "inherit",
        });
        console.log("✅ 测试通过！\n");
    } catch (error) {
        console.error("❌ 测试失败:", error.message);
        console.error("   这可能是正常的，请检查测试输出");
    }
}

// 显示下一步指引
function showNextSteps() {
    console.log("🎉 设置完成！下一步指引:\n");

    console.log("📚 开始学习:");
    console.log("   1. 阅读项目 README.md 了解整体结构");
    console.log("   2. 查看 docs/quick-start.md 快速开始指南");
    console.log("   3. 从第1章开始学习: chapters/chapter-01-basics/README.md\n");

    console.log("🛠️  常用命令:");
    console.log("   npm run build          # 编译 TypeScript");
    console.log("   npm test               # 运行测试");
    console.log("   npm run lint           # 代码检查");
    console.log("   npx ts-node file.ts    # 直接运行 TypeScript 文件\n");

    console.log("📖 学习建议:");
    console.log("   - 每章都要动手实践，不要只看理论");
    console.log("   - 完成每章的练习题目");
    console.log("   - 在 docs/learning-progress.md 中记录学习进度");
    console.log("   - 遇到问题可以查看 solutions.ts 文件\n");

    console.log("🎯 学习路径:");
    console.log("   完整学习: 第1章 → 第2章 → ... → 第9章 (推荐)");
    console.log("   Vue开发者: 第1-3章 → 第7-9章");
    console.log("   迁移导向: 第1-4章\n");

    console.log("🚀 准备好开始你的 TypeScript 学习之旅了吗？");
    console.log("   从这里开始: chapters/chapter-01-basics/README.md\n");
}

// 主函数
function main() {
    try {
        checkNodeVersion();
        checkRequiredFiles();
        installDependencies();
        verifyTypeScript();
        runFirstExample();
        runTests();
        showNextSteps();

        console.log("✨ 设置完成！祝你学习愉快！ ✨");
    } catch (error) {
        console.error("\n❌ 设置过程中出现错误:", error.message);
        console.error("   请检查错误信息并重试");
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = {
    checkNodeVersion,
    checkRequiredFiles,
    installDependencies,
    verifyTypeScript,
    runFirstExample,
    runTests,
    showNextSteps,
};
