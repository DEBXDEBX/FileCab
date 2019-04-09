//Ui class start
class Ui {
  constructor() {
    //select the lists
    this.fileCabList = document.querySelector("#fileCabList");
    this.mainFolderList = document.querySelector("#mainFolderList");
    this.subFolderList = document.querySelector("#subFolderList");
    this.noteList = document.querySelector("#noteList");
    //select the text area
    this.textArea = document.querySelector("#myTextArea");

    //select current tabs
    this.currentFC = document.querySelector("#currentFileCabinet");
    this.currentMF = document.querySelector("#currentMain");
    this.currentSF = document.querySelector("#currentSub");
    //select check box
    this.myCheckBox = document.querySelector("#myCheckBox");

    //addEventListeners
    this.myCheckBox.addEventListener("change", e => {
      if (this.myCheckBox.checked) {
        // Checkbox is checked..
        this.textArea.style.display = "block";
      } else {
        // Checkbox is not checked..
        this.textArea.style.display = "none";
      }
    }); //addEventlisener myCheckbox
  } //constructor

  //*************************************************************************** */

  //Method
  showAndCheckTextArea() {
    this.textArea.style.display = "block";
    this.myCheckBox.checked = true;
  }

  //Method
  clearFileCabDisplay() {
    this.fileCabList.innerHTML = "";
  } //End clearFileCabDisplay()
  //************************************************************************ */

  //Method
  clearPrimaryDisplay() {
    this.mainFolderList.innerHTML = "";
  } //End clearMainDisplay()
  //********************************************************************** */

  //Method
  clearSubDisplay() {
    this.subFolderList.innerHTML = "";
  } //End clearSubDisplay()
  //********************************************************************** */

  //Method
  clearNoteDisplay() {
    this.noteList.innerHTML = "";
  } //End clearNoteDisplay()
  //************************************************************************ */

  // Method
  paintScreen(mapedArray) {
    //this will paint all file cabinets tabs
    // make var for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="fileCab">${element}</li>`;
    });

    this.fileCabList.innerHTML = html;
  } // end paintScreen
  //******************************************************************************* */

  // Method
  paintScreenPrimary(mapedArray) {
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="main">${element}</li>`;
    });

    this.mainFolderList.innerHTML = html;
  } //end paintScreenPrimary
  //********************************************************************************* */

  // Method
  paintScreenSecondary(mappedSecondaryArray) {
    //Make var for html
    let html = "";
    mappedSecondaryArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="sub">${element}</li>`;
    });
    this.subFolderList.innerHTML = html;
  } //end paint screen secondary
  //******************************************************************************* */

  //Method
  paintScreenNote(fileIndex, primaryName, secondaryName) {
    //create storage  variable
    let myStorage = new MyStorage();
    //Get  primaryArray with index
    let fileName = myStorage.getFileNameWithIndex(fileIndex);
    let primaryArray = myStorage.getArrayFromFile(fileName);
    //set up primaryObject var
    let primaryObject;
    //loop through array to get primary object
    primaryArray.forEach((element, index) => {
      if (primaryName === element.name) {
        primaryObject = element;
        // console.log('they are equal');
        // console.log(primaryObject);
      }
    });
    //Get secondary array
    let secondaryArray = primaryObject.secondaryArray;
    //set up a secondaryObject var
    let secondaryObject;
    //loop through array to get secondary object
    secondaryArray.forEach((element, index) => {
      if (secondaryName === element.name) {
        secondaryObject = element;
        // console.log('they are equal');
        // console.log(secondaryObject);
      }
    });
    //get array of notes
    let noteArray = secondaryObject.noteArray;
    //Make div for html

    //clear the div
    this.noteList.innerHTML = "";
    //build div
    noteArray.forEach((note, index) => {
      // createNewBookMarkDiv(bm.name, bm.address, pointerObj.divPointer);
      this.createNoteElement(note.text, index);
      //create a new div for each bookmark
    });
  } //end paint screen note
  //******************************************************************** */

  createNoteElement(text, index) {
    let newElement = document.createElement("h4");
    newElement.className = "note";
    newElement.setAttribute("data-index", `${index}`);
    newElement.appendChild(document.createTextNode(`${text}`));
    this.noteList.appendChild(newElement);
  } //End createNoteElement

  //********************************************************************* */
  // Method
  showAlert(message, className, displayTime = 4000) {
    // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector("body");
    // Get form
    const form = document.querySelector("form");
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 4 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, displayTime);
  }
} // End class
