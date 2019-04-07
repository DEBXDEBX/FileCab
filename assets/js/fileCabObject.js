// alert("from file cab object");

//FileCabObject class start
class FileCabObject {
  constructor(name, fileNamePath, index) {
    this.name = name;
    this.fileNamePath = fileNamePath;
    this.index = index;
    this.fileType = "ElectronFileCab2019April";
    this.arrayOfPrimaryObjects = [];
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
      } else {
        ui.showAlert("A new file cabinet was added", "success");
      }
    });
    return returnVar;
  } //End writeFileCabToHardDisk(fs, ui)

  // Method
  getSecondaryArray(primaryName) {
    let secondaryArray;
    return secondaryArray;
  } //getSecondaryArray(primaryName)

  // Method
  getNoteArray(primaryName) {
    let noteArray;
    return noteArray;
  } //getSecondaryArray(primaryName)
} // End class
