var collapse = require('../');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/bundle.js', 'utf8');
console.log(collapse(src));
