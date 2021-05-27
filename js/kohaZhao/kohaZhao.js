const fs = require('fs');
const startPoint = 54;

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

function create2dArrayAndInversely (arr,  two = false) {
    let count = 0;
    let line = [];
    let column = [];
    if (two) {
        for (let i = 0; i < arr.length; i++) {
            column.push(arr[i][1]);
            if (column.length == 8) {
                line[count++] = column;
                column = [];
            }
        }
    } else {
        for (let i = 0; i < arr.length; i++)
            for (let j = 0; j < arr[i].length; j++)
                line.push(arr[i][j]);
    }
    return line;
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
            two[v][u] = (U * V * temp / Math.sqrt(2 * n));
        }
    }
    return two;
}

function getCr (buffer, len) {
    let arrYCr = [];
    for (let i = 0; i < buffer.length; i += 3) {
        let Y = Math.round((0.299 * buffer[i + 2]) + (0.587 * buffer[i + 1]) + (0.114 * buffer[i]));
        let Cr = Math.round((0.7132 * (buffer[i + 2] - Y)) + 128);
        arrYCr.push([Y, Cr]);
        if (arrYCr.length == len * 64)
            break;
    }
    return arrYCr;
}

function dctCoefficientChange (arr, bit) {
    let u1 = 3, v1 = 4, u2 = 4, v2 = 3;
    const P = 25;
    let abs1, abs2, z1 = 0, z2 = 0;
        abs1 = Math.abs(arr[u1][v1]);
        abs2 = Math.abs(arr[u2][v2]);
        // console.log(`1) abs1 = ${abs1} abs2 = ${abs2} bit = ${bit}`);
        if (arr[u1][v1] >= 0) z1 = 1;
        else z1 = -1;
        if (arr[u2][v2] >= 0) z2 = 1;
        else z2 = -1;
        
        if (bit == 0) {
            if (abs1 - abs2 <= P)
            abs1 = P + abs2 + 2;
        }
        
        if (bit == 1) {
            if (abs1 - abs2 >= -P)
            abs2 = P + abs1 + 2;
        }
        arr[u1][v1] = z1 * abs1;
        arr[u2][v2] = z2 * abs2;
        //console.log(`1) abs1 = ${arr[u1][v1]} abs2 = ${arr[u2][v2]} bit = ${bit}`)
        return arr;
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

function binaryDecoder (binStr, step) {
    let res = "", tmp = "";
    for (let i = 0; i < binStr.length; i++) {
        tmp += binStr[i];
        if (tmp.length == step) {
            res += String.fromCharCode(parseInt(tmp, 2));
            tmp = "";
        }
    }
    return res;
}

function getBit (arr) {
    let u1 = 3, v1 = 4, u2 = 4, v2 = 3, bit;
    const P = 25;
    abs1 = Math.abs(arr[u1][v1]);
    abs2 = Math.abs(arr[u2][v2]);
    abs1 > abs2 ? bit = 0 : bit = 1;
    return bit;
}

function getR (arrCr, arrY) { // waiting for 1-d array and 2d for arrY
    let result = [];
    for (let i = 0; i < arrCr.length; i++) {
        let R = arrY[i][0] + (1.402 * (arrCr[i] - 128));
        result.push(Math.round(R));
    }
    return result;
}

function pasteRedPixToBuffer (buffer, arrRedPix) {
    let count = 0;
    for (let i = startPoint; i < buffer.length; i += 3) {
        buffer[i + 2] = arrRedPix[count++];
        if (count == arrRedPix.length)
            break;
    }
    return buffer;
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
            const step = 8;

            if (containerFormat != 'bmp')
                throw new Error("Not supported format");
            if (secretMessage.length == 0)
                throw new Error("'Secret message' field is not filled!");

            let binaryMessage = translateStringToBinaryString(secretMessage);
            let arrYCr = getCr(bitMapArray, binaryMessage.length);
            let arrCr2d = create2dArrayAndInversely(arrYCr, true) // двумерный массив красной компоненты

            let result = [], countMes = 0;
            for (let i = 0; i < arrCr2d.length; i += step) {
                let tmp = dct(arrCr2d.slice(i, i + step));
                tmp = dctCoefficientChange(tmp, binaryMessage[countMes++]);
                tmp = idct(tmp);
                result = result.concat(create2dArrayAndInversely(tmp));
            }
            result = getR(result, arrYCr);
            const newBuffer = new Buffer(pasteRedPixToBuffer(containerBuffer, result));
            fs.writeFileSync('test.bmp', newBuffer);
            alert(`Your message was successfully embedded! Key for decrypt = ${binaryMessage.length}`);
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
            const bitMapArray = stegoContainer.slice(startPoint);
            const step = 8;

            if (secretKey.length == 0)
                throw new Error("'Key' field is not filled!");
            if (!Number.isInteger(secretKey))
                throw new Error("The secret key must be an integer!");
            if (stegoContainerFormat != 'bmp')
                throw new Error("Not supported format");
            
            let arrYCr = getCr(bitMapArray, secretKey);
            let arrCr2d = create2dArrayAndInversely(arrYCr, true);

            let result = "";
            for (let i = 0; i < arrCr2d.length; i += step) {
                let tmp = dct(arrCr2d.slice(i, i + step));
                result += getBit(tmp);
                if (result.length == secretKey)
                    break;
            }
            console.log(result);
            alert(`Success! Your message - ${binaryDecoder(result, 8)}`);
        } else {
            throw new Error("The user did not specify the required set of files");
        }
    } catch (e) {
        errorHandler(fs, e);
    }
}
