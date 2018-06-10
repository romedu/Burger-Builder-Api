require("dotenv").config();

const express        = require("express"),
      app            = express(),
      PORT           = process.env.PORT || 3000,
      bodyParser     = require("body-parser"),
      serializeError = require("serialize-error"),
      orderRoutes    = require("./routes/order"),
      authRoutes     = require("./routes/auth"),
      cors           = require("cors"),
      morgan         = require("morgan");
      orderMiddles   = require("./middlewares/order");
      
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api/order", orderMiddles.checkIfToken, orderRoutes);
app.use("/api", authRoutes);

app.use((error, req, res, next) => {
   if(error){
      delete error.stack;
      error = serializeError(error);
      res.json(error);
   }
   next();
});

app.listen(PORT, () => console.log("Welcome to My Burger Builder API"));