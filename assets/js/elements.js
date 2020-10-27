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
    this.renameFileCabAdd = document.querySelector("#renameFileCabAdd");
    this.mainFolderAddBtn = document.querySelector("#mainFolderAdd");
    this.mainFolderRenameBtn = document.querySelector("#mainFolderRename");
    this.subFolderAddBtn = document.querySelector("#subFolderAdd");
    this.subFolderRenameBtn = document.querySelector("#subFolderRename");
    // select textName and textArea
    this.textRenameFileCab = document.querySelector("#newFileCabName");
    this.textNameMain = document.querySelector("#mainFolderName");
    this.textNameSub = document.querySelector("#subFolderName");
    this.textArea = document.querySelector("#myTextArea");
    // select the autoload list
    this.autoLoadList = document.querySelector("#autoLoadList");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // select message border
    this.messageBorder = document.querySelector("#modalBorder");
    // this is for the fontSize
    this.root = document.querySelector(":root");
    this.myBody = document.querySelector("body");
    this.autoLoad = document.querySelector("#autoLoad");
    this.dark = document.querySelector("#Dark");
    this.light = document.querySelector("#Light");
    this.xSmall = document.querySelector("#x-small");
    this.small = document.querySelector("#small");
    this.normal = document.querySelector("#normal");
    this.large = document.querySelector("#large");
    this.xLarge = document.querySelector("#x-large");
    this.blank = document.querySelector("#blank");
    this.renameFileCabCancel = document.querySelector("#renameFileCabCancel");
    this.mfAdd = document.querySelector("#mfadd");
    this.mainFolderCancel = document.querySelector("#mainFolderCancel");
    this.sfAdd = document.querySelector("#sfadd");
    this.subFolderCancel = document.querySelector("#subFolderCancel");
    this.noteModalTextarea = document.querySelector("#noteModalTextarea");
    this.nAdd = document.querySelector("#nadd");
    this.noteAdd = document.querySelector("#noteAdd");
    this.noteCancel = document.querySelector("#noteCancel");
    this.noteClearTextArea = document.querySelector("#noteClearTextArea");
    this.noteDate = document.querySelector("#noteDate");
    this.saveEdit = document.querySelector("#saveEdit");
    this.editClose = document.querySelector("#editClose");
    this.settingsSave = document.querySelector("#settingsSave");
    this.settingsCancel = document.querySelector("#settingsCancel");
    this.factoryReset = document.querySelector("#factoryReset");
    this.settingsAddPath = document.querySelector("#settingsAddPath");
  } // End constructor
} // End Elements class
