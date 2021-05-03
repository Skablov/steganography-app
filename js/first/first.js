const fs = require('fs');
const reader = require('any-text');
require('./firstDraw.js');
document.addEventListener('DOMContentLoaded', () => {
  console.log('1234');
  console.log(fileObject);
});

function decrypt () {
  if (fileObject.steganoContainerFile !== null && fileObject.messageLength !== null) {
    const lengthMessage = fileObject.messageLength;
    const reader = new FileReader();
    reader.readAsText(fileObject.steganoContainerFile);
    reader.onload = () => {
      const steganoContainer = reader.result;
      let binaryString = "";
      let secretMessageBin = "";
      let secretMessage = "";

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
      for (let i = 0; i < binaryString.length; i++) {
        if ((i % 7) == 0)
          secretMessageBin += " ";
        secretMessageBin += binaryString[i];
      }
      console.log(secretMessageBin);
      secretMessageBin.split(" ").map(bin => {
        secretMessage += String.fromCharCode(parseInt(bin, 2));
      })
      const str = secretMessage.slice(1);
      console.log(str);
      alert(`Успешно! \n Зашифрованное слово - ${str}`);
    }

  }
}
async function loadFile (path) {
    const textPlain = await reader.getText(path);
    console.log(textPlain);
    return textPlain;
}

function encrypt () {
  console.log(fileObject);
  if (fileObject.containerFile !== null && fileObject.messageFile !== null) {
    let containerContent = '';
    let messageContent = '';
    const containerFileLoad = async () => {
      containerContent = await reader.getText(fileObject.containerFile.path);
    }
    const messageFileLoad = async () => {
      messageContent = await reader.getText(fileObject.messageFile.path);
    }
    
    Promise.all([containerFileLoad(), messageFileLoad()]).then(() => {
      console.log("Оба файла загружены!");
      console.log(containerContent);
      const lengthSpaces = containerContent.split(" ").length - 1; // кол-во пробелов в контейнере
      let binaryString = null;
      for (let i = 0; i < messageContent.length; i++)
        binaryString == null ? binaryString = messageContent[i].charCodeAt(0).toString(2) : binaryString += messageContent[i].charCodeAt(0).toString(2);
      console.log(`Бинарная строка: ${binaryString}`);
      console.log(`Кол-во пробелов = ${lengthSpaces}, длинна сообщения в битах = ${binaryString.length}`);
      if (lengthSpaces < binaryString.length) {
        alert("Ошибка!\n Длина сообщения превышает кол-во пробелов в тексте");
        return;
      }
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
      alert(`Успешно!\n Имя стеганоконтейнера - stegano.txt \n Длина зашифрованного сообщения - ${binaryString.length}`)
    })
  } else {
    alert ("User error: \n Не все файлы были загружены!");
  }
}
