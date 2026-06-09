# Margin

Margin is a minimal Markdown writing app for macOS, designed for writers who keep their work in an Obsidian vault.

It provides a quiet writing surface, Markdown preview, document outline, slash commands, and native vault saving. The app writes standard `.md` files directly into a directory inside your Obsidian vault.

## Features

- macOS desktop app built with Electron
- Markdown editor with live preview
- Outline panel generated from `#`, `##`, and `###` headings
- Slash command menu triggered by `/`
- Quick blocks for headings, quotes, lists, todos, code blocks, Obsidian callouts, and dividers
- Native Obsidian vault folder picker
- Saves Markdown files into a custom vault subdirectory, such as `Writing/Inbox`
- Local draft persistence
- Manual export as Markdown
- Focus mode, edit/split view, word count, and reading time

## Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Package a macOS build:

```bash
npm run package:mac
```

The packaged app will be generated under `dist/`.

Current local builds are unsigned. For public distribution, sign and notarize the app with an Apple Developer ID certificate.

## Usage

1. Launch Margin with `npm run dev` or open the packaged macOS app.
2. Click `选择 Vault`.
3. Select the root directory of your Obsidian vault.
4. Set the target folder, for example `Writing/Inbox`.
5. Write in Markdown. Margin autosaves to the selected vault when `自动沉淀` is enabled.

The file name is generated from the document title and saved as Markdown.

## Slash Commands

Type `/` inside the editor to open the quick writing menu.

Keyboard controls:

- `ArrowUp` / `ArrowDown`: move through options
- `Enter` / `Tab`: insert the selected block
- `Esc`: close the menu

Filtering examples:

- `/h`
- `/quote`
- `/引用`
- `/todo`

## Project Structure

```text
.
├── index.html
├── main.js
├── preload.js
├── package.json
└── README.md
```

## Notes

Margin is local-first. Drafts are stored in local app storage, and Markdown files are written only to the vault directory you choose.

The current version is an early desktop prototype. The UI is implemented in a single HTML file, while `main.js` and `preload.js` provide the macOS app shell and native file-system bridge.

## Roadmap

- Frontmatter templates
- Obsidian wikilink and tag completion
- Real recent-file loading from the vault
- Multiple document tabs
- Better Markdown rendering
- Native app icon
- Signed macOS release build
