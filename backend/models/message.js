"use strict";
const { query } = require("express");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      models.Message.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      models.Message.hasMany(models.Like, { foreignKey: "likeId" });
      models.Message.hasMany(models.Comment, { foreignKey: "commentId" });
    }
  }
  Message.init(
    {
      msgId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );

  return Message;
};
