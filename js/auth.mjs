import { qs, getLocalStorage, setLocalStorage } from './utils.mjs';

export function updateAuthUI() {
  const user = getLocalStorage('currentUser');
  const loginLink = qs('#login-link');
  const logoutLink = qs('#logout-link');
  
  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
    
    // Add welcome message if on index page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      const welcomeMessage = qs('#welcome-message');
      if (welcomeMessage && !welcomeMessage.querySelector('.welcome-text')) {
        welcomeMessage.innerHTML = `
          <div class="welcome-text">
            Welcome, ${user.firstName}!
          </div>
          ${welcomeMessage.innerHTML}
        `;
      }
    }
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

export function setupLogout() {
  const logoutLink = qs('#logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }
}

export function validateRegistration(username, users) {
  if (!username || username.length < 4) {
    return 'Username must be at least 4 characters';
  }
  if (users.some(user => user.username === username)) {
    return 'Username already exists';
  }
  return null;
}

export function validateLogin(username, password, users) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return 'Invalid username or password';
  }
  return null;
}