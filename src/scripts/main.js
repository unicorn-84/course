(function () {
  const imgElements = Array.prototype.slice.call(document.querySelectorAll('.lazy-image'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (document.documentElement.classList.contains('webp')) {
          entry.target.src = entry.target.dataset.webp;
        } else {
          entry.target.src = entry.target.dataset.src;
        }
        entry.target.classList.add('vision');
        io.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '25% 0px',
  });
  window.addEventListener('load', () => {
    imgElements.forEach((img) => {
      io.observe(img);
    });
  }, false);
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

