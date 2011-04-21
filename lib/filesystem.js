

/**
 * File System
 *
 **/

var fileSystem = module.exports,
    fs = require("fs"),
    path = require("path"),
    cachePath = "/./.cache";

/*
 * Retrieve a file in a non-blocking fashion
 */
fileSystem.getFile = function(filePath, callback) {
  //First we need to see if the cache version exists

  var base = path.basename(filePath),
      dir = path.dirname(filePath),
      cacheDir = path.normalize(dir+cachePath)+"/",
      cacheFile = cacheDir+base.replace(".js", ".ugly.js");

  function getCachedFile() {
    console.log("getting cached");
    fs.readFile(cacheFile, "utf-8",
      function(err, data) {
        if(err) throw err;
        callback(data, true);
      });
  }

  function getOriginalFile() {
    console.log("getting original");
    fs.readFile(filePath, "utf-8",
      function(err, data) {
        if(err) throw err;
        callback(data, false);
      });
  }

  path.exists(cacheDir,
    function(exists) {
      if(exists) {

        path.exists(cacheFile,
          function(exists) {
            if(exists) {
              // return the cached file
              getCachedFile();
            } else {
              // return the original file
              getOriginalFile();
            }
          });

      } else {
        fs.mkdirSync(cacheDir, 0755);
        getOriginalFile();
      }
    });
};

fileSystem.writeFile = function(filePath, data, callback) {
  var base = path.basename(filePath),
      dir = path.dirname(filePath),
      cacheDir = path.normalize(dir+cachePath)+"/",
      cacheFile = cacheDir+base.replace(".js", ".ugly.js");

  fs.writeFile(cacheFile, data, "utf-8",
    function(err) {
      if(err) throw err;
      callback();
    });
};