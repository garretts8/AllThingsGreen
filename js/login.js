import { loadHeaderFooter } from './utils.mjs';
import { qs, getLocalStorage, setLocalStorage } from './utils.mjs';
import { validateRegistration, validateLogin } from './auth.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  
  // Redirect if already logged in
  if (getLocalStorage('currentUser')) {
    window.location.href = 'index.html';
    return;
  }

  // Form elements
  const registerForm = qs('#register-form');
  const loginForm = qs('#login-form');
  const showLoginLink = qs('#show-login');
  const showRegisterLink = qs('#show-register');
  const registerSection = qs('.login-section:not(#login-section)');
  const loginSection = qs('#login-section');

  // Toggle between forms
  showLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });

  showRegisterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
  });

  // Registration handler
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: qs('#name', registerForm).value,
      address: qs('#address', registerForm).value,
      email: qs('#email', registerForm).value,
      phone: qs('#phone', registerForm).value,
      username: qs('#username', registerForm).value,
      password: qs('#password', registerForm).value
    };

    const users = getLocalStorage('users') || [];
    const validationError = validateRegistration(formData.username, users);
    
    if (validationError) {
      alert(validationError);
      return;
    }

    const newUser = {
      ...formData,
      firstName: formData.name.split(' ')[0]
    };

    users.push(newUser);
    setLocalStorage('users', users);
    setLocalStorage('currentUser', newUser);
    window.location.href = 'index.html';
  });

  // Login handler
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = qs('#login-username', loginForm).value;
    const password = qs('#login-password', loginForm).value;
    const users = getLocalStorage('users') || [];
    
    const validationError = validateLogin(username, password, users);
    if (validationError) {
      alert(validationError);
      return;
    }

    const user = users.find(u => u.username === username);
    setLocalStorage('currentUser', user);
    window.location.href = 'index.html';
  });
});