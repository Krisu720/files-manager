// import fs from "fs";
// import path from "path";
// import { v4 as uuid } from "uuid";

// export const handleSaveFile = async (file: Blob) => {
//   console.log("JEST!");
//   if (file instanceof Blob) {
//     console.log("niema");
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const generateId = uuid();
//     console.log(file);
//     const fileName = generateId + ".png";
//     fs.writeFile("./files/" + fileName, buffer, (err) => {
//       if (err) {
//         console.log("ERROR FILE DONT SAVE");
//         return null;
//       }
//     });
//     return fileName;
//   }
//   return null;
// };

// export const handleDeleteFile = async (name: string) => {
//   fs.rm("./files/" + name, { recursive: true }, (err) => {
//     if (err) {
//       console.log(err);
//       return false;
//     }
//   });
//   return true;
// };
