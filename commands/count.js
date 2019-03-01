// 统计修改行数

const inquirer = require('inquirer')
const dayjs = require('dayjs')
const { execSync } = require('child_process')
const chalk = require('chalk')
const log = console.log

const getCommand = data =>
  `git log --author="${data.gituser}" --since=${data.start} --until=${
    data.end
  } --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "%s-%s-%s", add, subs, loc }' -`

module.exports = function() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'start',
        message: '开始时间',
        default: dayjs(oneWeekBefore()).format('YYYY-MM-DD')
      },
      {
        type: 'input',
        name: 'end',
        message: '结束时间',
        default: dayjs().format('YYYY-MM-DD')
      },
      {
        type: 'input',
        name: 'gituser',
        message: '用户名',
        default: getDeafultGitName()
      }
    ])
    .then(answers => {
      const data = execSync(getCommand(answers), { encoding: 'utf8' })
      const [add, remove, total] = data.trim().split('-')
      log(chalk.blue('新增') + ': ' + add)
      log(chalk.red('删除') + ': ' + remove)
      log(chalk.green('总计') + ': ' + total)
    })
}

function oneWeekBefore() {
  return Date.now() - 3.6e6 * 24 * 7
}

function getDeafultGitName() {
  const data = execSync('git config --get user.name', {
    encoding: 'utf8'
  }).trim()
  return data
}
