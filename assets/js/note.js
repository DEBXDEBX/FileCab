//Note class start
class Note {
  constructor(text) {
    this.text = text;
    this.imagePath ='R2D2';
  }
  //Method
  setImagePath(imageName){
    let firstPart = '../assets/img/'
    this.imagePath = firstPart + imageName;
}

}// End class 