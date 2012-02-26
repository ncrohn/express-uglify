/**
 * Middleware
 *
 * MIT License copyright (c) 2012 Nick Crohn
 *
 */

var connect = require("connect");

module.exports = function(options) {

  var uglify = require("uglify-js"),
      fsys = require("../lib/filesystem.js"),
      url = require("url"),
      src,
      maxAge = options.maxAge || 86400000; // default to 1 day

  if(options.hasOwnProperty("src")) {
    src = options.src;
  } else {
    throw new Error("ExpressUglify middleware requires a 'src' directory");
  }

  return function(req, res, next) {
    var path = url.parse(req.url).pathname;
    if(path.match(/\.js$/) && !path.match(/min/)) {
      fsys.getFile(src+path,
        function(data, isCached) {

          if(data === null) {
            console.log('"GET', path, '" 404');
            res.send("file not found", 404);
          } else {
            if(!isCached) {
              var ast;
              try {
                ast = uglify.parser.parse(data, true);
                ast = uglify.uglify.ast_mangle(ast);
                ast = uglify.uglify.ast_squeeze(ast);
                ast = uglify.uglify.gen_code(ast);
              } catch (x) {
                console.error("\r\nERROR: ", path, x);
              }

              if(ast) {
                // Cache the file so we don't have to do it again.
                fsys.writeFile(src+path, ast,
                  function() {
                    console.log("Cached uglified: "+path);
                  });
                console.log('"GET', path, '" 200 - Minified');
                res.send(ast, {"Content-Type": "application/javascript"}, 200);
              } else {
                console.log('"GET', path, '" 200 - Failed to Minify');
                res.contentType('js');
                res.send(data, 200);
              }

            } else {
              console.log('"GET', path, '" 200 - Cached');
              res.setHeader('Expires', new Date(Date.now() + maxAge).toUTCString());
              res.setHeader('Cache-Control', 'public, max-age=' + (maxAge / 1000));
              res.contentType("js");
              res.send(data, 200);
            }
          }

        });
    } else {
      next();
    }

  };

};