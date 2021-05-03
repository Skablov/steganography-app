
const containerFileName = "cont.txt";
const messageFileName = "mes.txt";

const containerContent = fs.readFileSync(containerFileName, "utf8");
const messageContent = fs.readFileSync(messageFileName, "utf8");
console.log(containerContent + "\n" + messageContent);

const lengthSpaces = containerContent.split(" ").length - 1; // кол-во пробелов в контейнере
//const lengthMessage = Buffer.byteLength(messageContent, "utf8");
//const binaryString = messageContent[0].charCodeAt(0).toString(2);
let binaryString = null;
for (let i = 0; i < messageContent.length; i++)
  binaryString == null ? binaryString = messageContent[i].charCodeAt(0).toString(2) : binaryString += messageContent[i].charCodeAt(0).toString(2);
console.log(`Бинарная строка: ${binaryString}`);
console.log(`Кол-во пробелов = ${lengthSpaces}, длинна сообщения в битах = ${binaryString.length}`);

if (lengthSpaces < binaryString.length)
  return;
let steganoContainer = new String();

let tmp = 0;
for (let i = 0; i < containerContent.length; i++) {
  steganoContainer += containerContent[i];
  if (containerContent[i] == " ") {
    if (tmp < binaryString.length && binaryString[tmp] == 0)
      steganoContainer += " ";
    tmp++;
  }
}

console.log(steganoContainer);

fs.writeFileSync("stegano.txt", steganoContainer);

console.log(`Имя стеганоконтейнера - stegano.txt, Длинна зашифрованного сообщения - ${binaryString.length}`);
