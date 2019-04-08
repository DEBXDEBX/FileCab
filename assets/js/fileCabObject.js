// alert("from file cab object");

//FileCabObject class start
class FileCabObject {
  constructor(name, fileNamePath, array = []) {
    this.name = name;
    this.fileNamePath = fileNamePath;
    this.arrayOfPrimaryObjects = array;
    this.fileType = "ElectronFileCab2019April";
  }

  //Method
  getPrimaryArray() {
    return this.arrayOfPrimaryObjects;
  }
  // Method
  getSecondaryArray(primaryName) {
    let index;

    for (let i = 0; i < this.arrayOfPrimaryObjects.length; i++) {
      if (this.arrayOfPrimaryObjects.name === primaryName) {
        index = i;
        break;
      }
    }
    return this.arrayOfPrimaryObjects[index].secondaryArray;
  } //getSecondaryArray(primaryName)

  // Method
  getNoteArray(primaryName, secondaryName) {
    let index;
    let secondaryArray = this.getSecondaryArray(primaryName);
    for (let i = 0; i < secondaryArray.length; i++) {
      if (secondaryArray.name === secondaryName) {
        index = i;
        break;
      }
    }
    return secondaryArray[index].noteArray;
  } //getNoteArray(primaryName, secondaryName)

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
} // End class
