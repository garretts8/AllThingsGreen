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
      
      // Prepare data for server
      const data = {
        path: 'C:\\Users\\mitch\\OneDrive\\Desktop\\BYUI\\WDD 330 Web Frontend Development II\\WDD330\\WDD330PlantSpecies\\AllThingsGreen\\newsletter.txt',
        content: `Subscriber:\nEmail: ${subscriber.email}\nName: ${subscriber.name}\nPhone: ${subscriber.phone}\nDate: ${subscriber.date}\n\n`
      };
      
      // Send to Electron main process (if using Electron)
      if (window.electron) {
        window.electron.saveFile(data);
      } else {
        // Fallback to download
        saveAsDownload(data.content);
      }
      
      alert('Thank you for subscribing!');
      window.location.href = 'index.html';
    });
  }
});

function saveAsDownload(content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'newsletter.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}