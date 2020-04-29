const { Movie } = require("../config/db");
const { Genre } = require("../config/db");

const create = async (body) => {
    return await Movie.create(body);
};

const getAll = async (where, order, limit, offset) => {
    return await Movie.findAll({
        where: where,
        order: order,
        limit: limit,
        offset: offset,
        include: {
            model: Genre,
            through: {
                attributes: []
            }
        },
    });
};

const destroy = async (where) => {
    return await Movie.destroy({
        where: where
    });
};

module.exports = {
    create,
    getAll,
    destroy
};