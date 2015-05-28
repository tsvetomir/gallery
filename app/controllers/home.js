var config = require('../../config/config');
var express = require('express');
var fs = require('fs');
var sharp = require('sharp');
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
    var match = id.match(/\w{8}/);
    if (match) {
        var root = match[0];
        var rootPath = path.join(config.img, match[0]);
        fs.readdir(rootPath, function(err, files) {
            if (err) {
                next(unauthorized());
            } else {
                req.rootPath = rootPath;
                req.files = files.filter(function(name) {
                    return path.extname(name).toLowerCase() in { ".jpeg": true, ".jpg": true };
                }).map(function(name) {
                    return {
                        name: name,
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

router.param('name', function(req, res, next, name) {
    var match = name.match(/^[\w\-. ]+$/);
    if (match) {
        req.name = match[0];
        req.fileName = path.join(req.rootPath, req.name);
        next();
    } else {
        next(new Error("Not found"));
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

router.get('/:id/:name', function (req, res, next) {
    sharp(req.fileName)
        .resize(1200, null)
        .toBuffer(function(err, buffer, info) {
            if (err) {
                next(err);
            }

            res.send(buffer);
        });
});

router.get('/:id/thumb/:name', function (req, res, next) {
    sharp(req.fileName)
        .resize(100)
        .progressive()
        .toBuffer(function(err, buffer, info) {
            if (err) {
                next(err);
            }

            res.send(buffer);
        });
});
