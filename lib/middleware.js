

/**
 * Middleware
 *
 **/

module.exports = function(options) {





  return function(req, res, next) {
    console.log("*** middleware ***");
    console.log(req.url);
  };

};