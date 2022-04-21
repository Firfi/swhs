import chalk from "chalk";

export const printError = (error: string) => {
  const eLog = chalk.red(error);
  console.error(eLog);
};
