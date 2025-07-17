import { qs, setLocalStorage, loadHeaderFooter } from './utils.mjs';
import { updateAuthUI } from './auth.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  updateAuthUI();
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
