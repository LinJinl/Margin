# Margin

Margin 是一个面向 Obsidian 用户的极简 Markdown 写作原型。它把写作、预览、目录大纲和 Vault 沉淀放在同一个界面里，目标是让文章写完后直接进入 Obsidian 的指定目录，而不是停在另一个工具里。

当前版本是一个纯静态 HTML 原型，无需后端服务，也不依赖构建工具。

## 功能

- Markdown 写作区，支持实时预览
- 右侧目录大纲，自动读取 `#` / `##` / `###` 标题
- 通过 `/` 唤起快速写作菜单
- 支持大标题、小标题、引用、列表、待办、代码块、Obsidian Callout、分割线
- 可选择 Obsidian Vault 本地目录，并把内容保存为 `.md`
- 支持自定义沉淀目录，例如 `Writing/Inbox`
- 自动保存草稿到浏览器本地
- 浏览器不支持目录写入时，可导出 Markdown 文件
- 专注模式、编辑/分屏切换、字数和阅读时间统计

## 使用方式

直接打开 `index.html` 即可使用。

如果要写入 Obsidian Vault：

1. 使用 Chrome 或 Edge 打开页面。
2. 点击「选择 Vault」。
3. 授权你的 Obsidian Vault 根目录。
4. 在左侧输入沉淀目录，例如 `Writing/Inbox`。
5. 写作过程中会自动保存，也可以点击保存按钮手动保存。

如果浏览器不支持本地目录写入，可以点击「导出」下载 Markdown 文件，再手动放入 Vault。

## 快捷写作

在正文里输入 `/` 会弹出快速写作菜单。

支持键盘操作：

- `ArrowUp` / `ArrowDown`：切换选项
- `Enter` / `Tab`：插入当前选项
- `Esc`：关闭菜单

可以输入 `/h`、`/quote`、`/引用` 等关键词快速筛选。

## 浏览器支持

Margin 使用 File System Access API 写入本地目录。该能力主要支持 Chrome、Edge 等 Chromium 浏览器。

Safari 和 Firefox 通常不能直接授权写入本地目录，但仍然可以使用写作、预览和导出 Markdown 功能。

所有内容默认保存在本地浏览器和你授权的本地目录中，不会上传到服务器。

## 项目结构

```text
.
├── index.html
└── README.md
```

## 后续方向

- Frontmatter 模板
- Obsidian 双链和标签补全
- 多文档管理
- 最近文件真实读取
- 更完整的 Markdown 渲染
- GitHub Pages 演示页面
- 桌面端封装
