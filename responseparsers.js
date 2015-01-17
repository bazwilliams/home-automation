exports.json = function (callback) {
    return function jsonHttpResponse(res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            callback(null, JSON.parse(body));
        });
    };
};