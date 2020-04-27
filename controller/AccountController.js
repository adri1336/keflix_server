const { Account } = require("../config/db");

const create = async (body) => {
    return await Account.create(body);
};

const get = async (where) => {
    return await Account.findOne({
        where: where
    });
};

const checkPassword = async (account, password) => {
    return await account.checkPassword(password);
};

module.exports = {
    create,
    get,
    checkPassword
};