var path = require("path");
var rootPath = path.normalize(__dirname + "/..");
var imgPath = path.join(rootPath, "public", "img");
var env = process.env.NODE_ENV || "development";

var config = {
    development: {
        root: rootPath,
        img: imgPath,
        app: {
            name: "gallery"
        },
        port: 3000,
    },

    production: {
        root: rootPath,
        img: imgPath,
        app: {
            name: "gallery"
        },
        port: 3000,
    }
};

module.exports = config[env];
