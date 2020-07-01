#!/usr/bin/env node
const execute = require('./execute');

// load runtime
require('..');

// execute scripts
const args = process.argv.slice(2);
execute(...args);