const electron = require("electron");
//start the app
const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;
console.log(
  "starting: all console.log() go in terminal for the chrome side. index.js"
);
//You have to do this declaraiton for scoping issues
let mainWindow;
let addWindow;
//watch the app object and wait for a ready event
app.on("ready", () => {
  //function to run when the app is ready
  //create browser window
  mainWindow = new BrowserWindow({});
  //instruct main window to load html file, from the file system not http:
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  //quit app and close addWindow if main window is closed
  mainWindow.on("closed", () => app.quit());
  //attach menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createFileCabinet() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Create New File Cabinet"
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  //the following is for garbage collection
  addWindow.on("closed", () => {
    addWindow = null;
  });
}

//this listens for the addWindow
ipcMain.on("fileCab:add", (event, name) => {
  //close the addWindow
  addWindow.close();
  //open save dialog to create a fileNamePath
  dialog.showSaveDialog(fileNamePath => {
    //Send all info in an object to script.js
    mainWindow.webContents.send("fileCab:add", { fileNamePath, name });
  });
});

// Top Menu
const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Create File Cabinet",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click() {
          createFileCabinet();
        }
      },
      { label: "Load File Cabinet" },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];
//Check for mac os
if (process.platform === "darwin") {
  //add empty object to the front of the array
  menuTemplate.unshift({});
}
//check for NODE_ENV => prodution, development, staging, test
if (process.env.NODE_ENV !== "production") {
  // add object to end of array menu
  menuTemplate.push({
    label: "View",
    submenu: [
      //predefined role
      { role: "reload" },
      {
        label: "Toggle Developer Tools",
        accelerator:
          process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
