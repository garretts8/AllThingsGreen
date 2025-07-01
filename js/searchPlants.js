import { loadHeaderFooter } from './utils.mjs';

const PROXY_URL = 'http://localhost:3001/api/plants'; // Use your proxy server
let currentPage = 1;
let currentSearchTerm = '';
let totalPages = 1;

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('plant-search');
  const resultsContainer = document.getElementById('search-results');
  
  // Handle search button click
  searchButton.addEventListener('click', () => {
    currentPage = 1;
    currentSearchTerm = searchInput.value.trim();
    if (currentSearchTerm) {
      performSearch(currentSearchTerm, currentPage);
    } else {
      showMessage('Please enter a plant name to search');
    }
  });
  
  // Handle Enter key in search input
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentPage = 1;
      currentSearchTerm = searchInput.value.trim();
      if (currentSearchTerm) {
        performSearch(currentSearchTerm, currentPage);
      } else {
        showMessage('Please enter a plant name to search');
      }
    }
  });
});

async function performSearch(searchTerm, page) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '<p class="loading">Searching for plants...</p>';
  
  try {
    // Use the proxy server with common_name filter
    const url = `${PROXY_URL}?common_name=${encodeURIComponent(searchTerm)}&page=${page}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.meta && data.meta.total) {
      totalPages = Math.ceil(data.meta.total / 20);
    } else {
      totalPages = 1;
    }
    
    displayResults(data.data || [], searchTerm);
  } catch (error) {
    console.error('Search error:', error);
    resultsContainer.innerHTML = `
      <div class="error-message">
        <p>Failed to perform search. Please try again later.</p>
        <button id="retry-search">Retry Search</button>
      </div>
    `;
    
    document.getElementById('retry-search')?.addEventListener('click', () => {
      performSearch(searchTerm, page);
    });
  }
}

function displayResults(plants, searchTerm) {
  const resultsContainer = document.getElementById('search-results');
  
  if (!plants || plants.length === 0) {
    resultsContainer.innerHTML = `
      <div class="error-message">
        <p>No plants found matching "${searchTerm}"</p>
        <p>Try a different search term or check the spelling.</p>
      </div>
    `;
    return;
  }
  
  let html = `
    <h2>Search Results for "${searchTerm}"</h2>
    <div class="plant-grid">
  `;
  
  plants.forEach(plant => {
    const imageUrl = plant.image_url || 'https://via.placeholder.com/250x200?text=No+Image';
    const commonName = plant.common_name || 'Name not available';
    const scientificName = plant.scientific_name || 'Scientific name not available';
    const family = plant.family || 'Family not specified';
    
    html += `
      <div class="plant-card">
        <img src="${imageUrl}" alt="${commonName}" loading="lazy" />
        <h3>${commonName}</h3>
        <p><strong>Scientific Name:</strong> ${scientificName}</p>
        <p><strong>Family:</strong> ${family}</p>
      </div>
    `;
  });
  
  html += `</div>`;
  
  // Add pagination controls if there are multiple pages
  if (totalPages > 1) {
    html += `
      <div class="pagination">
        <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>
          Previous
        </button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button id="next-page" ${currentPage >= totalPages ? 'disabled' : ''}>
          Next
        </button>
      </div>
    `;
  }
  
  resultsContainer.innerHTML = html;
  
  // Add event listeners for pagination buttons
  document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      performSearch(currentSearchTerm, currentPage);
    }
  });
  
  document.getElementById('next-page')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      performSearch(currentSearchTerm, currentPage);
    }
  });
}

function showMessage(message) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = `<p class="search-instructions">${message}</p>`;
}

