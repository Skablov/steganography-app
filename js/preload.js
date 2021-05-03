const {ipcRenderer} = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  console.log(document.title);

  const btnClose = document.querySelector('.btn-close');
  const btnMax = document.querySelector('.btn-max');
  const btnMin = document.querySelector('.btn-min');
  const iconBtnMax = btnMax.children[0];
  const first = document.querySelector('#first');

  first.addEventListener('click', () => {
    ipcRenderer.send('loadWindow', 'first');
  });

  second.addEventListener('click', () => {
    ipcRenderer.send('loadWindow', 'second');
  });

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
})
