const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const MomLogin = sequelize.define('MomLogin', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'registeredmothers',
    timestamps: true,
})

MomLogin.pre('save', async function (){

    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);


})

MomLogin.methods.createJWT  = function (){
    return jwt.sign(

        {user:this._id, email:this.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRY}
    )
}

MomLogin.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bycrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = MomLogin;