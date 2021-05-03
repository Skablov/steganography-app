const fs = require('fs');

document.addEventListener('DOMContentLoaded', () => {
    console.log('second page is loaded!');
    console.log(fileObject);
});

function encrypt() {
    if (fileObject.containerFile !== null && fileObject.messageFile !== null) {
        console.log(`------------Start------------`);
        const containerFileName = fileObject.containerFile.name;
        const secretImageFileName = fileObject.messageFile.name;
        const imageFormat = new Buffer(secretImageFileName.split('.')[1]);
        const bmpBuffer = fs.readFileSync(containerFileName);
        const secretImageFile = fs.readFileSync(secretImageFileName);
        const secretImage = Buffer.concat([imageFormat, secretImageFile], imageFormat.length + secretImageFile.length);

        if (bmpBuffer.length - 78 <= secretImage.length) {
            console.log(`
                Ошибка пользователя:
                Размер буффера секретного сообщения -
                -- превышает размер желаемого контейнера!
            `);
            console.log(`-------------End-------------`);
            return;
        }

        const createArrayKey = (len) => {
            let array = [];
            let randomInteger = (min, max) => {
                let rand = min + Math.random() * (max + 1 - min);
                return Math.floor(rand);
            }
            for (let i = 78; i < len - 78; i++) {
                array.push(i);
            }
            for (let i = 0; i < array.length; i++) { // Тасование Фишера - Йетса
                let tmp = array[i];
                let random = randomInteger(0, array.length - 1);
                array[i] = array[random];
                array[random] = tmp;
            }
            return array;
        }

        const fillArrayBinaryElement = (bufferImage) => {
            let arr = new Array(bufferImage.length);
            for (let i = 0; i < bufferImage.length; i++) {
                let binStr = bufferImage[i].toString(2);
                while (binStr.length != 8)
                    binStr = `0${binStr}`;
                arr.push(binStr);
            }
            return arr;
        }

        const changeLeastSignificantBit = (bufferElement, bit) => {
            let tmp = bufferElement.substring(0, bufferElement.length - 1) + bit;
            return Number(parseInt(tmp, 2));
        }
        let count = 0;
        let secretKey = '';
        const arrayKey = createArrayKey(bmpBuffer.length);
        const arrayBinaryElementSecretImage = fillArrayBinaryElement(secretImage);

        arrayBinaryElementSecretImage.forEach(elem => {
            for (let i = 0; i < elem.length; i++) {
                secretKey == '' ? secretKey = arrayKey[count] : secretKey += `;${arrayKey[count]}`;
                bmpBuffer[arrayKey[count]] = changeLeastSignificantBit(bmpBuffer[arrayKey[count]].toString(2), elem[i]);
                count++;
            }
        });
        console.log(bmpBuffer);

        fs.writeFileSync('steganoCont.bmp', bmpBuffer);
        fs.writeFileSync('secretKey.key', secretKey);

        console.log(`-------------End-------------`);
        alert("Успешно!\nСоздано (2) файла:\nsteganoCont.bmp\nsecretKey.key");
    } else {
        alert("User error: \n Не все файлы были загружены!");
    }
    return;
}

function decrypt() {
    if (fileObject.stegoContainerFile !== null && fileObject.keyFile !== null) {
        console.log(`------------Start------------`);
        let pos = 0;
        const containerFileName = fileObject.stegoContainerFile.name;
        const keyFileName = fileObject.keyFile.name;
        let bmpBuffer = fs.readFileSync(containerFileName);
        const secretKeyFile = fs.readFileSync(keyFileName).toString();
        const arrayByte = [];
        const format = [];
        let tmp = '';

        secretKeyFile.split(';').forEach(elem => {
            let bufferByte = bmpBuffer[elem].toString(2);
            tmp += bufferByte[bufferByte.length - 1];
            if (pos < 24 && tmp.length == 8) {
                console.log(pos);
                format.push(parseInt(tmp, 2));
                pos += 8;
                tmp = '';
            } else if (tmp.length == 8) {
                arrayByte.push(parseInt(tmp, 2));
                tmp = '';
            }
        });
        let arrFormat = format.map(elem => {
            return String.fromCharCode(elem);
        })
        const decryptFile = new Buffer(arrayByte);
        console.log(decryptFile);
        fs.writeFileSync('success.' + arrFormat.join(''), decryptFile);

        console.log(`-------------End-------------`);
        alert("Успешно!\nСоздан (1) файл:\nsuccess." + arrFormat.join(''));
    } else {
        alert("User error: \n Не все файлы были загружены!");
    }
    return;
}
