const {Order, User} = require("../models");

exports.find = (req, res, next) => {
   let {searchData} = req;
   Order.find({"buyer.username": searchData})
      .then(orders => {
         let size = orders.length;
         let page = Number(req.query.page) * 10;
         if(Number(page) === page && orders.length >= page - 9){
            orders = orders.slice(page-10, page);
         }
         return res.status(200).json({orders, size})
      })
      .catch(error => {
         if(error) error = {};
         error.message = "Order not found!";
         error.status = 404;
         return next(error);
      });
};

exports.findAll = (req, res, next) => {
   Order.find({})
      .then(orders => {
         let size = orders.length;
         let page = Number(req.query.page) * 10;
         if(Number(page) === page && orders.length >= page - 9){
            orders = orders.slice(page-10, page);
         }
         return res.status(200).json({orders, size});
      })
      .catch(error => {
         if(error) error = {};
         error.message = "Orders not found!";
         error.status = 404;
         return next(error);
      });
};

exports.create = (req, res, next) => {
   let {searchData} = req;
   let {ingredients, totalPrice} = req.body;
   Order.create({ingredients, totalPrice})
      .then(newOrder => {
         User.findOne({username: searchData})
            .then(user => {
               let {username, id, isAdmin} = user;
               user.orders.push(newOrder);
               newOrder.buyer = {id, username, isAdmin};
               return Promise.all([user.save(), newOrder.save()])
            })
            .then(data => res.status(201).json(newOrder))
            .catch(error => {
               if(error) error = {};
               error.message = "User requesting not found!";
               error.status = 404;
               return next(error);
            });
      })
      .catch(error => {
         if(error) error = {};
         error.message = "Creation failed!";
         error.status = 417;
         return next(error);
      });
};

exports.findOne = (req, res, next) => {
   Order.findById(req.params.id)
      .then(foundOrder => res.json(foundOrder))
      .catch(error => {
         if(error) error = {};
         error.message = "Order not found!";
         error.status = 404;
         return next(error);
      });
};

exports.update = (req, res, next) => {
   Order.findByIdAndUpdate(req.params.id, req.body, {new:true})
      .then(editedOrder => res.json(editedOrder))
      .catch(error => {
         if(error) error = {};
         error.message = "Order not modified!";
         error.status = 417;
         return next(error);
      });
};

exports.delete = (req, res, next) => {
   Order.findByIdAndRemove(req.params.id)
      .then(removedOrder => {
         User.findById(removedOrder.buyer.id)
            .then(user => {
               user.orders.pull(removedOrder.id);
               return user.save();
            })
            .then(data => res.status(200).json({message: "Successfully removed the order"}))
            .catch(error => {
               if(error) error = {};
               error.message = "User requesting not found!";
               error.status = 404;
               return next(error);
            });
      })
      .catch(error => {
         if(error) error = {};
         error.message = "Order not deleted!";
         error.status = 417;
         return next(error);
      });
};