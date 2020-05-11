const { ProfileLibraryMovie } = require("../config/db");

const get = async (where) => {
    return await ProfileLibraryMovie.findOne({
        where: where
    });
};

const getAll = async (where) => {
    return await ProfileLibraryMovie.findAll({
        where: where
    });
};

const upsert = async (body) => {
    return await ProfileLibraryMovie.upsert(body);
};

module.exports = {
    get,
    getAll,
    upsert
};