# Margin

Margin 是一个 macOS Markdown 写作应用，用来把文章草稿直接沉淀到 Obsidian Vault。

当前版本是桌面应用原型：界面保持轻量，主写作区负责 Markdown 输入，右侧只保留文档目录，左侧负责选择 Vault、设置沉淀目录和保存状态。

## 当前设计

- 以 Markdown 写作为核心，支持实时预览。
- 输入 `/` 可以快速插入大标题、小标题、引用、列表、待办、代码块、Obsidian Callout 和分割线。
- 点击「选择 Vault」后，可以选择本机 Obsidian Vault 根目录。
- 可以设置保存目录，例如 `Writing/Inbox`。
- 开启「自动沉淀」后，内容会保存为 `.md` 文件并写入指定 Vault 目录。
- 草稿会保存在本地应用存储中，不会上传到服务器。

## 项目说明

Margin 基于 Electron 实现：

```text
.
├── index.html      # 界面和写作交互
├── main.js         # macOS 应用壳、目录选择、文件写入
├── preload.js      # 渲染层和主进程通信桥
├── package.json
└── README.md
```

## 运行

安装依赖：

```bash
npm install
```

启动应用：

```bash
npm run dev
```

打包 macOS 应用：

```bash
npm run package:mac
```

打包产物会生成在 `dist/` 目录下。

当前本地构建未签名。如果要公开分发，需要使用 Apple Developer ID 证书签名并 notarize。
