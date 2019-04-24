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

//Select headings
const mfHeading = document.querySelector("#headingMainFolder");
const sfHeading = document.querySelector("#headingSubFolder");
const nHeading = document.querySelector("#headingNote");
//Select forms
const mainFolderForm = document.querySelector("#mainFolderForm");
const subFolderForm = document.querySelector("#subFolderForm");
const noteForm = document.querySelector("#noteForm");
//Select add show forms +
const addShowFormMain = document.querySelector("#mfadd");
const addShowFormSub = document.querySelector("#sfadd");
const addShowFormNote = document.querySelector("#nadd");
//Select textName and textArea
const textNameMain = document.querySelector("#mainFolderName");
const textNameSub = document.querySelector("#subFolderName");
const textArea = document.querySelector("#myTextArea");

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
//Create ui object
const ui = new Ui($);
// This is the Main array that holds all the file cab objects
const arrayOfFileCabs = [];

//The start of program exicution.
window.onload = function() {
  startUp();
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
  if (imagePath === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter a path in the name area!", "error");
    return;
  }

  //set image path
  //get primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  primaryArray[mfI].secondaryArray[sfI].noteArray[nI].imagePath = imagePath;
  // save file cab
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
  addImageAudio.play();
  ui.showAlert("A new image was added to the note", "success");
}

function addImage() {
  //grab current note and add a image path property to it and save back to file

  //get primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;

  let imagePath;

  dialog.showOpenDialog(fileNames => {
    if (fileNames === undefined) {
      let message = "No file selected";
      let msgType = "error";
      console.log("there is no file");
      // mainWindow.webContents.send("UI:showAlert", { message, msgType });
    } else {
      //got file name
      imagePath = fileNames[0];
      handleFilePath(imagePath);
    }
  });
}

//End Helper functions********************************

//************************************************ */
//IPC
//************************************************ */
//listen for inedex.js to send data
ipcRenderer.on("fileCab:add", (event, dataObj) => {
  if (dataObj.name === "") {
    ui.showAlert("You did not enter a name for the File Cabinet!", "error");
    //redisplay
    fcI = -243;
    mfI = -243;
    sfI = -243;
    nI = -243;
    ui.clearFileCabDisplay();
    ui.clearPrimaryDisplay();
    ui.clearSubDisplay();
    ui.clearNoteDisplay();
    ui.displayNone(mfHeading);
    ui.displayNone(sfHeading);
    ui.displayNone(nHeading);
    ui.displayNone(mainFolderForm);
    ui.displayNone(subFolderForm);
    ui.displayNone(noteForm);

    //Get the names for all the file cabinets
    //and then send them to the UI
    ui.paintScreen(mapNamesOut(arrayOfFileCabs));
    return;
  }
  if (dataObj.fileNamePath === undefined) {
    ui.showAlert("You clicked cancel", "error");
    //redisplay
    fcI = -243;
    mfI = -243;
    sfI = -243;
    nI = -243;
    ui.clearFileCabDisplay();
    ui.clearPrimaryDisplay();
    ui.clearSubDisplay();
    ui.clearNoteDisplay();
    ui.displayNone(mfHeading);
    ui.displayNone(sfHeading);
    ui.displayNone(nHeading);
    ui.displayNone(mainFolderForm);
    ui.displayNone(subFolderForm);
    ui.displayNone(noteForm);

    //Get the names for all the file cabinets
    //and then send them to the UI
    ui.paintScreen(mapNamesOut(arrayOfFileCabs));
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
    fcI = -243;
    mfI = -243;
    sfI = -243;
    nI = -243;
    ui.clearFileCabDisplay();
    ui.clearPrimaryDisplay();
    ui.clearSubDisplay();
    ui.clearNoteDisplay();
    ui.displayNone(mfHeading);
    ui.displayNone(sfHeading);
    ui.displayNone(nHeading);
    ui.displayNone(mainFolderForm);
    ui.displayNone(subFolderForm);
    ui.displayNone(noteForm);

    //Get the names for all the file cabinets
    //and then send them to the UI
    ui.paintScreen(mapNamesOut(arrayOfFileCabs));
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
  mfI = -243;
  sfI = -243;
  nI = -243;
  ui.clearFileCabDisplay();
  ui.clearPrimaryDisplay();
  ui.clearSubDisplay();
  ui.clearNoteDisplay();
  ui.displayNone(mfHeading);
  ui.displayNone(sfHeading);
  ui.displayNone(nHeading);
  ui.displayNone(mainFolderForm);
  ui.displayNone(subFolderForm);
  ui.displayNone(noteForm);

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
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
    //redisplay
    fcI = -243;
    mfI = -243;
    sfI = -243;
    nI = -243;
    ui.clearFileCabDisplay();
    ui.clearPrimaryDisplay();
    ui.clearSubDisplay();
    ui.clearNoteDisplay();
    ui.displayNone(mfHeading);
    ui.displayNone(sfHeading);
    ui.displayNone(nHeading);
    ui.displayNone(mainFolderForm);
    ui.displayNone(subFolderForm);
    ui.displayNone(noteForm);

    //Get the names for all the file cabinets
    //and then send them to the UI
    ui.paintScreen(mapNamesOut(arrayOfFileCabs));
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
  mfI = -243;
  sfI = -243;
  nI = -243;
  ui.clearFileCabDisplay();
  ui.clearPrimaryDisplay();
  ui.clearSubDisplay();
  ui.clearNoteDisplay();
  ui.displayNone(mfHeading);
  ui.displayNone(sfHeading);
  ui.displayNone(nHeading);
  ui.displayNone(mainFolderForm);
  ui.displayNone(subFolderForm);
  ui.displayNone(noteForm);
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

//***************************************************************************** */

//************************************************************* */

//**************************************************************** */

//*************************************************************** */

//********************************************** */
//addEventListener for event delegation

fileCabUL.addEventListener("click", e => {
  ui.displayNone(mainFolderForm);
  ui.displayNone(subFolderForm);
  ui.displayNone(noteForm);

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

    // show and hide headings
    ui.displayBlock(mfHeading);
    ui.displayNone(sfHeading);
    ui.displayNone(nHeading);

    //get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    fcI = index;
    ui.clearPrimaryDisplay();

    mfI = -243;
    ui.clearSubDisplay();

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
  ui.displayNone(mainFolderForm);
  ui.displayNone(subFolderForm);
  ui.displayNone(noteForm);
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
    sfI = -243;
    nI = -243;

    //show and hide headings
    ui.displayBlock(sfHeading);
    ui.displayNone(nHeading);

    ui.clearNoteDisplay();
    let secondaryArray =
      arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray;
    ui.paintScreenSecondary(mapNamesOut(secondaryArray));

    //check if control was down, if so delete
    if (e.ctrlKey) {
      //delete main folder
      //get primary array
      let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
      //Delete main folder
      primaryArray.splice(mfI, 1);
      // save file cab
      arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
      deleteAudio.play();
      ui.showAlert("Main folder deleted!", "success");
      //clear main folder, sub folder and notes
      ui.displayNone(sfHeading);
      ui.displayNone(noteForm);
      ui.displayNone(subFolderForm);
      ui.displayNone(mainFolderForm);
      ui.clearPrimaryDisplay();
      mfI = -243;
      ui.clearSubDisplay();
      sfI = -243;
      ui.clearNoteDisplay();
      nI = -243;
      //redisplay main folder
      //mapped primary array
      ui.paintScreenPrimary(mapNamesOut(primaryArray));
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
    //End code to set the active class
  }

  //get the index from the html
  let index = e.target.dataset.index;
  index = parseInt(index);
  sfI = index;
  nI = -243;

  //Bug fix
  if (isNaN(sfI)) {
    // ui.paintScreenNote will throw an error, when you click outside the subfolder items
    //if it's not a number return
    return;
  }

  //show and hide headings
  ui.displayBlock(nHeading);
  ui.displayNone(subFolderForm);

  //send the note array to ui.paintScreenNote()

  ui.paintScreenNote(
    arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
      .noteArray
  );

  if (e.ctrlKey) {
    //DELETE sub folder
    //grab array from file
    let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;

    //grab the secondary array and delete sub folder
    primaryArray[mfI].secondaryArray.splice(sfI, 1);
    //set the primary array back to file
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
    ui.displayNone(nHeading);
    ui.displayNone(noteForm);
    ui.displayNone(subFolderForm);
    ui.displayNone(mainFolderForm);
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
      noteSection.insertBefore(oImg, e.target.nextSibling);
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
      arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
      //reasign current note
      nI = -243;
      deleteAudio.play();
      ui.showAlert("Removed the image from note!", "success");
      //redisplay notes
      ui.clearNoteDisplay();
      ui.paintScreenNote(
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
          .noteArray
      );
    }

    //check if control was down, if so delete note
    if (e.ctrlKey) {
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
      ui.paintScreenNote(
        arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray[sfI]
          .noteArray
      );
    } //End control key down
  } //End class name contains note
}); //End event listener

//********************************************* */
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//show forms addEventListener

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Main folder code

//When You click on the + in the main heading
addShowFormMain.addEventListener("click", e => {
  ui.displayBlock(mainFolderForm);
  ui.displayNone(subFolderForm);
  ui.displayNone(noteForm);
  ui.displayNone(sfHeading);
  ui.displayNone(nHeading);
  // ui.clearPrimaryDisplay();
  mfI = -243;
  ui.clearSubDisplay();
  sfI = -243;
  ui.clearNoteDisplay();
  nI = -243;
});

//When you click on the add main folder btn
document.querySelector("#mainFolderAdd").addEventListener("click", e => {
  e.preventDefault();
  //grab fileCab
  let fileCab = arrayOfFileCabs[fcI];
  //grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //grab text for primary object
  let primaryName = textNameMain.value.trim();
  //check if text is empty

  if (primaryName === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter a name for the Main Folder!", "error");
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
    ui.showAlert("That name is taken", "error");
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
    //Hide form
    ui.displayNone(mainFolderForm);
    //Hide sub folder heading and form
    ui.displayNone(sfHeading);
    ui.displayNone(subFolderForm);
    //hide note heading and foem
    ui.displayNone(nHeading);
    //reset form
    mainFolderForm.reset();
    //redisplay paint screen
    ui.clearPrimaryDisplay();

    mfI = -243;
    ui.clearSubDisplay();

    sfI = -243;
    ui.clearNoteDisplay();
    nI = -243;
    // mapped primary array
    ui.paintScreenPrimary(mapNamesOut(primaryArray));
  } //End else statement
}); //End

//When You click on cancel btn on the main folder form
document.querySelector("#mainFolderCancel").addEventListener("click", e => {
  //Hide form
  ui.displayNone(mainFolderForm);
  mainFolderForm.reset();
  //redisplay primary
  ui.paintScreenPrimary(
    mapNamesOut(arrayOfFileCabs[fcI].arrayOfPrimaryObjects)
  );
}); //End

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Sub folder code

//When You click + in the subfolder heading
addShowFormSub.addEventListener("click", e => {
  ui.displayBlock(subFolderForm);
  ui.displayNone(mainFolderForm);
  ui.displayNone(noteForm);
  ui.displayNone(nHeading);
  // ui.clearSubDisplay();
  sfI = -243;
  ui.clearNoteDisplay();
  nI = -243;
}); //End

//When You click on the add sub folder btn in the sub folder form
document.querySelector("#subFolderAdd").addEventListener("click", e => {
  e.preventDefault();
  //grab array from file
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //create secondary obj
  let secondaryName = textNameSub.value.trim();
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
  //check for taken name
  if (isTaken) {
    warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
    sfI = -243;
  } else {
    //push object into array
    primaryArray[mfI].secondaryArray.push(secondaryObject);
    // sort secondary array by name
    sortArrayByName(primaryArray[mfI].secondaryArray);
    //save file cab
    arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
    addAudio.play();
    ui.showAlert("A new sub folder was added", "success");
    //Hide form
    ui.displayNone(subFolderForm);
    //reset form
    subFolderForm.reset();
    //Hide note heading
    ui.displayNone(nHeading);
    //redisplay paint screen
    ui.clearSubDisplay();
    sfI = -243;
    ui.clearNoteDisplay();
    nI = -243;
    //Grab the secondary array
    let secondaryArray = primaryArray[mfI].secondaryArray;
    //Paint the screen
    ui.paintScreenSecondary(mapNamesOut(secondaryArray));
  } //End else statement
}); //End

//When You click the cancel btn in the sub folder form
document.querySelector("#subFolderCancel").addEventListener("click", e => {
  //Hide form
  ui.displayNone(subFolderForm);
  ui.displayNone(nHeading);
  subFolderForm.reset();
  //redisplay sub
  ui.paintScreenSecondary(
    mapNamesOut(arrayOfFileCabs[fcI].arrayOfPrimaryObjects[mfI].secondaryArray)
  );
}); //End

//Note Code**************************************************

//When You click the + in the Note Heading
addShowFormNote.addEventListener("click", e => {
  ui.displayBlock(noteForm);
  ui.displayNone(mainFolderForm);
  ui.displayNone(subFolderForm);
});

//When You click the add note btn in the note form
document.querySelector("#noteAdd").addEventListener("click", e => {
  e.preventDefault();
  // grab primary array
  let primaryArray = arrayOfFileCabs[fcI].arrayOfPrimaryObjects;
  //create note
  let noteText = textArea.value.trim();
  //check if text is empty
  if (noteText === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter note in the text area!", "error");
    return;
  }
  //create new note
  let newNote = new Note(noteText);
  //push note into note array
  primaryArray[mfI].secondaryArray[sfI].noteArray.push(newNote);
  //save file cab
  arrayOfFileCabs[fcI].writeFileCabToHardDisk(fs, ui);
  addAudio.play();
  ui.showAlert("A new note was added", "success");
  //Hide form
  ui.displayNone(noteForm);
  //redisplay paint screen
  ui.clearNoteDisplay();
  nI = -243;
  ui.paintScreenNote(primaryArray[mfI].secondaryArray[sfI].noteArray);
}); //End

// When You click the cancel btn in the note form
document.querySelector("#noteCancel").addEventListener("click", e => {
  //Hide form
  ui.displayNone(noteForm);
  mainFolderForm.reset();
}); //End

// When You click the clear btn in the note form
document.querySelector("#noteClearTextArea").addEventListener("click", e => {
  //clear the text Area
  textArea.value = "";
}); //End
//End addEventListener
