var mongoose = require("mongoose");

var PrescSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    age:String,
    mobile:String,
    MedicineName:String,
    Dose:String,
    quantity:String,
});



module.exports = mongoose.model("Presc", PrescSchema);