// js/plantSpecies.mjs
let currentFilter = "all";
let currentPage = 1;
let totalPages = 1;

const PROXY_URL = 'http://localhost:3001/api/plants';

export async function fetchPlantSpecies(filter = "all", page = 1) {
  try {
    const url = `${PROXY_URL}?filter=${filter}&page=${page}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Ensure meta data exists before trying to access it
    if (data.meta && data.meta.total) {
      totalPages = Math.ceil(data.meta.total / 20);
    } else {
      totalPages = 1;
    }
    
    return data.data || [];
  } catch (error) {
    console.error("Error fetching plant species:", error);
    throw error;
  }
}

export function displayPlantSpecies(plants, container) {
  container.innerHTML = "";
  
   if (!plants || plants.length === 0) {
    container.innerHTML = `
      <div class="error-message">
        <p>No plants found matching your criteria.</p>
        <p>Try a different filter or check back later.</p>
      </div>
    `;
    return;
  }
  
  const plantGrid = document.createElement("div");
  plantGrid.className = "plant-grid";
  
  plants.forEach(plant => {
    const plantCard = document.createElement("div");
    plantCard.className = "plant-card";
    
    // Handle cases where properties might be missing
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
    `;
    
    plantGrid.appendChild(plantCard);
  });
  
  container.appendChild(plantGrid);
  addPaginationControls(container);
}

function addPaginationControls(container) {
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      currentPage--;
      updatePlantDisplay();
    });
    paginationDiv.appendChild(prevButton);
  }
  
  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationDiv.appendChild(pageInfo);
  
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      currentPage++;
      updatePlantDisplay();
    });
    paginationDiv.appendChild(nextButton);
  }
  
  container.appendChild(paginationDiv);
}

export async function updatePlantDisplay() {
  const container = document.querySelector(".plantSpecies");
  const loadingMessage = document.createElement("p");
  loadingMessage.className = "loading";
  loadingMessage.textContent = "Loading plants...";
  container.innerHTML = "";
  container.appendChild(loadingMessage);
  
  try {
    const plants = await fetchPlantSpecies(currentFilter, currentPage);
    displayPlantSpecies(plants, container);
  } catch (error) {
    container.innerHTML = `
      <div class="error-container">
        <p>Failed to load plants. Please try again later.</p>
        <button id="retry-button">Retry</button>
      </div>
    `;
    
    document.getElementById("retry-button").addEventListener("click", updatePlantDisplay);
  }
}

export function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Update current filter and reset page
      currentFilter = button.dataset.filter;
      currentPage = 1;
      
      // Update active button styling
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      
      // Update the URL without reloading
      const url = new URL(window.location);
      url.searchParams.set("filter", currentFilter);
      window.history.pushState({}, "", url);
      
      updatePlantDisplay();
    });
  });
}

// Initialize from URL parameters
export function initFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get("filter") || "all";
  
  currentFilter = filterParam;
  currentPage = 1;
  
  // Set the active button based on URL
  const activeButton = document.querySelector(`.filter-btn[data-filter="${currentFilter}"]`);
  if (activeButton) {
    activeButton.classList.add("active");
  } else {
    // Default to "all" if the filter isn't found
    document.querySelector('.filter-btn[data-filter="all"]').classList.add("active");
    currentFilter = "all";
  }
}