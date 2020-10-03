require("dotenv").config();
const { EpisodeTv } = require("../config/db");
const fs = require("fs");

const create = async (body) => {
    const episode = await EpisodeTv.create(body);
    return episode;
};

const get = async (where) => {
    return await EpisodeTv.findOne({
        where: where
    });
};

const getAll = async (where) => {
    return await EpisodeTv.findAll({
        where: where
    });
};

const getEpisode = async (tvId, season, theEpisode) => {
    let episode = await get({ tvId: tvId, season: season, episode: theEpisode });
    
    const mediaInfo = getEpisodeMediaInfo(tvId, season, episode);
    episode.dataValues.mediaInfo = mediaInfo;
    return episode;
};

const destroy = async (tvId, season, theEpisode) => {
    const episode = await get({ tvId: tvId, season: season, episode: theEpisode });
    if(episode) {
        await episode.destroy();
        return true;
    }
    return false;
};

const getEpisodeMediaInfo = (tvId, season, episode) => {
    let mediaInfo = {
        video: fs.existsSync(process.env.MEDIA_PATH + "/tv/" + tvId + "/" + season + "/" + episode + "/video.mp4"),
        backdrop: fs.existsSync(process.env.MEDIA_PATH + "/tv/" + tvId + "/" + season + "/" + episode + "/backdrop.png"),
        nextSeason: null,
        nextEpisode: null
    };

    const next = getNextSeasonAndEpisode(tvId, season, episode);
    mediaInfo.nextSeason = next.season;
    mediaInfo.nextEpisode = next.episode;
    return mediaInfo;
}

const getNextSeasonAndEpisode = (tvId, season, episode) => {
    let next = {
        season: null,
        episode: null
    };

    var maxChecks = 30, checks = 0, episodesCheck = 0, found = false;
    var seasonChecking = 0, episodeChecking = -1;

    if(season !== null) seasonChecking = season;
    if(episode != null) episodeChecking = episode;

    do {
        episodeChecking ++;
        if(fs.existsSync(process.env.MEDIA_PATH + "/tv/" + tvId + "/" + seasonChecking + "/" + episodeChecking + "/video.mp4")) {
            next.season = seasonChecking;
            next.episode = episodeChecking;
            found = true;
        }
        else {
            episodesCheck ++;
            if(episodesCheck > maxChecks) {
                episodesCheck = 0;
                checks ++;
                seasonChecking ++;
                episodeChecking = -1;
            }
        }
    }
    while(maxChecks > checks && !found);
    return next;
};

const count = async (where = null) => {
    return await EpisodeTv.count({
        where: where
    });
};

module.exports = {
    create,
    get,
    getAll,
    getEpisode,
    destroy,
    getEpisodeMediaInfo,
    getNextSeasonAndEpisode,
    count
};