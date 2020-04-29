const { ProfileLibraryMovie } = require("../config/db");

const get = async (where) => {
    return await ProfileLibraryMovie.findOne({
        where: where
    });
};

module.exports = {
    get
};