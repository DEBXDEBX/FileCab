"use strict";
// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");

const electron = require("electron");
const { ipcRenderer } = electron;

// Select audio files
const addAudio = document.querySelector("#addAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const deleteAudio = document.querySelector("#deleteAudio");
const warningEmptyAudio = document.querySelector("#warningEmptyAudio");
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const warningNameTakenAudio = document.querySelector("#warningNameTakenAudio");
const tabAudio = document.querySelector("#tabAudio");
const clickAudio = document.querySelector("#clickAudio");
const btnAudio = document.querySelector("#btnAudio");
const cancelAudio = document.querySelector("#cancelAudio");
// Select Rename vars
const fileCabText = document.querySelector("#newFileCabName");
const mainFolderText = document.querySelector("#mainFolderName");
const subFolderText = document.querySelector("#subFolderName");
// Global variable's
// current File Cab Index
let fcI = -243;
// current Main Folder Index
let mfI = -243;
// current Sub Folder Index
let sfI = -243;
// current note Index
let nI = -243;
let checkBox = document.querySelector("#autoLoad");
let myBody = document.querySelector("body");
// this is for the fontSize
let root = document.querySelector(":root");
// temp hold for array
let settingsArrayContainer;
//Theme current
let currentTheme = "Dark";
// Delete Mode
let deleteMode = false;
// create elements object
const el = new Elements();
// Pass elements to display
const display = new Display(el, $);

// This is the Main array that holds all the file cab objects
const arrayOfFileCabs = [];

// This enables JQuery ToolTips
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// The start of program exicution.
window.onload = function () {
  startUp();
};
// Start Up
function startUp() {
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();

  if (settings.type === "fileCab") {
    // set the holding array
    settingsArrayContainer = settings.filePathArray;
    // loadsettings
    applySettings(settings);
    // update Form
    display.showAutoLoadList(settingsArrayContainer);
    var x = document.querySelector("#autoLoad").checked;
    if (x === true) {
      if (settings.filePathArray) {
        autoLoadFileCabs(settings.filePathArray);
      }
    }
  }
}

//*************************************************** */
// Helper functions
//*************************************************** */
// **************************************************
function renderFileCabs() {
  // function returns -243, -243 is used for close down of a file cabs
  fcI = display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
}
// **************************************************
function renderMainFolders() {
  display.paintMainFolderTabs(
    deleteMode,
    mapNamesOut(arrayOfFileCabs[fcI].arrayOfPrimaryObjects)
  );
}
// ***************************************************
function renderSubFolders() {
  display.paintSubFolderTabs(
    deleteMode,
    mapNamesOut(arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray)
  );
}
// ****************************************************
function renderNotes() {
  // send the note array to the Display
  display.paintNotes(
    deleteMode,
    arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
      .noteArray
  );
}
// ****************************************************
function pushFileSettingsContainer(filePath) {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;

  for (const element of settingsArrayContainer) {
    if (element === filePath) {
      isTaken = true;
    }
  }

  if (isTaken) {
    warningNameTakenAudio.play();
    display.showAlert("That file is already loaded!", "error");
    return;
  }

  // add it too temp HOld
  settingsArrayContainer.push(filePath);
}
// *********************************************************
function sortArrayByName(array) {
  array.sort(function (a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}
// ***********************************************************
function autoLoadFileCabs(array) {
  for (const item of array) {
    readFileContents(item);
  }
}
// ***********************************************************
function readFileContents(filepath) {
  if (!filepath) {
    let message = "No file selected!";
    let msgType = "error";
    display.showAlert(message, msgType);
    return;
  }

  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      let message = "An error occured reading the file!";
      let msgType = "error";
      display.showAlert(message, msgType);
      return;
    } else {
      try {
        data = JSON.parse(data);
      } catch {
        let message = "Can not parse data!";
        let msgType = "error";
        display.showAlert(message, msgType);
        return;
      }

      if (data) {
        if (data.fileType === "ElectronFileCab2019April") {
          // set filepath: This is in case you moved your file
          data.fileNamePath = filepath;

          // check if the fileNamePath already exists if it does alert and return
          // make a variable to return
          let isTaken = false;

          for (const element of arrayOfFileCabs) {
            if (element.fileNamePath === data.fileNamePath) {
              isTaken = true;
            }
          }

          if (isTaken) {
            display.showAlert(
              "A file cabinet with that name is already loaded!",
              "error"
            );
            // redisplay
            // get the names for all the file cabinets
            // and then send them to the Display

            renderFileCabs();
            return;
          }
          if (isNameInArray(data.name, arrayOfFileCabs)) {
            // alert and return
            display.showAlert("That name is already taken!", "error");
            renderFileCabs();
            return;
          }
          // create a file cab object
          let newfileCab = new FileCabObject(
            data.name,
            data.fileNamePath,
            data.arrayOfPrimaryObjects
          );
          // push the file cab obj into the array of file cabinets
          arrayOfFileCabs.push(newfileCab);
          sortArrayByName(arrayOfFileCabs);
          // write to file
          newfileCab.writeFileCabToHardDisk(fs);
          // redisplay
          // get the names for all the file cabinets
          // and then send them to the Display

          renderFileCabs();
        } else {
          let message = "This is not a valid ElectronFileCab2019April file!";
          let msgType = "error";
          display.showAlert(message, msgType);
        }
      }
    }
  });
} // End readFileContents(filepath)
// ***********************************************************
function loadUpSettingsForm() {
  const settingsStorage = new SettingsStorage();
  const settings = settingsStorage.getSettingsFromFile();
  settingsArrayContainer = settings.filePathArray;

  if (settings.type === "fileCab") {
    // set check box
    if (settings.autoLoad) {
      // check the box
      checkBox.checked = true;
    } else {
      // uncheck the box
      checkBox.checked = false;
    }
    // check the right theme
    switch (settings.theme) {
      case "Dark":
        document.querySelector("#Dark").checked = true;
        break;
      case "Light":
        document.querySelector("#Light").checked = true;
        break;
      default:
        console.log("No valid theme!");
    }
    // check the right font size
    switch (settings.fontSize) {
      case "x-small":
        document.querySelector("#x-small").checked = true;
        break;
      case "small":
        document.querySelector("#small").checked = true;
        break;
      case "normal":
        document.querySelector("#normal").checked = true;
        break;
      case "large":
        document.querySelector("#large").checked = true;
        break;
      case "x-large":
        document.querySelector("#x-large").checked = true;
        break;
      default:
        console.log("No valid font size");
    }
  }
  // update autoload form ul
  display.showAutoLoadList(settingsArrayContainer);
} // End loadUpSettingsForm()
// *******************************************************************
function applySettings(settings) {
  if (settings.autoLoad === true) {
    document.querySelector("#autoLoad").checked = true;
  }
  switch (settings.fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
  if (deleteMode === false) {
    // set the theme
    switch (settings.theme) {
      case "Dark":
        document.querySelector("#blank").href = "assets/css/dark.css";
        document.querySelector("body").style.backgroundColor = "black";
        // deleteMode = false;
        currentTheme = "Dark";
        break;
      case "Light":
        document.querySelector("#blank").href = "assets/css/light.css";
        document.querySelector("body").style.backgroundColor = "white";
        // deleteMode = false;
        currentTheme = "Light";
        break;
      default:
        console.log("No valid option");
      // code block
    }
  }
} // End applySettings(settings)

// ****************************************************************
function getRadioValue(form, name) {
  let val;
  // get list of radio buttons with specified name
  const radios = form.elements[name];
  // loop through list of radio buttons
  for (let i = 0, len = radios.length; i < len; i++) {
    if (radios[i].checked) {
      // radio checked?
      val = radios[i].value; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return val; // return value of checked radio or undefined if none checked
} // End getRadioValue(form, name)

// *******************************************************************
function mapNamesOut(array) {
  const mapedArray = array.map((item) => {
    return item.name;
  });
  return mapedArray;
} // End mapNamesOut(array)
// *******************************************************************
function handleFilePath(imagePath) {
  if (!imagePath) {
    warningEmptyAudio.play();
    display.showAlert("Please enter a path in the name area!", "error");
    return;
  }
  // set image path
  arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI].noteArray[
    nI
  ].imagePath = imagePath;
  // write to file
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
  addImageAudio.play();
  display.showAlert("A new image was added to the note!", "success");
} // End handleFilePath(imagePath)
// ***************************************************************
function addImage() {
  let imagePath;
  dialog.showOpenDialog((fileNames) => {
    if (!fileNames) {
      display.showAlert("No file selected!", "error");
    } else {
      // got file name
      imagePath = fileNames[0];
      handleFilePath(imagePath);
    }
  });
} // End addImage()
// *************************************************************
// *************************************************************
function isNameInArray(name, array) {
  for (let item of array) {
    if (name === item.name) {
      return true;
    }
  }
  return false;
} // End isNameInArray(name, array)

// *************************************************************
//  IPC Code
// *************************************************************
// listen for inedex.js to send data
ipcRenderer.on("fileCab:add", (event, dataObj) => {
  $("#myModal").modal("hide");
  if (!dataObj.fileNamePath) {
    display.showAlert("You did not enter a path!", "error");

    renderFileCabs();
    return;
  }

  if (dataObj.name === "") {
    display.showAlert(
      "You did not enter a name for the File Cabinet!",
      "error"
    );
    renderFileCabs();
    return;
  }

  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfFileCabs.forEach((element) => {
    if (element.fileNamePath === dataObj.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    display.showAlert("That file is already loaded!", "error");
    renderFileCabs();
    return;
  }
  if (isNameInArray(dataObj.name, arrayOfFileCabs)) {
    // alert and return
    warningNameTakenAudio.play();
    display.showAlert("That name is already taken!", "error");
    renderFileCabs();
    return;
  }
  // create a file cab object
  let newfileCab = new FileCabObject(dataObj.name, dataObj.fileNamePath);
  // push the file cab obj into the array of file cabinets
  arrayOfFileCabs.push(newfileCab);
  sortArrayByName(arrayOfFileCabs);
  // write to file
  newfileCab.writeFileCabToHardDisk(fs);

  renderFileCabs();
});
// End ipcRenderer.on("fileCab:add"********************
//*************************************************** */

// listen for inedex.js to send data ****************************************
ipcRenderer.on("fileCab:load", (event, data) => {
  $("#myModal").modal("hide");
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfFileCabs.forEach((element) => {
    if (element.fileNamePath === data.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    display.showAlert("That file is already loaded!", "error");

    renderFileCabs();
    return;
  }
  if (isNameInArray(data.name, arrayOfFileCabs)) {
    // alert and return
    warningNameTakenAudio.play();
    display.showAlert(
      "A file cabinet with that name is already loaded!",
      "error"
    );
    renderFileCabs();
    return;
  }
  // create a file cab object
  let newfileCab = new FileCabObject(
    data.name,
    data.fileNamePath,
    data.arrayOfPrimaryObjects
  );
  // push the file cab obj into the array of file cabinets
  arrayOfFileCabs.push(newfileCab);
  sortArrayByName(arrayOfFileCabs);
  // write the file cab object to disk
  newfileCab.writeFileCabToHardDisk(fs);

  renderFileCabs();
});
//End ipcRenderer.on("fileCab:load"**************************************
// **********************************************************************

// listen for inedex.js to send data ************************************
ipcRenderer.on("Display:showAlert", (event, dataObj) => {
  display.showAlert(dataObj.message, dataObj.msgType);
}); // End ipcRenderer.on("Display:showAlert"

// listen for index.js to set deletemode *********************************
ipcRenderer.on("deleteMode:set", (event, deleteModeBool) => {
  $("#myModal").modal("hide");
  // set the delete mode to true or false
  deleteMode = deleteModeBool;
  let paintMain = false;
  let mainText;
  let subText;
  let paintSub = false;
  let paintNote = false;
  let activeMain = document.querySelector(".main.active");
  let activeSub = document.querySelector(".sub.active");
  if (activeMain) {
    mainText = activeMain.textContent;
  }
  if (activeSub) {
    subText = activeSub.textContent;
  }

  if (deleteMode) {
    display.showAlert("Edit and Delete mode!", "error");
    myBody.style.backgroundColor = "#d3369c";
    myBody.style.background = "linear-gradient(to right, #180808, #ff0000)";
    //check for Main folders
    let htmlMainFolders = document.querySelectorAll(".main");
    if (htmlMainFolders.length > 0) {
      paintMain = true;
    }

    // check for sub folders
    let htmlSubFolders = document.querySelectorAll(".sub");

    if (htmlSubFolders.length > 0) {
      paintSub = true;
    }
    // check for notes
    let htmlNotes = document.querySelectorAll(".note");

    if (htmlNotes.length > 0) {
      paintNote = true;
    }
  } else {
    //check for Main folders
    let htmlMainFolders = document.querySelectorAll(".main");
    if (htmlMainFolders.length > 0) {
      paintMain = true;
    }
    // check for sub folders
    let htmlSubFolders = document.querySelectorAll(".sub");
    if (htmlSubFolders.length > 0) {
      paintSub = true;
    }

    // check for notes
    let htmlNotes = document.querySelectorAll(".note");
    if (htmlNotes.length > 0) {
      paintNote = true;
    }

    display.showAlert("Read and Write mode!", "success");
    switch (currentTheme) {
      case "Dark":
        myBody.style.background = "none";
        myBody.style.backgroundColor = "black";
        break;
      case "Light":
        myBody.style.background = "none";
        myBody.style.backgroundColor = "white";
        break;
      default:
        console.log("No Match");
    }
  }
  if (paintMain) {
    renderMainFolders();
    if (mainText) {
      // loop through the main array and set the one with mactching text to active
      let Main = document.querySelectorAll(".main");
      let newArray = Array.from(Main);
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].textContent === mainText) {
          newArray[i].classList.add("active");
          break;
        }
      }
    }
  }

  if (paintSub) {
    renderSubFolders();
    if (subText) {
      // loop through the main array and set the one with mactching text to active
      let Sub = document.querySelectorAll(".sub");
      let newArray = Array.from(Sub);
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].textContent === subText) {
          newArray[i].classList.add("active");
          break;
        }
      }
    }
  }
  if (paintNote) {
    renderNotes();
  }
}); //End ipcRenderer.on("deleteMode:set"

//listen for index.js to set theme ****************************************
ipcRenderer.on("Theme:set", (event, theme) => {
  $("#myModal").modal("hide");
  // set te current theme
  currentTheme = theme;
  // check if delete mode is on, if so return
  if (deleteMode) {
    return;
  }
  switch (theme) {
    case "Dark":
      document.querySelector("#blank").href = "assets/css/dark.css";
      document.querySelector("body").style.backgroundColor = "black";
      deleteMode = false;
      break;
    case "Light":
      document.querySelector("#blank").href = "assets/css/light.css";
      document.querySelector("body").style.backgroundColor = "white";
      deleteMode = false;
      break;
    default:
      console.log("No valid option!");
    // code block
  }
});
// End ipcRenderer.on("Theme:set"

// listen for index.js to show settings form *******************************
ipcRenderer.on("SettingsForm:show", (event) => {
  // set for close file cab on menu
  fcI = -243;
  loadUpSettingsForm();
  display.showSettingsForm();
  $("#myModal").modal("hide");
});

// listen for index.js to change font size
ipcRenderer.on("FontSize:change", (event, fontSize) => {
  switch (fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
}); // End ipcRenderer.on("FontSize:change"

// listen for index.js to close a file cab *****************************
ipcRenderer.on("FileCab:close", (event) => {
  $("#myModal").modal("hide");
  if (fcI === -243 || isNaN(fcI)) {
    renderFileCabs();
    display.showAlert("Please select a file cabinet to close!", "error");
    return;
  }
  // remove file cab from array
  arrayOfFileCabs.splice(fcI, 1);
  renderFileCabs();
}); // End ipcRenderer.on("FileCab:close"

// listen for index.js to close all file cab's
ipcRenderer.on("FileCab:closeAll", (event) => {
  $("#myModal").modal("hide");
  // setting the length to Zero emptys the array
  arrayOfFileCabs.length = 0;

  renderFileCabs();
}); // End ipcRenderer.on("FileCab:closeAll"

// *************************************************************
//  End IPC Code
// *************************************************************

// *************************************************************
//  file cab Code
// *************************************************************
// file cab UL *************************************************
el.fileCabList.addEventListener("click", (e) => {
  // if shift is held down rename fileCab
  if (e.shiftKey) {
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      // when you click out side of the tab
      // if it's not a number return
      return;
    }
    fcI = index;
    // grab file cab name
    let { name } = arrayOfFileCabs[fcI];
    fileCabText.value = name;
    display.showRenameFileCabForm();
    // set time out to focus
    window.setTimeout(function () {
      fileCabText.focus();
    }, 1000);
    return;
  } // End shift Key down

  // event delegation
  if (e.target.classList.contains("fileCab")) {
    let fileCabList = document.getElementsByClassName("fileCab");
    // create an array from an array like object
    let newArray = Array.from(fileCabList);
    newArray.forEach((item) => {
      item.classList.remove("active");
    });
    // add active class
    e.target.classList.add("active");
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      // when you click out side of the tab
      // if it's not a number return
      return;
    }
    fcI = index;
    tabAudio.play();
    renderMainFolders();
  }
}); // End el.fileCabList.addEventListener

// when You click on the rename File Cab rename Btn in the form *******************
document.querySelector("#renameFileCabAdd").addEventListener("click", (e) => {
  e.preventDefault();
  if (!deleteMode) {
    warningEmptyAudio.play();
    display.showAlert(
      "You have to enter Edit and Delete mode to rename a file cabinet!",
      "error"
    );
    return;
  }
  // get text
  let newName = el.textRenameFileCab.value;
  //check for empty string
  if (newName === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a name for the file cabinet!", "error");
    return;
  }
  if (isNameInArray(newName, arrayOfFileCabs)) {
    // alert and return
    warningNameTakenAudio.play();
    display.showAlert("That name is already taken!", "error");
    // set time out to focus
    window.setTimeout(function () {
      fileCabText.focus();
    }, 1000);
    return;
  }

  // change file cabinet name
  arrayOfFileCabs[fcI].name = newName;
  //sort the array
  sortArrayByName(arrayOfFileCabs);
  // write to file
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
  addAudio.play();
  display.showAlert(
    `You renamed the file cabinet to ${newName}`,
    "success",
    1500
  );

  // reset form
  renameFileCabForm.reset();
  // send file cabinets array to display
  renderFileCabs();
}); // End

// when You click on the rename File Cab cancel Btn in the form ************************
document
  .querySelector("#renameFileCabCancel")
  .addEventListener("click", (e) => {
    cancelAudio.play();
    // reset form
    el.renameFileCabForm.reset();
    // hide form
    display.displayNone(el.renameFileCabForm);
    // get rid of active class
    let activeTabList = document.getElementsByClassName("fileCab active");
    if (activeTabList) {
      let newArray = Array.from(activeTabList);
      for (let item of newArray) {
        item.classList.remove("active");
      }
    }
  });
// *************************************************************
//   Main Folder Code
// *************************************************************
// main UL *****************************************************
el.mainFolderList.addEventListener("click", (e) => {
  // if shift is held down rename main folder
  if (e.shiftKey) {
    // rename Main folder
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      // when you click out side of the tab
      // if it's not a number return
      return;
    }
    mfI = index;

    // grab main folder name
    let { name } = arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI];
    // set form text
    mainFolderText.value = name;
    // show form
    display.showRenameMainFolderForm();
    // set time out to focus
    window.setTimeout(function () {
      mainFolderText.focus();
    }, 1000);
    return;
  }
  if (e.target.classList.contains("delete-main")) {
    if (deleteMode) {
      if (e.ctrlKey) {
        // get the index from the html
        let deleteIndex = e.target.parentElement.dataset.index;
        deleteIndex = parseInt(deleteIndex);

        // DELETE MAIN folder
        // grab array from file
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects.splice(deleteIndex, 1);
        // write to file
        arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
        deleteAudio.play();
        display.showAlert("Main folder deleted!", "success");
        renderMainFolders();
        // return;
        return;
      } else {
        warningEmptyAudio.play();
        display.showAlert(
          "You have to hold down the control key to make a deletion!",
          "error"
        );
        return;
      } // End control key down
    } // End delete mode
  }
  // event delegation

  // The Next code is to set the current tab color white with the active class
  // set's the current target active

  if (e.target.classList.contains("main")) {
    let mainFolderList = document.getElementsByClassName("main");
    // create an array from an array like object
    let newArray = Array.from(mainFolderList);
    newArray.forEach((item) => {
      item.classList.remove("active");
    });
    // add active class
    e.target.classList.add("active");

    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    // Bug fix
    if (isNaN(index)) {
      // when you click out side of the tab
      // if it's not a number return
      return;
    }
    mfI = index;

    tabAudio.play();
    renderSubFolders();
    return;
  }
}); // End el.mainFolderList.addEventListener

// when You click on the +/icon in the main folder heading *********
el.addShowFormMain.addEventListener("click", (e) => {
  clickAudio.play();

  mainFolderText.value = "";
  // show form
  display.showMainFolderForm();
  // set time out to focus
  window.setTimeout(function () {
    mainFolderText.focus();
  }, 1000);
}); // End el.addShowFormMain.addEventListener

// when you click on the add main folder btn ***********************
document.querySelector("#mainFolderAdd").addEventListener("click", (e) => {
  e.preventDefault();
  // grab fileCab
  let fileCab = arrayOfFileCabs[fcI];
  // grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  // grab text for primary object
  let primaryName = el.textNameMain.value.trim();
  // check if text is empty

  if (primaryName === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a name for the Main Folder!", "error");
    return;
  }
  // check for taken name
  if (isNameInArray(primaryName, arrayOfFileCabs[fcI].arrayOfPrimaryObjects)) {
    warningNameTakenAudio.play();
    display.showAlert("That name is already taken!", "error");
    // set time out to focus
    window.setTimeout(function () {
      mainFolderText.focus();
    }, 1000);
  } else {
    // create primary object
    let primaryObj = new PrimaryObj(primaryName);
    // push primary object into array
    primaryArray.push(primaryObj);
    // sort primary array by name
    sortArrayByName(primaryArray);
    // save file cab
    fileCab.writeFileCabToHardDisk(fs);
    addAudio.play();
    display.showAlert("A new main folder was added!", "success", 1500);
    // reset form
    el.mainFolderForm.reset();
    // send main folder array to display
    renderMainFolders();
  } // End else statement
}); // End
// when you click on the rename main folder btn ***********************
document.querySelector("#mainFolderRename").addEventListener("click", (e) => {
  e.preventDefault();
  if (!deleteMode) {
    warningEmptyAudio.play();
    display.showAlert(
      "You have to enter Edit and Delete mode to rename a main folder!",
      "error"
    );
    return;
  }
  // grab text for primary object
  let primaryName = el.textNameMain.value.trim();
  // check if text is empty
  if (primaryName === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a name for the Main Folder!", "error");
    return;
  }

  // check for taken name
  if (isNameInArray(primaryName, arrayOfFileCabs[fcI].arrayOfPrimaryObjects)) {
    warningNameTakenAudio.play();
    display.showAlert("That name is already taken!", "error");
    // set time out to focus
    window.setTimeout(function () {
      mainFolderText.focus();
    }, 1000);
  } else {
    // grab main folder
    let mainFolder = arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI];
    //change text
    mainFolder.name = primaryName;
    // sort primary array by name
    sortArrayByName(arrayOfFileCabs[fcI].arrayOfPrimaryObjects);
    // save file cab
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
    addAudio.play();
    display.showAlert(
      `You renamed the folder to ${primaryName}!`,
      "success",
      1500
    );
    // reset form
    el.mainFolderForm.reset();
    // send main folder array to display
    renderMainFolders();
  } // End else statement
});
// when You click on cancel btn on the main folder form ****************
document.querySelector("#mainFolderCancel").addEventListener("click", (e) => {
  cancelAudio.play();
  // reset form
  el.mainFolderForm.reset();
  // hide form
  display.displayNone(el.mainFolderForm);
  // get rid of active class
  let activeTabList = document.getElementsByClassName("main active");
  if (activeTabList) {
    let newArray = Array.from(activeTabList);
    for (let item of newArray) {
      item.classList.remove("active");
    }
  }
}); // End
// *************************************************************
//  End Main Folder Code
// *************************************************************
// *************************************************************
//  Sub Folder Code
// *************************************************************
// Sub Folder UL
el.subFolderList.addEventListener("click", (e) => {
  // if shift is held down rename sub folder
  if (e.shiftKey) {
    // rename Main folder
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      // when you click out side of the tab
      // if it's not a number return
      return;
    }
    sfI = index;

    // grab sub folder name
    let { name } = arrayOfFileCabs[fcI].arrayOfPrimaryObjects[
      mfI
    ].secondaryArray[sfI];
    // set from text
    subFolderText.value = name;
    // show form
    display.showRenameSubFolderForm();
    // set time out to focus
    window.setTimeout(function () {
      subFolderText.focus();
    }, 1000);
    return;
  }
  // event delegation
  if (e.target.classList.contains("delete-sub")) {
    if (deleteMode) {
      if (e.ctrlKey) {
        // get the index from the html
        let deleteIndex = e.target.parentElement.dataset.index;
        deleteIndex = parseInt(deleteIndex);
        // DELETE sub folder
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray.splice(
          deleteIndex,
          1
        );
        // write to file
        arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
        deleteAudio.play();
        display.showAlert("Sub folder deleted!", "success");
        renderSubFolders();
        return;
      } else {
        warningEmptyAudio.play();
        display.showAlert(
          "You have to hold down the control key to make a deletion!",
          "error"
        );
        return;
      } // End control key down
    } // End delete mode
  }

  if (e.target.classList.contains("sub")) {
    let subFolderList = document.getElementsByClassName("sub");
    // create an array from an array like object
    let newArray = Array.from(subFolderList);
    newArray.forEach((item) => {
      item.classList.remove("active");
    });
    // add active class
    e.target.classList.add("active");
    // End code to set the active class

    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);

    // Bug fix
    if (isNaN(index)) {
      // display.paintNotes will throw an error, when you click outside the subfolder items
      // if it's not a number return
      return;
    }
    sfI = index;

    tabAudio.play();
    // send the note array to the Display
    renderNotes();
    return;
  }
}); // End el.subFolderList.addEventListener

// When You click +/icon in the subfolder heading ***************************
el.addShowFormSub.addEventListener("click", (e) => {
  clickAudio.play();
  subFolderText.value = "";
  // show form
  display.showSubFolderForm();
  // set time out to focus
  window.setTimeout(function () {
    subFolderText.focus();
  }, 1000);
}); // End

// When You click on the add sub folder btn in the sub folder form
document.querySelector("#subFolderAdd").addEventListener("click", (e) => {
  e.preventDefault();
  // grab array from file
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  // grab text input
  let secondaryName = el.textNameSub.value.trim();
  // check for empty string
  if (secondaryName === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a name for the Sub Folder!", "error");
    return;
  }
  // check for taken name
  if (
    isNameInArray(
      secondaryName,
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray
    )
  ) {
    warningNameTakenAudio.play();
    display.showAlert("That name is already taken!", "error");
    // set time out to focus
    window.setTimeout(function () {
      subFolderText.focus();
    }, 1000);
  } else {
    let secondaryObject = new SecondaryObj(secondaryName);
    // push object into array
    primaryArray[mfI].secondaryArray.push(secondaryObject);
    // sort secondary array by name
    sortArrayByName(primaryArray[mfI].secondaryArray);
    // write to file
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
    addAudio.play();
    display.showAlert("A new sub folder was added!", "success", 1500);
    // reset form
    subFolderForm.reset();
    renderSubFolders();
  } // End else statement
}); // End
// When you click on the sub folder rename btn
document.querySelector("#subFolderRename").addEventListener("click", (e) => {
  e.preventDefault();
  if (!deleteMode) {
    warningEmptyAudio.play();
    display.showAlert(
      "You have to enter Edit and Delete mode to rename a sub folder!",
      "error"
    );
    return;
  }
  // grab text for primary object
  let subName = el.textNameSub.value.trim();
  // check if text is empty
  if (subName === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a name for the Main Folder!", "error");
    return;
  }

  // check for taken name
  if (
    isNameInArray(
      subName,
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray
    )
  ) {
    warningNameTakenAudio.play();
    display.showAlert("That name is already taken!", "error");
    subFolderText.focus();
  } else {
    // grab sub folder
    let subFolder =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI];
    //change text
    subFolder.name = subName;
    // sort sub folder array by name
    sortArrayByName(
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray
    );
    // save file cab
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
    addAudio.play();
    display.showAlert(`You renamed the folder to ${subName}!`, "success", 1500);
    // hide form
    // reset form
    el.subFolderForm.reset();
    // send main folder array to display
    renderSubFolders();
  } // End else statement
}); // End

// when You click the cancel btn in the sub folder form
document.querySelector("#subFolderCancel").addEventListener("click", (e) => {
  cancelAudio.play();
  // reset form
  el.subFolderForm.reset();
  // hide form
  display.displayNone(el.subFolderForm);
  // get rid of active class
  let activeTabList = document.getElementsByClassName("sub active");
  if (activeTabList) {
    let newArray = Array.from(activeTabList);
    for (let item of newArray) {
      item.classList.remove("active");
    }
  }
}); //End
// *************************************************************
//  End SubFolder Code
// *************************************************************
// *************************************************************
//  Note Code
// *************************************************************
// Note UL
el.noteList.addEventListener("click", (e) => {
  // this gets the data I embedded into the html
  let dataIndex = e.target.dataset.index;
  let deleteIndex = parseInt(dataIndex);
  nI = deleteIndex;
  // this makes sure only one picture in a note shows up in the note area
  let picArray = [];
  let el = document.querySelectorAll(".myPic");
  // push all pic index's into an array to loop through next
  for (let i = 0; i < el.length; i++) {
    // remove all elements with the class of .myPic
    let indexP = el[i].getAttribute("data-pIndex");
    indexP = parseInt(indexP);
    picArray.push(indexP);
  }
  // loop through picArray and return if the picture is already displayed
  for (let ii = 0; ii < picArray.length; ii++) {
    if (picArray[ii] === nI) {
      nI = -243;
      return;
    }
  }
  // event delegation
  if (e.target.classList.contains("moveUp")) {
    // get the index from the html
    let index = e.target.parentElement.dataset.index;
    index = parseInt(index);

    //If index is zero. You can't move it any more so return
    if (index === 0) {
      return;
    }
    // get move to index
    let moveTo = index - 1;
    let arr =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
        .noteArray;
    // swap array elements
    [arr[index], arr[moveTo]] = [arr[moveTo], arr[index]];
    btnAudio.play();
    // write to file
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
    // redisplay
    // send note array to display
    renderNotes();
    // return
    return;
  }

  // event delegation
  if (e.target.classList.contains("moveDown")) {
    // get the index from the html
    let index = e.target.parentElement.dataset.index;
    index = parseInt(index);

    let arr =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
        .noteArray;
    // let arrayLength = arr.length - 1;
    //If index is equal to length - 1. You can't move it any more so return
    if (index === arr.length - 1) {
      return;
    }
    // get move to index
    let moveTo = index + 1;
    // swap array elements
    [arr[index], arr[moveTo]] = [arr[moveTo], arr[index]];
    btnAudio.play();
    // write to file
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
    // redisplay
    // send note array to display
    renderNotes();
    // return
    return;
  }
  // event delegation
  if (e.target.classList.contains("delete-item")) {
    // get the index from the html
    let deleteIndex = e.target.parentElement.dataset.index;
    deleteIndex = parseInt(deleteIndex);

    // check if control was down, if so delete note
    if (!deleteMode) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to select Edit and Delete mode in menu to make a deletion!",
        "error"
      );
      return;
    }
    if (!e.ctrlKey) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to hold down ctrl key to make a deletion!",
        "error"
      );
      return;
    }
    if (e.ctrlKey) {
      if (deleteMode) {
        // delete note
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[
          sfI
        ].noteArray.splice(deleteIndex, 1);
        // write to file
        arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
        // reasign current note
        nI = -243;
        deleteAudio.play();
        display.showAlert("Note deleted!", "success");
        // send note array to display
        renderNotes();
      }
    } // End control key down
    return;
  }
  // event delegation
  if (e.target.classList.contains("myPic")) {
    // remove image
    e.target.remove();
    return;
  }

  // event delegation
  if (e.target.classList.contains("note")) {
    // see if the note has a imagePath
    let selectedNote =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
        .noteArray[nI];

    if (selectedNote.imagePath) {
      let oImg = document.createElement("img");
      oImg.setAttribute("src", selectedNote.imagePath);
      oImg.setAttribute("alt", "na");
      oImg.setAttribute("width", "100%");
      oImg.setAttribute("data-pIndex", nI);
      oImg.className = "myPic";
      // insert the image after current note

      // You can not use el.noteList because you are in the addeventListener for el.noteList
      // use this.noteList
      this.noteList.insertBefore(oImg, e.target.nextSibling);
      // 2ND fix: just reselect the element, both will work
      // document
      //   .querySelector("#noteList")
      //   .insertBefore(oImg, e.target.nextSibling);
    }
    // check if the alt Key is held down and add Image to note
    if (e.altKey) {
      addImage();
      // send note array to display: after delay so the path prints
      setTimeout(function () {
        renderNotes();
      }, 4000);
      // end set Time out
      return;
    }
    // if shift is down remove the current path
    if (e.shiftKey) {
      selectedNote.imagePath = null;
      // write to file
      arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
      // reasign current note
      nI = -243;
      deleteAudio.play();
      display.showAlert("Removed the image from note!", "success");
      // send note array to display
      renderNotes();
    }
    return;
  } // End class name contains note
  // event delegation
  if (e.target.classList.contains("edit-note")) {
    // this kicks off the modal
    // get the index from the html
    let index = e.target.parentElement.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      return;
    }
    nI = index;
    // set modal text
    // grab current note
    let note =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
        .noteArray[nI];

    document.querySelector("#noteModalTextarea").value = note.text;
    clickAudio.play();
    return;
  }
}); // End el.noteList.addEventListener
// when You click the + in the Note Heading
el.addShowFormNote.addEventListener("click", (e) => {
  clickAudio.play();
  display.showNoteForm();

  // set time out to focus
  window.setTimeout(function () {
    document.querySelector("#myTextArea").focus();
  }, 1000);
}); // End
// when You click the add note btn in the note form
document.querySelector("#noteAdd").addEventListener("click", (e) => {
  e.preventDefault();
  // grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  // create note
  let noteText = el.textArea.value.trim();
  // check if text is empty
  if (noteText === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter note in the text area!", "error");
    return;
  }
  // create new note
  let newNote = new Note(noteText);
  // push note into note array
  primaryArray[mfI].secondaryArray[sfI].noteArray.push(newNote);
  // write to file
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
  addAudio.play();
  el.textArea.value = "";
  display.showAlert("A new note was added!", "success", 900);
  nI = -243;
  renderNotes();
}); // End
// when You click the cancel btn in the note form
document.querySelector("#noteCancel").addEventListener("click", (e) => {
  cancelAudio.play();
  el.noteForm.reset();
  display.displayNone(el.noteForm);
}); // End

// when You click the clear btn in the note form
document.querySelector("#noteClearTextArea").addEventListener("click", (e) => {
  btnAudio.play();
  // clear the text Area
  el.textArea.value = "";
  // set time out to focus
  window.setTimeout(function () {
    document.querySelector("#myTextArea").focus();
  }, 1000);
}); //End

// when you click on the add Date btn in the note form
document.querySelector("#noteDate").addEventListener("click", (e) => {
  btnAudio.play();
  let date = new Date();
  el.textArea.value = date.toDateString();
  // set time out to focus
  window.setTimeout(function () {
    document.querySelector("#myTextArea").focus();
  }, 1000);
}); //End

// *************************************************************
//  Edit Note Code
// *************************************************************
// when you click on the save edit btn in the modal
document.querySelector("#saveEdit").addEventListener("click", (e) => {
  if (fcI < 0 || isNaN(fcI)) {
    warningNameTakenAudio.play();
    return;
  }
  let newNoteText = document.querySelector("#noteModalTextarea").value.trim();
  // check if text is empty
  if (newNoteText === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter text in the text area!", "error");
    return;
  }
  // grab current note
  let note =
    arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
      .noteArray[nI];

  // if note is valid set the new text
  if (note) {
    note.text = newNoteText;
  }
  display.showAlert("Note updated!", "success", 3000);
  addAudio.play();

  // write to file
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs);
  renderNotes();
});

// when you click on the close Btn on the edit note form
document.querySelector("#editClose").addEventListener("click", (e) => {
  clickAudio.play();
});
// *************************************************************
//  End Edit Note Code
// *************************************************************
// *************************************************************
//  End Note Code
// *************************************************************
// *************************************************************
// Settings code
// *************************************************************
// when You click on save settings Btn
document.querySelector("#settingsSave").addEventListener("click", (e) => {
  e.preventDefault();

  // get form data to create a settings object
  // theme radio code
  let themeValue = getRadioValue(el.settingsForm, "theme");
  // set the current theme
  currentTheme = themeValue;
  // fontsize radio code
  let fontSizeValue = getRadioValue(el.settingsForm, "fontSize");
  let settingsStorage = new SettingsStorage();
  let settingsObj = new SettingsObj();
  // set the object values
  settingsObj.theme = themeValue;
  settingsObj.fontSize = fontSizeValue;
  settingsObj.filePathArray = settingsArrayContainer;
  // set auto load true or false
  let y = document.querySelector("#autoLoad").checked;
  if (y === true) {
    settingsObj.autoLoad = true;
  } else {
    settingsObj.autoLoad = false;
  }
  // save the object
  settingsStorage.saveSettings(settingsObj);
  addAudio.play();
  display.showAlert("Saving User Settings!", "success", 900);
  // reset form
  el.settingsForm.reset();
  if (settingsObj.autoLoad) {
    // clear two arrays
    // setting the length to Zero emptys the array
    arrayOfFileCabs.length = 0;
    settingsArrayContainer.length = 0;
    display.displayNone(el.settingsForm);
    startUp();
  } else {
    // let settings = settingsStorage.getSettingsFromFile();
    applySettings(settingsObj);
    // hide form
    display.displayNone(el.settingsForm);

    renderFileCabs();
  }
}); // End

// when You click on settings form cancel Btn
document.querySelector("#settingsCancel").addEventListener("click", (e) => {
  cancelAudio.play();
  // hide form
  display.displayNone(el.settingsForm);

  renderFileCabs();
});

// when You click on settings form factory reset btn
document.querySelector("#factoryReset").addEventListener("click", (e) => {
  btnAudio.play();
  let settingsStorage = new SettingsStorage();
  settingsStorage.clearFileFromLocalStorage();
  loadUpSettingsForm();
});

// When You click on settings form add path to autoload Btn
document.querySelector("#settingsAddPath").addEventListener("click", (e) => {
  e.preventDefault();

  // this is for extensions
  let myOptions = {
    filters: [
      {
        name: "Custom File Type",
        extensions: ["deb"],
      },
    ],
    properties: ["openFile", "multiSelections"],
  };

  dialog.showOpenDialog(null, myOptions, (fileNames) => {
    if (fileNames === undefined || fileNames.length === 0) {
      display.showAlert("No file selected!", "error");
    } else {
      // got file name

      for (let filePath of fileNames) {
        pushFileSettingsContainer(filePath);
      }

      addImageAudio.play();
      // update Form
      display.showAutoLoadList(settingsArrayContainer);
    }
  });
});

// when You click on x to delete a file path
document.querySelector("#autoLoadList").addEventListener("click", (e) => {
  e.preventDefault();
  // event delegation
  if (e.target.classList.contains("deleteFile")) {
    if (!deleteMode) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to select Edit and Delete mode in menu to make a deletion",
        "error"
      );
      return;
    }
    if (!e.ctrlKey) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to hold down ctrl key to make a deletion",
        "error"
      );
      return;
    }

    if (e.ctrlKey) {
      if (deleteMode) {
        // this gets the data I embedded into the html
        let dataIndex = e.target.parentElement.parentElement.dataset.index;
        let deleteIndex = parseInt(dataIndex);
        // delete path
        settingsArrayContainer.splice(deleteIndex, 1);
        warningSelectAudio.play();
        // update Form
        display.showAutoLoadList(settingsArrayContainer);
      }
    }
  }
});
// *************************************************************
//  End Settings Code
// *************************************************************
