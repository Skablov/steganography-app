const {BrowserWindow, ipcMain} = require('electron');
const path = require('path');

createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, '/js/preload.js')
    },
    icon: __dirname +  "/img/icon.png",
    frame: false
  });
  win.loadFile(path.join(__dirname, '/html/index.html'));

  ipcMain.on('closeWindow', (event, arg) => {
    win.close();
  });

  ipcMain.on('minimize', (event, arg) => {
    win.minimize();
  });

  ipcMain.on('loadWindow', (event, arg) => {
    switch (arg) {
      case 'first':
        const firstLab = new BrowserWindow({
          width: 800,
          height: 600,
          webPreferences: {
            devTools: true,
            preload: path.join(__dirname, '/js/preloadFor/preloadForFirst.js'),
            nodeIntegration: true,
            contextIsolation: false,
          },
          icon: __dirname +  "/img/icon.png",
          frame: false
        });
        firstLab.loadFile(path.join(__dirname, '/html/first.html'));
      break;
      case 'second':
        const secondLab = new BrowserWindow({
          width: 800,
          height: 600,
          webPreferences: {
            devTools: true,
            preload: path.join(__dirname, '/js/preloadFor/preloadForSecond.js'),
            nodeIntegration: true,
            contextIsolation: false,
          },
          icon: __dirname + "/img/icon.png",
          frame: false
        });
        secondLab.loadFile(path.join(__dirname, '/html/second.html'));
      break;
    };
  });
}