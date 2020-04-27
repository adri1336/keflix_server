require("dotenv").config();
const fetch = require("node-fetch");
const GenreController = require("../controller/GenreController");
const MovieController = require("../controller/MovieController");

const
    API_KEY = process.env.TMDB_API_KEY,
    LANGUAGE = "es-ES";

const refreshGenres = async () => {
    try {
        await GenreController.destroy({}); //destruimos todos los géneros actuales

        const
            response = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY + "&language=" + LANGUAGE),
            { genres } = await response.json();

        if(!genres) throw "no genres";
        
        await Promise.all(genres.map(async genre => {
            await GenreController.create(genre);
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
            backdrop_path: api_movie.backdrop_path,
            original_title: api_movie.original_title,
            overview: api_movie.overview,
            popularity: api_movie.popularity,
            poster_path: api_movie.poster_path,
            release_date: api_movie.release_date,
            runtime: api_movie.runtime,
            tagline: api_movie.tagline,
            title: api_movie.title,
            vote_average: api_movie.vote_average
        };

        //trailer yt video
        response = await fetch("https://api.themoviedb.org/3/movie/" + api_movie.id + "/videos?api_key=" + API_KEY + "&language=" + LANGUAGE);
        const data = await response.json();
        if(data.results && data.results[0].type == "Trailer" && data.results[0].site == "YouTube") {
            movie.trailer_youtube_key = data.results[0].key;
        }

        movie.libraryMovieId = libraryMovie.id;
        await MovieController.create(movie);        
    }
    catch(error) {
        console.log("TMDb Script Error (createMovie): ", error);
    }
};

module.exports = {
    refreshGenres,
    createMovie
};