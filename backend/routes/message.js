const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const msgCtrl = require("../controllers/message");

//route pour gerer la pagination
router.get("/message/paginate/:range/:factor", auth, msgCtrl.allMessages);

//route pour creer le message
router.post("/message", auth, msgCtrl.createMessage);

//route pour recuperer les messages
router.get("/message/:msgId", auth, msgCtrl.viewMessage);

//route pour editer le message
router.put("/message/:msgId", auth, msgCtrl.editMessage);

//route pour supprimer le message
router.delete("/message/:msgId", auth, msgCtrl.deleteMessage);

//route pour creer le like
router.post("/message/:msgId/like", auth, msgCtrl.postLike);

//route pour sup le like
router.delete("/message/:msgId/like", auth, msgCtrl.deleteLike);

//route pour recuperer les likes
router.get("/message/:msgId/like", auth, msgCtrl.allLikes);

module.exports = router;
