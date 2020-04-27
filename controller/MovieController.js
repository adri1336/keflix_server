const { Movie } = require("../config/db");

const create = async (body) => {
    return await Movie.create(body);
};

const destroy = async (where) => {
    return await Movie.destroy({
        where: where
    });
};

module.exports = {
    create,
    destroy
};