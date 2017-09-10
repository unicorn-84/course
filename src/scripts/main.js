(function () {
  const modal = document.querySelector('#modal');
  const modalLink = document.querySelectorAll('.modal-link');
  const modalClose = document.querySelectorAll('.modal-close');
  const program = document.querySelector('#program');
  const btnScroll = document.querySelector('#btn-scroll');

  modalLink.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.toggle('active');
    });
  });
  modalClose.forEach((close) => {
    close.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.toggle('active');
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
}());

