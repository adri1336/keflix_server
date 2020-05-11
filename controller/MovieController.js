require("dotenv").config();
const { Movie } = require("../config/db");
const { Genre } = require("../config/db");
const ProfileLibraryMovieController = require("../controller/ProfileLibraryMovieController");
const { Sequelize, Op } = require("sequelize");
const fs = require("fs");

const create = async (body) => {
    return await Movie.create(body);
};

const get = async (where) => {
    return await Movie.findOne({
        where: where
    });
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
            }
        },
    });
};

const destroy = async (where) => {
    return await Movie.destroy({
        where: where
    });
};

const getMovies = async (options) => {
    const where = {
        adult: {
            [Op.or]: options.include_adult ? [true, false] : [false]
        },
        [Op.all]: options.year ? Sequelize.literal("YEAR(release_date) = " + options.year) : Sequelize.literal(""),
        published: {
            [Op.or]: options.include_no_published ? [true, false] : [true]
        }
    };

    let order = [["libraryMovieId", "DESC"]];
    if(options.sort_by) {
        order = [options.sort_by.split(".")];
    }

    const limit = options.limit || 50;
    const offset = options.page ? (options.limit * (options.page - 1)) : 0;
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
            const profileInfo = await ProfileLibraryMovieController.get({
                libraryMovieId: movie.libraryMovieId,
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
        trailer: fs.existsSync(process.env.MEDIA_MOVIES_PATH + id + "/trailer.mp4"),
        video: fs.existsSync(process.env.MEDIA_MOVIES_PATH + id + "/video.mp4"),
        poster: fs.existsSync(process.env.MEDIA_MOVIES_PATH + id + "/poster.png"),
        backdrop: fs.existsSync(process.env.MEDIA_MOVIES_PATH + id + "/backdrop.png"),
        logo: fs.existsSync(process.env.MEDIA_MOVIES_PATH + id + "/logo.png")
    };
}

module.exports = {
    create,
    get,
    getAll,
    destroy,
    getMovies,
    getMovieMediaInfo
};