(function () {
  const modal = document.querySelector('#modal');
  const modalLink = document.querySelectorAll('.modal-link');
  const modalClose = document.querySelectorAll('.modal-close');

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
}());
