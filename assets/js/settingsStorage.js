class SettingsStorage {
  constructor() {
    this.fileName = "fileCabSettings8132019DEBX";
  } //constructor

  //Method setObjToFileName
  saveSettings(obj) {
    let myJSON = JSON.stringify(obj);
    localStorage.setItem(this.fileName, myJSON);
  }

  // Method getSettingsFromFile
  getSettingsFromFile() {
    //Make a variable for obj
    let obj;
    // Read file
    let textFromFile = localStorage.getItem(this.fileName);

    if (textFromFile) {
      //parse file
      obj = JSON.parse(textFromFile);
    } else {
      obj = { type: "noSettingsFound" };
      console.log(`Inside settings storage: the object is ${obj}`);
      console.log(obj);
    }
    // return obj
    return obj;
  } // End  getSettingsFromFile() method

  //************************************************ */
  //Method clearFileFromLocalStorage
  clearFileFromLocalStorage() {
    localStorage.removeItem(this.fileName);
  } //End clearFileFromLocalStorage method
  //************************************************** */
}
