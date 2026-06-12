const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('marginApp', {
  platform: process.platform,
  chooseVault: () => ipcRenderer.invoke('choose-vault'),
  listObsidianVaults: () => ipcRenderer.invoke('list-obsidian-vaults'),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  saveMarkdown: (payload) => ipcRenderer.invoke('save-markdown', payload),
  importAsset: (payload) => ipcRenderer.invoke('import-asset', payload),
  exportMarkdown: (payload) => ipcRenderer.invoke('export-markdown', payload),
});
