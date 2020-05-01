require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const http = require("http");
const youtubedl = require("youtube-dl");
const GenreController = require("../controller/GenreController");
const MovieController = require("../controller/MovieController");

const
    API_KEY = process.env.TMDB_API_KEY,
    LANGUAGE = "es-ES",
    TMDB_IMAGES_PATH = "http://image.tmdb.org/t/p/original";

const refreshGenres = async () => {
    try {
        const
            response = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY + "&language=" + LANGUAGE),
            { genres } = await response.json();

        if(!genres) throw "no genres";
        
        await Promise.all(genres.map(async genre => {
            await GenreController.upsert(genre);
        }));
    }
    catch(error) {
        console.log("TMDb Script Error (refreshGenres): ", error);
    }
};

const createMovie = async (libraryMovie) => {
    try {
        let response = await fetch("https://api.themoviedb.org/3/movie/" + libraryMovie.id_movie + "?api_key=" + API_KEY + "&language=" + LANGUAGE);
        const api_movie = await response.json();

        let movie = {
            id: api_movie.id,
            adult: api_movie.adult,
            original_title: api_movie.original_title,
            overview: api_movie.overview,
            popularity: api_movie.popularity,
            release_date: api_movie.release_date,
            runtime: api_movie.runtime,
            tagline: api_movie.tagline,
            title: api_movie.title,
            vote_average: api_movie.vote_average
        };

        //genres
        let genres = [];
        api_movie.genres.map(api_genre => {
            genres.push(api_genre.id);
        });

        //files
        const path = "./media/movies/" + api_movie.id;

        //crear carpeta
        await fs.promises.mkdir(path, { recursive: true });

        //poster path
        const posterFile = fs.createWriteStream(path + "/poster.png");
        http.get(TMDB_IMAGES_PATH + api_movie.poster_path, function(response) {
            response.pipe(posterFile);
        });

        //backdrop_path
        const backdropFile = fs.createWriteStream(path + "/backdrop.png");
        http.get(TMDB_IMAGES_PATH + api_movie.backdrop_path, function(response) {
            response.pipe(backdropFile);
        });

        //trailer yt video
        response = await fetch("https://api.themoviedb.org/3/movie/" + api_movie.id + "/videos?api_key=" + API_KEY + "&language=" + LANGUAGE);
        const data = await response.json();
        if(data.results && (data.results[0].type == "Trailer" || data.results[0].type == "Teaser") && data.results[0].site == "YouTube") {
            const youtubeKey = data.results[0].key;
            const video = youtubedl("http://www.youtube.com/watch?v=" + youtubeKey); //["--format=22"]);
            video.pipe(fs.createWriteStream(path + "/trailer.mp4"));
        }

        movie.libraryMovieId = libraryMovie.id;
        movie = await MovieController.create(movie);
        movie.addGenres(genres);
    }
    catch(error) {
        console.log("TMDb Script Error (createMovie): ", error);
    }
};

module.exports = {
    refreshGenres,
    createMovie
};