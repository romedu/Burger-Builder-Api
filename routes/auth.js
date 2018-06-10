const router  = require("express").Router(),
      helpers = require("../helpers/auth"),
      middles = require("../middlewares/auth");
      
router.post("/login", helpers.login);
router.post("/register", middles.verifyAdminKey, helpers.register);
router.get("/token/:id", helpers.verifyToken)

module.exports = router;