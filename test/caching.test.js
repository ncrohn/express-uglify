var assert = require("assert"),
    uglyExpress = require('../lib/express-uglify'),
    app    = require("express").createServer();

app.configure(function() {
  app.use(uglyExpress.middleware({ src: __dirname + '/assets'}));
});


module.exports = {
  "Files are being served": function() {
    assert.response(
      app, {
        url: '/test.js', timeout: 500
      }, function(res) {
        console.log("Asserting 'test.js' body is 'var test=function(){var a=\"foo\"}'");
        assert.ok(res.body === 'var test=function(){var a="foo"}', 'Test assert.response() callback');

        console.log(res.headers);
      });
  }
};