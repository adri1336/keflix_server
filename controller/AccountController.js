const Account = require("../model/Account");

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

const validate = async (email, password) => {
    const account = await get({ email: email });
    if(!account) return false;
    if(await account.validPassword(password)) {
        return account;
    }
    return null;
};

module.exports = {
    create,
    getAll,
    get,
    update,
    destroy,
    validate
};