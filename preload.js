const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('marginApp', {
  platform: process.platform,
  chooseVault: () => ipcRenderer.invoke('choose-vault'),
  saveMarkdown: (payload) => ipcRenderer.invoke('save-markdown', payload),
  importAsset: (payload) => ipcRenderer.invoke('import-asset', payload),
  exportMarkdown: (payload) => ipcRenderer.invoke('export-markdown', payload),
});
