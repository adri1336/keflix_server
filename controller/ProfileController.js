const { Profile } = require("../config/db");

const create = async (body) => {
    return await Profile.create(body);
};

const get = async (where) => {
    return await Profile.findOne({
        where: where
    });
};

const getAll = async (where) => {
    return await Profile.findAll({
        where: where
    });
};

const update = async (body, where) => {
    return await Profile.update(body, {
        where: where
    });
};

const destroy = async (where) => {
    return await Profile.destroy({
        where: where
    });
};

const checkPassword = async (profile, password) => {
    return await profile.checkPassword(password);
};

module.exports = {
    create,
    get,
    getAll,
    update,
    destroy,
    checkPassword
};