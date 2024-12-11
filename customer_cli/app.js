const mongoose = require("mongoose");
const Customerdb = require("./models/customer");

mongoose.connect("mongodb://localhost:27017/CustomerCLI")
    .then(() => console.log("mongodb is running"))
    .catch(err => console.log(err))

// adding customer
const addCustomer = (customer => {
    Customerdb.create(customer).then(data => {
        // here customer is object .create will auto map it db as object contain correct name as same as sechema.
        console.log("customer added successfully");
        mongoose.connection.close();
    })
})
// find customers
const findCustomers = async (name) => {
    // making it case insensitive
    const search = new RegExp(name, "i");
    const data = await Customerdb.find({ $or: [{ firstname: name }, { lastname: name }] });
    // used or in db beacuse name can given firstname or lastname so i have to cheack both of them.
    console.info(data);
    console.log(`matched data found = ${data.length}`);
    mongoose.connection.close();
    // closing connection each time because it should stop after adding or finding 
}
// update the customer details
const updateCustomer = async (_id, customer) => {
    // find by id and update the new data
    await Customerdb.updateOne({ _id: _id }, { $set: customer });
    console.log("data updated");
    mongoose.connection.close();
}
// remove or delete customer data
const deleteCustomer = async (param) => {
    const customer = await Customerdb.findOne({
        $or: [
            { firstname: param },
            { lastname: param },
            { phone: param },
            { email: param }
        ]
    });
    // check if not empty
    if (customer === null) {
        console.log("Customer not found pls enter correct details");
        return;
    }
    await Customerdb.findByIdAndDelete(customer._id);

    console.log("user data deleted");
    mongoose.connection.close();
}
// list all customers
const AllCustomer = async () => {
    const data = await Customerdb.find({});
    console.log("all customers data below here");
    console.log(data);
    mongoose.connection.close();
}

module.exports = {
    addCustomer,
    findCustomers,
    updateCustomer,
    deleteCustomer,
    AllCustomer
}
