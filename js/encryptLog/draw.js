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
}