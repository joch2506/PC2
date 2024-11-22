<template>
    <div>
      <h1>Lista de Películas</h1>
      <div class="search-bar row items-center">
        <q-input
          filled
          v-model="searchQuery"
          label="Buscar películas..."
          @keyup.enter="fetchMovies"
          class="col-6"
        />
        <q-btn
          label="Buscar"
          color="primary"
          @click="fetchMovies"
          class="col-2"
        />
      </div>
  
      <div v-if="isLoading" class="row justify-center">
        <q-spinner size="50px" color="primary" />
      </div>
  
      <div v-if="errorMessage" class="text-negative text-center">
        {{ errorMessage }}
      </div>
  
      <div class="movies-container row wrap justify-center">
        <div v-for="movie in movies" :key="movie.id" class="movie-card q-pa-md">
          <q-card>
            <q-img :src="getPosterUrl(movie.poster_path)" :alt="movie.title" />
            <q-card-section>
              <div class="text-subtitle1">{{ movie.title }}</div>
              <div>Calificación: {{ movie.vote_average }}</div>
              <div>Votos: {{ movie.vote_count }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
  
      <div v-if="totalPages > 1" class="q-pa-md">
        <q-pagination
          v-model="page"
          :max="totalPages"
          @update:model-value="fetchMovies"
          color="primary"
          boundary-numbers
          boundary-links
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "MovieList",
    data() {
      return {
        movies: [],
        searchQuery: "",
        selectedGenre: null,
        genres: [],
        language: "es-PE",
        page: 1,
        totalPages: 1,
        isLoading: false,
        errorMessage: "",
      };
    },
    methods: {
      getPosterUrl(posterPath) {
        return `http://image.tmdb.org/t/p/w500${posterPath}`;
      },
      fetchMovies() {
        this.isLoading = true;
        this.errorMessage = "";
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        console.log("API Key está definida:", !!apiKey);
        console.log("API Key:", apiKey);
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        };
  
        let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=${this.language}&page=${this.page}&sort_by=popularity.desc`;
  
        if (this.searchQuery) {
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            this.searchQuery
          )}&language=${this.language}&page=${this.page}&include_adult=false`;
        }
  
        if (this.selectedGenre) {
          url += `&with_genres=${this.selectedGenre}`;
        }
  
        fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            this.movies = data.results.slice(0, 18);
            this.totalPages = data.total_pages;
            this.isLoading = false;
          })
          .catch((err) => {
            console.error(err);
            this.errorMessage = "Error al cargar las películas.";
            this.isLoading = false;
          });
      },
      fetchGenres() {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        };
  
        fetch(
          `https://api.themoviedb.org/3/genre/movie/list?language=${this.language}`,
          options
        )
          .then((response) => response.json())
          .then((data) => {
            this.genres = data.genres.map((genre) => ({
              label: genre.name,
              value: genre.id,
            }));
          })
          .catch((err) => console.error(err));
      },
    },
    watch: {
      page() {
        this.fetchMovies();
      },
    },
    mounted() {
      this.fetchGenres();
      this.fetchMovies();
    },
  };
  </script>
  
  <style scoped>
  .movies-container {
    margin-top: 20px;
  }
  
  .movie-card {
    width: 200px;
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .q-pagination {
    display: flex;
    justify-content: center;
  }
  </style>
  