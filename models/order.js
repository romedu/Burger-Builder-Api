const mongoose = require("mongoose"),
   orderSchema = new mongoose.Schema({
      ingredients: {
         type: Object,
         required: true
      },
      totalPrice: {
         type: Number,
         default: 3
      },
      buyer: {
         id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         username: String,
         isAdmin: Boolean
      },
      time: {
         type: Date,
         default: Date.now()
      }
   });

module.exports = mongoose.model("Order", orderSchema);