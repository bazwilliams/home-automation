var http = require('http');
var responseParsers = require('./responseparsers.js');
var config = require('./config.js');
var currentRequest;

function statusChecker(callback) {
    return function responseHandler(res) {
        if (res.statusCode >= 400) {
            callback(new Error(res.statusCode));
        } else {
            callback(); 
        }
    }
}
function post(uriRoot, command, payload, responseHandler) {
    if (currentRequest) {
        currentRequest.abort();
    }
    var buffer = new Buffer(JSON.stringify(payload || {}));
    var options = {
        hostname: config.hostname,
        port: config.port,
        path: uriRoot + command,
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
function toggleStandbyOrRadio(switchConfig, callback) {
    console.log(switchConfig.name + '/toggle standby');
    post(switchConfig.uriRoot, 'toggle-standby', {}, function playRadioIfNotInStandby(res) {
        if (res.statusCode !== 200) {
            callback(new Error(res.statusCode));
        } else {
            responseParsers.json(function (err, results) {
                if (err) {
                    callback(err);
                } else {
                    if (results.standbyState === 0) {
                        play()(switchConfig, callback);
                    } else {
                        callback();
                    }
                }
            })(res);
        }
    }).on('error', callback);
}
function play(playlistId) {
    return function setupPlay(switchConfig, callback) {
	var playlistName = switchConfig[playlistId];
        console.log(switchConfig.name + '/play ' + (playlistName || 'radio'));
        post(switchConfig.uriRoot, 'play', { playlistName: playlistName, shuffle: true }, statusChecker(callback)).on('error', callback);
    }
}
function volumeUp(switchConfig, callback) {
    post(switchConfig.uriRoot, 'volume-up', { increment: 4 }, statusChecker(callback)).on('error', callback);
}
function volumeDown(switchConfig, callback) {
    post(switchConfig.uriRoot, 'volume-down', { decrement: 1 }, statusChecker(callback)).on('error', callback);
}
exports.actions = {
    'GroupOff': toggleStandbyOrRadio,
    'Mood1': play('playlist1'),
    'Mood2': play('playlist2'),
    'Mood3': play('playlist3'),
    'Off': volumeDown,
    'On': volumeUp
}
