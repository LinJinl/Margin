# Margin

Margin 是一个 macOS Markdown 写作应用，用来把文章草稿直接沉淀到 Obsidian Vault。

当前版本是桌面应用原型：界面保持轻量，主写作区负责 Markdown 输入，右侧只保留文档目录，左侧负责选择 Vault、设置沉淀目录、资源目录和保存状态。

## 当前设计

- 以 Markdown 写作为核心，支持实时预览。
- 输入 `/` 可以快速插入大标题、小标题、引用、列表、待办、代码块、Obsidian Callout 和分割线。
- 点击「选择 Vault」后，可以选择本机 Obsidian Vault 根目录。
- 首次打开会读取 Obsidian 配置中的 Vault 列表，让用户先选择一个 Vault。
- 可以设置保存目录，例如 `posts/{year}`。
- 可以设置资源目录和资源子目录，例如 `public/images` + `{title}`。
- 插入图片时，Margin 会把图片复制到资源目录，并在正文中插入相对 Markdown 图片链接。
- 开启「自动沉淀」后，内容会保存为 `.md` 文件并写入指定 Vault 目录。
- 草稿会保存在本地应用存储中，不会上传到服务器。

## 资源路径

资源目录表示图片、画板预览等资源放在哪个根目录；资源子目录表示资源目录下面是否再按文章或日期分文件夹。

例如：

```text
保存目录：posts/{year}
资源目录：public/images
资源子目录：{title}
```

当文章标题是 `Agent 本质` 时，会生成：

```text
posts/2026/agent-本质.md
public/images/agent-本质/image.png
```

正文会插入相对 Markdown 图片链接：

```md
![image.png](../../public/images/agent-本质/image.png)
```

当前支持的模板变量：

- `{title}`：根据文档标题生成的文件名
- `{year}`：当前年份
- `{month}`：当前月份
- `{day}`：当前日期

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

开发模式会监听 `main.js`、`preload.js` 和 `index.html`，保存后自动重启应用。也可以在任意目录直接运行：

```bash
margin-dev
```

安装到当前用户的 macOS 应用目录：

```bash
npm run install:mac
```

安装后应用位于 `~/Applications/Margin.app`。

打包 macOS 应用：

```bash
npm run package:mac
```

打包产物会生成在 `dist/` 目录下。

当前本地构建未签名。如果要公开分发，需要使用 Apple Developer ID 证书签名并 notarize。
