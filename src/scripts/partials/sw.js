if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then((reg) => {
      console.log('serviceWorker registered');
    }).catch((err) => {
      console.log('serviceWorker not registered. This happened: ', err);
    });
}
