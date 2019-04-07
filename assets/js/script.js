// Used to access file system
// let app = require("electron").remote;
// let dialog = app.dialog;
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
//Create ui object
const ui = new Ui();
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
let currentFileCabIndex = -243;
let currentMainFolder = -243;
let currentSubFolder = -243;
let currentNoteIndex = -243;
const arrayOfFileCabs = [];

//The start of program exicution.
window.onload = function() {
  startUp();
};
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
  //create a locale var for the index
  let index = arrayOfFileCabs.length;
  //create a file cab object
  let newfileCab = new FileCabObject(dataObj.name, dataObj.fileNamePath, index);
  //push the file cab obj into the array of file cabinets
  arrayOfFileCabs.push(newfileCab);
  //Write the file cab object to disk
  newfileCab.writeFileCabToHardDisk(fs, ui);

  //redisplay
  currentFileCabIndex = -243;
  currentMainFolder = -243;
  currentSubFolder = -243;
  currentNoteIndex = -243;
  ui.clearFileCabDisplay();
  ui.clearPrimaryDisplay();
  ui.clearSubDisplay();
  ui.clearNoteDisplay();
  let mapedArray = arrayOfFileCabs.map(item => {
    return item.name;
  });

  ui.paintScreen(mapedArray);
});
//IPC End ipcRenderer.on("fileCab:add",

function startUp() {
  // ui.paintScreen();
}

//************************************************************************* */
document.querySelector("#addMainFolder").addEventListener("click", e => {
  if (currentFileCabIndex === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a  File Cabinet first!", "error");
    return;
  }
  //get file name with index
  const myStorage = new MyStorage();
  let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
  //grab array from file
  let primaryArray = myStorage.getArrayFromFile(fileName);
  //create primary object
  let primaryName = textName.value.trim();
  if (primaryName === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter a name for the Main Folder!", "error");
    return;
  }
  //You must set the main folder name to the input value above
  // currentMainFolder = primaryName;
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
  } else {
    //push primary object into array
    primaryArray.push(primaryObj);
    //sort primary array
    // sort by name
    primaryArray.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    }); //End sort function
    //save array storage
    myStorage.setArrayToFileName(primaryArray, fileName);
    addAudio.play();
    ui.showAlert("A new main folder was added", "success");
    //redisplay paint screen
    ui.clearPrimaryDisplay();
    currentMainFolder = -243;
    ui.clearSubDisplay();
    currentSubFolder = -243;
    ui.clearNoteDisplay();
    currentNoteIndex = -243;
    ui.paintScreenPrimary(currentFileCabIndex);
  } //End else statement
}); //End add main folder
//***************************************************************************** */

document.querySelector("#addSubFolder").addEventListener("click", e => {
  if (currentFileCabIndex === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }
  if (currentMainFolder === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Main Folder first!", "error");
    return;
  }
  //create storage var
  const myStorage = new MyStorage();
  //get primary array
  let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
  //grab array from file
  let primaryArray = myStorage.getArrayFromFile(fileName);
  //grab the primary object index
  let primaryObjIndex;
  primaryArray.forEach((element, index, array) => {
    if (currentMainFolder === element.name) {
      primaryObjIndex = index;
    }
  });
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
  primaryArray[primaryObjIndex].secondaryArray.forEach(element => {
    if (secondaryName === element.name) {
      isTaken = true;
      return;
    }
  });
  if (isTaken) {
    warningNameTakenAudio.play();
    ui.showAlert("That name is taken", "error");
    currentSubFolder = -243;
  } else {
    //push object into array
    primaryArray[primaryObjIndex].secondaryArray.push(secondaryObject);
    // sort by name
    primaryArray[primaryObjIndex].secondaryArray.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    }); //End sort function
    //save array storage
    myStorage.setArrayToFileName(primaryArray, fileName);
    addAudio.play();
    ui.showAlert("A new sub folder was added", "success");
    //redisplay paint screen
    ui.clearSubDisplay();
    currentSubFolder = -243;
    ui.clearNoteDisplay();
    currentNoteIndex = -243;
    ui.paintScreenSecondary(currentFileCabIndex, currentMainFolder);
  } //End else statement
}); //End add sub folder

//************************************************************* */

document.querySelector("#addNote").addEventListener("click", e => {
  if (currentFileCabIndex === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }
  if (currentMainFolder === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Main Folder first!", "error");
    return;
  }
  if (currentSubFolder === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Sub Folder first!", "error");
    return;
  }

  //create storage var
  const myStorage = new MyStorage();
  //get primary array
  let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
  //grab array from file
  let primaryArray = myStorage.getArrayFromFile(fileName);
  //grab the primary object index
  let primaryObjIndex;
  primaryArray.forEach((element, index, array) => {
    if (currentMainFolder === element.name) {
      primaryObjIndex = index;
    }
  });
  //grab the secondary object index
  let secondaryObjIndex;
  primaryArray[primaryObjIndex].secondaryArray.forEach((element, index) => {
    if (currentSubFolder === element.name) {
      secondaryObjIndex = index;
    }
  });
  //create note
  let noteText = textArea.value.trim();
  if (noteText === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter note in the text area!", "error");
    ui.showAndCheckTextArea();
    return;
  }
  let newNote = new Note(noteText);
  //push note into note array
  primaryArray[primaryObjIndex].secondaryArray[
    secondaryObjIndex
  ].noteArray.push(newNote);
  //set primary array back to file
  myStorage.setArrayToFileName(primaryArray, fileName);
  addAudio.play();
  ui.showAlert("A new note was added", "success");
  //redisplay paint screen

  ui.clearNoteDisplay();
  currentNoteIndex = -243;

  ui.paintScreenNote(currentFileCabIndex, currentMainFolder, currentSubFolder);
}); //End add note
//************************************************** */

document.querySelector("#addImage").addEventListener("click", e => {
  if (currentFileCabIndex === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }
  if (currentMainFolder === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Main Folder first!", "error");
    return;
  }
  if (currentSubFolder === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Sub Folder first!", "error");
    return;
  }
  if (currentNoteIndex === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a Note first!", "error");
    return;
  }

  //the first half of the image path
  let firstPart = "./assets/img/";
  //grab current note and add a image path property to it and save back to file
  //create storage var
  const myStorage = new MyStorage();
  //get primary array
  let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
  //grab array from file
  let primaryArray = myStorage.getArrayFromFile(fileName);
  //grab the primary object index
  let primaryObjIndex;
  primaryArray.forEach((element, index, array) => {
    if (currentMainFolder === element.name) {
      primaryObjIndex = index;
    }
  });
  //grab the secondary object index
  let secondaryObjIndex;
  primaryArray[primaryObjIndex].secondaryArray.forEach((element, index) => {
    if (currentSubFolder === element.name) {
      secondaryObjIndex = index;
    }
  }); //End of forEach

  //get the image path from the name text field
  let imageName = textName.value.trim();
  if (imageName === "") {
    warningEmptyAudio.play();
    ui.showAlert("Please enter a path in the name area!", "error");
    return;
  }
  //add the image paths togather
  let fullImagePath = firstPart + imageName;
  primaryArray[primaryObjIndex].secondaryArray[secondaryObjIndex].noteArray[
    currentNoteIndex
  ].imagePath = fullImagePath;
  //set primary array back to file
  myStorage.setArrayToFileName(primaryArray, fileName);
  addImageAudio.play();
  ui.showAlert("A new image was added to the note", "success");
}); //End add event listener

//**************************************************************** */
document.querySelector("#exportJSON").addEventListener("click", e => {
  if (currentFileCabIndex === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }
  addAudio.play();
  ui.showAndCheckTextArea();
  ui.showAlert(
    "Copy and paste the text in the text area to a .json file and add it to the json folder",
    "success",
    10000
  );
  //get current file cab array
  let myStorage = new MyStorage();
  let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
  let array = myStorage.getArrayFromFile(fileName);
  //turn array into a string
  let myStringOfJSON = JSON.stringify(array);
  //output string to text area
  textArea.value = myStringOfJSON;
}); //End add event listener

//*************************************************************** */
document.querySelector("#importJSON").addEventListener("click", e => {
  if (currentFileCabIndex === -243) {
    warningSelectAudio.play();
    ui.showAlert("Please select a File Cabinet first!", "error");
    return;
  }

  let textAreaInput = textArea.value.trim();

  if (textAreaInput === "") {
    warningEmptyAudio.play();
    ui.showAlert(
      "Please copy and paste a valid JSON string in the large text Area",
      "error",
      10000
    );
    ui.showAndCheckTextArea();
    return;
  }

  //get data from file
  let array = JSON.parse(textAreaInput);

  //get current file cab array
  let myStorage = new MyStorage();
  let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);

  //check if array is empty if so go ahead and write over
  let checkArray = myStorage.getArrayFromFile(fileName);
  if (checkArray.length === 0) {
    //the file cabinet is empty go ahead and write the new file
    myStorage.setArrayToFileName(array, fileName);
    addAudio.play();
    ui.showAlert("File Cabinet loaded!", "success");
  } else {
    //This setTimeout is to give the audio a chance to play before the confirm pop's up
    warningEmptyAudio.play();
    setTimeout(function() {
      //I tried to put warning audio here but it doesn't want to play until after the confirm is done
      if (
        confirm(
          "Are you sure, you want to load this data, this file cabinet already has valid data?"
        )
      ) {
        myStorage.setArrayToFileName(array, fileName);
        addAudio.play();
        ui.showAlert("File Cabinet loaded!", "success");
      } else {
        warningNameTakenAudio.play();
        ui.showAlert("You have chosen not to load a file cabinet!", "error");
      } //End bottom else
    }, 1000);
  } //End top else

  //paint the Main folder
  ui.clearPrimaryDisplay();
  currentMainFolder = -243;
  ui.clearSubDisplay();
  currentSubFolder = -243;
  ui.clearNoteDisplay();
  currentNoteIndex = -243;
  ui.paintScreenPrimary(currentFileCabIndex);
}); //End add event listener

//********************************************** */
//addEventListener for event delegation

fileCabUL.addEventListener("click", e => {
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
    currentFileCabIndex = index;
    ui.clearPrimaryDisplay();
    currentMainFolder = -243;
    ui.clearSubDisplay();
    currentSubFolder = -243;
    ui.clearNoteDisplay();
    currentNoteIndex = -243;
    ui.paintScreenPrimary(currentFileCabIndex);
  } // end contains 'fileCab

  //if shift is held down move file cab left
  if (e.shiftKey) {
    let myStorage = new MyStorage();
    myStorage.moveFileCabinetLeft(currentFileCabIndex);
    //update display
    currentFileCabIndex = -243;
    currentMainFolder = -243;
    currentSubFolder = -243;
    currentNoteIndex = -243;
    ui.clearFileCabDisplay();
    ui.clearPrimaryDisplay();
    ui.clearSubDisplay();
    ui.clearPrimaryDisplay();
    ui.paintScreen();
  }

  //if control is held down delete file cabinet and move files down one
  if (e.ctrlKey) {
    //This setTimeout is to give the audio a chance to play before the confirm pop's up
    warningEmptyAudio.play();
    setTimeout(function() {
      //I tried to put warning audio here but it doesn't want to play until after the confirm is done
      if (confirm("Are you sure, you want to delete this File Cabinet?")) {
        //grab the array of file cabinets
        let myStorage = new MyStorage();
        let fileCabArray = myStorage.getArrayOfFileCabinets();
        //remove the current file cab from array
        fileCabArray.splice(currentFileCabIndex, 1);
        //set file cab array back to file
        myStorage.setArrayOfFileCabinets(fileCabArray);
        //move all files down one with currentFileCabIndex
        myStorage.moveAllFilesDownOneWithDeleteIndex(currentFileCabIndex);
        //set current file cabinet to -243
        currentFileCabIndex = -243;
        deleteAudio.play();
        ui.showAlert("File cabinet deleted!", "success");
        //repaint screens
        ui.clearPrimaryDisplay();
        currentMainFolder = -243;
        ui.clearSubDisplay();
        currentSubFolder = -243;
        ui.clearNoteDisplay();
        currentNoteIndex = -243;
        ui.paintScreen();
      } else {
        warningNameTakenAudio.play();
        ui.showAlert("You have chosen not to delete a file cabinet!", "error");
      } //End bottom else
    }, 1000);
  }
});

//************************************************************************** */
mainFolderUL.addEventListener("click", e => {
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

    currentMainFolder = e.target.textContent;
    currentSubFolder = -243;
    currentNoteIndex = -243;

    ui.clearNoteDisplay();

    ui.paintScreenSecondary(currentFileCabIndex, currentMainFolder);
    //check if control was down, if so delete
    if (e.ctrlKey) {
      //create storage var
      const myStorage = new MyStorage();
      //get primary array
      let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
      //grab array from file
      let primaryArray = myStorage.getArrayFromFile(fileName);
      //grab the primary object index
      let primaryObjIndex;
      primaryArray.forEach((element, index, array) => {
        if (currentMainFolder === element.name) {
          primaryObjIndex = index;
        }
      });
      //Delete main folder
      primaryArray.splice(primaryObjIndex, 1);
      //set the primary array back to file
      myStorage.setArrayToFileName(primaryArray, fileName);
      deleteAudio.play();
      ui.showAlert("Main folder deleted!", "success");
      //clear main folder, sub folder and notes
      ui.clearPrimaryDisplay();
      currentMainFolder = -243;
      ui.clearSubDisplay();
      currentSubFolder = -243;
      ui.clearNoteDisplay();
      currentNoteIndex = -243;
      //redisplay main folder
      ui.paintScreenPrimary(currentFileCabIndex);
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
  currentSubFolder = e.target.textContent;
  currentNoteIndex = -243;
  ui.paintScreenNote(currentFileCabIndex, currentMainFolder, currentSubFolder);

  if (e.ctrlKey) {
    //create storage var
    const myStorage = new MyStorage();
    //get primary array
    let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
    //grab array from file
    let primaryArray = myStorage.getArrayFromFile(fileName);
    //grab the primary object index
    let primaryObjIndex;
    primaryArray.forEach((element, index, array) => {
      if (currentMainFolder === element.name) {
        primaryObjIndex = index;
      }
    });
    //grab the secondary object index
    let secondaryObjIndex;
    primaryArray[primaryObjIndex].secondaryArray.forEach((element, index) => {
      if (currentSubFolder === element.name) {
        secondaryObjIndex = index;
      }
    });
    //grab the secondary array and delete sub folder
    primaryArray[primaryObjIndex].secondaryArray.splice(secondaryObjIndex, 1);
    //set the primary array back to file
    myStorage.setArrayToFileName(primaryArray, fileName);
    deleteAudio.play();
    ui.showAlert("Sub folder deleted!", "success");
    //clear sub folder and notes
    ui.clearSubDisplay();
    currentSubFolder = -243;
    ui.clearNoteDisplay();
    currentNoteIndex = -243;
    //redisplay sub folder
    ui.paintScreenSecondary(currentFileCabIndex, currentMainFolder);
  } //End control key down
}); //End

//****************************************************** */
noteSection.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("myPic")) {
    // remove image
    e.target.remove();
  }

  // event delegation
  if (e.target.classList.contains("note")) {
    //This gets the data I embedded into the html
    let dataIndex = e.target.dataset.index;
    let deleteIndex = parseInt(dataIndex);
    currentNoteIndex = deleteIndex;

    //if the note has a image path create elemment and insert into document
    //create storage var
    const myStorage = new MyStorage();
    //get primary array
    let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
    //grab array from file
    let primaryArray = myStorage.getArrayFromFile(fileName);
    //grab the primary object index
    let primaryObjIndex;
    primaryArray.forEach((element, index, array) => {
      if (currentMainFolder === element.name) {
        primaryObjIndex = index;
      }
    });
    //grab the secondary object index
    let secondaryObjIndex;
    primaryArray[primaryObjIndex].secondaryArray.forEach((element, index) => {
      if (currentSubFolder === element.name) {
        secondaryObjIndex = index;
      }
    });
    //see if the note has a imagePath
    let selectedNote =
      primaryArray[primaryObjIndex].secondaryArray[secondaryObjIndex].noteArray[
        currentNoteIndex
      ];
    if (selectedNote.imagePath !== "R2D2") {
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

    //check if control was down, if so delete
    if (e.ctrlKey) {
      //create storage var
      const myStorage = new MyStorage();
      //get primary array
      let fileName = myStorage.getFileNameWithIndex(currentFileCabIndex);
      //grab array from file
      let primaryArray = myStorage.getArrayFromFile(fileName);
      //grab the primary object index
      let primaryObjIndex;
      primaryArray.forEach((element, index, array) => {
        if (currentMainFolder === element.name) {
          primaryObjIndex = index;
        }
      });
      //grab the secondary object index
      let secondaryObjIndex;
      primaryArray[primaryObjIndex].secondaryArray.forEach((element, index) => {
        if (currentSubFolder === element.name) {
          secondaryObjIndex = index;
        }
      });
      //grab the note array and delete current note
      primaryArray[primaryObjIndex].secondaryArray[
        secondaryObjIndex
      ].noteArray.splice(deleteIndex, 1);
      //set primary array back to file
      myStorage.setArrayToFileName(primaryArray, fileName);
      //reasign current note
      currentNoteIndex = -243;
      deleteAudio.play();
      ui.showAlert("Note deleted!", "success");
      //redisplay notes
      ui.paintScreenNote(
        currentFileCabIndex,
        currentMainFolder,
        currentSubFolder
      );
    } //End control key down
  } //End class name contains note
}); //End event listener

//********************************************* */
//End addEventListener
