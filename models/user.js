var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    email : String,
    password: String,
    position: String,
    firstName: String,
    lastName: String,
    mobileNumber: String,
    address: String,

});



module.exports = mongoose.model("User", UserSchema);