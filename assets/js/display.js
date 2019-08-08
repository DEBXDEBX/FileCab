//Ui class start
class Display {
  constructor(elements, $) {
    this.elements = elements;
    //JQuery
    this.$ = $;
  } // End constructor

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
  }

  //Method
  clearPrimaryDisplay() {
    this.elements.mainFolderList.innerHTML = "";
  }

  //Method
  clearSubDisplay() {
    this.elements.subFolderList.innerHTML = "";
  }

  //Method
  clearNoteDisplay() {
    this.elements.noteList.innerHTML = "";
  }

  // Method
  paintFileCabTabs(mapedArray) {
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
    this.displayNone(this.elements.renameFileCabForm);
    // this will paint all file cabinets tabs
    // make var for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="fileCab">${element}</li>`;
    });

    this.elements.fileCabList.innerHTML = html;
  } // end paintFileCabTabs()
  //******************************************************************************* */

  // Method
  paintMainFolderTabs(mapedArray) {
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
  } //end paintMainFolderTabs()
  //********************************************************************************* */

  // Method
  paintSubFolderTabs(mappedSecondaryArray) {
    this.clearSubDisplay();
    this.clearNoteDisplay();
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
  } //end paintSubFolderTabs
  //******************************************************************************* */

  //Method
  paintNotes(noteArray) {
    this.displayNone(this.elements.nHeading);
    this.displayBlock(this.elements.nHeading);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
    this.displayNone(this.elements.noteForm);
    this.displayNone(this.elements.noteList);
    //clear the div
    this.clearNoteDisplay();
    //build div
    noteArray.forEach((note, index) => {
      // createNewBookMarkDiv(bm.name, bm.address, pointerObj.divPointer);
      this.createNoteElement(note.text, index);
      //create a new div for each bookmark
    });
    this.displayBlock(this.elements.noteList);
  } //end paintNotes()
  //******************************************************************** */

  createNoteElement(text, index) {
    let newElement = document.createElement("h4");
    newElement.className = "note";
    newElement.setAttribute("data-index", `${index}`);
    newElement.appendChild(document.createTextNode(`${text}`));
    this.elements.noteList.appendChild(newElement);
  } //End createNoteElement

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

  //Method
  showMainFolderForm() {
    this.displayBlock(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
    this.displayNone(this.elements.noteForm);
    this.displayNone(this.elements.sfHeading);
    this.displayNone(this.elements.nHeading);
    this.clearSubDisplay();
    this.clearNoteDisplay();
  }

  //Method
  showSubFolderForm() {
    this.displayBlock(this.elements.subFolderForm);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.noteForm);
    this.displayNone(this.elements.nHeading);
    this.clearNoteDisplay();
  }

  //Method
  showNoteForm() {
    this.displayBlock(this.elements.noteForm);
    this.displayNone(this.elements.mainFolderForm);
    this.displayNone(this.elements.subFolderForm);
  }

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
  } // End showAlert()
} // End class
