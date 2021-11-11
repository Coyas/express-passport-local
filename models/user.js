const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('users',{
    username: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true
    },
    email:  {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:  {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
})
// User.sync()
module.exports = User