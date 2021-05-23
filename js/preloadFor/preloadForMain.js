const {ipcRenderer} = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    console.log(document.title);
  
    const btnClose = document.querySelector('.btn-close');
    const btnMax = document.querySelector('.btn-max');
    const btnMin = document.querySelector('.btn-min');
    const iconBtnMax = btnMax.children[0];
    const btnLogin = document.querySelector('#loginUser');
    const btnReg = document.querySelector('#registerUser');
  
    document.querySelector('#first').addEventListener('click', () => {
      ipcRenderer.send('loadWindow', 'first');
    });
  
    document.querySelector('#second').addEventListener('click', () => {
      ipcRenderer.send('loadWindow', 'second');
    });
    document.querySelector('#encryptLog').addEventListener('click', () => {
      ipcRenderer.send('loadWindow', 'encryptLog');
    })
  
    document.querySelector('#kohaZhao').addEventListener('click', () => {
      ipcRenderer.send('loadWindow', 'kohaZhao');
    })

    btnMin.addEventListener('click', () => {
      ipcRenderer.send('minimize', `${document.title}`);
    });
  
  
    btnClose.addEventListener('click', () => {
      window.close();
    });
  
    document.querySelectorAll('li[data-action="sm-open"]').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.getAttribute('data-isaction') === 'false') {
          e.target.setAttribute('data-isaction', 'true');
          e.target.children[0].style.display = 'block';
        } else if (e.target.getAttribute('data-isaction') === 'true'){
          e.target.setAttribute('data-isaction', 'false');
          e.target.children[0].style.display = 'none';
        }
      })
    })
  });