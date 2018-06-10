const mongoose   = require("mongoose"),
      bcrypt     = require("bcrypt"),
      userSchema = new mongoose.Schema({
         username: {
            type: String,
            required: true,
            unique: true
         },
         password: {
            type: String, 
            required: true
         },
         orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
         }],
         isAdmin: {
            default: false,
            type: Boolean
         }
      });

userSchema.pre("save", function(next){
   let user = this;
   
   if(!user.isModified("password")) return next();
     
   return bcrypt.hash(user.password, 8)
            .then(hashed => {
               user.password = hashed;
               return next();
            })
            .catch(error => next(error));
});

userSchema.methods.comparePassword = function(password){
   return bcrypt.compare(password, this.password)
            .then(response => {
               return response;
            })
            .catch(error => error);
};

module.exports = mongoose.model("User", userSchema);