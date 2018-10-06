"use strict";

const {exitSucces, exitFail, readCommandProcess} = require(`./src/utils`);

const emptyCommand = require(`./src/empty`);
const errorCommand = require(`./src/error`);

const commands = {
  "--author": require(`./src/author`),
  "--license": require(`./src/license`),
  "--description": require(`./src/description`),
  "--version": require(`./src/version`),
  "--help": require(`./src/help`)
};

const {"--help": help} = commands;
help.execute = help.execute.bind(help, commands);

if (process.argv.length === 2) {
  emptyCommand.execute();
  exitSucces();
}

if (readCommandProcess()) {
  try {
    commands[readCommandProcess()].execute();
    exitSucces();
  } catch (err) {
    errorCommand.execute(readCommandProcess());
    exitFail();
  }
}
