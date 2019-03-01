#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('caporal')

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../package.json'))
)
program.version(pkg.version).description('git命令行工具集')
const commands = fs
  .readdirSync(path.resolve(__dirname, '../commands'))
  .map(filename => filename.replace('.js', ''))

commands.forEach(command => {
  const action = require(`../commands/${command}`)
  program.command(command, getDesc(command)).action(action)
})

program.parse(process.argv)

function getDesc(command) {
  const commandFile = fs.readFileSync(
    path.resolve(__dirname, `../commands/${command}.js`),
    'utf-8'
  )
  return commandFile.split('\n')[0].substr(3)
}
