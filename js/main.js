import { loadHeaderFooter } from './utils.mjs';
// import { fetchPlantSpecies, displayPlantSpecies } from './plantSpecies.mjs';

loadHeaderFooter();
// displayPlantSpecies ();

document.addEventListener('DOMContentLoaded', function() {
  // Handle the Find Plants button click
  const findPlants = document.getElementById('findPlants');
  if (findPlants) {
    findPlants.addEventListener('click', function() {
      // Store plant data in localStorage before navigating
      // fetchPlantSpecies().then(plants => {
      //   localStorage.setItem('plantSpecies', JSON.stringify(plants));
        window.location.href = 'plantSpecies.html';
      });
    }
  
});