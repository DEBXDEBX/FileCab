class FileCabObject {
  constructor(name, fileNamePath, array = []) {
    this.name = name;
    this.fileNamePath = fileNamePath;
    this.arrayOfPrimaryObjects = array;
    this.fileType = "ElectronFileCab2019April";
  }

  // Method
  writeFileCabToHardDisk(fs, display) {
    try {
      // throw error("force an error");
      //Stringify the file cab Object
      let content = JSON.stringify(this);
      fs.writeFileSync(this.fileNamePath, content);
    } catch (err) {
      setTimeout(() => {
        display.showAlert(`Error writing file. ${err}`, "error", 5000);
      }, 5000);
    }
  } // End writeFileCabToHardDisk(fs)
} // End FileCabObject class
