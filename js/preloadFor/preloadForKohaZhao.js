const {ipcRenderer} = require('electron');
const fs = require('fs');

document.addEventListener('DOMContentLoaded', () => {
    const btnClose = document.querySelector('.btn-close');
    btnClose.addEventListener('click', () => {
        window.close();
    });
});
