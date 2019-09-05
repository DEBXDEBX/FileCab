class FileCabObject {
  constructor(name, fileNamePath, array = []) {
    this.name = name;
    this.fileNamePath = fileNamePath;
    this.arrayOfPrimaryObjects = array;
    this.fileType = "ElectronFileCab2019April";
  }

  // Method
  writeFileCabToHardDisk(fs) {
    //Stringify the file cab Object
    let content = JSON.stringify(this);
    fs.writeFileSync(this.fileNamePath, content);
  } // End writeFileCabToHardDisk(fs)
} // End FileCabObject class
