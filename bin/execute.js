const path = require('path');

function execute(...args) {
    if (!args.length)
    console.log('Please provide one or more files to execute.');

    for (const arg of args)
        window.include(path.resolve(
            process.cwd(),
            arg
        ));
}

module.exports = execute;