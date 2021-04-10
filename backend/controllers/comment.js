const models = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUserId = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN);
  const userId = decodedToken.userId;
  return userId;
};

exports.allComments = (req, res, next) => {
  models.Comment.findAll({
    attributes: ["comment", "createdAt", "msgId", "userId", "commentId"],
    where: { msgId: req.params.msgId },
    include: [
      {
        model: models.User,
        attributes: ["name", "userId", "avatar"],
      },
    ],
    order: [["createdAt", "ASC"]],
  })
    .then((comments) => res.status(200).json({ comments }))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Impossible de récupérer les commentaires" })
    );
};

exports.postComment = (req, res, next) => {
  console.log("test");
  models.Comment.create({
    include: [
      {
        model: models.User,
        attributes: ["name", "userId", "avatar"],
      },
    ],
    comment: req.body.comment,
    userId: getUserId(req),
    msgId: req.params.msgId,
  })
    .then((comment) => res.status(201).json({ comment }))
    .catch((error) =>
      res.status(400).json({
        error:
          "Erreur de la base de données, impossible de posté le commentaire",
      })
    );
};

exports.updateComment = (req, res, next) => {
  console.log("testupd");
  models.Comment.findOne({
    attributes: ["userId", "commentId", "msgId"],
    where: { commentId: req.params.commentId },
  })
    .then((commentFound) => {
      console.log(commentFound + "test eupdate");
      if (commentFound) {
        models.User.findOne({
          attributes: ["isAdmin"],
          where: { userId: getUserId(req) },
        })
          .then((userIsAdmin) => {
            if (
              getUserId(req) == commentFound.userId ||
              userIsAdmin.dataValues.isAdmin == true
            ) {
              models.Comment.update(req.body, {
                attributes: ["comment"],
                where: { commentId: req.params.commentId },
              })
                .then(() =>
                  res.status(201).json({ message: "Commentaire modifié" })
                )
                .catch((error) => res.status(500).json({ error }));
            } else {
              res.status(401).json({
                error: "Vous n'êtes pas autorisé à modifier le commentaire",
              });
            }
          })
          .catch((error) =>
            res.status(500).json({
              error: "Impossible de communiquer avec la base de données",
            })
          );
      } else {
        res.status(404).json({ error: "Commentaire non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Impossible de modifier le commentaire" })
    );
};

exports.deleteComment = (req, res, next) => {
  models.Comment.findOne({
    where: { commentId: req.params.commentId },
  })
    .then((commentFound) => {
      if (commentFound) {
        models.User.findOne({
          attributes: ["isAdmin"],
          where: { userId: getUserId(req) },
        })
          .then((userIsAdmin) => {
            if (
              getUserId(req) == commentFound.userId ||
              userIsAdmin.dataValues.isAdmin == true
            ) {
              models.Comment.destroy({
                where: { commentId: req.params.commentId },
              })
                .then(() =>
                  res.status(201).json({ message: "Commentaire supprimé" })
                )
                .catch((error) => res.status(404).json({ error }));
            } else {
              res.status(401).json({
                error: "Vous n'êtes pas autorisé à supprimer le commentaire",
              });
            }
          })
          .catch((error) =>
            res.status(500).json({
              error: "Impossible de communiquer avec la base de données",
            })
          );
      } else {
        res.status(404).json({ error: "Commentaire non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Impossible de supprimer le commentaire" })
    );
};
