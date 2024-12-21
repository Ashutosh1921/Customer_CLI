// seeds/seed.js
import mongoose from 'mongoose';
import Customer from '../models/customer.js';
import chalk from 'chalk';

const users = [
  {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890"
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    phone: "234-567-8901"
  },
  {
    firstname: "Robert",
    lastname: "Johnson",
    email: "robert.j@example.com",
    phone: "345-678-9012"
  },
  {
    firstname: "Sarah",
    lastname: "Williams",
    email: "sarah.w@example.com",
    phone: "456-789-0123"
  },
  {
    firstname: "Michael",
    lastname: "Brown",
    email: "michael.b@example.com",
    phone: "567-890-1234"
  },
  {
    firstname: "Emily",
    lastname: "Davis",
    email: "emily.d@example.com",
    phone: "678-901-2345"
  },
  {
    firstname: "David",
    lastname: "Miller",
    email: "david.m@example.com",
    phone: "789-012-3456"
  },
  {
    firstname: "Lisa",
    lastname: "Wilson",
    email: "lisa.w@example.com",
    phone: "890-123-4567"
  },
  {
    firstname: "James",
    lastname: "Taylor",
    email: "james.t@example.com",
    phone: "901-234-5678"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/CustomerCLI");
    console.log(chalk.green("\n✔ MongoDB connected successfully"));

    // Clear existing customers
    await Customer.deleteMany({});
    console.log(chalk.yellow("✔ Cleared existing customers"));

    // Add new customers
    for (const user of users) {
      const customer = await Customer.create(user);
      console.log(chalk.blue(`✔ Added customer: ${customer.firstname} ${customer.lastname} (ID: ${customer.customerId})`));
    }

    console.log(chalk.green("\n✔ Database seeded successfully!"));
    console.log(chalk.blue("\nSeed Summary:"));
    console.table(await Customer.find().sort({ customerId: 1 }));

  } catch (error) {
    console.error(chalk.red("\n✘ Error seeding database:", error.message));
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log(chalk.yellow("\n✔ Database connection closed"));
  }
}

// Run the seed function
seedDatabase();