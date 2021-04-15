const bcrypt = require("bcrypt"); //Permet le cryptage du mot de passe
const models = require("../models/");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailValidator = require("email-validator"); //Permet de s'assurer que l'utilisateur utilise une adresse email valide via une REGEX contenu dans ce plugin
const passwordValidator = require("password-validator"); // Idem mais pour avoir un mot de passe fort via les propriétés contenues dans schema
const fs = require("fs");

const schema = new passwordValidator();

schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(40) // Maximum length 100
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

const getUserId = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN);
  const userId = decodedToken.userId;
  return userId;
};
exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email)) {
    // Si l'email n'est pas valide
    res.status(401).json({
      message: "Merci de bien vouloir entrer une adresse email valide !",
    }); // Ajouter une alert
  }
  if (req.body.name.length >= 15 || req.body.name.length <= 4) {
    // Si un pseudo est bien renseigné
    res.status(401).json({
      message: "Merci de renseigner un pseudo entre 5 et 14 caractères !",
    });
  }
  if (!schema.validate(req.body.password)) {
    // Si le password n'est pas valide
    res.status(401).json({
      message:
        "Veuillez choisir un mot de passe fort, entre 8 et 40 caractères contenant au moins un caractère majuscule et un minuscule, 2 chiffres et sans espaces.",
    });
  }
  models.User.findOne({
    attributes: ["email"],
    where: { email: req.body.email },
  })
    .then((userFound) => {
      if (!userFound) {
        bcrypt
          .hash(req.body.password, 10) // 10 salage du password
          .then((hash) => {
            const newUser = models.User.create({
              email: req.body.email,
              password: hash,
              name: req.body.name,
              bio: "Veuillez compléter votre profil...",
              isAdmin: 0,
              avatar: "http://localhost:3000/images/avatar-default.png",
            })
              .then((newUser) =>
                res.status(201).json({
                  message: "Utilisateur créé avec l'id " + newUser.userId,
                })
              )
              .catch((error) => res.status(400).json({ error }));
          });
      } else {
        return res.status(409).json({ error: "L 'utilisateur existe déjà" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  models.User.findOne({
    attributes: ["email", "userId", "password", "isAdmin"],
    where: { email: req.body.email },
  })
    .then((userFound) => {
      if (userFound) {
        bcrypt
          .compare(req.body.password, userFound.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: userFound.userId,
              isAdmin: userFound.isAdmin,
              token: jwt.sign(
                { userId: userFound.userId },
                process.env.TOKEN, // Encodage du token via la variable d'environnement contenu dans le .env
                { expiresIn: "3h" } // Expiration de la connexion au bout de 3h
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(404).json({ error: "Utilisateur non trouvé !" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.viewProfil = (req, res, next) => {
  models.User.findOne({
    attributes: ["name", "email", "bio", "avatar", "isAdmin", "userId"],
    where: { userId: req.params.userId },
  })
    .then((userFound) => {
      if (userFound) {
        res.status(201).json(userFound);
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de voir le profil" });
    });
};

exports.editProfil = (req, res, next) => {
  //ternaire verif si req.file si oui oon ajout l'objet body.user et la clef avatar correspond a l'url de l'image
  //sinon user objet est = objet body
  const userObject = req.file
    ? {
        avatar: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  models.User.findOne({
    // cherche un utilisdateur dont l'id est celui founris en paramattre
    attributes: ["isAdmin", "userId", "avatar"],
    where: { userId: req.params.userId },
  })
    .then((userFound) => {
      // quand l'utilisateur est trouvé
      //quand l'utilisateur est trouvé on verifis qu'il est proprietaire du profil ou administrateur
      //si c'est le cas on maj le profil sinon on renvoie une erreur

      if (
        userFound &&
        (userFound.isAdmin == true || userFound.userId == getUserId(req))
      ) {
        models.User.update(userObject, {
          attributes: ["bio", "avatar"],
          where: { userId: req.params.userId },
        })
          .then(() => {
            const supImg = userFound.avatar.split("/")[4];

            fs.unlink("images/" + supImg, () => {
              res.status(200).json({ message: "Profil mis à jour" });
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(401).json({
          error: "Vous n'êtes pas autorisé à mettre à jour le profil",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de mettre à jour le profil" });
    });
};

exports.deleteProfil = (req, res, next) => {
  models.User.findOne({
    where: { userId: req.params.userId },
  })
    .then((userFound) => {
      if (userFound) {
        models.User.findOne({
          attributes: ["isAdmin"],
          where: { userId: getUserId(req) },
        }).then((userIsAdmin) => {
          if (
            getUserId(req) == userFound.userId ||
            userIsAdmin.dataValues.isAdmin == true
          ) {
            models.User.destroy({
              where: { userId: req.params.userId },
            })
              .then(() => res.status(201).json({ message: "Compte supprimé" }))
              .catch((error) => res.status(404).json({ error }));
          } else {
            res.status(401).json({
              error: "Vous n'êtes pas autorisé à supprimer le compte",
            });
          }
        });
      } else {
        res.status(404).json({ error: "Profil non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Impossible de supprimer le compte" })
    );
};
