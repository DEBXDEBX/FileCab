// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");

const electron = require("electron");
const { ipcRenderer } = electron;

//Select ul's
const fileCabUL = document.querySelector("#fileCabList");
const mainFolderUL = document.querySelector("#mainFolderList");
const subFolderUL = document.querySelector("#subFolderList");
const noteSection = document.querySelector("#noteList");

//Select textName and textArea
const textName = document.querySelector("#name");
const textArea = document.querySelector("#myTextArea");

//Select audio files
const addAudio = document.querySelector("#addAudio");
const addFileCabAudio = document.querySelector("#addFileCabAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const deleteAudio = document.querySelector("#deleteAudio");
const warningEmptyAudio = document.querySelector("#warningEmptyAudio");
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const warningNameTakenAudio = document.querySelector("#warningNameTakenAudio");
const warningMaxNumberAudio = document.querySelector("#warningMaxNumberAudio");

//Global variable's
//current File Cab Index
let fcI = -243;
// current Main Folder Index
let mfI = -243;
// currentSub Folder Index
let sfI = -243;
// current note Index
let nI = -243;
//Create ui object
const ui = new Ui();
// This is the Main array that holds all the file cab objects
const arrayOfFileCabs = [];

//The start of program exicution.
window.onload = function() {
  // startUp();
  // console.log(dialog);
};
//Start Up
function startUp() {
  // there is nothing that needs to run at start up, it is event driven
}

//*************************************************** */
// Helper functions
//*************************************************** */
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
  console.log(imagePath);
  if (imagePath === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter a path in the name area!", "error");
    return;
  }
  console.log(imagePath);
  //set image path
  //get primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  primaryArray[mfI].secondaryArray[sfI].noteArray[nI].imagePath = imagePath;
  console.log(primaryArray[mfI].secondaryArray[sfI].noteArray[nI].imagePath);
  // save file cab
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
  addImageAudio.play();
  ui.showAlert("A new image was added to the note", "success");
}
//End Helper functions********************************

//************************************************ */
//IPC
//************************************************ */
//listen for inedex.js to send data
ipcRenderer.on("fileCab:add", (event, dataObj) => {
  if (dataObj.name === "") {
    ui.showAlert("You did not enter a name for the File Cabinet!", "error");
    // warningEmptyAudio.play();
    return;
  }
  if (dataObj.fileNamePath === undefined) {
    ui.showAlert("You clicked cancel");
    return;
  }
  // //check if the name already exists if it does alert and return
  //make a variable to return
  let isTaken = false;
  arrayOfFileCabs.forEach(element => {
    if (element.name === dataObj.name) {
      isTaken = true;
      return;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
    return;
  }
  //create a file cab object
  let newfileCab = new FileCabObject(dataObj.name, dataObj.fileNamePath);
  //push the file cab obj into the array of file cabinets
  arrayOfFileCabs.push(newfileCab);
  //Write the file cab object to disk
  newfileCab.writeFileCabToHardDisk(fs, ui);

  //redisplay
  fcI = -243;
  currentMainFolder = -243;
  mfI = -243;
  currentSubFolder = -243;
  sfI = -243;
  nI = -243;
  ui.clearFileCabDisplay();
  ui.clearPrimaryDisplay();
  ui.clearSubDisplay();
  ui.clearNoteDisplay();
  //Get the names for all the file cabinets
  //and then send them to the UI
  ui.paintScreen(mapNamesOut(arrayOfFileCabs));
});
// End ipcRenderer.on("fileCab:add"********************
//*************************************************** */

//listen for inedex.js to send data
ipcRenderer.on("fileCab:load", (event, data) => {
  // check if the name already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfFileCabs.forEach(element => {
    if (element.name === data.name) {
      isTaken = true;
      return;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
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
  newfileCab.writeFileCabToHardDisk(fs, ui);

  //redisplay
  fcI = -243;
  currentMainFolder = -243;
  mfI = -243;
  currentSubFolder = -243;
  sfI = -243;
  nI = -243;
  ui.clearFileCabDisplay();
  ui.clearPrimaryDisplay();
  ui.clearSubDisplay();
  ui.clearNoteDisplay();
  //Get the names for all the file cabinets
  //and then send them to the UI
  ui.paintScreen(mapNamesOut(arrayOfFileCabs));
});
//End ipcRenderer.on("fileCab:load"*****************************
// ***********************************************************

//listen for inedex.js to send data
ipcRenderer.on("UI:showAlert", (event, dataObj) => {
  ui.showAlert(dataObj.message, dataObj.msgType);
}); //End ipcRenderer.on("UI:showAlert"

//End IPC**************************************

//************************************************************************* */
document.querySelector("#addMainFolder").addEventListener("click", e => {
  if (fcI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a  File Cabinet first!", "error");
    return;
  }

  //grab fileCab
  let fileCab = arrayOfFileCabs[fcI];
  //grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //create primary object
  let primaryName = textName.value.trim();
  if (primaryName === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter a name for the Main Folder!", "error");
    return;
  }
  let primaryObj = new PrimaryObj(primaryName);
  //check if the name already exists if it does alert and return and set current main folder to -243
  //make a variable to return
  let isTaken = false;
  primaryArray.forEach(element => {
    if (primaryName === element.name) {
      isTaken = true;
      return;
    }
  });
  if (isTaken) {
    warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
    currentMainFolder = -243;
    mfI = -243;
  } else {
    //push primary object into array
    primaryArray.push(primaryObj);
    //sort primary array by name
    sortArrayByName(primaryArray);

    // save file cab
    fileCab.writeFileCabToHardDisk(fs, ui);
    addAudio.play();
    ui.showAlert("A new main folder was added", "success");
    //redisplay paint screen
    ui.clearPrimaryDisplay();
    currentMainFolder = -243;
    mfI = -243;
    ui.clearSubDisplay();
    currentSubFolder = -243;
    sfI = -243;
    ui.clearNoteDisplay();
    nI = -243;

    // mapped primary array
    ui.paintScreenPrimary(mapNamesOut(primaryArray));
  } //End else statement
}); //End add main folder
//***************************************************************************** */

document.querySelector("#addSubFolder").addEventListener("click", e => {
  if (fcI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }
  if (mfI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Main Folder first!", "error");
    return;
  }

  //grab array from file
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //grab the primary object index

  //create secondary obj
  let secondaryName = textName.value.trim();
  if (secondaryName === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter a name for the Sub Folder!", "error");
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
  if (isTaken) {
    warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
    currentSubFolder = -243;
    sfI = -243;
  } else {
    //push object into array
    primaryArray[mfI].secondaryArray.push(secondaryObject);
    // sort secondary array by name
    sortArrayByName(primaryArray[mfI].secondaryArray);
    //save array storage
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);

    addAudio.play();
    ui.showAlert("A new sub folder was added", "success");
    //redisplay paint screen
    ui.clearSubDisplay();
    currentSubFolder = -243;
    sfI = -243;
    ui.clearNoteDisplay();
    nI = -243;
    let secondaryArray = primaryArray[mfI].secondaryArray;

    ui.paintScreenSecondary(mapNamesOut(secondaryArray));
  } //End else statement
}); //End add sub folder

//************************************************************* */

document.querySelector("#addNote").addEventListener("click", e => {
  // get current notge index

  if (fcI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }
  if (mfI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Main Folder first!", "error");
    return;
  }
  if (sfI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Sub Folder first!", "error");
    return;
  }
  // grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //create note
  let noteText = textArea.value.trim();
  if (noteText === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter note in the text area!", "error");
    ui.showAndCheckTextArea();
    return;
  }
  let newNote = new Note(noteText);
  console.table(newNote);
  //push note into note array
  primaryArray[mfI].secondaryArray[sfI].noteArray.push(newNote);
  //save array storage
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
  addAudio.play();
  ui.showAlert("A new note was added", "success");
  //redisplay paint screen
  ui.clearNoteDisplay();
  nI = -243;
  ui.paintScreenNote(primaryArray[mfI].secondaryArray[sfI].noteArray);
}); //End add note
//************************************************** */

document.querySelector("#addImage").addEventListener("click", e => {
  //get current note index

  if (fcI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }
  if (mfI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Main Folder first!", "error");
    return;
  }
  if (sfI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Sub Folder first!", "error");
    return;
  }
  if (nI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Note first!", "error");
    return;
  }

  //grab current note and add a image path property to it and save back to file

  //get primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;

  //get the image path from the name text field
  // let fullImagePath = textName.value.trim();
  let imagePath;

  dialog.showOpenDialog(fileNames => {
    if (fileNames === undefined) {
      let message = "No file selected";
      let msgType = "error";
      console.log("there is no file");
      // mainWindow.webContents.send("UI:showAlert", { message, msgType });
    } else {
      console.log("got file name");
      imagePath = fileNames[0];
      console.log(imagePath);
      handleFilePath(imagePath);
    }
  });
}); //End add event listener

//**************************************************************** */

//*************************************************************** */

//********************************************** */
//addEventListener for event delegation

fileCabUL.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("fileCab")) {
    let fileCabName = e.target.textContent;

    //set's the current target active
    e.target.classList.add("active");

    //The Next code is to set the current tab color white with the active class
    var el = document.querySelector(".fileCab");
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
    ui.clearPrimaryDisplay();
    currentMainFolder = -243;
    mfI = -243;
    ui.clearSubDisplay();
    currentSubFolder = -243;
    sfI = -243;
    ui.clearNoteDisplay();
    nI = -243;
    let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
    ui.paintScreenPrimary(mapNamesOut(primaryArray));
  } // end contains 'fileCab

  //if shift is held down move file cab left
  if (e.shiftKey) {
    console.log("Shift key is held down");
  }

  //if control is held down delete file cabinet and move files down one
  if (e.ctrlKey) {
    console.log("control key held down");
  }
});

//************************************************************************** */
mainFolderUL.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("main")) {
    //set's the current target active
    e.target.classList.add("active");

    //The Next code is to set the current tab color white with the active class
    var el = document.querySelector(".main");
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
    sfI = -243;
    nI = -243;

    ui.clearNoteDisplay();
    let secondaryArray =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray;
    ui.paintScreenSecondary(mapNamesOut(secondaryArray));

    //check if control was down, if so delete
    if (e.ctrlKey) {
      //get primary array
      let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
      //Delete main folder
      primaryArray.splice(mfI, 1);
      // save file cab
      arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
      deleteAudio.play();
      ui.showAlert("Main folder deleted!", "success");
      //clear main folder, sub folder and notes
      ui.clearPrimaryDisplay();
      mfI = -243;
      ui.clearSubDisplay();
      sfI = -243;
      ui.clearNoteDisplay();
      nI = -243;
      //redisplay main folder
      //mapped primary array
      ui.paintScreenPrimary(mapNamesOut(primaryArray));
      // ui.paintScreenPrimary(fcI);
    } //End control key down
  }
});

//************************************************************************ */
subFolderUL.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("sub")) {
    //set's the current target active
    e.target.classList.add("active");

    //The Next code is to set the current tab color white with the active class
    var el = document.querySelector(".sub");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "sub";
        }
        el[i].className = "sub active";
      };
    }
    //End code to set the active class
  }

  //get the index from the html
  let index = e.target.dataset.index;
  index = parseInt(index);
  sfI = index;
  nI = -243;
  //send the note array to ui.paintScreenNote()
  ui.paintScreenNote(
    arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
      .noteArray
  );

  if (e.ctrlKey) {
    //grab array from file
    let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;

    //grab the secondary array and delete sub folder
    primaryArray[mfI].secondaryArray.splice(sfI, 1);
    //set the primary array back to file
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
    // myStorage.setArrayToFileName(primaryArray, fileName);
    deleteAudio.play();
    ui.showAlert("Sub folder deleted!", "success");
    //clear sub folder and notes
    ui.clearSubDisplay();
    sfI = -243;
    ui.clearNoteDisplay();
    nI = -243;
    //redisplay sub folder
    let secondaryArray =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray;
    ui.paintScreenSecondary(mapNamesOut(secondaryArray));
  } //End control key down
}); //End

//****************************************************** */
// When the user clicks on a note
noteSection.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("myPic")) {
    // remove image
    e.target.remove();
  }
  let index = e.target.dataset.index;
  index = parseInt(index);
  nI = index;
  console.log(`note index: ${nI}`);
  if (nI === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Note first!", "error");
    return;
  }
  //get the index from the html

  // event delegation
  if (e.target.classList.contains("note")) {
    if (nI === -243) {
      warningSelectAudio.play();
      ui.showAlert("Please select a Note first!", "error");
      return;
    }
    //This gets the data I embedded into the html
    let dataIndex = e.target.dataset.index;
    let deleteIndex = parseInt(dataIndex);
    nI = deleteIndex;
    console.log(`note index: ${nI}`);
    //if the note has a image path create elemment and insert into document

    //grab array from file
    let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
    console.log(`note index: ${nI}`);
    //see if the note has a imagePath
    let selectedNote = primaryArray[mfI].secondaryArray[sfI].noteArray[nI];
    console.table(selectedNote);
    if (selectedNote.imagePath) {
      console.log("there is an image path");
      // image path is not R2D2
      let oImg = document.createElement("img");
      oImg.setAttribute("src", selectedNote.imagePath);
      oImg.setAttribute("alt", "na");
      oImg.setAttribute("width", "100%");
      oImg.className = "myPic";
      //insert the image after current note
      noteSection.insertBefore(oImg, e.target.nextSibling);
    }

    if (selectedNote.imagePath === "R2D2") {
      // console.log('image path is R2D2');
    }

    //check if control was down, if so delete note
    if (e.ctrlKey) {
      console.log(`note index: ${nI}`);
      //grab array from file
      let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;

      //grab the note array and delete current note
      primaryArray[mfI].secondaryArray[sfI].noteArray.splice(deleteIndex, 1);
      //write to file
      arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
      //reasign current note
      nI = -243;
      deleteAudio.play();
      ui.showAlert("Note deleted!", "success");
      //redisplay notes
      console.log(`note index: ${nI}`);
      ui.paintScreenNote(
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
          .noteArray
      );
    } //End control key down
  } //End class name contains note
}); //End event listener

//********************************************* */

//End addEventListener
