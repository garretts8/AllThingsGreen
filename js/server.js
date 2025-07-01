// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// const PORT = 3001;

// app.use(cors());

// const TREFL_API_TOKEN = '6NLk4t2jIwu_cKtUzrPoUJa6rEMaHJTRGEN4ttAsl7k';

// // Existing endpoint for plant species
// app.get('/api/plants', async (req, res) => {
//   try {
//     const { filter, page } = req.query;
//     let url = `https://trefle.io/api/v1/plants?token=${TREFL_API_TOKEN}&page=${page || 1}&limit=20`;
    
//     if (filter && filter !== 'all') {
//       if (filter === 'vegetable' || filter === 'edible') {
//         url += `&filter[${filter}]=true`;
//       } else {
//         const growthHabitMap = {
//           tree: "tree",
//           shrub: "shrub",
//           flower: "flower",
//           grass: "grass",
//           vine: "vine",
//           herb: "herb"
//         };
//         if (growthHabitMap[filter]) {
//           url += `&filter[growth_habit]=${growthHabitMap[filter]}`;
//         }
//       }
//     }

//     const response = await axios.get(url);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Proxy error:', error);
//     res.status(500).json({ error: 'Failed to fetch plants' });
//   }
// });

// // New endpoint for plant search
// app.get('/api/plants/search', async (req, res) => {
//   try {
//     const { q, page } = req.query;
//     if (!q) {
//       return res.status(400).json({ error: 'Search query is required' });
//     }
    
//     const url = `https://trefle.io/api/v1/plants/search?token=${TREFL_API_TOKEN}&q=${encodeURIComponent(q)}&page=${page || 1}`;
//     const response = await axios.get(url);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Search proxy error:', error);
//     res.status(500).json({ error: 'Failed to search plants' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Proxy server running on http://localhost:${PORT}`);
// });


