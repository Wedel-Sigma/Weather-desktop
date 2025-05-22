const { contextBridge } = require('electron');

// Na razie nic nie eksportujemy, ale gotowe pod IPC
contextBridge.exposeInMainWorld('api', {
  // IPC lub inne funkcje jeśli potrzebujesz
});
