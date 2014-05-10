"use strict";

var dns = require('dns');
var url = require('url');
var http = require('http');

var REMOTE_ADDRESS = 'http://www.remoteAddress.net/api/ip';
var ENOM_HOSTNAME = 'dynamic.name-services.com';

var Enom = module.exports = {};

Enom.publicAddress = function(cb) {
	getJson(REMOTE_ADDRESS, function(err, statusCode, json) {
		if (err) return cb(err);
		if (statusCode != 200) {
			return cb(new Error('Error: Server returned status code: ' + statusCode));
		}
		cb(null, json.address);
	});
};

Enom.hasChanged = function(domain, cb) {
	dns.resolve4(domain, function(err, addresses) {
		if (err) return cb(err);
		if (addresses.length < 1)
			return cb(null, false);

		Enom.publicAddress(function(err, pub) {
			if (err) return cb(err);
			return cb(null, (addresses.indexOf(pub) == -1));
		});
	});
};

Enom.updateRecord = function(opt, cb) {
	if (!opt || !opt.domain || !opt.password) return cb(new Error('Domain and password are mandatory'));
	opt.hostname = opt.hostname || '*';

	var options = {
		protocol: 'http',
		hostname: ENOM_HOSTNAME,
		pathname: '/interface.asp',
		query: {
			'Command': 'SetDNSHost',
			'Zone': opt.domain,
			'DomainPassword': opt.password,
			'HostName': opt.hostname
		}
	};
	if (opt.address) {
		options.query['Address'] = opt.address;
	}

	var uri = url.format(options);
	console.log(uri);
	http.get(uri, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var response = parseUpdateResponse(body);
			if (response.ErrCount > 0) {
				return cb(new Error('Failed to update record: ' + response.Err1));
			}
			cb(null, response);
		});
	}).on('error', function(err) {
		cb(err);
	});
};

function getJson(uri, cb) {
	http.get(uri, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var json = JSON.parse(body);
			cb(null, res.statusCode, json);
		});
	}).on('error', cb);
}

function parseUpdateResponse(response) {
	var lines = response.split('\r\n');
	var obj = {};

	for (var i in lines) {
		var line = lines[i];
		if (line.indexOf(';') === 0)
			continue;
		var pair = line.split('=');
		if (pair.length == 2) {
			if (!isNaN(pair[1]))
				pair[1] = +pair[1];
			obj[pair[0]] = pair[1];
		}
	}
	return obj;
};
