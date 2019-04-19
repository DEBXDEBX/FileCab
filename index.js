const electron = require("electron");
let fs = require("fs");
//start the app
const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;
console.log(
  "starting: all console.log() go in terminal for the chrome side. index.js"
);

//You have to do this declaraiton for scoping issues
let mainWindow;
let addWindow;
let helpWindow;
//watch the app object and wait for a ready event
app.on("ready", () => {
  //function to run when the app is ready
  //create browser window
  mainWindow = new BrowserWindow({});
  //instruct main window to load html file, from the file system not http:
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.maximize();
  // mainWindow.setFullScreen(true);
  //quit app and close addWindow if main window is closed
  mainWindow.on("closed", () => app.quit());
  //attach menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

//When you click on create file cab
function createFileCabinet() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 200,
    title: "Create New File Cabinet"
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  //the following is for garbage collection
  addWindow.on("closed", () => {
    addWindow = null;
  });
}
//When you click on help
function loadHelp() {
  helpWindow = new BrowserWindow({
    width: 800,
    height: 720,
    title: "Help"
  });
  helpWindow.loadURL(`file://${__dirname}/help.html`);
  //the following is for garbage collection
  helpWindow.on("closed", () => {
    helpWindow = null;
  });
}

//When You click on load file cab
function loadFileCabinet() {
  console.log("Start loading file cab....");
  //this is for extsions
  let myOptions = {
    filters: [{ name: "Custom File Type", extensions: ["deb"] }]
  };
  dialog.showOpenDialog(null, myOptions, fileNames => {
    if (fileNames === undefined) {
      let message = "No file selected";
      let msgType = "error";
      mainWindow.webContents.send("UI:showAlert", { message, msgType });
    } else {
      readFileContents(fileNames[0]);
    }
  });

  function readFileContents(filepath) {
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        let message = "An error occured reading the file.";
        let msgType = "error";
        mainWindow.webContents.send("UI:showAlert", { message, msgType });
        return;
      } else {
        try {
          data = JSON.parse(data);
        } catch {
          let message = "Can not parse data";
          let msgType = "error";
          mainWindow.webContents.send("UI:showAlert", { message, msgType });
          return;
        }

        if (data) {
          if (data.fileType === "ElectronFileCab2019April") {
            console.log("This is a valid file");
            //set filepath: This is in case you moved your file
            data.fileNamePath = filepath;
            //laod file cab
            console.log("sending data to script.js");
            //data is an object to be converted to an file cab object
            mainWindow.webContents.send("fileCab:load", data);
          } else {
            let message = "This is not a valid ElectronFileCab2019April file";
            let msgType = "error";
            mainWindow.webContents.send("UI:showAlert", { message, msgType });
          }
        }
      }
    });
  }
}

//this listens for the addWindow
ipcMain.on("fileCab:add", (event, name) => {
  //close the addWindow
  addWindow.close();
  //this is for extsions
  let myOptions = {
    filters: [{ name: "Custom File Type", extensions: ["deb"] }]
  };
  //open save dialog to create a fileNamePath
  dialog.showSaveDialog(null, myOptions, fileNamePath => {
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
      {
        label: "Load File Cabinet",
        accelerator: process.platform === "darwin" ? "Command+O" : "Ctrl+O",
        click() {
          loadFileCabinet();
        }
      },
      {
        label: "Help",
        click() {
          loadHelp();
        }
      },
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
//This does not work coment it out before you build

//DEVELOPER TOOLS
// if (process.env.NODE_ENV !== "production") {
//   // add object to end of array menu
//   menuTemplate.push({
//     label: "View",
//     submenu: [
//       //predefined role
//       { role: "reload" },
//       {
//         label: "Toggle Developer Tools",
//         accelerator:
//           process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
//         click(item, focusedWindow) {
//           focusedWindow.toggleDevTools();
//         }
//       }
//     ]
//   });
// }
