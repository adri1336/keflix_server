const { ProfileLibraryMovie } = require("../config/db");

const get = async (where) => {
    return await ProfileLibraryMovie.findOne({
        where: where
    });
};

const getAll = async (where, order) => {
    return await ProfileLibraryMovie.findAll({
        where: where,
        order: order
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