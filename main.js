const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const { dialog } = require('electron')
const server = require('./server')
const shell = require('electron').shell;
const ipcMain = require('electron').ipcMain
const join = require('path').join;
const openAboutWindow = require('about-window').default;
function createWindow () {
  const win = new BrowserWindow({
    icon: __dirname + '/icon.png',
    resizable:false,
    maximizable:false,
    width: 1100,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')
  const template = [
   
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' }
        
      ]
    },
    {
       role: 'window',
       submenu: [
          {
             role: 'minimize'
          },
          {
             role: 'close'
          }
       ]
    },
    
    {
       role: 'help',
       submenu: [
          {
             label: 'Learn More'
          },
          {
            label:'Join Discord',
            click(){
              shell.openExternal("https://discord.gg/tvdf5sjQhM")
            }
          },
          {
            label:'Clear Local Storage',
            click(){
              win.webContents.executeJavaScript('clearStorage();');
              
            }
          }
          
          
       ]

    },
    {
      label: 'About',
      click: () =>
          openAboutWindow({
              icon_path: join(__dirname, 'icon.png'),
              copyright: 'Copyright (c) 2021 Latte',
              package_json_dir: __dirname,
              adjust_window_size:false
          }),
  },
  ]
  
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(createWindow)
// app.on('ready',()=>{
//   document.getElementById('delay').addEventListener('change',()=>{
//     console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))

//   })
// })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

