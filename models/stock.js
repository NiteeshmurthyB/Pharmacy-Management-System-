var mongoose = require("mongoose");

var StockSchema = new mongoose.Schema({
    companyName : String,
    date :Date,
    mobileNo : String,
    address : String,
    invoiceNo : String,
    medicineName  : String,
    costPrice    : Number,
    quantity     : Number,
    sellingPrice : Number
});



module.exports = mongoose.model("Stock", StockSchema);