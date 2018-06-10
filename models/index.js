const mongoose = require("mongoose");

mongoose.connect(process.env.DBURL);
mongoose.Promise = Promise;
mongoose.set("debug", true);

exports.Order = require("./order");
exports.User = require("./user");

module.exports = exports;