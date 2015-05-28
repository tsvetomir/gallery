var config = require('../../config/config');
var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();
module.exports = function (app) {
  app.use('/', router);
};

function unauthorized() {
    var err = new Error("401 Unauthorized");
    err.status = 401;

    return err;
}

router.param('id', function(req, res, next, id) {
    var match = id.match(/[a-z0-9]{8}/i);
    if (match) {
        var root = match[0];
        var rootPath = path.join(config.img, match[0]);
        fs.readdir(rootPath, function(err, files) {
            if (err) {
                next(unauthorized());
            } else {
                req.files = files.filter(function(name) {
                    return path.extname(name).toLowerCase() in { ".jpeg": true, ".jpg": true };
                }).map(function(name) {
                    return {
                        name: name,
                        thumb: name.replace(path.extname(name), "_thumb.jpg"),
                        root: root
                    };
                });

                next();
            }
        });
    } else {
        next(unauthorized());
    }
});

router.get('/', function (req, res, next) {
    next(unauthorized());
});

router.get('/:id', function (req, res, next) {
    res.render('index', {
        title: 'Gallery',
        files: req.files
    });
});
