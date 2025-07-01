import { loadHeaderFooter } from './utils.mjs';
import { 
  initFromUrl, 
  setupFilterButtons, 
  updatePlantDisplay 
} from './plantSpecies.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderFooter();
  
  initFromUrl();
  setupFilterButtons();
  updatePlantDisplay();
});