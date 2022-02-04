#!/usr/bin/env node

// NOTE: The official inquirer documentation is really good. To know more about the different question types,
// please refer to https://www.npmjs.com/package/inquirer#prompt-types

const program = require('commander')
const inquirer = require('inquirer')
const clipboardy = require('clipboardy')
const { aws } = require('./src')
require('colors')
const { version } = require('./package.json')
program.version(version) // This is required is you wish to support the --version option.

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

const friendlyName = data => `${data.name} (${data.service})`

const chooseActions = async (actions) => {
	const { action } = await inquirer.prompt([
		{ 
			type: 'autocomplete', 
			name: 'action', 
			message: 'Search AWS actions:',
			pageSize: 20,
			source: function(answersSoFar, input) {
				if (input) 
					return actions
						.filter(r => r.textSearch.indexOf(input.toLowerCase()) >= 0)
						.map(r => ({
							name: friendlyName(r),
							value:r
						}))
						.sort((a,b) => a.value.name > b.value.name ? 1 : -1)
				else
					return actions
						.map(r => ({
							name: friendlyName(r),
							value:r
						}))
						.sort((a,b) => a.value.name > b.value.name ? 1 : -1)
			}
		}
	])

	return action
}

const selectAction = async () => {
	const actions = await aws.actions
	const action = await chooseActions(actions)
	
	clipboardy.writeSync(action.name)
	
	console.log(`${action.name.bold} copied to your clipboard`.green)
	console.log('')

	const nextStep02 = 'Select another action'
	const nextStep03 = 'No, thanks. I\'m done for now.'
	const { nextStep } = await inquirer.prompt([
		{ 
			type: 'list', 
			name: 'nextStep', 
			message: 'Do you wish to carry on with the following?',
			pageSize: 20,
			choices:[nextStep02, nextStep03]
		}
	])

	if (nextStep == nextStep02)
		return await selectAction()
	else
		return
}

// 1. Creates your first command. This example shows an 'order' command with a required argument
// called 'product' and an optional argument called 'option'.
program
	.command('select')
	.description('Default behavior. Lists/searches AWS actions used in policies. It copies the selected one to the clipboard. Equivalent to `npx get-aws-actions`') // Optional description
	.action(selectAction)

// 2. Deals with cases where no command is passed.
const cmdArgs = [process.argv[0], process.argv[1]]
if (process.argv.length == 2)
	cmdArgs.push('select')

// 3. Starts the commander program
program.parse(cmdArgs) 





