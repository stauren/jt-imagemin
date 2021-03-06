/*jslint node:true */
var through = require('through2'),
  Imagemin = require('imagemin');

module.exports = function (options, info) {
  'use strict';
  return through(function (buffer, encoding, callback) {
    var imagemin = new Imagemin().src(buffer),
      isOldApi = !!imagemin.optimize;

    switch (info.ext) {
    case '.png':
      imagemin.use(Imagemin.optipng({ optimizationLevel : 3 }));
      break;
    case '.gif':
      imagemin.use(Imagemin.gifsicle({ interlaced: true }));
      break;
    case '.jpg':
    case '.jpeg':
      imagemin.use(Imagemin.jpegtran({ progressive: true }));
      break;
    default:
      callback(null, buffer);
      return;
    }

    imagemin[isOldApi ? 'optimize' : 'run'](function (err, files) {
      if (err) {
        console.log(err);
      }
      callback(null, isOldApi ? files.contents : files[0].contents);
    });
  });
};
