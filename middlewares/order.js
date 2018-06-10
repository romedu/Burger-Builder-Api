const jwt    = require("jsonwebtoken"),
      {User, Order} = require("../models"),
      {createError} = require("../helpers/error");

exports.checkIfToken = (req, res, next) => {
   let {token} = req.query;
   if(!token || token === "null" || token === "undefined"){
      let error = createError(403, "You need a valid token to proceed!");
      return next(error);
   }

   req.searchData = jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if(error){
         error = createError(403, "Invalid/Expired Token. You should consider relogging");
         return next(error);
      } 
      return decoded.username;
   });
   
   return next();
};

exports.checkIfAdmin = (req, res, next) => {
   User.findOne({username: req.searchData})
      .then(user => {
         if(user.isAdmin) return next();
         let error = createError(401, "You are not authorized!");
         return next(error);
      })
      .catch(error => {
         error = createError(404, "User requesting not found!");
         return next(error);
      });
};

exports.isAuthorized = (req, res, next) => {
   User.findOne({username: req.searchData})
      .then(user => {
         let userOrders = user.orders.map(order => order.toString());
         if(user.isAdmin || userOrders.includes(req.params.id)) return next();
         let error = createError(401, "You are not authorized!");
         return next(error);
      })
      .catch(error => {
         error = createError(404, "User requesting not found!");
         return next(error);
      });
};

exports.isOwnerAndAdmin = (req, res, next) => {
   Order.findById(req.params.id)
      .then(order => {
         let {buyer} = order;
         if(buyer.isAdmin && buyer.username !== req.searchData){
            let error = createError(401, "Only the owner is authorized!");
            return next(error);
         } 
         return next();
      })
      .catch(error => {
         if(error) error = createError(404, "Order not found");
         next(error);
      })
}

module.exports = exports;