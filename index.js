const { Command } = require("commander");
const { addCustomer, findCustomers, updateCustomer, deleteCustomer, AllCustomer } = require("./customer_cli/app");
const program = new Command();

const Questions = [
    {
        type: "input",
        name: "firstname",
        message: "Customer first name",
    },
    {
        type: "input",
        name: "lastname",
        message: "Customer last name",
    },
    {
        type: "input",
        name: "phone",
        message: "Customer phone",
    },
    {
        type: "input",
        name: "email",
        message: "Customer email",
    }
]

// this will show version and description when we hit command in cli 

program
    .name('CSDT')
    .description('CLI to some JavaScript string utilities')
    .version('0.8.0');

program
    .command('add')
    .alias('a')
    .description('add a Customer')
    .action(async () => {
        try {
            // Dynamically import inquirer
            const inquirerModule = await import('inquirer');
            const inquirer = inquirerModule.default; // Use default export for Inquirer.js
            const answers = await inquirer.prompt(Questions);
            addCustomer(answers);
        } catch (err) {
            console.error('Error:', err.message);
        }
    });
// this out command to add customer

program
    .command('find <name>')
    .alias('f')
    .description("find a customer")
    .action((name) => {
        findCustomers(name);
    })

// this is update
program
    .command('update <id>')
    .alias('u')
    .description("update a customer")
    .action(async (_id) => {
        try {
            // Dynamically import inquirer
            const inquirerModule = await import('inquirer');
            const inquirer = inquirerModule.default; // Use default export for Inquirer.js
            const answers = await inquirer.prompt(Questions);
            updateCustomer(_id, answers);
        } catch (err) {
            console.error('Error:', err.message);
        }
    });
// this is for delete the user data
program
    .command('del <name>')
    .alias('d')
    .description("delete a customer data")
    .action((name) => {
        deleteCustomer(name);
    });
// command to get all customer data
program
    .command('all')
    .alias('al')
    .description("get all customer data")
    .action(() => {
        AllCustomer();
    })
program.parse(process.argv);