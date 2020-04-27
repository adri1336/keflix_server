const { Genre } = require("../config/db");

const create = async (body) => {
    return await Genre.create(body);
};

const destroy = async (where) => {
    return await Genre.destroy({
        where: where
    });
};

module.exports = {
    create,
    destroy
};