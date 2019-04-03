const electron = require("electron");
//start the app
const { app, BrowserWindow } = electron;
//watch the app object and wait for a ready event
app.on("ready", () => {
  //function to run when the app is ready
  //create browser window
  const mainWindow = new BrowserWindow({});
  //instruct main window to load html file, from the file system not http:
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
