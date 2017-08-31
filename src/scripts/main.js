(function (){
  let modal = document.querySelector('#modal');
  let modalLink = document.querySelectorAll('.modal-link');
  let modalClose = document.querySelectorAll('.modal-close');

  modalLink.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      modal.classList.toggle('active');
    })
  });
  modalClose.forEach(function (close) {
    close.addEventListener('click', function (e) {
      e.preventDefault();
      modal.classList.toggle('active');
    })
  });
  window.onclick = function(e){
    if(e.target === modal.querySelector('.modal-overlay')){
      modal.classList.toggle('active');
    }
  }
}());