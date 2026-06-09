const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1040,
    minHeight: 720,
    title: 'Margin',
    backgroundColor: '#f3f5f2',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
};

const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

const safeSegments = (value) => String(value || '')
  .split(/[\\/]/)
  .map((segment) => segment.trim())
  .filter(Boolean)
  .filter((segment) => segment !== '.' && segment !== '..');

const safeFileName = (value) => {
  const base = path.basename(String(value || 'untitled.md'));
  const clean = base.replace(/[\\/:*?"<>|]/g, '').trim();
  return clean || 'untitled.md';
};

const uniqueFilePath = async (directory, fileName) => {
  const extension = path.extname(fileName);
  const stem = path.basename(fileName, extension);
  let candidate = path.join(directory, fileName);
  let index = 1;

  while (true) {
    try {
      await fs.access(candidate);
      candidate = path.join(directory, `${stem}-${index}${extension}`);
      index += 1;
    } catch {
      return candidate;
    }
  }
};

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Margin',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ]));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('choose-vault', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择 Obsidian Vault',
    properties: ['openDirectory', 'createDirectory'],
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const vaultPath = result.filePaths[0];
  return {
    canceled: false,
    path: vaultPath,
    name: path.basename(vaultPath),
  };
});

ipcMain.handle('save-markdown', async (_event, payload) => {
  const rawVaultPath = String(payload.vaultPath || '').trim();
  if (!rawVaultPath) {
    throw new Error('Vault path is required');
  }

  const vaultPath = path.resolve(rawVaultPath);
  const targetDirectory = path.resolve(vaultPath, ...safeSegments(payload.targetPath));
  const fileName = safeFileName(payload.fileName);
  const filePath = path.resolve(targetDirectory, fileName);

  if (!isInside(vaultPath, filePath)) {
    throw new Error('Invalid vault path');
  }

  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.writeFile(filePath, String(payload.content || ''), 'utf8');

  return {
    ok: true,
    filePath,
  };
});

ipcMain.handle('export-markdown', async (_event, payload) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: '导出 Markdown',
    defaultPath: safeFileName(payload.fileName),
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  await fs.writeFile(result.filePath, String(payload.content || ''), 'utf8');
  return {
    canceled: false,
    filePath: result.filePath,
  };
});

ipcMain.handle('import-asset', async (_event, payload) => {
  const rawVaultPath = String(payload.vaultPath || '').trim();
  if (!rawVaultPath) {
    throw new Error('Vault path is required');
  }

  const vaultPath = path.resolve(rawVaultPath);
  const assetDirectory = path.resolve(vaultPath, ...safeSegments(payload.assetDirectory));

  if (!isInside(vaultPath, assetDirectory)) {
    throw new Error('Invalid asset directory');
  }

  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择图片资源',
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const sourcePath = result.filePaths[0];
  const fileName = safeFileName(path.basename(sourcePath));
  await fs.mkdir(assetDirectory, { recursive: true });

  const targetPath = await uniqueFilePath(assetDirectory, fileName);
  if (!isInside(vaultPath, targetPath)) {
    throw new Error('Invalid target path');
  }

  await fs.copyFile(sourcePath, targetPath);

  return {
    canceled: false,
    fileName: path.basename(targetPath),
    filePath: targetPath,
    vaultRelativePath: path.relative(vaultPath, targetPath).split(path.sep).join('/'),
  };
});
