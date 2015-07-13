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
    var match = id.match(/[A-Z0-9-_]*/i);
    if (match) {
        var galleryId = match[0];
        var galleryPath = path.join(config.basePath, match[0]);
        fs.readdir(galleryPath, function(err, files) {
            if (err) {
                next(unauthorized());
            } else {
                req.galleryId = galleryId;
                req.files = files.filter(function(name) {
                    var jpeg = path.extname(name).toLowerCase() in { ".jpeg": true, ".jpg": true };
                    var responsive = name.match(/-\d+px\./);
                    return jpeg && !responsive;
                }).map(function(name) {
                    return {
                        basename: path.basename(name, path.extname(name)),
                        name: name
                    };
                });

                fs.readFile(
                    path.join(galleryPath, 'responsive.json'),
                    { encoding: 'utf8' },
                    function(err, data) {
                        if (!err) {
                            var config = JSON.parse(data);
                            req.responsive = config.enabled;
                            req.resolutions = config.resolutions;
                        }

                        next();
                    }
                );
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
        files: req.files,
        responsive: req.responsive,
        resolutions: req.resolutions,
        rootUrl: config.rootUrl,
        galleryUrl: config.baseUrl + "/" + req.galleryId
    });
});

