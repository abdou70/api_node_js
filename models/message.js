'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message',{
    titre: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
  },{
    classMethods:{
      associate: function(models) {

      }
    }
  });
  return Message;
};