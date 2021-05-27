#! /usr/bin/env node

// 发版流程

const { execSync, exec } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const open = require('open');
//
const { failConsole, successConsole, vpnErrorInterceptor, getCurrentBranch } = require('./utils');

const basePrompt = [
  {
    type: 'list',
    name: 'env',
    message: '需要发布的环境是',
    choices: ['beta', 'prod', 'beta-gray', 'staging', 'mes999', 'nongfushanquan'],
    default: 'beta',
  },
];

const envToBranch = {
  beta: 'release',
  prod: 'master',
  'beta-gray': 'beta-gray',
  staging: 'staging',
  mes999: 'mes999',
  nongfushanquan: 'nongfushanquan',
};

const tagSuffix = {
  beta: 'release',
  'beta-gray': 'beta-gray',
  staging: 'staging',
  mes999: 'mes999',
  nongfushanquan: 'nongfushanquan',
};

/**
 * 生成发布commit message
 * @param {string} tag
 * @returns
 */
const genCommitMsg = (tag) => `"chore(release): bump version to ${tag}"`;

/**
 * 生成发布commit code
 * @param {string} tag
 * @returns
 */
const genCommitCode = (tag) => `git commit -m ${genCommitMsg(tag)}`;

/**
 * 检查网络，并拉取tag，修改package和package-lock 版本号
 */
function baseStep(version, env) {
  // 删除本地所有tag
  execSync('git tag -l | xargs git tag -d', { cwd: './' });
  // 同步远程tag
  exec('git fetch --tags -f', { cwd: './' }, (err) => {
    vpnErrorInterceptor(err);
    if (version) {
      // 指定发布版本号
      execSync(`npm run standard-version -- --release-as ${version}`, { cwd: './' });
    } else {
      // 自增版本号
      execSync('npm run standard-version -- --release-as patch', { cwd: './' });
    }
    successConsole(`${chalk.yellow('1:')} package.json，package-lock.json version 已修改`);

    const package = JSON.parse(fs.readFileSync('./package.json').toString());
    const tagTail = tagSuffix[env] ? `-${tagSuffix[env]}` : '';
    const tag = `v${package.version}${tagTail}`;

    step1(tag, env);
  });
}

/**
 * 发布分支生成log，commit版本升级信息
 * @param {string} tag
 */
function step1(tag, env) {
  execSync('npm run changelog', { cwd: './' });
  successConsole(`${chalk.yellow('2:')} changelog 已生成`);

  execSync('git add --all', { cwd: './' });

  execSync(genCommitCode(tag), { cwd: './' });
  successConsole(`${chalk.yellow('3:')} version，changelog修改 已提交`);

  step2(tag, env);
}

/**
 * 打tag，并推送到远端
 * @param {string} tag
 */
function step2(tag, env) {
  if (tag) {
    // 打tag，生成tag message
    execSync(`git tag ${tag} -m ${genCommitMsg(tag)}`, { cwd: './' });
    successConsole(`${chalk.yellow('4:')} ${tag} tag 已生成`);

    exec(`git push origin ${tag}`, { cwd: './' }, (error) => {
      vpnErrorInterceptor(error, `git push origin ${tag}`);
      successConsole(`${chalk.yellow('5:')} ${tag} tag 已推送到远端`);
      step3(tag, env);
    });
  } else {
    failConsole('自动化发布流程遇到异常，请重新尝试');
  }
}

/**
 * 推送hotfix分支到远端，结束流程
 * @param {string} tag
 */
function step3(tag, env) {
  const envBranch = envToBranch[env];
  const curBranch = getCurrentBranch();
  exec(`git push origin ${curBranch}`, { cwd: './' }, (error, stdout) => {
    if (error) {
      failConsole(
        `自动push失败，请自行将当前发布分支${chalk.green('push')}到远端，在gitlab的界面将该分支${chalk.green(
          'merge',
        )}到${chalk.green(`${envBranch}`)}分支上,结束发布流程`,
      );
    } else {
      successConsole(
        `${chalk.yellow('6:')} 当前发布分支已${chalk.green('push')}到远端，请在gitlab的界面将该分支${chalk.green(
          'merge',
        )}到${chalk.green(`${envBranch}`)}分支上,结束发布流程`,
      );
      open(
        `http://gitlab.blacklake.tech/frontend/web/merge_requests/new?utf8=%E2%9C%93&merge_request[source_project_id]=8&merge_request[source_branch]=${curBranch}&merge_request[target_project_id]=8&merge_request[target_branch]=${envBranch}`,
      );
    }
  });
}

function main() {
  const version = process.argv.slice(2)[0];

  inquirer.prompt(basePrompt).then((answers) => {
    try {
      const { env } = answers;

      baseStep(version, env);
    } catch (error) {
      failConsole(error);
    }
  });
}

main();
