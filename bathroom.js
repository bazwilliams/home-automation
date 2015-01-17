var http = require('http');
var responseParsers = require('./responseparsers.js');
var config = require('./config.js');
var currentRequest;

function toggleStandbyOrRadio(callback) {
    if (currentRequest) {
        console.log('Aborting previous request');
        currentRequest.abort();
    }
    var options = {
        hostname: config.hostname,
        port: config.port,
        path: config.uriRoot + 'toggle-standby',
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    };
    currentRequest = http.request(options, function statusChecker(res) {
        if (res.statusCode !== 200) {
            callback(new Error(res.statusCode));
        } else {
            responseParsers.json(function (err, results) {
                if (err) {
                    callback(err);
                } else {
                    if (results.standbyState === 0) {
                        play()(callback);
                    } else {
                        callback();
                    }
                }
            })(res);
        }
    });
    currentRequest.on('error', callback);
    currentRequest.end();
}

function play(playlistName) {
    return function setupPlay(callback) {
        if (currentRequest) {
            console.log('Aborting previous request');
            currentRequest.abort();
        }
        console.log('Preparing ' + playlistName || "");
        var buffer = new Buffer(JSON.stringify({ playlistName: playlistName }));
        var options = {
            hostname: config.hostname,
            port: config.port,
            path: config.uriRoot + 'play',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-length': buffer.length
            }
        };
        currentRequest = http.request(options, function statusChecker(res) { 
            if (res.statusCode !== 200) {
                callback(new Error(res.statusCode));
            } else {
                callback(); 
            }
        });
        currentRequest.on('error', callback);
        currentRequest.end(buffer);
    }
}

function volumeUp(callback) {
    if (currentRequest) {
        console.log('Aborting previous request');
        currentRequest.abort();
    }
    console.log('Volume Up');
    var options = {
        hostname: config.hostname,
        port: config.port,
        path: config.uriRoot + 'volume-up',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    currentRequest = http.request(options, function statusChecker(res) { 
        if (res.statusCode !== 200) {
            callback(new Error(res.statusCode));
        } else {
            callback(); 
        }
    });
    currentRequest.on('error', callback);
    currentRequest.end();
}

function volumeDown(callback) {
    if (currentRequest) {
        console.log('Aborting previous request');
        currentRequest.abort();
    }
    console.log('Volume Down');
    var options = {
        hostname: config.hostname,
        port: config.port,
        path: config.uriRoot + 'volume-down',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    currentRequest = http.request(options, function statusChecker(res) { 
        if (res.statusCode !== 200) {
            callback(new Error(res.statusCode));
        } else {
            callback(); 
        }
    });
    currentRequest.on('error', callback);
    currentRequest.end();
}

exports.actions = {
    'GroupOff': toggleStandbyOrRadio,
    'Mood1': play(config.playlist1),
    'Mood2': play(config.playlist2),
    'Mood3': play(config.playlist3),
    'Off': volumeDown,
    'On': volumeUp
}