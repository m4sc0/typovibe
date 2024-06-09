// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');
// const { spawn } = require('child_process');
// const fs = require('fs');

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { startServer } from './server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  let iconPath;

  // if (process.platform === 'linux') {
  //   iconPath = path.join(process.resourcesPath, 'src', 'icons', 'typovibe-icon.png');
  // } else if (process.platform === 'win32') {
  //   iconPath = path.join(process.resourcesPath, 'src', 'icons', 'typovibe-icon.ico');
  // } else if (process.platform === 'darwin') {
  //   iconPath = path.join(process.resourcesPath, 'src', 'icons', 'typovibe-icon.icns');
  // }

  iconPath = path.join(__dirname, 'src', 'icons', 'png', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');

  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();

  mainWindow.removeMenu();
}

var port = 13395;

app.whenReady().then(() => {
  port = startServer();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  fetch(`http://localhost:${port}/restart`);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});