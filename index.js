var unpack = require('browser-unpack');
var pack = require('browser-pack');
var falafel = require('falafel');

module.exports = function (src) {
    var rows = unpack(src);
    var p = pack({ raw: true });
    rows.forEach(function (row) {
        row.source = replace(row.source, row.deps);
        row.deps = {};
        p.write(row);
    });
    p.end();
    return p;
};

function replace (src, deps) {
    return falafel(src, function (node) {
        if (isRequire(node)) {
            var value = node.arguments[0].value;
            if (has(deps, value)) {
                node.update('require(' + deps[value] + ')');
            }
        }
    }).toString();
}

function isRequire (node) {
    var c = node.callee;
    return c
        && node.type === 'CallExpression'
        && c.type === 'Identifier'
        && c.name === 'require'
        && node.arguments[0]
        && node.arguments[0].type === 'Literal'
    ;
}

function has (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
