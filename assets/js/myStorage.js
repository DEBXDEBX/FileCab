//My Storage class
class MyStorage{
  constructor(){
   this.arrayOfFileCabinets = "fileAOFCDEBX";
    this.file0 = "fileZero9302018DEBX";
    this.file1 = "fileOne9302018DEBX";
    this.file2 = "fileTwo9302018DEBX";
    this.file3 = "fileThree9302018DEBX";
    this.file4 = "fileFour9302018DEBX";
    this.file5 = "fileFive9302018DEBX";
    this.file6 = "fileSix9302018DEBX";
    this.file7 = "fileSeven9302018DEBX";
    this.file8 = "fileEight9302018DEBX";
    this.file9 = "fileNine9302018DEBX";
  }

  //Method 
  moveFileCabinetLeft(currentFileCabIndex){
    if(currentFileCabIndex === 0){
      //You can't move the zero index
      return;
    }
   //get array of file cabinets
   //call the move function on it
   let otherIndex = currentFileCabIndex - 1;
   let arrayMove = this.getArrayFromFile(this.arrayOfFileCabinets);
   let array = this.move(arrayMove, currentFileCabIndex, otherIndex);
   this.setArrayOfFileCabinets(array);
   //part B
   //copy and swap arrays
   let indexFileName = this.getFileNameWithIndex(currentFileCabIndex);
   let otherFileName = this.getFileNameWithIndex(otherIndex);
   let indexArray = this.getArrayFromFile(indexFileName);
   let otherArray = this.getArrayFromFile(otherFileName);
   this.setArrayToFileName(indexArray, otherFileName);
   this.setArrayToFileName(otherArray, indexFileName);
  }//End moveFileCabinetLeft

//method
//This function moves one object to a new index and returns the array
 move(array, from, to) {
  if( to === from ) return array;

  var target = array[from];                         
  var increment = to < from ? -1 : 1;

  for(var k = from; k != to; k += increment){
    array[k] = array[k + increment];
  }
  array[to] = target;
  return array;
}
//End of move Functioon

//***************************************************************** */

  //Method
  getArrayOfFileCabinets(){
          //Make a variable for array
          let array;
          // Read file 
         let textFromFile = localStorage.getItem(this.arrayOfFileCabinets);
 
       if(textFromFile){
                    //parse file 
            array = JSON.parse(textFromFile); 
       }else{
         array = [];
       }
       // return array
       return array;
     } // End getArrayFromFile method
  

  //Method 
  setArrayOfFileCabinets(array){
    let myHomeJSON = JSON.stringify(array);
    localStorage.setItem(this.arrayOfFileCabinets, myHomeJSON);

  }
  //Method
  setArrayToFileName(array, fileName){
    let myHomeJSON = JSON.stringify(array);
    localStorage.setItem(fileName, myHomeJSON);
  }
//****************************************** */

    // Method
    getArrayFromFile(fileName) {
      //Make a variable for array
      let array;
         // Read file 
        let textFromFile = localStorage.getItem(fileName);

    	if(textFromFile){
                   //parse file 
           array = JSON.parse(textFromFile); 
      }else{
        array = [];
      }
      // return array
      return array;
    } // End getArrayFromFile method

//************************************************ */

 // Method
 getFileNameWithIndex(index) {
  let fileName;
 switch (index) {
   case 0:
            fileName = this.file0
            break;
   case 1:
            fileName = this.file1
             break;
   case 2:
             fileName = this.file2
              break;
   case 3:
              fileName = this.file3
               break;
   case 4:
               fileName = this.file4
                break;
   case 5:
                fileName = this.file5;
                 break;     
   case 6:
                 fileName = this.file6;
                  break; 
   case 7:
                  fileName = this.file7;
                   break;    
   case 8:
                   fileName = this.file8;
                    break; 
   case 9:
                    fileName = this.file9;
                     break;                                                                                              
   default:
    //  console.log('Sorry, no file name');
 }

 return fileName;
} // End getFileNameWithIndex

//*************************************************** */

//Method 
removeFileNameLS(fileName){
  localStorage.removeItem(fileName);
} // End Method

//Method 
moveAllFilesDownOneWithDeleteIndex(deletedFileCabinet){
  let lastValidFileName;
  switch (deletedFileCabinet) {
    case 0:   lastValidFileName = this.file0;
             //Grab array
             let array1 = this.getArrayFromFile(this.file1);
             
             //if array length is valid, save to file
             if(array1.length >= 1){
               this.setArrayToFileName(array1, this.file0);
               lastValidFileName = this.file1;
               this.removeFileNameLS(lastValidFileName);
             }
             //********************************************** */
             //Grab array 
             let array2 = this.getArrayFromFile(this.file2);
       
             //if array length is valid, save to file
             if(array2.length >=  1){
               this.setArrayToFileName(array2, this.file1);
               lastValidFileName = this.file2;
               this.removeFileNameLS(lastValidFileName);
             }
             //*********************************************** */
             //Grab array 
             let array3 = this.getArrayFromFile(this.file3);
             
              //if array length is valid, save to file
              if(array3.length >=  1){
                 this.setArrayToFileName(array3, this.file2);
                 lastValidFileName = this.file3;
                 this.removeFileNameLS(lastValidFileName);
               }
               //*********************************************** */
                //Grab array 
               let array4 = this.getArrayFromFile(this.file4);
               //if array length is valid, save to file
               if(array4.length >=  1){
                 this.setArrayToFileName(array4, this.file3)
                 lastValidFileName = this.file4;
                 this.removeFileNameLS(lastValidFileName);
               }
              //  //*********************************************** */
              //Grab array
              let array5 = this.getArrayFromFile(this.file5);
              //if array length is valid, save it to file
              if(array5.length >= 1){
                this.setArrayToFileName(array5, this.file4);
                lastValidFileName = this.file5;
                this.removeFileNameLS(lastValidFileName);
              }
             //*********************************************** */
              //Grab array
               let array6 = this.getArrayFromFile(this.file6);
                //if array length is valid, save it to file
                if(array6.length >= 1){
                  this.setArrayToFileName(array6, this.file5);
                  lastValidFileName = this.file6;
                  this.removeFileNameLS(lastValidFileName);
                }
                  //  //*********************************************** */
              //Grab array
              let array7 = this.getArrayFromFile(this.file7);
               //if array length is valid, save it to file
               if(array7.length >= 1){
                 this.setArrayToFileName(array7, this.file6);
                 lastValidFileName = this.file7;
                 this.removeFileNameLS(lastValidFileName);
               }
              //*********************************************** */
              //Grab array
              let array8 = this.getArrayFromFile(this.file8);
               //if array length is valid, save it to file
               if(array8.length >= 1){
                 this.setArrayToFileName(array8, this.file7);
                 lastValidFileName = this.file8;
                 this.removeFileNameLS(lastValidFileName);
               }
               //*********************************************** */
              //Grab array
              let array9 = this.getArrayFromFile(this.file9);
              //if array length is valid, save it to file
              if(array9.length >= 1){
                this.setArrayToFileName(array9, this.file8);
                lastValidFileName = this.file9;
                this.removeFileNameLS(lastValidFileName);
              }
              // this is the last line in case 0:
              this.removeFileNameLS(lastValidFileName);
         
             break;
    case 1:
            //********************************************** */
            lastValidFileName = this.file1;
             //Grab array 
             let array2C1 = this.getArrayFromFile(this.file2);
          
             //if array length is valid, save to file
             if(array2C1.length >=  1){
               this.setArrayToFileName(array2C1, this.file1);
               lastValidFileName = this.file2;
               this.removeFileNameLS(lastValidFileName);
             }
                          //*********************************************** */
               //Grab array 
               let array3C1 = this.getArrayFromFile(this.file3);
             
               //if array length is valid, save to file
               if(array3C1.length >=  1){
                 this.setArrayToFileName(array3C1, this.file2);
                 lastValidFileName = this.file3;
                 this.removeFileNameLS(lastValidFileName);
               }
            //*********************************************** */
            //Grab array 
            let array4C1 = this.getArrayFromFile(this.file4);
            //if array length is valid, save to file
            if(array4C1.length >=  1){
              this.setArrayToFileName(array4C1, this.file3)
              lastValidFileName = this.file4;
              this.removeFileNameLS(lastValidFileName);
              }
            //*********************************************** */
            //Grab array 
            let array5C1 = this.getArrayFromFile(this.file5);
            //if array length is valid, save to file
            if(array5C1.length >= 1){
              this.setArrayToFileName(array5C1, this.file4);
              lastValidFileName = this.file5;
              this.removeFileNameLS(lastValidFileName);
            }
            //*********************************************** */
            //Grab array 
            let array6C1 = this.getArrayFromFile(this.file6);
            //if array length is valid, save to file
            if(array6C1.length >= 1){
              this.setArrayToFileName(array6C1, this.file5);
              lastValidFileName = this.file6;
              this.removeFileNameLS(lastValidFileName);
            }
            //*********************************************** */
            //Grab array 
            let array7C1 = this.getArrayFromFile(this.file7);
            //if array length is valid, save to file
            if(array7C1.length >= 1){
              this.setArrayToFileName(array7C1, this.file6);
              lastValidFileName = this.file7;
              this.removeFileNameLS(lastValidFileName);
            }
            //*********************************************** */
            //Grab array 
            let array8C1 = this.getArrayFromFile(this.file8);
            //if array length is valid, save to file
            if(array8C1.length >= 1){
              this.setArrayToFileName(array8C1, this.file7);
              lastValidFileName = this.file8;
              this.removeFileNameLS(lastValidFileName);
            }
            //*********************************************** */
            //Grab array 
            let array9C1 = this.getArrayFromFile(this.file9);
            //if array length is valid, save to file
            if(array9C1.length >= 1){
              this.setArrayToFileName(array9C1, this.file8);
              lastValidFileName = this.file9;
              this.removeFileNameLS(lastValidFileName);
            }
            //this is the last line in case 1:
              this.removeFileNameLS(lastValidFileName);
              break;
    case 2:
              //*********************************************** */
               lastValidFileName = this.file2;
               //Grab array 
               let array3C2 = this.getArrayFromFile(this.file3);
             
               //if array length is valid, save to file
               if(array3C2.length >=  1){
                 this.setArrayToFileName(array3C2, this.file2);
                 lastValidFileName = this.file3;
                 this.removeFileNameLS(lastValidFileName);
               }
             //*********************************************** */
            //Grab array 
            let array4C2 = this.getArrayFromFile(this.file4);
            //if array length is valid, save to file
            if(array4C2.length >=  1){
              this.setArrayToFileName(array4C2, this.file3)
              lastValidFileName = this.file4;
              this.removeFileNameLS(lastValidFileName);
              }
             //*********************************************** */
            //Grab array 
            let array5C2 = this.getArrayFromFile(this.file5);
             //if array length is valid, save to file
            if(array5C2.length >= 1){
              this.setArrayToFileName(array5C2, this.file4);
              lastValidFileName = this.file5;
              this.removeFileNameLS(lastValidFileName);
            }
             //*********************************************** */
            //Grab array  
           let array6C2 = this.getArrayFromFile(this.file6);
           //if array length is valid, save to file
           if(array6C2.length >= 1){
             this.setArrayToFileName(array6C2, this.file5);
             lastValidFileName = this.file6;
             this.removeFileNameLS(lastValidFileName);
           }
             //*********************************************** */
            //Grab array  
            let array7C2 = this.getArrayFromFile(this.file7);
               //if array length is valid, save to file
               if(array7C2.length >= 1){
                 this.setArrayToFileName(array7C2, this.file6);
                 lastValidFileName = this.file7;
                 this.removeFileNameLS(lastValidFileName);
               }
             //*********************************************** */
            //Grab array  
            let array8C2 = this.getArrayFromFile(this.file8);
               //if array length is valid, save to file
               if(array8C2.length >= 1){
                 this.setArrayToFileName(array8C2, this.file7);
                 lastValidFileName - this.file8;
                 this.removeFileNameLS(lastValidFileName);
               }
             //*********************************************** */
            //Grab array  
            let array9C2 = this.getArrayFromFile(this.file9);
            //if array length is valid, save to file
            if(array9C2.length >= 1){
              this.setArrayToFileName(array9C2, this.file8);
              lastValidFileName = this.file9;
              this.removeFileNameLS(lastValidFileName);
            }

            //*********************************************** */
            //This is the last line in case 2:
              this.removeFileNameLS(lastValidFileName);              
               break;
    case 3:
            //*********************************************** */
             lastValidFileName = this.file3;
            //Grab array 
            let array4C3 = this.getArrayFromFile(this.file4);
            //if array length is valid, save to file
            if(array4C3.length >=  1){
              this.setArrayToFileName(array4C3, this.file3)
              lastValidFileName = this.file4;
              this.removeFileNameLS(lastValidFileName);
              }
            //*********************************************** */
            //Grab array 
            let array5C3 = this.getArrayFromFile(this.file5);
            //if array length is valid, save to file
              if(array5C3.length >= 1){
                this.setArrayToFileName(array5C3, this.file4);
                lastValidFileName = this.file5;
                this.removeFileNameLS(lastValidFileName);
              }
               //*********************************************** */
            //Grab array
            let array6C3 = this.getArrayFromFile(this.file6);
             //if array length is valid, save to file
             if(array6C3.length >= 1){
               this.setArrayToFileName(array6C3, this.file5);
               lastValidFileName = this.file6;
               this.removeFileNameLS(lastValidFileName);
             }
               //*********************************************** */
            //Grab array
            let array7C3 = this.getArrayFromFile(this.file7);
             //if array length is valid, save to file
             if(array7C3.length >= 1){
               this.setArrayToFileName(array7C3, this.file6);
               lastValidFileName = this.file7;
               this.removeFileNameLS(lastValidFileName);
             }
               //*********************************************** */
            //Grab array
            let array8C3 = this.getArrayFromFile(this.file8);
            //if array length is valid, save to file
            if(array8C3.length >= 1){
              this.setArrayToFileName(array8C3, this.file7);
              lastValidFileName = this.file8;
              this.removeFileNameLS(lastValidFileName);
            }
               //*********************************************** */
            //Grab array
            let array9C3 = this.getArrayFromFile(this.file9);
            //if array length is valid, save to file
            if(array9C3.length >= 1){
              this.setArrayToFileName(array9C3, this.file8);
              lastValidFileName = this.file9;
              this.removeFileNameLS(lastValidFileName);
            }
            //this is the last line in case 3:
              this.removeFileNameLS(lastValidFileName);     
                break;
    case 4:
                //*********************************************** */
             lastValidFileName = this.file4;
            //Grab array               
            let array5C4 = this.getArrayFromFile(this.file5);
                   //if array length is valid, save to file
                   if(array5C4.length >= 1){
                     this.setArrayToFileName(array5C4, this.file4);
                     lastValidFileName = this.file5;
                     this.removeFileNameLS(lastValidFileName);
                   }
                //*********************************************** */
            //Grab array 
            let array6C4 = this.getArrayFromFile(this.file6);
            //if array length is valid, save to file
            if(array6C4.length >= 1){
              this.setArrayToFileName(array6C4, this.file5);
              lastValidFileName = this.file6;
              this.removeFileNameLS(lastValidFileName);
            }
                 //*********************************************** */
            //Grab array 
            let array7C4 = this.getArrayFromFile(this.file7);
              //if array length is valid, save to file
              if(array7C4.length >= 1){
                this.setArrayToFileName(array7C4, this.file6);
                lastValidFileName = this.file7;
                this.removeFileNameLS(lastValidFileName);
              }     
                 //*********************************************** */
            //Grab array 
            let array8C4 = this.getArrayFromFile(this.file8);
             //if array length is valid, save to file
             if(array8C4.length >= 1){
               this.setArrayToFileName(array8C4, this.file7);
               lastValidFileName = this.file8;
               this.removeFileNameLS(lastValidFileName);
             }      
                               //*********************************************** */
            //Grab array 
              let array9C4 = this.getArrayFromFile(this.file9);
              //if array length is valid, save to file
              if(array9C4.length >= 1){
                this.setArrayToFileName(array9C4, this.file8);
                lastValidFileName = this.file9;
                this.removeFileNameLS(lastValidFileName);
              }
            //this is the last line in case 4:
                this.removeFileNameLS(lastValidFileName); 
                
                 break;
    case 5:  //*********************************************** */
            lastValidFileName = this.file5;
             //Grab array
             let array6C5 = this.getArrayFromFile(this.file6);
              //if array length is valid, save to file
              if(array6C5.length >= 1){
                this.setArrayToFileName(array6C5, this.file5);
                lastValidFileName = this.file6;
                this.removeFileNameLS(lastValidFileName);
              }
 //*********************************************** */
             //Grab array
             let array7C5 = this.getArrayFromFile(this.file7);
             //if array length is valid, save to file
             if(array7C5.length >= 1){
                 this.setArrayToFileName(array7C5, this.file6);
                 lastValidFileName = this.file7;
                 this.removeFileNameLS(lastValidFileName);
               }
       //*********************************************** */
             //Grab array
             let array8C5 = this.getArrayFromFile(this.file8);
              //if array length is valid, save to file
              if(array8C5.length >= 1){
                this.setArrayToFileName(array8C5, this.file7);
                lastValidFileName = this.file8;
                this.removeFileNameLS(lastValidFileName);
              }    
         //*********************************************** */
             //Grab array
             let array9C5 = this.getArrayFromFile(this.file9);
                    //if array length is valid, save to file
                if(array9C5.length >= 1){
                  this.setArrayToFileName(array9C5,this.file8);
                  lastValidFileName = this.file9;
                  this.removeFileNameLS(lastValidFileName);
                }           
                              //this is the last line in case 5:
                              this.removeFileNameLS(lastValidFileName);
                 break;
    case 6: 
             //*********************************************** */
             lastValidFileName = this.file6;
             //Grab array
             let array7C6 = this.getArrayFromFile(this.file7);
             //if array length is valid, save to file
             if(array7C6.length >= 1){
               this.setArrayToFileName(array7C6, this.file6);
               lastValidFileName = this.file7;
               this.removeFileNameLS(lastValidFileName);
             }
                   //*********************************************** */
             //Grab array
             let array8C6 = this.getArrayFromFile(this.file8);
                  //if array length is valid, save to file
                  if(array8C6.length >= 1){
                    this.setArrayToFileName(array8C6, this.file7);
                    lastValidFileName = this.file8;
                    this.removeFileNameLS(lastValidFileName);
                  }     
                                   //*********************************************** */
             //Grab array
             let array9C6 = this.getArrayFromFile(this.file9);
                      //if array length is valid, save to file
                      if(array9C6.length >= 1){
                        this.setArrayToFileName(array9C6, this.file8);
                        lastValidFileName = this.file9;
                        this.removeFileNameLS(lastValidFileName);
                      }
                //this is the last line in case 6:
                this.removeFileNameLS(lastValidFileName);
                 break;
    case 7:
                                       //*********************************************** */
              lastValidFileName = this.file7;
             //Grab array
             let array8C7 = this.getArrayFromFile(this.file8);
                  //if array length is valid, save to file
                if(array8C7.length >= 1){
                  this.setArrayToFileName(array8C7, this.file7);
                  lastValidFileName = this.file8;
                  this.removeFileNameLS(lastValidFileName);
                }
                                              //*********************************************** */
             //Grab array
             let array9C7 = this.getArrayFromFile(this.file9);
                   //if array length is valid, save to file
                   if(array9C7.length >= 1){
                     this.setArrayToFileName(array9C7, this.file8);
                     lastValidFileName = this.file9;
                     this.removeFileNameLS(lastValidFileName);
                   }    
                //this is the last line in case 7:
                this.removeFileNameLS(lastValidFileName);
                 break;
    case 8:
                                                  //*********************************************** */
              lastValidFileName = this.file8;
             //Grab array
             let array9C8 = this.getArrayFromFile(this.file9);
             //if array length is valid, save to file
             if(array9C8.length >= 1){
               this.setArrayToFileName(array9C8, this.file8);
               lastValidFileName = this.file9;
               this.removeFileNameLS(lastValidFileName);
             }
                //this is the last line in case 8
                this.removeFileNameLS(lastValidFileName);
                 break;
    case 9:
           lastValidFileName = this.file9;
            this.removeFileNameLS(lastValidFileName); 
                 break;
   default:
                 console.log('Sorry, something went wrong');
}//End switch statment
}//End moveAllFilesDownOneWithDeleteIndex()
}//End class