const fs = require('fs')
module.exports = async function (req, res, proceed) {
    logfile = 'logs.txt'
    line = '\n######################## Request ####################\n';
    line += req.url + '\n' + req.method;
    line += '\n' + JSON.stringify(req._header);
    line += '\n' + JSON.stringify(req.params);
    fs.appendFile(logfile, line, () => { proceed(); });

    // https://stackoverflow.com/a/19215370
    var oldWrite = res.write,
        oldEnd = res.end;

    var chunks = [];

    res.write = function (chunk) {
        chunks.push(chunk);

        oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk)
            chunks.push(chunk);

        var body = Buffer.concat(chunks).toString('utf8');
        line = '\n######################## Response ####################\n';
        line += res.statusCode + '\n' + res.message;
        line += '\n' + res._header;
        line += '\n' + body;
        fs.appendFile(logfile, line, () => { console.log('logged') });

        oldEnd.apply(res, arguments);
    };
    return;
}