#!/usr/bin/env node
"use strict";

var fs = require('fs');
var path = require('path');

var argv_opt = {
	alias: {
		domain: 'd',
		password: 'p',
		hostname: 'h',
		check: 'c',
		force: 'f',
		help: 'h'
	},
	boolean: ['check', 'help']
};
var argv = require('minimist')(process.argv.slice(2), argv_opt);
if (argv.help) {
	quit_help();
}

var enom = require('../index.js');

if (!argv.domain) {
	console.log('Missing domain name');
	quit_help();
}
if (!argv.password && !argv.check) {
	console.log('Missing password');
	quit_help();
}

enom.hasChanged(argv.domain, function(err, changed) {
	if (err) {
		console.log('Error: %s', err.message);
		process.exit(1);
	};

	if (argv.check) {
		console.log('Changed:', changed);
		process.exit(changed ? 1 : 0);
	}

	if (changed || argv.force) {
		console.log("Address changed, updating record");
		enom.updateRecord({
			domain: argv.domain,
			password: argv.password
		}, function(err, res) {
			if (err) {
				console.error(err.message);
			} else {
				console.log('Record updated!');
				console.log('New address: %s', res.IP);
			}
		});
	}
});


function quit_help() {
	var content = fs.readFileSync(path.join(__dirname, 'usage.md'), 'utf8');
	console.log(content);
	process.exit(1);
}
