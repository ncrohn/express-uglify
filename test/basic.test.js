var assert = require("assert"),
    expressUglify = require('../lib/express-uglify');

module.exports = {
  'Validity': function() {
    console.log("Asserting 1 equals 1");
    assert.eql(1, 1);
  }
};