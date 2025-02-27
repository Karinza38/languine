#!/usr/bin/env node

import "./envs.js";
import { isCancel, select } from "@clack/prompts";
import chalk from "chalk";
import dedent from "dedent";
import { clean } from "./commands/clean.js";
import { diff } from "./commands/diff.js";
import { extract } from "./commands/extract.js";
import { init } from "./commands/init.js";
import { instructions } from "./commands/instructions.js";
import { translate } from "./commands/translate.js";

if (!process.argv[2]) {
  console.log(
    `
    ██╗      █████╗ ███╗   ██╗ ██████╗ ██╗   ██╗██╗███╗   ██╗███████╗
    ██║     ██╔══██╗████╗  ██║██╔════╝ ██║   ██║██║████╗  ██║██╔════╝
    ██║     ███████║██╔██╗ ██║██║  ███╗██║   ██║██║██║██╗ ██║█████╗  
    ██║     ██╔══██║██║╚██╗██║██║   ██║██║   ██║██║██║╚██╗██║██╔══╝  
    ███████╗██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝██║██║ ╚████║███████╗
    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
    `,
  );

  console.log(
    chalk.gray(dedent`
      Translate your application with Languine CLI powered by AI.
      Website: ${chalk.bold("https://languine.ai")}
    `),
  );

  console.log();
}

// Parse command line arguments
const command =
  process.argv[2] ||
  (await select({
    message: "What would you like to do?",
    options: [
      { value: "init", label: "Initialize a new Languine configuration" },
      { value: "translate", label: "Translate to target languages" },
      { value: "add", label: "Add a new language" },
      { value: "instructions", label: "Add custom translation instructions" },
      { value: "extract", label: "Extract translation keys from source files" },
      { value: "diff", label: "Check for changes in source locale file" },
      { value: "clean", label: "Clean unused translations" },
      { value: "available", label: "Available commands" },
    ],
  }));

if (isCancel(command)) {
  process.exit(0);
}

const targetLocale = process.argv[3];
const preset = process.argv.includes("--preset")
  ? process.argv[process.argv.indexOf("--preset") + 1]
  : undefined;
const force = process.argv.includes("--force") || process.argv.includes("-f");
if (command === "init") {
  await init(preset);
} else if (command === "translate") {
  await translate(targetLocale, force);
} else if (command === "instructions") {
  await instructions();
} else if (command === "extract") {
  const update =
    process.argv.includes("--update") || process.argv.includes("-u");
  await extract(update);
} else if (command === "diff") {
  await diff();
} else if (command === "clean") {
  await clean();
} else if (command === "available") {
  console.log(dedent`
    ${chalk.cyan("init")}          Initialize a new Languine configuration
    ${chalk.cyan("init")} ${chalk.gray("--preset expo")}    Initialize with Expo preset
    ${chalk.cyan("translate")}     Translate to all target locales
    ${chalk.cyan("translate")} ${chalk.gray("<locale>")}    Translate to a specific locale
    ${chalk.cyan("translate")} ${chalk.gray("--force")}     Force translate all keys
    ${chalk.cyan("instructions")}  Add custom translation instructions
    ${chalk.cyan("extract")}       Extract translation keys from source files
    ${chalk.cyan("extract")} ${chalk.gray("-u, --update")}  Update source locale file with new keys
    ${chalk.cyan("diff")}          Check for changes in source locale file
    ${chalk.cyan("clean")}         Clean unused translations
    ${chalk.cyan("available")}     Show available commands
    Run ${chalk.cyan("languine <command>")} to execute a command
  `);
}
