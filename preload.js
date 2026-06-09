const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('marginApp', {
  platform: process.platform,
  chooseVault: () => ipcRenderer.invoke('choose-vault'),
  saveMarkdown: (payload) => ipcRenderer.invoke('save-markdown', payload),
  exportMarkdown: (payload) => ipcRenderer.invoke('export-markdown', payload),
});
