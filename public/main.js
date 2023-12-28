const { app, BrowserWindow,ipcMain,session ,shell} = require('electron')
const isDev = require("electron-is-dev")
const fs = require('fs');
const path = require("path");
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadURL(
        isDev
            ? 'http://localhost:5000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
}

app.whenReady().then(() => {
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})