//Ui class start
class Ui {
  constructor($) {
    //select the lists
    this.fileCabList = document.querySelector("#fileCabList");
    this.mainFolderList = document.querySelector("#mainFolderList");
    this.subFolderList = document.querySelector("#subFolderList");
    this.noteList = document.querySelector("#noteList");
    //select the text area
    this.textArea = document.querySelector("#myTextArea");
    //JQuery
    this.$ = $;
  } //constructor

  //*************************************************************************** */

  //Method
  displayNone(element) {
    this.$(element).slideUp("slow");
  }

  //Method
  displayBlock(element) {
    this.$(element).slideDown("slow");
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
  paintScreenNote(noteArray) {
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
    // Get header
    const header = document.querySelector("header");
    // Insert alert
    container.insertBefore(div, header);

    // Timeout after 4 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, displayTime);
  }
} // End class
