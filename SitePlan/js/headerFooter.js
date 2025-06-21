// Load header and footer dynamically
window.addEventListener('DOMContentLoaded', () => {
  // Load Header
  fetch('sitePlanheader.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('header').innerHTML = data;
    });

  // Load Footer
  fetch('sitePlanFooter.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('footer').innerHTML = data;
    });
});