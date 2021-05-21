'use strict'
import {app, globalShortcut, BrowserWindow, Menu} from 'electron'
// const { autoUpdater } = require('electron-updater')
// if (require('electron-squirrel-startup')) app.quit()
// const electronInstaller = require('electron-winstaller')
// const { autoUpdater } = require('electron-updater')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 2000,
    useContentSize: true,
    width: 2000,
    webPreferences: {
      devTools: true
    }
  })

  mainWindow.maximize()
  mainWindow.setResizable(true)
  // mainWindow.setFullScreen(true)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // localStorage.removeItem('access_token')

  // shell.beep()
}
// mainWindow.once('ready-to-show', () => {
//   autoUpdater.checkForUpdatesAndNotify()
// })
app.on('ready', () => {
  createWindow()

  // const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(null)
  globalShortcut.register('Control+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
  })

  globalShortcut.register('F5', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
  })

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
  })

  /* globalShortcut.register('CommandOrControl+Shift+I', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
  }) */
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+X')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

app.on('browser-window-focus', function () {
  globalShortcut.register('Control+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
  })
  globalShortcut.register('F5', () => {
    console.log('F5 is pressed: Shortcut Disabled')
  })
})

app.on('browser-window-blur', function () {
  globalShortcut.unregister('Control+R')
  globalShortcut.unregister('F5')
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
