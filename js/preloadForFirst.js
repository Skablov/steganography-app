const {ipcRenderer} = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  console.log(document.title);

  const btnClose = document.querySelector('.btn-close');
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
})
