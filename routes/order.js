const router  = require("express").Router(),
      helpers = require("../helpers/order");
      middles = require("../middlewares/order");

router.route("/")
   .get(helpers.find)
   .post(helpers.create);

router.get("/all", middles.checkIfAdmin, helpers.findAll);

router.route("/:id")
   .get(middles.isAuthorized, helpers.findOne)
   .patch(middles.checkIfAdmin, middles.isOwnerAndAdmin, helpers.update)
   .delete(middles.isAuthorized, middles.isOwnerAndAdmin, helpers.delete);

module.exports = router;