"use strict";
// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");

const electron = require("electron");
const { ipcRenderer } = electron;

//Select audio files
const addAudio = document.querySelector("#addAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const deleteAudio = document.querySelector("#deleteAudio");
const warningEmptyAudio = document.querySelector("#warningEmptyAudio");
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const warningNameTakenAudio = document.querySelector("#warningNameTakenAudio");

//Global variable's
//current File Cab Index
let fcI = -243;
// current Main Folder Index
let mfI = -243;
// currentSub Folder Index
let sfI = -243;
// current note Index
let nI = -243;
let myBody = document.querySelector("body");
let root = document.querySelector(":root");
//Theme current
let currentTheme = "Dark";
//Delete Mode
let deleteMode = false;
// create elements object
const el = new Elements();
// Pass elements to display
const display = new Display(el, $);

// This is the Main array that holds all the file cab objects
const arrayOfFileCabs = [];

//This enables JQuery ToolTips
$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

//The start of program exicution.
window.onload = function() {
  startUp();
};
//Start Up
function startUp() {
  console.log(root.style.fontSize);
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // increase font size
  // let root = document.querySelector(":root");
  // root.style.fontSize = "24px";
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();
  console.log(`start up function: the object is ${settings}`);
  console.log(settings);
  if (settings.type === "fileCab") {
    // loadsettings
    applySettings(settings);
  }

  if (settings.type === "noSettingsFound") {
    console.log("No valid settings on file");
  }

  // ############################################################
  // there is nothing that needs to run at start up, it is event driven
  //   document.querySelector("#blank").href = "assets/css/dark.css";
  //   document.querySelector("#blank").href = "assets/css/classic.css";
  // document.querySelector("body").style.backgroundColor = "black";
}

//*************************************************** */
// Helper functions
//*************************************************** */
//applySettings(settings)
function applySettings(settings) {
  // root.style.fontSize = "10px";
  console.log("settings loading: applySettings()");
  //10px x-small
  //12px small
  //16px normal
  //20px large
  //24px X-large

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

  //Set the theme
  switch (settings.theme) {
    case "Dark":
      document.querySelector("#blank").href = "assets/css/dark.css";
      document.querySelector("body").style.backgroundColor = "black";
      deleteMode = false;
      break;
    case "Light":
      document.querySelector("#blank").href = "assets/css/white.css";
      document.querySelector("body").style.backgroundColor = "white";
      deleteMode = false;
      break;
    default:
      console.log("No valid option");
    // code block
  }
}

// Create a new array with only the items name
function mapNamesOut(array) {
  let mapedArray = array.map(item => {
    return item.name;
  });
  return mapedArray;
}

// Sort an array by it's name
function sortArrayByName(array) {
  array.sort(function(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be eimagePathual
    return 0;
  }); //End sort function
}

function handleFilePath(imagePath) {
  if (imagePath === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a path in the name area!", "error");
    return;
  }

  //set image path
  //get primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  primaryArray[mfI].secondaryArray[sfI].noteArray[nI].imagePath = imagePath;
  // save file cab
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
  addImageAudio.play();
  display.showAlert("A new image was added to the note", "success");
}

function addImage() {
  //grab current note and add a image path property to it and save back to file

  //get primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;

  let imagePath;

  dialog.showOpenDialog(fileNames => {
    if (fileNames === undefined) {
      display.showAlert("No file selected", "error");
    } else {
      //got file name
      imagePath = fileNames[0];
      handleFilePath(imagePath);
    }
  });
}

function turnOffDeleteMode() {
  deleteMode = false;
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
//End Helper functions********************************

//************************************************ */
//IPC
//************************************************ */
//listen for inedex.js to send data
ipcRenderer.on("fileCab:add", (event, dataObj) => {
  if (deleteMode) {
    turnOffDeleteMode();
  }
  if (dataObj.name === "") {
    ui.showAlert("You did not enter a name for the File Cabinet!", "error");
    //redisplay
    //Get the names for all the file cabinets
    //and then send them to the Display
    display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
    return;
  }
  if (dataObj.fileNamePath === undefined) {
    display.showAlert("You clicked cancel", "error");
    //redisplay
    //Get the names for all the file cabinets
    //and then send them to the Display
    display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
    return;
  }
  // //check if the name already exists if it does alert and return
  //make a variable to return
  let isTaken = false;
  arrayOfFileCabs.forEach(element => {
    if (element.name === dataObj.name) {
      isTaken = true;
    }
  });
  if (isTaken) {
    ui.showAlert("That name is taken", "error");
    //redisplay
    //Get the names for all the file cabinets
    //and then send them to the Display
    display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
    return;
  }
  //create a file cab object
  let newfileCab = new FileCabObject(dataObj.name, dataObj.fileNamePath);
  //push the file cab obj into the array of file cabinets
  arrayOfFileCabs.push(newfileCab);
  //Write the file cab object to disk
  newfileCab.writeFileCabToHardDisk(fs, display);
  //redisplay
  //Get the names for all the file cabinets
  //and then send them to the UI
  display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
});
// End ipcRenderer.on("fileCab:add"********************
//*************************************************** */

//listen for inedex.js to send data
ipcRenderer.on("fileCab:load", (event, data) => {
  if (deleteMode) {
    turnOffDeleteMode();
  }

  // check if the name already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfFileCabs.forEach(element => {
    if (element.name === data.name) {
      isTaken = true;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
    //redisplay

    //Get the names for all the file cabinets
    //and then send them to the Display
    display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
    return;
  }
  //create a file cab object
  let newfileCab = new FileCabObject(
    data.name,
    data.fileNamePath,
    data.arrayOfPrimaryObjects
  );
  //push the file cab obj into the array of file cabinets
  arrayOfFileCabs.push(newfileCab);
  //Write the file cab object to disk
  newfileCab.writeFileCabToHardDisk(fs, display);

  //redisplay
  //Get the names for all the file cabinets
  //and then send them to the Display
  display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
});
//End ipcRenderer.on("fileCab:load"*****************************
// ***********************************************************

//listen for inedex.js to send data
ipcRenderer.on("Display:showAlert", (event, dataObj) => {
  display.showAlert(dataObj.message, dataObj.msgType);
}); //End ipcRenderer.on("Display:showAlert"

//listen for index.js to set deletemode
ipcRenderer.on("deleteMode:set", (event, deleteModeBool) => {
  deleteMode = deleteModeBool;
  if (deleteMode) {
    display.showAlert("You have entered delete mode", "success");
    myBody.style.backgroundColor = "#d3369c";
    myBody.style.background = "linear-gradient(#000000, #ff0000)";
  } else {
    display.showAlert("You Have exited delete mode", "success");
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
}); //End ipcRenderer.on("deleteMode:set"

//listen for index.js to set theme
ipcRenderer.on("Theme:set", (event, theme) => {
  if (deleteMode) {
    deleteMode = false;
    myBody.style.background = "none";
    if (currentTheme === "Dark") {
      myBody.style.backgroundColor = "black";
    }
    if (currentTheme === "Light") {
      myBody.style.backgroundColor = "white";
    }
  }

  currentTheme = theme;
  switch (theme) {
    case "Dark":
      document.querySelector("#blank").href = "assets/css/dark.css";
      document.querySelector("body").style.backgroundColor = "black";
      deleteMode = false;
      break;
    case "Light":
      document.querySelector("#blank").href = "assets/css/white.css";
      document.querySelector("body").style.backgroundColor = "white";
      deleteMode = false;
      break;
    default:
      console.log("No valid option");
    // code block
  }
});
// End ipcRenderer.on("Theme:set"

//listen for index.js to set theme
ipcRenderer.on("SettingsForm:show", event => {
  console.log("Show settings form");
  display.showSettingsForm();
});
//End IPC**************************************

//************************************************************************* */

//***************************************************************************** */

//************************************************************* */

//**************************************************************** */

//*************************************************************** */

// //********************************************** */
// //addEventListener for event delegation

el.fileCabList.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("fileCab")) {
    let fileCabName = e.target.textContent;

    //set's the current target active
    e.target.classList.add("active");

    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".fileCab");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "fileCab";
        }
        el[i].className = "fileCab active";
      };
    }
    //End code to set the active class

    //get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    fcI = index;

    let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
    display.paintMainFolderTabs(mapNamesOut(primaryArray));
  } // end contains 'fileCab

  //if shift is held down rename fileCab
  if (e.shiftKey) {
    display.showRenameFileCabForm();
  } //End shift Key down
}); //End el.fileCabList.addEventListener

//************************************************************************** */
el.mainFolderList.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("main")) {
    //set's the current target active
    e.target.classList.add("active");

    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".main");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "main";
        }
        el[i].className = "main active";
      };
    }
    //End code to set the active class

    //get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    mfI = index;

    let secondaryArray =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray;
    display.paintSubFolderTabs(mapNamesOut(secondaryArray));

    //check if control was down, if so delete
    if (e.ctrlKey) {
      if (deleteMode) {
        //delete main folder
        //get primary array
        let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
        //Delete main folder
        primaryArray.splice(mfI, 1);
        // save file cab
        arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
        deleteAudio.play();
        display.showAlert("Main folder deleted!", "success");
        display.paintMainFolderTabs(mapNamesOut(primaryArray));
      } else {
        warningEmptyAudio.play();
        display.showAlert(
          "You have to select delete mode in menu to make a deletion",
          "error"
        );
      }
    } //End control key down
  }
}); //End el.mainFolderList.addEventListener

//************************************************************************ */
el.subFolderList.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("sub")) {
    //set's the current target active
    e.target.classList.add("active");

    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".sub");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "sub";
        }
        el[i].className = "sub active";
      };
    }
  }
  //End code to set the active class

  //get the index from the html
  let index = e.target.dataset.index;
  index = parseInt(index);
  sfI = index;

  //Bug fix
  if (isNaN(sfI)) {
    //  display.paintNotes will throw an error, when you click outside the subfolder items
    //if it's not a number return
    return;
  }

  //send the note array to the Display
  display.paintNotes(
    arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
      .noteArray
  );

  if (e.ctrlKey) {
    if (deleteMode) {
      //DELETE sub folder
      //grab array from file
      let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
      //grab the secondary array and delete sub folder
      primaryArray[mfI].secondaryArray.splice(sfI, 1);
      //set the primary array back to file
      arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
      deleteAudio.play();
      display.showAlert("Sub folder deleted!", "success");
      //redisplay sub folder
      let secondaryArray =
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray;
      //send the note array to the Display
      display.paintSubFolderTabs(mapNamesOut(secondaryArray));
    } else {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to select delete mode in menu to make a deletion",
        "error"
      );
    }
  } //End control key down
}); //End el.subFolderList.addEventListener

//****************************************************** */
// When the user clicks on a note
el.noteList.addEventListener("click", e => {
  //This gets the data I embedded into the html
  let dataIndex = e.target.dataset.index;
  let deleteIndex = parseInt(dataIndex);
  nI = deleteIndex;
  // //This makes sure only one picture in a note shows up in the note area
  let picArray = [];
  let el = document.querySelectorAll(".myPic");
  //push all pic index's into an array to loop through next
  for (let i = 0; i < el.length; i++) {
    //remove all elements with the class of .myPic
    let indexP = el[i].getAttribute("data-pIndex");
    indexP = parseInt(indexP);
    picArray.push(indexP);
  }
  //loop through picArray and return if the picture is already displayed
  for (let ii = 0; ii < picArray.length; ii++) {
    if (picArray[ii] === nI) {
      nI = -243;
      return;
    }
  }

  // event delegation
  if (e.target.classList.contains("myPic")) {
    // remove image
    e.target.remove();
  }

  // event delegation
  if (e.target.classList.contains("note")) {
    //grab array from file
    let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;

    //see if the note has a imagePath
    let selectedNote = primaryArray[mfI].secondaryArray[sfI].noteArray[nI];

    if (selectedNote.imagePath) {
      let oImg = document.createElement("img");
      oImg.setAttribute("src", selectedNote.imagePath);
      oImg.setAttribute("alt", "na");
      oImg.setAttribute("width", "100%");
      oImg.setAttribute("data-pIndex", nI);
      oImg.className = "myPic";
      //insert the image after current note

      // You can not use el.noteList because you are in the addeventListener for el.noteList
      //use this.noteList
      this.noteList.insertBefore(oImg, e.target.nextSibling);
      // 2ND fix: just reselect the element, both will work
      // document
      //   .querySelector("#noteList")
      //   .insertBefore(oImg, e.target.nextSibling);
    }
    //check if the alt Key is held down and add Image to note
    if (e.altKey) {
      addImage();
      return;
    }
    //if shift is down remove the current path
    if (e.shiftKey) {
      // //grab array from file
      // let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
      selectedNote.imagePath = null;
      //write to file
      arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
      //reasign current note
      nI = -243;
      deleteAudio.play();
      display.showAlert("Removed the image from note!", "success");
      //send note array to display
      display.paintNotes(
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
          .noteArray
      );
    }

    //check if control was down, if so delete note
    if (e.ctrlKey) {
      if (deleteMode) {
        //grab array from file
        let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
        //grab the note array and delete current note
        primaryArray[mfI].secondaryArray[sfI].noteArray.splice(deleteIndex, 1);
        //write to file
        arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
        //reasign current note
        nI = -243;
        deleteAudio.play();
        display.showAlert("Note deleted!", "success");
        //send note array to display
        display.paintNotes(
          arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
            .noteArray
        );
      } else {
        warningEmptyAudio.play();
        display.showAlert(
          "You have to select delete mode in menu to make a deletion",
          "error"
        );
      }
    } //End control key down
  } //End class name contains note
}); //End el.noteList.addEventListener

// //********************************************* */

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//show forms addEventListener

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Main folder code

//When You click on the + in the main foleder heading
el.addShowFormMain.addEventListener("click", e => {
  display.showMainFolderForm();
}); // End el.addShowFormMain.addEventListener

//When you click on the add main folder btn
document.querySelector("#mainFolderAdd").addEventListener("click", e => {
  e.preventDefault();
  //grab fileCab
  let fileCab = arrayOfFileCabs[fcI];
  //grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //grab text for primary object
  let primaryName = el.textNameMain.value.trim();
  //check if text is empty

  if (primaryName === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a name for the Main Folder!", "error");
    return;
  }

  //Create primary object
  let primaryObj = new PrimaryObj(primaryName);
  //check if the name already exists if it does alert and return and set current main folder to -243
  //make a variable to return
  let isTaken = false;
  primaryArray.forEach(element => {
    if (primaryName === element.name) {
      isTaken = true;
    }
  });
  //check for taken name
  if (isTaken) {
    warningNameTakenAudio.play();
    display.showAlert("That name is taken", "error");
    mfI = -243;
  } else {
    //push primary object into array
    primaryArray.push(primaryObj);
    //sort primary array by name
    sortArrayByName(primaryArray);
    // save file cab
    fileCab.writeFileCabToHardDisk(fs, display);
    addAudio.play();
    display.showAlert("A new main folder was added", "success", 1500);
    //Hide form

    //reset form
    el.mainFolderForm.reset();

    // send main folder array to display
    display.paintMainFolderTabs(mapNamesOut(primaryArray));
  } //End else statement
}); //End

//When You click on cancel btn on the main folder form
document.querySelector("#mainFolderCancel").addEventListener("click", e => {
  // reset form
  el.mainFolderForm.reset();
  // hide form
  display.displayNone(el.mainFolderForm);
}); //End

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Sub folder code

//When You click + in the subfolder heading
el.addShowFormSub.addEventListener("click", e => {
  display.showSubFolderForm();
}); //End

//When You click on the add sub folder btn in the sub folder form
document.querySelector("#subFolderAdd").addEventListener("click", e => {
  e.preventDefault();
  //grab array from file
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //create secondary obj
  let secondaryName = el.textNameSub.value.trim();
  if (secondaryName === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a name for the Sub Folder!", "error");
    return;
  }
  let secondaryObject = new SecondaryObj(secondaryName);
  //check if the name already exists if it does alert and return and set current sub folder to -243
  //make a variable to return
  let isTaken = false;
  primaryArray[mfI].secondaryArray.forEach(element => {
    if (secondaryName === element.name) {
      isTaken = true;
      return;
    }
  });
  //check for taken name
  if (isTaken) {
    warningNameTakenAudio.play();
    display.showAlert("That name is taken", "error");
  } else {
    //push object into array
    primaryArray[mfI].secondaryArray.push(secondaryObject);
    // sort secondary array by name
    sortArrayByName(primaryArray[mfI].secondaryArray);
    //save file cab
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
    addAudio.play();
    display.showAlert("A new sub folder was added", "success", 1500);
    //reset form
    subFolderForm.reset();
    //Grab the secondary array
    let secondaryArray = primaryArray[mfI].secondaryArray;
    //Paint the screen
    display.paintSubFolderTabs(mapNamesOut(secondaryArray));
  } //End else statement
}); //End

//When You click the cancel btn in the sub folder form
document.querySelector("#subFolderCancel").addEventListener("click", e => {
  //reset form
  el.subFolderForm.reset();
  //hide form
  display.displayNone(el.subFolderForm);
}); //End

//Note Code**************************************************

//When You click the + in the Note Heading
el.addShowFormNote.addEventListener("click", e => {
  display.showNoteForm();
}); //End

//When You click the add note btn in the note form
document.querySelector("#noteAdd").addEventListener("click", e => {
  e.preventDefault();
  // grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //create note
  let noteText = el.textArea.value.trim();
  //check if text is empty
  if (noteText === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter note in the text area!", "error");
    return;
  }
  //create new note
  let newNote = new Note(noteText);
  //push note into note array
  primaryArray[mfI].secondaryArray[sfI].noteArray.push(newNote);
  //save file cab
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
  addAudio.play();
  display.showAlert("A new note was added", "success", 900);
  nI = -243;
  display.paintNotes(primaryArray[mfI].secondaryArray[sfI].noteArray);
}); //End

// When You click the cancel btn in the note form
document.querySelector("#noteCancel").addEventListener("click", e => {
  el.noteForm.reset();
  display.displayNone(el.noteForm);
}); //End

// When You click the clear btn in the note form
document.querySelector("#noteClearTextArea").addEventListener("click", e => {
  //clear the text Area
  el.textArea.value = "";
}); //End

//When you click on the add Date btn in the note form
document.querySelector("#noteDate").addEventListener("click", e => {
  let date = new Date();
  el.textArea.value = date.toDateString();
}); //End

//When You click on the rename File Cab rename Btn
document.querySelector("#renameFileCabAdd").addEventListener("click", e => {
  e.preventDefault();
  //change file cabinet name
  arrayOfFileCabs[fcI].name = el.textRenameFileCab.value;
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, display);
  //reset form
  renameFileCabForm.reset();
  //send file cabinets array to display
  display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
}); //End

//When You click on the rename File Cab cancel Btn
document.querySelector("#renameFileCabCancel").addEventListener("click", e => {
  //reset form
  el.renameFileCabForm.reset();
  //hide form
  display.displayNone(el.renameFileCabForm);
});
//settings
//When You click on save settings Btn
document.querySelector("#settingsSave").addEventListener("click", e => {
  e.preventDefault();
  console.log("saving setings");
  //Get form data to create a settings object

  //create settings object
  let settingsObj = new SettingsObj("Light", "x-large");
  let settingsStorage = new SettingsStorage();
  settingsStorage.saveSettings(settingsObj);
  //reset form
  el.settingsForm.reset();
  //hide form
  display.displayNone(el.settingsForm);
  display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
}); //End

//When You click on settings form cancel Btn
document.querySelector("#settingsReset").addEventListener("click", e => {
  console.log("resetting default setttings");
  let settingsStorage = new settingsStorage();
  settingsStorage.clearFileFromLocalStroage();
  //reset form
  el.settingsForm.reset();
  //hide form
  display.displayNone(el.settingsForm);
  display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
});

//When You click on settings form cancel Btn
document.querySelector("#settingsCancel").addEventListener("click", e => {
  console.log("cancel btn clicked");
  //reset form
  el.settingsForm.reset();
  //hide form
  display.displayNone(el.settingsForm);
  display.paintFileCabTabs(mapNamesOut(arrayOfFileCabs));
});
