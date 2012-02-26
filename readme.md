# Express Uglify JS #

## About ##
This package is designed to provide a middleware solution for on the fly compression of JavaScript files. Code for embedding stays identical so switching between development and production states is as simple as changing the config for express.

### What it does ###
The Express Uglify middleware intercepts JS file calls and runs them through the [UglifyJS](https://github.com/mishoo/UglifyJS) package to compress and cache the files. If the file has been previously cached it just access that file on disk in a .cache directory and serves that file. All cached files are stored as xxxxx.ugly.js where xxxxx is the starting point. i.e. jquery-1.6.2.js -> jquery-1.6.2.ugly.js

## To Do ##
- Use [ConnectJS](http://www.senchalabs.org/connect/) caching API to provide proper headers
- Comprehensive unit tests

## Usage:

    app.use(require('express-uglify').middleware({ src: __dirname + '/public' }));

## MIT LICENSE



