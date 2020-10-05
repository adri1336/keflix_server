require("dotenv").config();
const { Tv } = require("../config/db");
const { Genre, EpisodeTv } = require("../config/db");
const ProfileTvController = require("../controller/ProfileTv");
const EpisodeTvController = require("../controller/EpisodeTv");
const { Sequelize, Op } = require("sequelize");
const fs = require("fs");

const create = async (body) => {
    const tv = await Tv.create(body);
    if(tv) {
        const { genres } = body;
        tv.addGenres(genres);
    }
    return tv;
};

const get = async (where) => {
    return await Tv.findOne({
        where: where,
        include: [
            {
                model: Genre,
                through: {
                    attributes: []
                },
                required: false
            },
            {
                model: EpisodeTv,
                required: false
            }
        ]
    });
};

const getTv = async id => {
    let tv = await get({ id: id });
    const mediaInfo = getTvMediaInfo(tv.id);
    tv.dataValues.mediaInfo = mediaInfo;

    //episodes mediaInfo
    const episodes = tv.episode_tvs;
    for(let j = 0; j < episodes.length; j ++) {
        const episode = episodes[j];
        const mediaInfo = EpisodeTvController.getEpisodeMediaInfo(tv.id, episode.season, episode.episode);
        episode.dataValues.mediaInfo = mediaInfo;
    }

    return tv;
};

const getAll = async (where, order, limit, offset) => {
    return await Tv.findAll({
        where: where,
        order: order,
        limit: limit,
        offset: offset,
        include: [
            {
                model: Genre,
                through: {
                    attributes: []
                },
                required: false
            },
            {
                model: EpisodeTv,
                required: false
            }
        ]
    });
};

const update = async (tv, newTv) => {
    for(let property in newTv) {
        if(property in tv) {
            tv[property] = newTv[property];
        }
    } 
    
    await tv.save();
    return tv;
};

const updateGenres = async (tv, genres) => {
    await tv.setGenres(genres);
    return tv;
};

const destroy = async id => {
    const tv = await get({ id: id });
    if(tv) {
        await tv.destroy();
        return true;
    }
    return false;
};

const getTvs = async (options) => {
    const where = {
        [Op.or]: [
            {
                name: {
                    [Op.like]: options.search ? "%" + options.search + "%" : "%"
                }
            },
            {
                original_name: {
                    [Op.like]: options.search ? "%" + options.search + "%" : "%"
                }
            }
        ],
        adult: {
            [Op.or]: options.include_adult ? [true, false] : [false]
        },
        [Op.all]: options.year ? Sequelize.literal("YEAR(first_air_date) = " + options.year) : Sequelize.literal(""),
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
    
    const tvs = await getAll(where, order, limit, offset);

    //Genres Filter
    let final = [];
    const with_genres = options.with_genres ? options.with_genres.toString().split(",") : [];
    const without_genres = options.without_genres ? options.without_genres.toString().split(",") : [];
    if(with_genres.length > 0 || without_genres.length > 0) {
        tvs.map(tv => {
            let add = with_genres.length == 0 ? true : false;
            for(let i = 0; i < tv.genres.length; i ++) {
                const genre = tv.genres[i];
                if(with_genres.some(id => genre.id.toString() == id)) {
                    add = true;
                }
                if(without_genres.some(id => genre.id.toString() == id)) {
                    add = false;
                    break;
                }   
            }
            if(add) {
                final.push(tv);
            }
        });
    }
    else {
        final = tvs;
    }

    //Profile Info
    if(options.profile_id) {
        const profileId = options.profile_id;
        for(let i = 0; i < final.length; i ++) {
            const tv = final[i];
            const profileInfo = await ProfileTvController.get({
                tvId: tv.id,
                profileId: profileId
            });
            if(profileInfo) {
                final[i].dataValues.profileInfo = profileInfo.dataValues;
            }   
        }
    }

    //mediaInfo
    for(let i = 0; i < final.length; i ++) {
        const tv = final[i];
        const mediaInfo = getTvMediaInfo(tv.id);
        final[i].dataValues.mediaInfo = mediaInfo;

        //episodes mediaInfo
        const episodes = tv.episode_tvs;
        for(let j = 0; j < episodes.length; j ++) {
            const episode = episodes[j];
            const mediaInfo = EpisodeTvController.getEpisodeMediaInfo(tv.id, episode.season, episode.episode);
            episode.dataValues.mediaInfo = mediaInfo;
        }
    }

    //first episode
    for(let i = 0; i < final.length; i ++) {
        let tv = final[i];
        const next = EpisodeTvController.getNextSeasonAndEpisode(tv.id, null, null);
        tv.dataValues.firstSeason = next.season;
        tv.dataValues.firstEpisode = next.episode;
    }
    return final;
}

const getTvMediaInfo = (id) => {
    return {
        trailer: fs.existsSync(process.env.MEDIA_PATH + "/tv/" + id + "/trailer.mp4"),
        poster: fs.existsSync(process.env.MEDIA_PATH + "/tv/" + id + "/poster.png"),
        backdrop: fs.existsSync(process.env.MEDIA_PATH + "/tv/" + id + "/backdrop.png"),
        logo: fs.existsSync(process.env.MEDIA_PATH + "/tv/" + id + "/logo.png")
    };
}

const count = async (where = null) => {
    return await Tv.count({
        where: where
    });
};

module.exports = {
    create,
    get,
    getTv,
    getAll,
    update,
    updateGenres,
    destroy,
    getTvs,
    getTvMediaInfo,
    count
};