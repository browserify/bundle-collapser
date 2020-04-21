var collapse = require('../');
var concat = require('concat-stream');
var test = require('tape');
var fs = require('fs');
var vm = require('vm');
var unpack = require('browser-unpack');
var expected = require('./custom/expected.json');

var defs = [
    {
        replacement: '%s',
        value: function (node) {
            return node.value;
        },
        check: function (node) {
            var c = node;
            var parent = c.parent && c.parent.callee;
            return c
                && c.type === 'Literal'
                && parent
                && parent.object
                && parent.object.name === 'env'
                && parent.object.type === 'Identifier'
                && parent.property
                && parent.property.name === 'getTemplate'
                && parent.property.type === 'Identifier'
            ;
        }
    }
];

test('custom', function (t) {
    t.plan(1 + expected.length);

    var src = fs.readFileSync(__dirname + '/custom/bundle.js', 'utf8');
    collapse(src, { custom: defs }).pipe(concat(function (body) {
        vm.runInNewContext(body, { console: { log: log } });
        function log (msg) { t.equal(msg, 300) }

        var rows = unpack(body.toString('utf8'));
        rows.forEach(function (row) {
            t.deepEqual(trim(row), trim(expected.shift()));
        });
    }));
});

function trim (a) {
  a.source = a.source.trim();
  return a;
}
