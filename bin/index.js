#!/usr/bin/env node
const path = require('path');
require('..');

const args = process.argv.slice(2);

if (!args.length)
    console.log('Please provide one or more files to execute.');

for (const arg of args)
    include(path.resolve(
        process.cwd(),
        arg
    ));