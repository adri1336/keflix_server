const { LibraryMovie } = require("../config/db");

const create = async (body) => {
    return await LibraryMovie.create(body);
};

const destroy = async (where) => {
    return await Profile.destroy({
        where: where
    });
};

module.exports = {
    create,
    destroy
};