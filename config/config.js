var path = require("path");
var root = path.normalize(__dirname + "/..");
var env = process.env.NODE_ENV || "development";

var config = {
    development: {
        root: root,
        app: {
            name: "gallery"
        },
        port: 3000,

        baseUrl: "/img",
        basePath: path.join(root, "public", "img")
    },

    production: {
        root: root,
        app: {
            name: "gallery"
        },
        port: 80,

        baseUrl: "/gallery-static",
        basePath: "/usr/local/www/gallery-static"
    }
};

module.exports = config[env];
