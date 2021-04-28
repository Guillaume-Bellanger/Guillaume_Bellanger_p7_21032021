const models = require("../models");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../models");
const message = require("../models/message");
require("dotenv").config();
const Op = sequelize.Sequelize.Op;

const getUserId = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN);
  const userId = decodedToken.userId;
  return userId;
};

exports.allMessages = (req, res, next) => {
  const search = req.query.search;
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
    limit: parseInt(req.params.factor),
    offset: parseInt(req.params.range),
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
          res.status(200).json({ message });
        })
        .catch(() => res.status(500).json({ error: "Erreur allPromises" }));
    })

    .catch(() =>
      res.status(400).json({
        error:
          "Erreur de la base de données, impossible de récupérer les messages",
      })
    );
};

exports.viewMessage = (req, res, next) => {
  models.Message.findOne({
    attributes: ["content", "createdAt", "userId"],
    where: { msgId: req.params.msgId },
    include: [
      {
        model: models.User,
        attributes: ["name", "userId", "avatar"],
      },
    ],
  })
    .then((message) => {
      if (message) {
        res.status(200).json({ message });
      } else {
        res.status(404).json({ error: "Ce message n'existe pas" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de voir le message" });
    });
};

exports.createMessage = (req, res, next) => {
  models.Message.create({
    include: [
      {
        model: models.User,
        attributes: ["name", "userId", "avatar"],
      },
    ],
    content: req.body.content,
    userId: getUserId(req),
  })
    .then((message) => res.status(201).json({ message }))
    .catch((error) =>
      res.status(400).json({
        error: "Erreur de la base de données, impossible de posté le message",
      })
    );
};

exports.editMessage = (req, res, next) => {
  models.Message.findOne({
    where: { msgId: req.params.msgId },
    include: [
      {
        model: models.User,
        attributes: ["userId"],
      },
    ],
  })
    .then((msgFound) => {
      if (msgFound) {
        models.User.findOne({
          attributes: ["isAdmin"],
          where: { userId: getUserId(req) },
        })
          .then((userIsAdmin) => {
            if (
              getUserId(req) == msgFound.userId ||
              userIsAdmin.dataValues.isAdmin == true
            ) {
              models.Message.update(req.body, {
                attributes: ["content"],
                where: { msgId: req.params.msgId },
              })
                .then(() =>
                  res.status(201).json({ message: "Message modifié" })
                )
                .catch((error) => res.status(500).json({ error }));
            } else {
              res.status(401).json({
                error: "Vous n'êtes pas autorisé à modifier le message",
              });
            }
          })
          .catch((error) =>
            res.status(500).json({
              error: "Impossible de communiquer avec la base de données",
            })
          );
      } else {
        res.status(404).json({ error: "Message non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Impossible de modifier le message" })
    );
};

exports.deleteMessage = (req, res, next) => {
  models.Message.findOne({
    where: { msgId: req.params.msgId },
  })
    .then((msgFound) => {
      if (msgFound) {
        models.User.findOne({
          attributes: ["isAdmin"],
          where: { userId: getUserId(req) },
        })
          .then((userIsAdmin) => {
            if (
              getUserId(req) == msgFound.userId ||
              userIsAdmin.dataValues.isAdmin == true
            ) {
              models.Message.destroy({
                where: { msgId: req.params.msgId },
              })
                .then(() =>
                  res.status(201).json({ message: "Message supprimé" })
                )
                .catch((error) => res.status(404).json({ error }));
            } else {
              res.status(401).json({
                error: "Vous n'êtes pas autorisé à supprimer le message",
              });
            }
          })
          .catch((error) =>
            res.status(500).json({
              error: "Impossible de communiquer avec la base de données",
            })
          );
      } else {
        res.status(404).json({ error: "Message non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Impossible de supprimer le message" })
    );
};

exports.postLike = (req, res, next) => {
  models.Message.findOne({
    attributes: ["msgId"],
    where: { msgId: req.params.msgId },
  })
    .then((msgFound) => {
      if (msgFound) {
        models.Like.findOne({
          attributes: ["userId", "msgId"],
          where: { userId: getUserId(req), msgId: req.params.msgId },
        })
          .then((likeFound) => {
            if (!likeFound) {
              models.Like.create({
                include: [
                  {
                    model: models.User,
                    attributes: ["userId"],
                  },
                  {
                    model: models.Message,
                    attributes: ["msgId"],
                  },
                ],
                userId: getUserId(req),
                msgId: req.params.msgId,
              })
                .then(() => {
                  res.status(201).json({ message: "Like posté" });
                })
                .catch((error) =>
                  res.status(400).json({
                    error:
                      "Erreur de la base de données, impossible de posté le like",
                  })
                );
            } else {
              res.status(404).json({ error: "Vous avez déjà liké" });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: "Impossible de liké le message" });
          });
      } else {
        res.status(404).json({ error: "Ce message n'existe pas" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de voir le message" });
    });
};

exports.deleteLike = (req, res, next) => {
  models.Message.findOne({
    attributes: ["msgId"],
    where: { msgId: req.params.msgId },
  })
    .then((msgFound) => {
      if (msgFound) {
        models.Like.findOne({
          attributes: ["userId", "msgId"],
          where: { userId: getUserId(req), msgId: req.params.msgId },
        })
          .then((likeFound) => {
            if (likeFound) {
              models.Like.destroy({
                where: { msgId: req.params.msgId, userId: getUserId(req) },
              })
                .then((message) =>
                  res.status(201).json({ message: "Like supprimé" })
                )
                .catch((error) =>
                  res.status(400).json({
                    error:
                      "Erreur de la base de données, impossible de supprimer le like",
                  })
                );
            } else {
              res.status(404).json({
                error: "Vous ne pouvez pas supprimer un like qui n'existe pas",
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: "Impossible de supprimer le like" });
          });
      } else {
        res.status(404).json({ error: "Ce message n'existe pas" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de voir le message" });
    });
};

exports.allLikes = (req, res, next) => {
  models.Like.findAndCountAll({
    attributes: ["likeId", "userId", "msgId"],
    where: { msgId: req.params.msgId },
  })
    .then((likes) => res.status(200).json({ likes }))
    .catch((error) =>
      res.status(500).json({ error: "Impossible de récupérer les likes" })
    );
};
