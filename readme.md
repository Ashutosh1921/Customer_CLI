# Customer CLI

A command-line interface application for managing customer data with MongoDB and Redis caching.

## Features

- Create, read, update, and delete customer records
- Automatic customer ID generation with smart padding
- Redis caching for improved performance
- MongoDB for persistent storage
- Input validation for email and phone
- Real-time data resequencing after deletions
- Colored console output for better visibility

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- Redis (running on localhost:6379)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd customer_cli
```

2. Install dependencies:
```bash
npm install
```

3. Ensure MongoDB and Redis services are running on your machine.

## Project Structure

```
CUSTOMER_CLI/
├── config/
│   └── redis.js         # Redis configuration and cache helpers
├── models/
│   └── customer.js      # MongoDB customer model and schema
├── utils/
│   └── validators.js    # Input validation utilities
├── seeds/
│   └── seed.js         # Database seeding script
├── customerOperations.js # Core CRUD operations
├── index.js            # Main application entry point
└── package.json        # Project dependencies and scripts
```

## Features in Detail

### Customer Model
- Unique customer ID with automatic padding
- Required fields: firstname, lastname
- Optional fields: phone, email
- Timestamps for record tracking

### Caching System
- Redis implementation for performance optimization
- 1-hour cache expiry by default
- Automatic cache invalidation on data updates
- Cache retrieval for frequent queries

### Data Operations
- **Add Customer**: Creates new customer records with validation
- **Find Customers**: Search by name with regex support
- **Update Customer**: Modify existing customer records
- **Delete Customer**: Remove records with ID resequencing
- **List All**: Retrieve all customers with caching

### ID Management
- Automatic sequential ID generation
- Smart padding system (e.g., 001, 002, ... 010, ... 100)
- Automatic resequencing after deletions
- Padding updates for milestone numbers

## Usage Examples

```javascript
// Add a new customer
await addCustomer({
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  phone: "+1234567890"
});

// Find customers by name
const customers = await findCustomers("John");

// Update customer
await updateCustomer("001", {
  email: "newemail@example.com"
});

// Delete customer
await deleteCustomer("001");

// Get all customers
const allCustomers = await getAllCustomers();
```

## Error Handling

The application includes comprehensive error handling for:
- Database connection issues
- Invalid input data
- Record not found scenarios
- Cache operations failures

## Performance Considerations

- Redis caching reduces database load
- Efficient ID resequencing
- Optimized search with regex
- Automatic cache invalidation
- Connection retry strategies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
