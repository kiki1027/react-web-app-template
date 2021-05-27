#! /usr/bin/env node

const { execSync, exec } = require('child_process');
const chalk = require('chalk');
const { vpnErrorInterceptor, getCurrentBranch } = require('./utils');

const commonBranch = ['feat', 'test', 'staging', 'master', 'release', 'beta-gray', 'mes999', 'nongfushanquan'];

function main() {
  exec('git status -s', (err, stdout, stderr) => {
    // 未提交的改动
    const uncommittedChangesCount = stdout ? stdout.split('\n').length - 1 : 0;
    const curBranch = getCurrentBranch();
    if (uncommittedChangesCount > 0) {
      console.log(chalk.red('当前分支存在未提交的更改，请处理完再执行 npm run work:finish \n'));
      process.exit(1);
    }
    if (commonBranch.includes(curBranch)) {
      console.log(chalk.red('❌ 警告：公共分支不支持 push ！！ ❌ \n'));
      process.exit(1);
    } else {
      exec(`git push --set-upstream origin ${curBranch} --force`, (err) => {
        vpnErrorInterceptor(err);
        console.log(
          `${chalk.green(
            '当前分支自动 push gitlab 完成，cmd + click 下方链接可快速打开 gitlab \n',
          )}http://gitlab.blacklake.tech/frontend/web/-/commits/${curBranch}`,
        );
      });
    }
  });
}

main();
