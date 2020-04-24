class Elements {
  constructor() {
    // select the lists
    this.fileCabList = document.querySelector("#fileCabList");
    this.mainFolderList = document.querySelector("#mainFolderList");
    this.subFolderList = document.querySelector("#subFolderList");
    this.noteList = document.querySelector("#noteList");
    // select headings
    this.mfHeading = document.querySelector("#headingMainFolder");
    this.sfHeading = document.querySelector("#headingSubFolder");
    this.nHeading = document.querySelector("#headingNote");
    // select forms
    this.renameFileCabForm = document.querySelector("#renameFileCabForm");
    this.mainFolderForm = document.querySelector("#mainFolderForm");
    this.subFolderForm = document.querySelector("#subFolderForm");
    this.noteForm = document.querySelector("#noteForm");
    this.settingsForm = document.querySelector("#settingsForm");
    // select btn
    this.mainFolderAddBtn = document.querySelector("#mainFolderAdd");
    this.mainFolderRenameBtn = document.querySelector("#mainFolderRename");
    this.subFolderAddBtn = document.querySelector("#subFolderAdd");
    this.subFolderRenameBtn = document.querySelector("#subFolderRename");
    // select add show forms + / icon
    this.addShowFormMain = document.querySelector("#mfadd");
    this.addShowFormSub = document.querySelector("#sfadd");
    this.addShowFormNote = document.querySelector("#nadd");
    // select textName and textArea
    this.textRenameFileCab = document.querySelector("#newFileCabName");
    this.textNameMain = document.querySelector("#mainFolderName");
    this.textNameSub = document.querySelector("#subFolderName");
    this.textArea = document.querySelector("#myTextArea");
    // select the autoload list
    this.autoLoadList = document.querySelector("#autoLoadList");
  } // End constructor
} // End Elements class
