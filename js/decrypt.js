const fs = require("fs");

const lengthMessage = 74;
const fileName = "stegano.txt";
let binaryString = "";
let secretMessageBin = "";
let secretMessage = "";

const steganoContainer = fs.readFileSync(fileName, "utf-8");

console.log(steganoContainer);

for (let i = 0; i < steganoContainer.length; i++) {
  if (steganoContainer[i] == " " && binaryString.length < lengthMessage) {
    if (steganoContainer[i + 1] == " ") {
      binaryString += "0";
      i++;
    } else {
      binaryString += "1";
    }
  }
}
console.log(binaryString.length);
console.log(binaryString);

for (let i = 0; i < binaryString.length; i++) {
  if ((i % 7) == 0)
    secretMessageBin += " ";
  secretMessageBin += binaryString[i];
}
secretMessageBin.split(" ").map(bin => {
  console.log("bin = " + bin);
  secretMessage += String.fromCharCode(parseInt(bin, 2));
})



console.log(secretMessage);
