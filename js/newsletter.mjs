import { qs, getLocalStorage, setLocalStorage } from './utils.mjs';
import { loadHeaderFooter } from './utils.mjs';
import { updateAuthUI } from './auth.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  updateAuthUI();

  // Get email from localStorage and populate the field
  const email = getLocalStorage('newsletterEmail');
  if (email) {
    qs('#email').value = email;
  }

  // Handle form submission
  const form = qs('#complete-subscription');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const subscriber = {
        email: qs('#email').value,
        name: qs('#name').value,
        phone: qs('#phone').value,
        date: new Date().toISOString()
      };
      
      // Save to localStorage
      setLocalStorage('newsletterSubscriber', subscriber);
      
      // Send data to server to save to newsletter.txt
      saveSubscriber(subscriber);
      
      // Redirect or show success message
      alert('Thank you for subscribing to our newsletter!');
      window.location.href = 'index.html';
    });
  }
});

async function saveSubscriber(subscriber) {
  try {
    const response = await fetch('/api/save-subscriber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriber),
    });
    
    if (!response.ok) {
      console.error('Failed to save subscriber');
    }
  } catch (error) {
    console.error('Error saving subscriber:', error);
  }
}