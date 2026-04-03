// Imports
const { Command } = require('commander')

// Code
// Create a new Command instance
const commander = new Command()

// Set the program name and version
commander.option('--mode <mode>', 'Modo de trabajo', 'production')


commander.parse()

console.log('Options: ', commander.opts())
console.log('Remaining arguments: ', commander.args);

// Exports
module.exports = {
    commander
}