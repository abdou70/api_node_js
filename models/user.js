'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User',{
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.INTEGER,
    isAdmin: DataTypes.INTEGER
  },{
    classMethods:{
      associate: function(models) {

      }
    }
  });
  return User;
};