const encryptHtml = `<label class="main-label">Выберите ваш файл контейнер</label><br>
        <input type="file" id="containerFile"  onchange="fileChange('containerFile')"><br><br>
        <label class="main-label">Выберите ваш файл с сообщением</label><br>
        <input type="file" id="messageFile"  onchange="fileChange('messageFile')"><br><br>
        <span>Выбранные файлы должны быть в формате TXT, DOCX или DOC</span><br><br>
        <button class="button28" onclick="encrypt()">Encrypt</button>`;
const decryptHtml = `<label class="main-label">Выберите ваш файл стеганоконтейнер</label><br>
        <input type="file" id="steganoContainerFile"  onchange="fileChange('steganoContainerFile')"><br><br>
        <label class="main-label">Введите длину зашифрованного сообщения</label><br><br>
        <input type="text" id="messageLength"  onchange="fileChange('messageLength')"><br><br>
        <span>Выбранный файл должны быть в формате TXT</span><br><br>
        <button class="button28" onclick="decrypt()">Decrypt</button>`;

const fileObject = {
  containerFile: null,
  messageFile: null,
  steganoContainerFile: null,
  messageLength: null
};

function drawHtmlTemplate (e) {
  console.log(e.value);
  e.value == 'encrypt' ? document.getElementById('main').innerHTML = encryptHtml : document.getElementById('main').innerHTML = decryptHtml;
  for (atr in fileObject) {
    fileObject[atr] = null;
  }
  console.log(fileObject);
}

function fileChange(name) {
  if (name === 'messageLength') {
    const str = document.getElementById(name).value;
    isNaN(str) ? alert("Некорректная длина сообщения") : fileObject[name] = str * 1;
  } else {
      const file = document.getElementById(name);
      if ( file.files[0].name.split('.').pop() !== 'txt' && file.files[0].name.split('.').pop() !== 'doc' && file.files[0].name.split('.').pop() !== 'docx'){
        alert('User error: \n Невозможно загрузить данный тип файла!');
        file.value = "";
      } else {
        fileObject[name] = file.files[0];
        console.log(fileObject);
      }
  }
  return;
}
