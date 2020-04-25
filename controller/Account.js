const { Account } = require("../db");
const { saltRounds } = require("../config");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

//CRUD
const create = async (body) => {
    return await Account.create(body);
};

const getAll = async () => {
    return await Account.findAll();
};

const get = async (where) => {
    return await Account.findOne({
        where: where
    });
};

const update = async (body, where) => {
    return await Account.update(body, {
        where: where
    });
};

const destroy = async (where) => {
    return await Account.destroy({
        where: where
    });
};

module.exports = {
    hashPassword,
    checkPassword,
    create,
    getAll,
    get,
    update,
    destroy
};