// customerOperations.js
import mongoose from 'mongoose';
import Customer from './models/customer.js';
import chalk from 'chalk';
import { setCacheWithExpiry, getCache, deleteCache, clearCache } from './config/redis.js';

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/CustomerCLI");
    console.log(chalk.green("✔ MongoDB connected successfully"));

    // Clear cache on startup to ensure fresh state
    await clearCache();

    // Initial resequence to ensure all IDs are correct
    const count = await Customer.countDocuments();
    if (count > 0) {
      await Customer.resequenceIds();
    }
  } catch (error) {
    console.error(chalk.red("✘ MongoDB connection error:", error.message));
    process.exit(1);
  }
};

export const addCustomer = async (customer) => {
  try {
    const newCustomer = await Customer.create(customer);

    // Invalidate relevant caches
    await clearCache();

    console.log(chalk.green("\n✔ Customer added successfully:"));
    console.table(newCustomer.toDisplay());
    return newCustomer;

  } catch (error) {
    throw new Error(`Failed to add customer: ${error.message}`);
  }
};


export const findCustomers = async (name) => {
  try {
    const cacheKey = `search:${name.toLowerCase()}`;
    const cachedResults = await getCache(cacheKey);

    if (cachedResults) {
      console.log(chalk.blue('✓ Retrieved from cache'));
      return cachedResults;
    }

    const search = new RegExp(name, "i");
    const customers = await Customer.find({
      $or: [
        { firstname: search },
        { lastname: search }
      ]
    }).sort({ customerId: 1 });

    const results = customers.length > 0 ? customers.map(customer => customer.toDisplay()) : [];

    // Cache results for 1 hour
    await setCacheWithExpiry(cacheKey, results, 3600);
    console.log(chalk.blue('✓ Cached search results'));

    return results;
  } catch (error) {
    throw new Error(`Failed to find customers: ${error.message}`);
  }
};

export const updateCustomer = async (customerId, updates) => {
  try {
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      throw new Error("Customer not found");
    }

    Object.assign(customer, updates);
    await customer.save();

    // Invalidate relevant caches
    await clearCache();

    console.log(chalk.green("\n✔ Customer updated successfully:"));
    console.table(customer.toDisplay());
    return customer;
  } catch (error) {
    throw new Error(`Failed to update customer: ${error.message}`);
  }
};

export const deleteCustomer = async (param) => {
  try {
    const customer = await Customer.findOne({
      $or: [
        { customerId: param },
        { firstname: new RegExp(param, "i") },
        { lastname: new RegExp(param, "i") },
        { email: param }
      ]
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    console.log(chalk.yellow("\nDeleting customer:"));
    console.table(customer.toDisplay());

    await Customer.deleteOne({ _id: customer._id });

    // Resequence all IDs after deletion
    await Customer.resequenceIds();

    // Invalidate all caches
    await clearCache();

    return true;
  } catch (error) {
    throw new Error(`Failed to delete customer: ${error.message}`);
  }
};

export const getAllCustomers = async () => {
  try {
    const cacheKey = 'all_customers';
    const cachedCustomers = await getCache(cacheKey);

    if (cachedCustomers) {
      console.log(chalk.blue('✓ Retrieved from cache'));
      return cachedCustomers;
    }

    const customers = await Customer.find({})
      .sort({ customerId: 1 });

    const results = customers.length > 0 ?
      customers.map(customer => customer.toDisplay()) : [];

    // Cache results for 1 hour
    await setCacheWithExpiry(cacheKey, results, 3600);
    console.log(chalk.blue('✓ Cached customer list'));

    return results;
  } catch (error) {
    throw new Error(`Failed to retrieve customers: ${error.message}`);
  }
};