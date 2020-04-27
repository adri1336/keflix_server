const { LibraryMovie } = require("../config/db");

const create = async (body) => {
    return await LibraryMovie.create(body);
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

module.exports = {
    create,
    update,
    destroy
};