var falafel = require('falafel');
module.exports = replace;

var defaultRepls = [
    {
        replacement: 'require(%s)',
        value: function (node) {
            return node.arguments[0].value;
        },
        check: function (node) {
            var c = node.callee;
            return c
                && node.type === 'CallExpression'
                && c.type === 'Identifier'
                && c.name === 'require'
                && node.arguments[0]
                && node.arguments[0].type === 'Literal'
            ;
        }
    }
];

function replace (src, deps, customRepls) {
    var repls = defaultRepls.concat(customRepls || []);
    var opts = {
        ecmaVersion: 8,
        allowReturnOutsideFunction: true
    };
    return falafel(src, opts, function (node) {
        repls.forEach(function (repl) {
            if (repl.check(node)) {
                var value = repl.value(node);
                if (has(deps, value) && deps[value]) {
                    node.update(repl.replacement.replace(/%s/, JSON.stringify(deps[value])));
                }
            }
        });
    }).toString();
}

function has (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
