const joi = require('joi');
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

// update用
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();

const avater = joi.string().dataUri().required();

exports.reg_login_schema={
    body:{
        username,
        password
    }
}

exports.update_user_schema={
    body:{
        id,
        nickname,
        email
    }
}
exports.update_password_schema={
    body:{
        oldpwd:password,
        newpwd:joi.not(joi.ref('oldpwd')).concat(password)
    }
}

exports.update_avater_schema={
    body:{
        avater
    }
}