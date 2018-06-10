const {ADMIN_KEY} = process.env,
      {createError} = require("../helpers/error");

exports.verifyAdminKey = (req, res, next) => {
   let {adminPassword} = req.body;
   if(adminPassword){
      if(adminPassword === ADMIN_KEY) req.body.isAdmin = true;
      else {
         let error = createError(401, "Invalid Admin's Password");
         return next(error);
      }
   }
   return next();
};

module.exports = exports;