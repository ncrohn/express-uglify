/**
 * Middleware
 *
 * MIT License copyright (c) 2012 Nick Crohn
 *
 */

var winston = require('winston');

module.exports = function(options) {

  var uglify = require("uglify-js"),
      fsys = require("../lib/filesystem.js"),
      url = require("url"),
      src, logLevel = options.logLevel,
      logger = options.logger,
      maxAge = options.maxAge || 86400000; // default to 1 day

  if(!logger) {
    winston.loggers.add('express-uglify', {
                          console: {
                            level: logLevel || 'info',
                            colorize: true
                          }
                        });

    logger = winston.loggers.get('express-uglify');
    logger.setLevels(winston.config.syslog.levels);
  }

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

          if(!data) {
            logger.log('info', '"GET ' + path + '" 404');
            res.end("file not found", 404);
          } else {
            if(!isCached) {
              var ast;
              try {
                ast = uglify.parser.parse(data, true);
                ast = uglify.uglify.ast_mangle(ast);
                ast = uglify.uglify.ast_squeeze(ast);
                ast = uglify.uglify.gen_code(ast);
              } catch (x) {
                logger.log('error', path + ' ' + x);
              }

              if(ast) {
                // Cache the file so we don't have to do it again.
                fsys.writeFile(src+path, ast,
                  function() {
                    logger.log('debug', 'Cached uglified: '+path);
                  });
                logger.log('info', '"GET ' + path + '" 200 - Minified');
                res.setHeader('Content-Type', 'text/javascript');
                res.send(200, ast);
              } else {
                logger.log('warning', '"GET ' + path + '" 200 - Failed to Minify');
                res.setHeader('Content-Type', 'text/javascript');
                res.send(200, data);
              }

            } else {
              logger.log('info', '"GET ' + path + '" 200 - Cached');
              res.setHeader('Expires', new Date(Date.now() + maxAge).toUTCString());
              res.setHeader('Cache-Control', 'public, max-age=' + (maxAge / 1000));
              res.setHeader('Content-Type', 'text/javascript');
              res.send(200, data);
            }
          }

        });
    } else {
      next();
    }

  };

};
