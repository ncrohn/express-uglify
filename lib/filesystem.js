

/**
 * File System
 */

var fileSystem = module.exports,
    fs = require("fs"),
    path = require("path"),
    cachePath = "/./.cache",
    extension = ".ugly";

/*
 * Retrieve a file in a non-blocking fashion
 */

fileSystem.getFile = function(filePath, callback) {
  //First we need to see if the cache version exists

  var base = path.basename(filePath),
      dir = path.dirname(filePath),
      cacheDir = path.normalize(dir+cachePath)+"/",
      cacheFile = cacheDir+base.replace(".js", extension+".js");

  function getCachedFile() {
    fs.readFile(cacheFile, "utf-8",
      function(err, data) {
        if(err) throw err;
        callback(data, true);
      });
  }

  function getOriginalFile() {
    fs.readFile(filePath, "utf-8",
      function(err, data) {
        if(err) throw err;
        callback(data, false);
      });
  }

  path.exists(cacheDir,
    function(dirExists) {
      if(dirExists) {

        path.exists(cacheFile,
          function(fileExists) {
            if(fileExists) {
              var cst = fs.statSync(cacheFile),
                  ost = fs.statSync(filePath);

              // Compare modified times if the original file is newer than the cached file rebuild
              if(ost.mtime > cst.mtime) {
                // return the original file
                getOriginalFile();
              } else {
                // return the cached file
                getCachedFile();
              }

            } else {
              // return the original file
              getOriginalFile();
            }
          });

      } else {
        try {
          fs.mkdirSync(cacheDir, 0755);
        } catch (x) {
          //console.error("ERROR:", x);
        }
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