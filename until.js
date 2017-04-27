
var crypto = require('crypto');
var getSha1 = exports.getSha1 = function(str) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    var res = sha1.digest('hex');
    return res;
}

exports.comparePassword = function(p1,p2) {
    return getSha1(p1) === p2;
}
