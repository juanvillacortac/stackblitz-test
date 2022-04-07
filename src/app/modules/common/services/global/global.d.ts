export {}; // this file needs to be a module
 declare global {
   interface Object {
         toParams(addNulls: boolean): Object;
   }
 }