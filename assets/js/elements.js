class Elements {
  constructor() {
    //select the lists
    this.fileCabList = document.querySelector("#fileCabList");
    this.mainFolderList = document.querySelector("#mainFolderList");
    this.subFolderList = document.querySelector("#subFolderList");
    this.noteList = document.querySelector("#noteList");
    // this.noteHeader = document.querySelector("#headingNote");
    //Select headings
    this.mfHeading = document.querySelector("#headingMainFolder");
    this.sfHeading = document.querySelector("#headingSubFolder");
    this.nHeading = document.querySelector("#headingNote");
    //Select forms
    this.renameFileCabForm = document.querySelector("#renameFileCabForm");
    this.mainFolderForm = document.querySelector("#mainFolderForm");
    this.subFolderForm = document.querySelector("#subFolderForm");
    this.noteForm = document.querySelector("#noteForm");
    this.settingsForm = document.querySelector("#settingsForm");
    //Select add show forms +
    this.addShowFormMain = document.querySelector("#mfadd");
    this.addShowFormSub = document.querySelector("#sfadd");
    this.addShowFormNote = document.querySelector("#nadd");
    //Select textName and textArea
    this.textRenameFileCab = document.querySelector("#newFileCabName");
    this.textNameMain = document.querySelector("#mainFolderName");
    this.textNameSub = document.querySelector("#subFolderName");
    this.textArea = document.querySelector("#myTextArea");
    // autoload
    this.autoLoadList = document.querySelector("#autoLoadList");
  } //constructor
}
