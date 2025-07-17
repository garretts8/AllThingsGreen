import { loadHeaderFooter, qs, getLocalStorage, setLocalStorage } from './utils.mjs';
import { updateAuthUI } from './auth.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  updateAuthUI();
// Handle newsletter subscription form
  const newsletterForm = qs('#newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = qs('#newsletter-email').value;
      setLocalStorage('newsletterEmail', email);
      window.location.href = 'newsletter.html';
    });
  }
});