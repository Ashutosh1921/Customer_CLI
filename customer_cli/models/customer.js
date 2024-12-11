const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    }

})
// now creata a collection in database 
const Customerdb = mongoose.model("customer", userSchema);
module.exports = Customerdb;