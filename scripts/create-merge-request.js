#! /usr/bin/env node

const { exec } = require('child_process');
const chalk = require('chalk');
const open = require('open');
const { vpnErrorInterceptor, getCurrentBranch } = require('./utils');

function main() {
  const targetBranch = process.argv.slice(2)[0];
  const curBranch = getCurrentBranch();

  if (!targetBranch) {
    console.log(chalk.red('请提供需要创建 mergeRequest 的 base 分支 \n'));
    process.exit(9);
  }

  exec(`git ls-remote origin ${curBranch}`, (err, stdout) => {
    vpnErrorInterceptor(err);
    if (!stdout) {
      // 不存在远程同名分支
      console.log(chalk.red('未找到同名的远程分支 \n'));
      process.exit(1);
    }
    console.log(chalk.green('自动发起 mergeRequest 创建，请在 gitlab 界面进行后续操作，完成合并流程'));
    open(
      `http://gitlab.blacklake.tech/frontend/web/merge_requests/new?utf8=%E2%9C%93&merge_request[source_project_id]=8&merge_request[source_branch]=${curBranch}&merge_request[target_project_id]=8&merge_request[target_branch]=${targetBranch}`,
    );
  });
}

main();
