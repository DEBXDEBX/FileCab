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
    this.renameFileCabAdd = document.querySelector("#renameFileCabSubmitBtn");
    this.mainFolderAddBtn = document.querySelector("#addMainFolderSubmitBtn");
    this.mainFolderRenameBtn = document.querySelector("#renameMainFolderBtn");
    this.subFolderAddBtn = document.querySelector("#addSubFolderSubmitBtn");
    this.subFolderRenameBtn = document.querySelector(
      "#renameSubfolderSubmitBtn"
    );
    // select textName and textArea
    this.textRenameFileCab = document.querySelector("#fileCabNameInput");
    this.textNameMain = document.querySelector("#mainFolderNameInput");
    this.textNameSub = document.querySelector("#subFolderNameInput");
    this.textArea = document.querySelector("#noteTextareaInput");
    // select the autoload list
    this.autoLoadList = document.querySelector("#autoLoadList");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // select message border
    this.messageBorder = document.querySelector("#modalBorder");
    // this is for the fontSize
    this.root = document.querySelector(":root");
    this.myBody = document.querySelector("body");
    this.autoLoad = document.querySelector("#autoLoadCheckBox");
    this.dark = document.querySelector("#darkRadio");
    this.light = document.querySelector("#lightRadio");
    this.xSmall = document.querySelector("#x-smallRadio");
    this.small = document.querySelector("#smallRadio");
    this.normal = document.querySelector("#normalRadio");
    this.large = document.querySelector("#largeRadio");
    this.xLarge = document.querySelector("#x-largeRadio");
    this.blank = document.querySelector("#blankCssLink");
    this.renameFileCabCancel = document.querySelector(
      "#renameFileCabCancelBtn"
    );
    this.mfAdd = document.querySelector("#mainFolderAddIcon");
    this.mainFolderCancel = document.querySelector("#mainFolderCancelBtn");
    this.sfAdd = document.querySelector("#subFolderAddIcon");
    this.subFolderCancel = document.querySelector("#subFolderCancelBtn");
    this.noteModalTextarea = document.querySelector("#noteModalTextarea");
    this.nAdd = document.querySelector("#noteAddIcon");
    this.noteAdd = document.querySelector("#addNoteSubmitBtn");
    this.noteCancel = document.querySelector("#noteCancelBtn");
    this.noteClearTextArea = document.querySelector("#noteClearTextAreaBtn");
    this.noteDate = document.querySelector("#noteAddDateBtn");
    this.saveEdit = document.querySelector("#saveEditedNoteBtn");
    this.editClose = document.querySelector("#editNoteCloseBtn");
    this.settingsSave = document.querySelector("#saveSettingsSubmitBtn");
    this.settingsCancel = document.querySelector("#settingsCancelBtn");
    this.factoryReset = document.querySelector("#factoryResetBtn");
    this.settingsAddPath = document.querySelector("#settingsAddPathBtn");
  } // End constructor
} // End Elements class
