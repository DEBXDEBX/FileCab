//Ui class start
class Display {
  constructor(elements, $) {
    this.elements = elements;
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
    this.elements.fileCabList.innerHTML = "";
  } //End clearFileCabDisplay()
  //************************************************************************ */

  //Method
  clearPrimaryDisplay() {
    this.elements.mainFolderList.innerHTML = "";
  } //End clearMainDisplay()
  //********************************************************************** */

  //Method
  clearSubDisplay() {
    this.elements.subFolderList.innerHTML = "";
  } //End clearSubDisplay()
  //********************************************************************** */

  //Method
  clearNoteDisplay() {
    this.elements.noteList.innerHTML = "";
  } //End clearNoteDisplay()
  //************************************************************************ */

  // Method
  paintScreen(mapedArray) {
    // do this first
    this.clearFileCabDisplay();
    this.clearPrimaryDisplay();
    this.clearSubDisplay();
    this.clearNoteDisplay();
    this.displayNone(this.elements.mfHeading);
    this.displayNone(this.elements.sfHeading);
    this.displayNone(this.elements.nHeading);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
    this.displayNone(this.elements.noteForm);
    //this will paint all file cabinets tabs
    // make var for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="fileCab">${element}</li>`;
    });

    this.elements.fileCabList.innerHTML = html;
  } // end paintScreen
  //******************************************************************************* */

  // Method
  paintScreenPrimary(mapedArray) {
    this.clearPrimaryDisplay();
    this.clearSubDisplay();
    this.clearNoteDisplay();
    this.displayNone(this.elements.mfHeading);
    this.displayBlock(this.elements.mfHeading);
    this.displayNone(this.elements.sfHeading);
    this.displayNone(this.elements.nHeading);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
    this.displayNone(this.elements.noteForm);

    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="main">${element}</li>`;
    });

    this.elements.mainFolderList.innerHTML = html;
  } //end paintScreenPrimary
  //********************************************************************************* */

  //Method
  showRenameFileCabForm() {
    this.clearPrimaryDisplay();
    this.clearSubDisplay();
    this.clearNoteDisplay();
    this.displayNone(this.elements.mfHeading);
    this.displayNone(this.elements.sfHeading);
    this.displayNone(this.elements.nHeading);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
    this.displayNone(this.elements.noteForm);
    this.displayBlock(this.elements.renameFileCabForm);
  }
  // Method
  paintScreenSecondary(mappedSecondaryArray) {
    this.clearSubDisplay();
    this.clearNoteDisplay();
    this.displayNone(this.elements.mfHeading);
    this.displayBlock(this.elements.mfHeading);
    this.displayNone(this.elements.sfHeading);
    this.displayBlock(this.elements.sfHeading);
    this.displayNone(this.elements.nHeading);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
    this.displayNone(this.elements.noteForm);

    //Make var for html
    let html = "";
    mappedSecondaryArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="sub">${element}</li>`;
    });
    this.elements.subFolderList.innerHTML = html;
  } //end paint screen secondary
  //******************************************************************************* */

  //Method
  paintScreenNote(noteArray) {
    this.displayNone(this.elements.nHeading);
    this.displayBlock(this.elements.nHeading);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
    this.displayNone(this.elements.noteForm);
    this.displayNone(this.elements.noteList);
    //clear the div
    this.elements.noteList.innerHTML = "";
    //build div
    noteArray.forEach((note, index) => {
      // createNewBookMarkDiv(bm.name, bm.address, pointerObj.divPointer);
      this.createNoteElement(note.text, index);
      //create a new div for each bookmark
    });
    this.displayBlock(this.elements.noteList);
  } //end paint screen note
  //******************************************************************** */

  createNoteElement(text, index) {
    let newElement = document.createElement("h4");
    newElement.className = "note";
    newElement.setAttribute("data-index", `${index}`);
    newElement.appendChild(document.createTextNode(`${text}`));
    this.elements.noteList.appendChild(newElement);
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
    // Insert alert other element
    container.insertBefore(div, this.elements.nHeading);

    // Timeout after 4 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, displayTime);
  }
} // End class
