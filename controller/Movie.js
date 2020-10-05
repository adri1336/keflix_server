require("dotenv").config();
const { Movie } = require("../config/db");
const { Genre } = require("../config/db");
const ProfileMovieController = require("../controller/ProfileMovie");
const { Sequelize, Op } = require("sequelize");
const fs = require("fs");

const create = async (body) => {
    const movie = await Movie.create(body);
    if(movie) {
        const { genres } = body;
        movie.addGenres(genres);
    }
    return movie;
};

const get = async (where) => {
    return await Movie.findOne({
        where: where,
        include: {
            model: Genre,
            through: {
                attributes: []
            },
            required: false
        }
    });
};

const getMovie = async id => {
    let movie = await get({ id: id });
    
    const mediaInfo = getMovieMediaInfo(movie.id);
    movie.dataValues.mediaInfo = mediaInfo;
    return movie;
};

const getAll = async (where, order, limit, offset) => {
    return await Movie.findAll({
        where: where,
        order: order,
        limit: limit,
        offset: offset,
        include: {
            model: Genre,
            through: {
                attributes: []
            },
            required: false
        }
    });
};

const update = async (movie, newMovie) => {
    for(let property in newMovie) {
        if(property in movie) {
            movie[property] = newMovie[property];
        }
    } 
    
    await movie.save();
    return movie;
};

const updateGenres = async (movie, genres) => {
    await movie.setGenres(genres);
    return movie;
};

const destroy = async id => {
    const movie = await get({ id: id });
    if(movie) {
        await movie.destroy();
        return true;
    }
    return false;
};

const getMovies = async (options) => {
    const where = {
        [Op.or]: [
            {
                title: {
                    [Op.like]: options.search ? "%" + options.search + "%" : "%"
                }
            },
            {
                original_title: {
                    [Op.like]: options.search ? "%" + options.search + "%" : "%"
                }
            }
        ],
        adult: {
            [Op.or]: options.include_adult ? [true, false] : [false]
        },
        [Op.all]: options.year ? Sequelize.literal("YEAR(release_date) = " + options.year) : Sequelize.literal(""),
        published: {
            [Op.or]: options.include_no_published ? [true, false] : [true]
        }
    };

    let order = [["id", "DESC"]];
    if(options.sort_by) {
        order = [options.sort_by.split(".")];
    }

    let limit = options.limit || 50;
    let offset = 0;
    if(limit == -1) {
        limit = null;
    }
    else {
        offset = options.page ? (options.limit * (options.page - 1)) : 0;
    }
    
    const movies = await getAll(where, order, limit, offset);

    //Genres Filter
    let final = [];
    const with_genres = options.with_genres ? options.with_genres.toString().split(",") : [];
    const without_genres = options.without_genres ? options.without_genres.toString().split(",") : [];
    if(with_genres.length > 0 || without_genres.length > 0) {
        movies.map(movie => {
            let add = with_genres.length == 0 ? true : false;
            for(let i = 0; i < movie.genres.length; i ++) {
                const genre = movie.genres[i];
                if(with_genres.some(id => genre.id.toString() == id)) {
                    add = true;
                }
                if(without_genres.some(id => genre.id.toString() == id)) {
                    add = false;
                    break;
                }   
            }
            if(add) {
                final.push(movie);
            }
        });
    }
    else {
        final = movies;
    }

    //Profile Info
    if(options.profile_id) {
        const profileId = options.profile_id;
        for(let i = 0; i < final.length; i ++) {
            const movie = final[i];
            const profileInfo = await ProfileMovieController.get({
                movieId: movie.id,
                profileId: profileId
            });
            if(profileInfo) {
                final[i].dataValues.profileInfo = profileInfo.dataValues;
            }   
        }
    }

    //mediaInfo
    for(let i = 0; i < final.length; i ++) {
        const movie = final[i];
        const mediaInfo = getMovieMediaInfo(movie.id);
        final[i].dataValues.mediaInfo = mediaInfo;
    }
    return final;
}

const getMovieMediaInfo = (id) => {
    return {
        trailer: fs.existsSync(process.env.MEDIA_PATH + "/movies/" + id + "/trailer.mp4"),
        video: fs.existsSync(process.env.MEDIA_PATH + "/movies/" + id + "/video.mp4"),
        poster: fs.existsSync(process.env.MEDIA_PATH + "/movies/" + id + "/poster.png"),
        backdrop: fs.existsSync(process.env.MEDIA_PATH + "/movies/" + id + "/backdrop.png"),
        logo: fs.existsSync(process.env.MEDIA_PATH + "/movies/" + id + "/logo.png")
    };
}

const count = async (where = null) => {
    return await Movie.count({
        where: where
    });
};

module.exports = {
    create,
    get,
    getMovie,
    getAll,
    update,
    updateGenres,
    destroy,
    getMovies,
    getMovieMediaInfo,
    count
};