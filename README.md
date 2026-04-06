# 🎬 CineSearch

A stunning, responsive Movie Discovery application powered by React and Vite. Search for your favorite movies, watch official trailers, build a watchlist, and explore infinite thematic categories!

**Developed by itzbobo(shazeat)** | 🔗 **[Live Demo](https://cinemasafari.netlify.app/)**

![CineSearch Banner](https://via.placeholder.com/800x200/1a1a2e/e11d48?text=CineSearch)

## 🌟 Key Features

* **Real-time Autocomplete Search**: Start typing to instantly reveal up to 5 suggested movies dropping down from the search bar.
* **YouTube Trailers**: Click on any movie card to preview its official cinematic HD trailer sourced directly through TMDB video data!
* **❤️ Your Favorites**: Saving movies is easy! Click the floating heart button on any movie poster to add it to your securely tracked `localStorage` Watchlist to revisit anytime.
* **🎭 Genre Library**: Tap buttons like "Action", "Horror", or "Sci-Fi" under the search bar to dynamically swap out trending results with thematic movie discoveries!
* **🔄 Infinite Scrolling Rabbit Hole**: Keep scrolling to automatically fetch the newest releases asynchronously via IntersectionObservers.
* **Infinite Discovery**: Read the overview of a movie, and directly leap from its generic "Similar Movies" section to the next!

## 🚀 Built With
* React 18
* Vite
* Vanilla CSS (Modern CSS properties, blur filters, CSS Variables)
* [TMDB (The Movie Database) API](https://developer.themoviedb.org/reference/intro/getting-started)

## 💻 Running Locally

### 1. Clone & Install
Clone the project and navigate into the `movie search app` directory, then run:

```bash
npm install
```

### 2. Environment Variables
You'll need a free API key from TMDB. 
1. Create an account at [TheMovieDB](https://www.themoviedb.org/settings/api).
2. Inside your project's root folder, copy the example variables.
```bash
cp .env.example .env
```
3. Edit the `.env` file to contain your API token:
```env
VITE_TMDB_API_KEY=your_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

Visit the outputted URL (usually `http://localhost:5173`) in your browser to view the application!
