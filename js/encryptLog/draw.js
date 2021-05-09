const fileObject = {
    logFile: null,
    secretKey: null,
    checkLog: null,
    publicKey: null,
    signature: null
};

const drawHtmlTemplate = (e) => {
    console.log(e.value);
    const divEncr = document.getElementsByClassName('encr')[0];
    const divDecr = document.getElementsByClassName('decr')[0];
    if (e.value == 'encrypt') {
        divEncr.style = 'display: block';
        divDecr.style = 'display: none';
    } else {
        divEncr.style = 'display: none';
        divDecr.style = 'display: block';
    }
    for (key in fileObject) {
        fileObject[key] = null;
    }
}

const fileChange = (name) => {
    const file = document.getElementById(name);
    fileObject[name] = file.files[0];
    console.log(fileObject);
}