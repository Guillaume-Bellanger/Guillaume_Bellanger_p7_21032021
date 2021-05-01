const models = require("../models");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../models");
const message = require("../models/message");
require("dotenv").config();
const Op = sequelize.Sequelize.Op;

exports.searchMessage = (req, res, next) => {
  const search = req.params.search;
  let condition = search
    ? {
        [Op.or]: [
          {
            content: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      }
    : null;
  models.Message.findAll({
    attributes: ["content", "createdAt", "msgId", "userId"],
    where: condition,

    include: [
      {
        model: models.User,
        attributes: ["name", "userId", "avatar"],
      },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((messages) => {
      const allPromises = messages.map((message) => {
        return new Promise((resolv, reject) => {
          models.Comment.findAndCountAll({ where: { msgId: message.msgId } })
            .then((length) => {
              models.Like.findAndCountAll({ where: { msgId: message.msgId } })
                .then((likes) => {
                  resolv({
                    ...JSON.parse(JSON.stringify(message)),
                    commentLength: length.count,
                    likesLength: likes.count,
                  });
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
      Promise.all(allPromises)
        .then((message) => {
          req.message = { message };
          next();
        })
        .catch(() => res.status(500).json({ error: "Erreur allPromises" }));
    })

    .catch(() => next());
};
exports.searchUser = (req, res, next) => {
  console.log(req.message);
  const search = req.params.search;
  let condition = search
    ? {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      }
    : null;
  models.User.findAll({
    attributes: ["name"],
    where: condition,
  })
    .then((User) => {
      res.status(200).json({ ...req.message, users: User });
    })
    .catch(() => {
      if (req.message) {
        res.status(200).json({ ...req.message });
      } else {
        res.status(400).json({
          error: "aucun résultat de recherche ",
        });
      }
    });
};
