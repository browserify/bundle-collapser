var unpack = require('browser-unpack');
var pack = require('browser-pack');
var replace = require('./lib/replace.js');

module.exports = function (src, opts) {
    var rows = unpack(src);
    var p = pack({ raw: true });
    rows.forEach(function (row) {
        row.source = replace(row.source, row.deps, opts && opts.custom);
        row.deps = {};
        p.write(row);
    });
    p.end();
    return p;
};
