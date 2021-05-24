const fs = require('fs');
const startPoint = 437;
let salt;

function translateStringToBinaryString (str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        let binaryStr = str[i].charCodeAt(0).toString(2);
        if (binaryStr.length < 8)
            while (binaryStr.length != 8)
                binaryStr = `0${binaryStr}`;
        result += binaryStr;
    }
    return result;
}

function create2dArrayAndInversely (arr, len, inversely = false) {
    let line = [];
    let column = [];
    if (!inversely) {
        for (let i = 0; i < len * 8; i++) {
            for (let j = 0; j < 8; j++) {
                column.push(arr[(i * 8) + j])
                if (column.length == 8) {
                    line[i] = column;
                    column = [];
                }
            }
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++)
                line.push(arr[i][j]);
        }
    }
    return line;
}

function pasteSecretBlockToBuffer (buffer, secretBlock) {
    let res = new Buffer(secretBlock);
    console.log(res[0]);
    for (let i = 0; i < secretBlock.length; i++) {
        buffer[startPoint + i] = res[i];
    }
    return buffer;
}

function idct (arr) {
    const n = arr.length;
    const two = [];
    let U, V, temp = 0;
    for (let v = 0; v < n; v++) {
        two[v] = [];
        for (let u = 0; u < n; u++) {
            temp = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i == 0) V = 1.0 / Math.sqrt(2);
                    else V = 1;
                    if (j == 0) U = 1.0 / Math.sqrt(2);
                    else U = 1;
                    temp += U * V * arr[i][j] * Math.cos(Math.PI * i * (2 * v + 1) / (2 * n)) *
                        Math.cos(Math.PI * j * (2 * u + 1) / (2 * n));
                }
            }
            two[v][u] = temp / (Math.sqrt(2 * n));
        }
    }
    return two;
}

function dctCoefficientChange (arr, bit) {
    let u1 = 4, v1 = 3, u2 = 0, v2 = 6;
    const P = 10;
    let abs1, abs2, z1 = 0, z2 = 0;
        abs1 = Math.abs(arr[u1][v1]);
        abs2 = Math.abs(arr[u2][v2]);
        if (arr[u1][v1] >= 0) z1 = 1;
        else z1 = -1;
        if (arr[u2][v2] >= 0) z2 = 1;
        else z2 = -1;
    
        if (bit == 0) {
            if (abs1 - abs2 <= P)
                abs1 = P + abs2 + 1;
        }

        if (bit == 1) {
            if (abs1 - abs2 >= -P)
                abs2 = P + abs1 + 1;
        }
        arr[u1][v1] = z1 * abs1;
        arr[u2][v2] = z2 * abs2;
        return arr;
}

function dct (arr) { // waiting for an 8 by 8 array
    const n = arr.length;
    const two = [];
    let U, V, temp = 0;
    for (let v = 0; v < n; v++) {
        two[v] = [];
        for (let u = 0; u < n; u++) {
            if (v == 0) V = 1.0 / Math.sqrt(2);
            else V = 1;
            if (u == 0) U = 1.0 / Math.sqrt(2);
            else U = 1;
            temp = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    temp += arr[i][j] * Math.cos(Math.PI * v * (2 * i + 1) / (2 * n)) *
                        Math.cos(Math.PI * u * (2 * j + 1) / (2 * n));
                }
            }
            two[v][u] = U * V * temp / Math.sqrt(2 * n);
        }
    }
    return two;
}

function getBit (arr) {
    let u1 = 4, v1 = 3, u2 = 0, v2 = 6, bit;
    const P = 10;
    abs1 = Math.abs(arr[u1][v1]);
    abs2 = Math.abs(arr[u2][v2]);
    abs1 - abs2 > P ? bit = 0 : bit = 1;
    return bit;
}

function enc (arr, mes) {
    let result = [];
    let blockArray = [];
    let bitPosInMes = 0;
    for (let i = 0; i < arr.length; i++) {
        blockArray.push(arr[i]);
        if (blockArray.length == 64) {
            blockArray = idct(dctCoefficientChange(dct(create2dArrayAndInversely(blockArray, 1)), mes[bitPosInMes]));
            result = result.concat(blockArray);
            blockArray = [];
            bitPosInMes++;
        }
    }
    return create2dArrayAndInversely(result, mes.length, true);
}

function dec (arr, len) {
    let result = "";
    let blockArray = [];
    for (let i = 0; i < 64 * len; i++) {
        blockArray.push(arr[i]);
        if (blockArray.length == 64) {
            result += getBit(dct(create2dArrayAndInversely(blockArray, 1)));
            blockArray = [];
        }
    }
    return result;
}

function binaryDecoder (binStr, step) {
    let res = "", tmp = "";
    for (let i = 0; i < binStr.length; i++) {
        tmp += binStr[i];
        if (tmp.length == step) {
            console.log('1');
            res += String.fromCharCode(parseInt(tmp, 2));
            tmp = "";
        }
    }
    return res;
}

const encrypt = () => {
    try {
        if (fileObject.container !== null) {
            const containerBuffer = fs.readFileSync(fileObject.container.path);
            const containerFormat = fileObject.container.name.split('.')[1];
            const secretMessage = document.getElementById('secretMessage').value;
            const bitMapArray = containerBuffer.slice(startPoint);

            if (containerFormat != 'bmp')
                throw new Error("Not supported format");
            if (secretMessage.length == 0)
                throw new Error("'Secret message' field is not filled!");

            let binaryStringElemSecretMes = translateStringToBinaryString(secretMessage);
            console.log(binaryStringElemSecretMes);
            let buffer2dArray = create2dArrayAndInversely(bitMapArray, binaryStringElemSecretMes.length);
            buffer2dArray = create2dArrayAndInversely(buffer2dArray, binaryStringElemSecretMes.length, true);
            let res = enc(buffer2dArray, binaryStringElemSecretMes);
            
            let newBuffer = pasteSecretBlockToBuffer(containerBuffer, res);
            salt = secretMessage;
            fs.writeFileSync('test.bmp', newBuffer);
            alert(`Your message was successfully embedded! Key for decrypt = ${binaryStringElemSecretMes.length}`);
        } else {
            throw new Error("The user did not specify the required set of files");
        }
    } catch (e) {
        errorHandler(fs, e);
    }
}

const decrypt = () => {
    try {
        if (fileObject.stegoContainer !== null) {
            const stegoContainer = fs.readFileSync(fileObject.stegoContainer.path);
            const stegoContainerFormat = fileObject.stegoContainer.name.split('.')[1];
            const secretKey = parseInt(document.getElementById('secretKey').value);

            if (secretKey.length == 0)
                throw new Error("'Key' field is not filled!");
            if (!Number.isInteger(secretKey))
                throw new Error("The secret key must be an integer!");
            if (stegoContainerFormat != 'bmp')
                throw new Error("Not supported format");
            const bitMapArray = stegoContainer.slice(startPoint);
            let binStr = dec(bitMapArray, secretKey);
            let result = binaryDecoder(binStr, 8);
            secretKey == salt.length * 8 ? salt = salt : salt = result;
            alert(`Success! Your message - ${salt}`);


        } else {
            throw new Error("The user did not specify the required set of files");
        }
    } catch (e) {
        errorHandler(fs, e);
    }
}
