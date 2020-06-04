const { Account } = require("../config/db");
const { Profile } = require("../config/db");

const create = async (body) => {
    return await Account.create(body);
};

const get = async (where) => {
    return await Account.findOne({
        where: where
    });
};

const getAll = async (where = null) => {
    return await Account.findAll({
        where: where,
        include: {
            model: Profile
        }
    });
};

const destroy = async (where) => {
    return await Profile.destroy({
        where: where
    });
};

const checkPassword = async (account, password) => {
    return await account.checkPassword(password);
};

const count = async (where = null) => {
    return await Account.count({
        where: where
    });
};

module.exports = {
    create,
    get,
    getAll,
    destroy,
    checkPassword,
    count
};