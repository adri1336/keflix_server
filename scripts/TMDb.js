require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const http = require("http");
const youtubedl = require("youtube-dl");
const GenreController = require("../controller/GenreController");
const MovieController = require("../controller/MovieController");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

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
        const path = process.env.MEDIA_MOVIES_PATH + api_movie.id;

        //crear carpeta
        await fs.promises.mkdir(path + "/tmp", { recursive: true });

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
        if(data.results) {
            let youtubeKey = null;
            for(let i = 0; i < data.results.length; i++) {
                const result = data.results[i];
                if(result.type && result.site && result.type == "Trailer" && result.site == "YouTube") {
                    youtubeKey = result.key;
                    downloadYoutubeTrailer(youtubeKey, path);
                    break;
                }
            }

            if(!youtubeKey) {
                for(let i = 0; i < data.results.length; i++) {
                    const result = data.results[i];
                    if(result.type && result.site && result.type == "Teaser" && result.site == "YouTube") {
                        youtubeKey = result.key;
                        downloadYoutubeTrailer(youtubeKey, path);
                        break;
                    }
                }
            }
        }

        movie.libraryMovieId = libraryMovie.id;
        movie = await MovieController.create(movie);
        movie.addGenres(genres);
    }
    catch(error) {
        console.log("TMDb Script Error (createMovie): ", error);
    }
};

function downloadYoutubeTrailer(youtubeKey, path) {
    try {
        tmp_path = path + "/tmp";
        youtubedl.exec("http://www.youtube.com/watch?v=" + youtubeKey, ["-f", "bestvideo", "-o", tmp_path + "/trailer.video"], {}, function(error, output1) {
            if(error) throw error;
            youtubedl.exec("http://www.youtube.com/watch?v=" + youtubeKey, ["-f", "bestaudio", "-o", tmp_path + "/trailer.audio"], {}, function(error2, output2) {
                if(error2) throw error2;
                //convertir
                ffmpeg(tmp_path + "/trailer.video")
                    .addInput(tmp_path + "/trailer.audio")
                    .output(tmp_path + "/trailer.mp4")
                    .on("end", async function() {
                        await fs.promises.rename(tmp_path + "/trailer.mp4", path + "/trailer.mp4");
                        fs.rmdirSync(tmp_path, { recursive: true });
                    })
                    .run();
            });
        });
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = {
    refreshGenres,
    createMovie
};