#! /usr/bin/env node

// 根据需求类型，jira号切出分支开发,feature和hotfix使用

const { execSync, exec } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
//
const { failConsole, successConsole, validateEmpty } = require('./utils');

const basePrompt = [
  {
    type: 'list',
    name: 'type',
    message: '需要的分支类型是',
    choices: ['feature', 'hotfix', 'bugfix', 'mergeRequest'],
    default: 'feature',
  },
];

const featurePrompt = [
  {
    type: 'list',
    name: 'type',
    message: '需求类型是',
    choices: ['project', 'minor', 'other'],
    default: 'project',
  },
  {
    type: 'input',
    name: 'jiraCode',
    message: '需求jira是(仅数字)',
    validate: validateEmpty,
  },
];

const hotfixPrompt = [
  {
    type: 'list',
    name: 'baseBranch',
    message: 'hotfix 分支是',
    choices: ['release', 'master', 'staging', 'beta-gray', 'mes999', 'nongfushanquan'],
    default: 'release',
  },
  {
    type: 'input',
    name: 'jiraCode',
    message: 'hotfix jira是(仅数字)',
    validate: validateEmpty,
  },
];

const bugfixPrompt = [
  {
    type: 'input',
    name: 'jiraCode',
    message: 'bugfix jira是(仅数字)',
    validate: validateEmpty,
  },
];

const mergeRequestPrompt = [
  {
    type: 'list',
    name: 'baseBranch',
    message: '该发布分支的base分支是',
    choices: ['test', 'master', 'release', 'staging', 'beta-gray', 'mes999', 'nongfushanquan'],
    default: 'test',
  },
];

/**
 * 获取当前六位日期
 * @returns {string} 六位日期 eg.210407
 */
const getFullDate = () => {
  const formatFunc = (num) => {
    const t = `0${num}`.toString();
    // 补0，截取两位
    return t.substring(t.length - 2);
  };
  const date = new Date();
  const year = formatFunc(date.getFullYear()); // 获取两位年份
  const month = formatFunc(date.getMonth() + 1); // 获取两位月份，默认月份是0-11
  const day = formatFunc(date.getDate()); // 获取两位日期
  return year + month + day;
};

/**
 * 去除字符串中的换行符
 * @param {string} cmdString
 * @returns
 */
const formatCmdString = (cmdString) => cmdString.replace('\n', '');

/**
 * 检查是否存在同名分支
 * @param {string} branchName
 * @returns
 */
const checkBranchDuplicated = (branchName) =>
  new Promise((resolve, reject) => {
    const countBranchCmd = formatCmdString(`git branch -l | grep ${branchName} --count`);
    exec(countBranchCmd, (err, stdout, stderr) => {
      // 存在同名分支
      if (Number(stdout) !== 0) {
        inquirer
          .prompt([
            {
              type: 'confirm',
              name: 'deleteOldBranch',
              message: `检测到当前存在同名分支 ${chalk.yellow(
                branchName,
              )}${new inquirer.Separator()}\n是否删除旧分支重新建立分支`,
            },
          ])
          .then(({ deleteOldBranch }) => {
            const deleteBranchCmd = formatCmdString(`git branch -D ${branchName}`);
            if (deleteOldBranch) {
              // 删除同名分支
              execSync(deleteBranchCmd);
              if (typeof resolve === 'function') {
                resolve();
              }
            } else {
              console.log(`请在本地自行操作或运行 ${chalk.yellow(deleteBranchCmd)}`);
              process.exit();
            }
          });
      } else if (typeof resolve === 'function') {
        resolve();
      }
    });
  });

/**
 * 基于baseBranch 创建新分支
 * @param {string} baseBrach 基础分支名
 * @param {string} newBranch 新分支名
 */
const createNewBranch = (baseBrach, newBranch) => {
  // 检测是否存在同名分支
  checkBranchDuplicated(newBranch).then(() => {
    const checkoutBranchCmd = formatCmdString(`git checkout -b ${newBranch} ${baseBrach}`);
    const currentBranch = formatCmdString(execSync('git symbolic-ref --short HEAD', { cwd: './' }).toString());

    if (currentBranch === baseBrach) {
      execSync('git pull');
    } else {
      execSync(`git fetch origin ${baseBrach}:${baseBrach}`);
    }

    exec(checkoutBranchCmd, { cwd: './' }, (error) => {
      if (error) {
        failConsole(error);
      } else {
        successConsole(formatCmdString(`已从 ${baseBrach} 切出 ${chalk.green(newBranch)} 分支, 可以在此分支上开发了!`));
      }
    });
  });
};

/**
 * 创建需求相关开发分支
 */
const createFeatureBranch = () => {
  inquirer.prompt(featurePrompt).then((answers) => {
    try {
      const { type, jiraCode } = answers;

      const currentUser = execSync('git config user.name', { cwd: './' }).toString() || Math.round(Math.random() * 100);
      const newBranch = `feature/${type}/${jiraCode}_${currentUser}`;

      createNewBranch('test', newBranch);
    } catch (error) {
      failConsole(error);
    }
  });
};

/**
 * 创建hotfix相关分支（已上线且需立即修复的bug）
 */
const createHotfixBranch = () => {
  inquirer.prompt(hotfixPrompt).then((answers) => {
    try {
      const { baseBranch, jiraCode } = answers;

      const currentUser = execSync('git config user.name', { cwd: './' }).toString() || Math.round(Math.random() * 100);
      const newBranch = `hotfix/${baseBranch}_${jiraCode}_${currentUser}`;

      createNewBranch(baseBranch, newBranch);
    } catch (error) {
      failConsole(error);
    }
  });
};

/**
 * 创建用于合并发布的分支
 */
const createMergeRequestBranch = () => {
  inquirer.prompt(mergeRequestPrompt).then((answers) => {
    try {
      const { baseBranch } = answers;

      const currentUser = execSync('git config user.name', { cwd: './' }).toString() || Math.round(Math.random() * 100);
      const newBranch = `mergeRequest/${baseBranch}/${getFullDate()}_${currentUser}`;

      createNewBranch(baseBranch, newBranch);
    } catch (error) {
      failConsole(error);
    }
  });
};

/**
 * 创建bugfix分支（已上线但不急着修复的bug）
 */
const createBugFixBranch = () => {
  inquirer.prompt(bugfixPrompt).then((answers) => {
    try {
      const { jiraCode } = answers;

      const currentUser = execSync('git config user.name', { cwd: './' }).toString() || Math.round(Math.random() * 100);
      const newBranch = `bugfix/${jiraCode}_${currentUser}`;

      createNewBranch('test', newBranch);
    } catch (error) {
      failConsole(error);
    }
  });
};

inquirer.prompt(basePrompt).then((answers) => {
  try {
    const { type } = answers;
    if (type === 'feature') {
      createFeatureBranch();
    }
    if (type === 'hotfix') {
      createHotfixBranch();
    }
    if (type === 'bugfix') {
      createBugFixBranch();
    }
    if (type === 'mergeRequest') {
      createMergeRequestBranch();
    }
  } catch (error) {
    failConsole(error);
  }
});
