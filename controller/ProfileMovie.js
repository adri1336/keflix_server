const { ProfileMovie } = require("../config/db");

const get = async (where) => {
    return await ProfileMovie.findOne({
        where: where
    });
};

const getAll = async (where, order) => {
    return await ProfileMovie.findAll({
        where: where,
        order: order
    });
};

const upsert = async (body) => {
    return await ProfileMovie.upsert(body);
};

module.exports = {
    get,
    getAll,
    upsert
};