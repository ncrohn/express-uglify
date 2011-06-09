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
        url: '/no-dir/test.js', timeout: 500
      }, function(res) {
        console.log("Asserting missing file returns a 404");
        assert.ok(res.statusCode === 404);
      });
  }
};