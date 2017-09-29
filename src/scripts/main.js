//= partials/modernizr.js
//= ../../node_modules/intersection-observer/intersection-observer.js
//= partials/io.js

const modal = document.querySelector('#modal');
const modalLink = [].slice.call(document.querySelectorAll('.modal-link'));
const modalClose = [].slice.call(document.querySelectorAll('.modal-close'));
const program = document.querySelector('#program');
const btnScroll = document.querySelector('#btn-scroll');
const requestForm = document.querySelector('#requestForm');
const requestName = document.querySelector('#requestName');
const requestEmail = document.querySelector('#requestEmail');
const nameHint = document.querySelector('#nameHint');
const emailHint = document.querySelector('#emailHint');
const toast = document.querySelector('#toast');
const toastClose = [].slice.call(document.querySelectorAll('.toast-close'));

modalLink.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('active');
    requestForm.reset();
    nameHint.classList.add('d-none');
    emailHint.classList.add('d-none');
    requestName.classList.remove('is-error');
    requestEmail.classList.remove('is-error');
    toast.classList.add('d-none');
  });
});
modalClose.forEach((close) => {
  close.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('active');
  });
});
toastClose.forEach((close) => {
  close.addEventListener('click', (e) => {
    e.preventDefault();
    toast.classList.add('d-none');
  });
});
window.onclick = (e) => {
  if (e.target === modal.querySelector('.modal-overlay')) {
    modal.classList.toggle('active');
  }
};
btnScroll.addEventListener('click', (e) => {
  e.preventDefault();
  program.scrollIntoView();
});
requestForm.onsubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(requestForm);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'contact.php', true);
  xhr.send(formData);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      const res = (JSON.parse(this.responseText));
      if (res.email === 'error') {
        requestEmail.classList.add('is-error');
        emailHint.classList.remove('d-none');
      }
      if (res.name === 'error') {
        requestName.classList.add('is-error');
        nameHint.classList.remove('d-none');
      }
      if (res.result === 'success') {
        requestForm.reset();
        modal.classList.toggle('active');
        toast.classList.remove('d-none');
      }
    }
  };
};
