const { Profile } = require("../config/db");

const create = async (body) => {
    return await Profile.create(body);
};

const get = async (where) => {
    return await Profile.findOne({
        where: where
    });
};

const getAll = async (where) => {
    return await Profile.findAll({
        where: where
    });
};

const update = async (profile, newProfile) => {
    const {
        id,
        name,
        password,
        color,
        adult_content
    } = newProfile;
    
    profile.id = id;
    profile.name = name;
    profile.password = password;
    profile.color = color;
    profile.adult_content = adult_content;
    await profile.save();
    return profile;
};

const destroy = async (where) => {
    return await Profile.destroy({
        where: where
    });
};

const checkPassword = async (profile, password) => {
    return await profile.checkPassword(password);
};

module.exports = {
    create,
    get,
    getAll,
    update,
    destroy,
    checkPassword
};