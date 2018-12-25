'use strict';

import * as logger from 'electron-log';
import { app, powerSaveBlocker, protocol, BrowserWindow } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
logger.warn('Starting background process');

import { getDeviceId } from './services/device';
import { wifi } from './services/wifi';

// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
  // network interface, choose a random wifi interface if set to null
  iface: null,
});

getDeviceId().then(deviceId => logger.warn('Device Id:', deviceId));

const isDevelopment = process.env.NODE_ENV !== 'production';

import { ChromeFlags } from './services/chrome-flags';

const chromeFlags = new ChromeFlags();
chromeFlags.setup();

const blockerId = powerSaveBlocker.start('prevent-display-sleep');
logger.debug(`Blocking screensaver: ${powerSaveBlocker.isStarted(blockerId)}`);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | undefined;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });
function createWindow() {
  // Create the browser window.
  let opts;

  if (isDevelopment) {
    opts = { width: 800, height: 600 };
  } else {
    opts = {
      fullscreen: true,
      kiosk: true,
      frame: false,
      transparent: true,
    };
  }

  win = new BrowserWindow(opts);

  if (isDevelopment || process.env.IS_TEST) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = void 0;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  app.quit();
  // }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
