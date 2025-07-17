import { qs, getLocalStorage, setLocalStorage } from './utils.mjs';
import { loadHeaderFooter } from './utils.mjs';
import { updateAuthUI } from './auth.mjs';

// Function to export subscriber data to newsletter.txt
async function exportSubscribersToFile() {
  const subscriberData = getLocalStorage('newsletterSubscriber');
  if (!subscriberData) {
    console.log('No subscriber data found in localStorage');
    return;
  }

  try {
    // Create a JSON string
    const jsonData = JSON.stringify(subscriberData, null, 2);
    
    // Create a Blob with the data
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a download link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'newsletter.txt';
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    
    console.log('Subscriber data exported to newsletter.txt');
  } catch (error) {
    console.error('Error exporting subscriber data:', error);
  }
}

// Function to save subscriber data
async function saveSubscriber(data) {
  setLocalStorage('newsletterSubscriber', data);
  
  try {
    const response = await fetch('http://localhost:3000/api/save-newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Server error');
    alert('Subscription saved to server!');
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to save subscription');
  }
}

// Initialize newsletter page
function initNewsletterPage() {
  const email = getLocalStorage('newsletterEmail');
  const emailInput = qs('#email');
  
  if (email && emailInput) {
    emailInput.value = email;
  }
  
  const form = qs('#newsletter-complete-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const subscriberData = {
        email: emailInput.value,
        name: qs('#name').value,
        phone: qs('#phone').value,
        date: new Date().toISOString()
      };
      
      saveSubscriber(subscriberData);
      alert('Thank you for subscribing to our newsletter!');
      window.location.href = 'index.html';
    });
  }
  
  // Add export button if needed
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Subscribers';
  exportBtn.addEventListener('click', exportSubscribersToFile);
  document.body.appendChild(exportBtn);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  updateAuthUI();
  initNewsletterPage();
});