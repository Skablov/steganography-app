const path = require('path'); // модуль для работы с различными файлами внутри проекта
const url = require('url'); // модуль для отслеживания различных адрессов внутри проекта
const {app, BrowserWindow, ipcMain, Menu} = require('electron');
require('./cwnd.js');

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
