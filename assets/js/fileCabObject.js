// alert("from file cab object");

//FileCabObject class start
class FileCabObject {
  constructor(name, fileNamePath, array = []) {
    this.name = name;
    this.fileNamePath = fileNamePath;
    this.arrayOfPrimaryObjects = array;
    this.fileType = "ElectronFileCab2019April";
  }
  // Method
  writeFileCabToHardDisk(fs, ui) {
    //Stringify the file cab Object
    let content = JSON.stringify(this);

    //write file cab object to file
    let returnVar = fs.writeFile(this.fileNamePath, content, err => {
      if (err) {
        ui.showAlert("There was an error writing the file", "error");
        return true;
      }
    });
    return returnVar;
  } //End writeFileCabToHardDisk(fs, ui)

  //Method
  getPrimaryArray() {
    return this.arrayOfPrimaryObjects;
  }
  // Method
  getSecondaryArray(primaryName) {
    let secondaryArray;
    return secondaryArray;
  } //getSecondaryArray(primaryName)

  // Method
  getNoteArray(primaryName, seccondaryName) {
    let noteArray;
    return noteArray;
  } //getSecondaryArray(primaryName)
} // End class
