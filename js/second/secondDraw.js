const encryptHtml = `<label class="main-label">Выберите ваш файл контейнер</label><br>
<input type="file" id="containerFile"  onchange="fileChange(this)"><br><br>
<label class="main-label">Выберите ваш секретный файл</label><br>
<input type="file" id="messageFile"  onchange="fileChange(this)"><br><br>
<button class="button28" onclick="encrypt()">Encrypt</button>
<button class="button28" onclick="encrypt(true)">Show insertion point</button>`;

const decryptHtml = `<label class="main-label">Выберите ваш стегоконтейнер</label><br>
<input type="file" id="stegoContainerFile"  onchange="fileChange(this)"><br><br>
<label class="main-label">Выберите ваш файл-ключ</label><br><br>
<input type="file" id="keyFile"  onchange="fileChange(this)"><br><br>
<span>Выбранный файл должны быть в формате KEY</span><br><br>
<button class="button28" onclick="decrypt()">Decrypt</button>`;

const fileObject = {
    containerFile: null,
    messageFile: null,
    stegoContainerFile: null,
    keyFile: null
}

function drawHtmlTemplate(e) {
    console.log(e.value);
    e.value == 'encrypt' ? document.getElementById('main').innerHTML = encryptHtml : document.getElementById('main').innerHTML = decryptHtml;
    for (atr in fileObject) {
        fileObject[atr] = null;
    }
    console.log(fileObject);
}

function fileChange(e) {
    try {
        const file = document.getElementById(e.id);
        console.log(file);
        if ((e.id == 'containerFile' || e.id == 'stegoContainerFile') && file.files[0].name.split('.').pop() != 'bmp') {
            file.value = "";
            throw new Error('Container has an unsupported format');
        } else if (e.id == 'keyFile' && file.files[0].name.split('.').pop() != 'key') {
            throw new Error('Key has an unsupported format');
        } else {
            fileObject[e.id] = file.files[0];
        }
        return;
    } catch (err) {
        errorHandler(fs, err);
    }

}