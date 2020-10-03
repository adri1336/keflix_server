const { ProfileTv } = require("../config/db");

const get = async (where) => {
    return await ProfileTv.findOne({
        where: where
    });
};

const getAll = async (where, order) => {
    return await ProfileTv.findAll({
        where: where,
        order: order
    });
};

const upsert = async (body) => {
    return await ProfileTv.upsert(body);
};

module.exports = {
    get,
    getAll,
    upsert
};