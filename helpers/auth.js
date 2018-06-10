const {User} = require("../models"),
      jwt  = require("jsonwebtoken"),
      {createError} = require("../helpers/error");

exports.register = (req, res, next) => {
   User.create(req.body)
        .then(user => {
            let {username, isAdmin} = user;
            return res.json(serializeUserData(username, isAdmin));
        })
        .catch(error => {
            let codedError = error.code === 11000;
            if(!error || codedError){
               if(codedError){
                  error.message = "Username already taken";
               } else {
                  error = {
                     message: "User not created!"
                  };
               } 
               error.status = 417;
            }
            return next(error);
      });
}

exports.login = (req, res, next) => {
   User.findOne({username: req.body.username})
      .then(user => {
         user.comparePassword(req.body.password)
            .then(result => {
               if(result){
                  let {username, isAdmin} = user;
                  return res.json(serializeUserData(username, isAdmin));
               }
               let error = createError(404, "Invalid username/password");
               return next(error);
            })
            .catch(error => {
               if(error) error = createError(500, "Internal Server Error");
               return next(error);
            });
      })
      .catch(error => {
         error = createError(404, "Invalid username/password");
         return next(error);
      });
}

exports.verifyToken = (req, res, next) => {
   return jwt.verify(req.params.id, process.env.SECRET, (error, decoded) => {
             if(error){
                error = createError(404, "Invalid/Expired Token. You should consider relogging");
                return next(error);
             };
             return res.status(200).json(decoded);
          });
}

const serializeUserData = (username, isAdmin) => {
   let token = jwt.sign({username, isAdmin}, process.env.SECRET, {expiresIn: 60*60});
   return ({
            message: `Hi ${username}!`,
            username,
            isAdmin,
            token,
            tokenExpiration: 3600 
         });
}

module.exports = exports;