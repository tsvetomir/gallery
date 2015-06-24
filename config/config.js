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

        rootUrl: "",
        baseUrl: "/img",
        basePath: path.join(root, "public", "img")
    },

    production: {
        root: root,
        app: {
            name: "gallery"
        },
        port: 3000,

        rootUrl: "/gallery",
        baseUrl: "/gallery-static",
        basePath: "/gallery"
    }
};

module.exports = config[env];
