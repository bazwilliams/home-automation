var http = require('http');
var responseParsers = require('./responseparsers.js');
var config = require('./config.js');
var currentRequest;

function post(command, payload, responseHandler) {
    if (currentRequest) {
        currentRequest.abort();
    }
    var buffer = new Buffer(JSON.stringify(payload || {}));
    var options = {
        hostname: config.hostname,
        port: config.port,
        path: config.uriRoot + command,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-length': buffer.length
        }
    };
    currentRequest = http.request(options, responseHandler);
    currentRequest.end(buffer);
    return currentRequest;
}

function toggleStandbyOrRadio(callback) {
    post('toggle-standby', {}, function playRadioIfNotInStandby(res) {
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
    }).on('error', callback);
}

function play(playlistName) {
    return function setupPlay(callback) {
        console.log('Preparing ' + playlistName || "");
        post('play', { playlistName: playlistName }, function statusChecker(res) { 
            if (res.statusCode !== 200) {
                callback(new Error(res.statusCode));
            } else {
                callback(); 
            }
        }).on('error', callback);
    }
}

function volumeUp(callback) {
    post('volume-up', {}, function statusChecker(res) { 
        if (res.statusCode !== 200) {
            callback(new Error(res.statusCode));
        } else {
            callback(); 
        }
    }).on('error', callback);
}

function volumeDown(callback) {
    post('volume-down', {}, function statusChecker(res) {
        if (res.statusCode !== 200) {
            callback(new Error(res.statusCode));
        } else {
            callback(); 
        }
    }).on('error', callback);
}

exports.actions = {
    'GroupOff': toggleStandbyOrRadio,
    'Mood1': play(config.playlist1),
    'Mood2': play(config.playlist2),
    'Mood3': play(config.playlist3),
    'Off': volumeDown,
    'On': volumeUp
}