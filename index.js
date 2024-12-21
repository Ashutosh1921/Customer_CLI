// index.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { 
  connectDB, 
  addCustomer, 
  findCustomers, 
  updateCustomer, 
  deleteCustomer, 
  getAllCustomers 
} from './customerOperations.js';

await connectDB();

const mainMenu = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { name: '➕ Add Customer', value: 'Add Customer' },
      { name: '🔍 Find Customers', value: 'Find Customers' },
      { name: '✏️  Update Customer', value: 'Update Customer' },
      { name: '❌ Delete Customer', value: 'Delete Customer' },
      { name: '📋 List All Customers', value: 'List All Customers' },
      { name: '👋 Exit', value: 'Exit' }
    ]
  }
];

const addCustomerQuestions = [
  {
    type: 'input',
    name: 'firstname',
    message: 'Enter first name:',
    validate: input => input.trim() !== '' ? true : 'First name is required'
  },
  {
    type: 'input',
    name: 'lastname',
    message: 'Enter last name:',
    validate: input => input.trim() !== '' ? true : 'Last name is required'
  },
  {
    type: 'input',
    name: 'email',
    message: 'Enter email:',
    default: 'Not provided'
  },
  {
    type: 'input',
    name: 'phone',
    message: 'Enter phone number:',
    default: 'Not provided'
  }
];

const findCustomerQuestions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter name to search:',
    validate: input => input.trim() !== '' ? true : 'Search term is required'
  }
];

const deleteCustomerQuestions = [
  {
    type: 'input',
    name: 'param',
    message: 'Enter customer ID or name:',
    validate: input => input.trim() !== '' ? true : 'Input is required'
  }
];

const updateCustomerInitialQuestions = [
  {
    type: 'input',
    name: 'id',
    message: 'Enter customer ID:',
    validate: input => input.trim() !== '' ? true : 'Customer ID is required'
  }
];

const updateCustomerDetailsQuestions = [
  {
    type: 'list',
    name: 'field',
    message: 'What would you like to update?',
    choices: [
      'First Name',
      'Last Name',
      'Email',
      'Phone'
    ]
  },
  {
    type: 'input',
    name: 'value',
    message: 'Enter new value:',
    validate: input => input.trim() !== '' ? true : 'Value is required'
  }
];

const handleAddCustomer = async () => {
  try {
    const answers = await inquirer.prompt(addCustomerQuestions);
    await addCustomer(answers);
  } catch (error) {
    console.error(chalk.red(`\n✘ ${error.message}\n`));
  }
};

const handleFindCustomers = async () => {
  try {
    const { name } = await inquirer.prompt(findCustomerQuestions);
    const customers = await findCustomers(name);
    
    if (customers.length > 0) {
      console.log(chalk.green(`\n✔ Found ${customers.length} customers:`));
      console.table(customers);
    } else {
      console.log(chalk.yellow('\n⚠ No customers found.\n'));
    }
  } catch (error) {
    console.error(chalk.red(`\n✘ ${error.message}\n`));
  }
};

const handleUpdateCustomer = async () => {
  try {
    const { id } = await inquirer.prompt(updateCustomerInitialQuestions);
    const { field, value } = await inquirer.prompt(updateCustomerDetailsQuestions);
    
    const fieldMap = {
      'First Name': 'firstname',
      'Last Name': 'lastname',
      'Email': 'email',
      'Phone': 'phone'
    };

    await updateCustomer(id, { [fieldMap[field]]: value });
  } catch (error) {
    console.error(chalk.red(`\n✘ ${error.message}\n`));
  }
};

const handleDeleteCustomer = async () => {
  try {
    const { param } = await inquirer.prompt(deleteCustomerQuestions);
    await deleteCustomer(param);
    console.log(chalk.green('\n✔ Customer deleted successfully!\n'));
  } catch (error) {
    console.error(chalk.red(`\n✘ ${error.message}\n`));
  }
};

const handleListCustomers = async () => {
  try {
    const customers = await getAllCustomers();
    if (customers.length > 0) {
      console.log(chalk.green(`\n✔ Found ${customers.length} customers:`));
      console.table(customers);
    } else {
      console.log(chalk.yellow('\n⚠ No customers found.\n'));
    }
  } catch (error) {
    console.error(chalk.red(`\n✘ ${error.message}\n`));
  }
};

const main = async () => {
  console.log(chalk.blue.bold('\n🎯 Welcome to Customer Management CLI!\n'));
  
  while (true) {
    try {
      const { action } = await inquirer.prompt(mainMenu);
      
      switch (action) {
        case 'Add Customer':
          await handleAddCustomer();
          break;
        case 'Find Customers':
          await handleFindCustomers();
          break;
        case 'Update Customer':
          await handleUpdateCustomer();
          break;
        case 'Delete Customer':
          await handleDeleteCustomer();
          break;
        case 'List All Customers':
          await handleListCustomers();
          break;
        case 'Exit':
          console.log(chalk.blue.bold('\n👋 Goodbye!\n'));
          process.exit(0);
      }
    } catch (error) {
      console.error(chalk.red(`\n✘ An error occurred: ${error.message}\n`));
    }
  }
};

process.on('SIGINT', () => {
  console.log(chalk.blue.bold('\n\n👋 Goodbye!\n'));
  process.exit(0);
});

main().catch(error => {
  console.error(chalk.red('Fatal error:', error.message));
  process.exit(1);
});