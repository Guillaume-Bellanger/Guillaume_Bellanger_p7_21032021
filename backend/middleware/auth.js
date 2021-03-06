const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Le token encodé correspond à la 2ème partie de ce header, le split est nécessaire pour le récupérer
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.id && req.body.id !== userId) {
      res.status(401).json({ message: "Invalid user ID" });
    } else {
      // Si le user ID de l'utilisateur souhaitant réaliser une requête correspond à celui récupérer dans le TOKEN d'autentification, la requête peut être réalisée.
      next();
    }
  } catch {
    res.status(500).json({ error: "Veuillez vous reconnecter !" });
  }
};
