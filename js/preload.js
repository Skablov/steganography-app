const {ipcRenderer} = require('electron');
const fs = require('fs');



document.addEventListener('DOMContentLoaded', () => {
  console.log(document.title);

  const btnClose = document.querySelector('.btn-close');
  const btnMax = document.querySelector('.btn-max');
  const btnMin = document.querySelector('.btn-min');
  const iconBtnMax = btnMax.children[0];
  const btnLogin = document.querySelector('#loginUser');
  const btnReg = document.querySelector('#registerUser');

  btnReg.addEventListener('click', () => {
    try {
      const login = document.getElementById('regLogin').value;
      const psw = document.getElementById('regPassword').value;
      const retPsw = document.getElementById('repRegPassword').value;
      let complexPassword = false;
      if (isEmpty(login) || isEmpty(psw) || isEmpty(retPsw))
        throw new Error('The user did not specify the required set of files');
      if (psw !== retPsw)
        throw new Error('Passwords mismatch');
      if (psw.length <= 5)
        throw new Error('Password must contain at least 6 characters');
      complexPassword = checkPassword(psw);
      if (!complexPassword)
        throw new Error('Password must contain uppercase and lowercase characters, numbers and special characters');
      const bdArr = JSON.parse(fs.readFileSync('./bd/bd.txt'));
      for (let i = 0; i < bdArr.length; i++) {
        if (bdArr[i].login == login) throw new Error('This login is already to use');
      }
      bdArr.push({
        login: login,
        psw: psw
      });
      fs.writeFileSync('./bd/bd.txt', JSON.stringify(bdArr));
      alert("You have successfully registered!");

    } catch (err) {
      alert(err);
    }
  })

  btnLogin.addEventListener('click', () => {
    try {
      const login = document.getElementById('login').value;
      let auth = false;
      const psw = document.getElementById('password').value;
      if (isEmpty(login) || isEmpty(psw))
        throw new Error('The user did not specify the required set of files');
      const bdArr = JSON.parse(fs.readFileSync('./bd/bd.txt'));
      for (let i = 0; i < bdArr.length; i++) {
        if (bdArr[i].login == login) {
          if (bdArr[i].psw == psw) auth = true;
        }
      }
      if (auth) {
        alert('You have successfully authorization!');
        ipcRenderer.send('loadWindow', 'main');
      } else {
        alert('Incorrect login or password!');
      }
    } catch (err) {
      alert(err);
    }

  })

  btnMin.addEventListener('click', () => {
    ipcRenderer.send('minimize', `${document.title}`);
  });

  btnMax.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      iconBtnMax.classList.remove('fa-window-maximaze');
      iconBtnMax.classList.add('fa-window-restore');
    } else {
      document.exitFullscreen();
      iconBtnMax.classList.add('fa-window-maximaze');
      iconBtnMax.classList.remove('fa-window-restore');
    }
  })

  btnClose.addEventListener('click', () => {
    ipcRenderer.send('closeWindow', `${document.title}`);
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

function isEmpty(str) {
  if (str.trim() == '') 
    return true;
    
  return false;
}

function checkPassword (psw) {
  const sLetters = 'qwertyuiopasdfghjklzxcvbnm';
  const bLetters = 'QWERTYUIOPLKJHGFDSAZXCVBNM';
  const digits = '0123456789';
  const specials = '!@#$%^&*()_-+=\|/.,:;[]{}';
  let isS = false;
  let isB = false;
  let isD = false;
  let isSp = false;
  for (let i = 0; i < psw.length; i++) {
    if (!isS && sLetters.indexOf(psw[i]) != -1) isS = true;
    else if (!isB && bLetters.indexOf(psw[i]) != -1) isB = true;
    else if (!isD && digits.indexOf(psw[i]) != -1) isD = true;
    else if (!isSp && specials.indexOf(psw[i]) != -1) isSp = true;
  }
  if (isS && isB && isD && isSp) return true;
  else return false;
}