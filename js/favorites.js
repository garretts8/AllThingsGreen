import { loadHeaderFooter } from './utils.mjs';
import { qs, getLocalStorage, setLocalStorage } from './utils.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  displayFavorites();
});

function displayFavorites() {
  const user = getLocalStorage('currentUser');
  const favoritesContainer = qs('#favorites-container');
  const noFavoritesMessage = qs('#no-favorites-message');
  const loginPrompt = qs('#login-prompt');
  
  if (!user) {
    loginPrompt.style.display = 'block';
    favoritesContainer.style.display = 'none';
    noFavoritesMessage.style.display = 'none';
    return;
  }
  
  const favorites = getLocalStorage('favorites') || {};
  const userFavorites = favorites[user.username] || [];
  
  if (userFavorites.length === 0) {
    noFavoritesMessage.style.display = 'block';
    favoritesContainer.style.display = 'none';
  } else {
    noFavoritesMessage.style.display = 'none';
    favoritesContainer.style.display = 'grid';
    favoritesContainer.innerHTML = '';
    
    userFavorites.forEach(plant => {
      const plantCard = document.createElement('div');
      plantCard.className = 'plant-card';
      
      const imageUrl = plant.image_url || "";
      const commonName = plant.common_name || "Name not available";
      const scientificName = plant.scientific_name || "Scientific name not available";
      const family = plant.family || "Family not specified";
      
      plantCard.innerHTML = `
        ${imageUrl ? 
          `<img src="${imageUrl}" alt="${commonName}" loading="lazy" />` : 
          `<div class="no-image">No Image Available</div>`}
        <h3>${commonName}</h3>
        <p><strong>Scientific Name:</strong> ${scientificName}</p>
        <p><strong>Family:</strong> ${family}</p>
        <button class="remove-favorite" data-plant-id="${plant.id}">Remove from Favorites</button>
      `;
      
      favoritesContainer.appendChild(plantCard);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-favorite').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default behavior
        const plantId = button.dataset.plantId;
        removeFromFavorites(plantId, user.username);
      });
    });
  }
}

function removeFromFavorites(plantId, username) {
  let favorites = getLocalStorage('favorites') || {};
  if (favorites[username]) {
    favorites[username] = favorites[username].filter(plant => plant.id != plantId);
    setLocalStorage('favorites', favorites);
    displayFavorites(); // Refresh the display
  }
}