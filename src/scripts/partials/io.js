/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor":
 ["entry"] }] */
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
});
window.addEventListener('load', () => {
  imgElements.forEach((img) => {
    io.observe(img);
  });
}, false);
