/**
 * generated by alinw
 */

module.exports = function(grunt) {
    var os = require("os");
    var fs = require("fs");
    var path = require("path");
    var shutils = require("shutils");
    var filesystem = shutils.filesystem;
    var _ = require("underscore");
    var StringUtils = require("underscore.string");
    var chalk = require("chalk");

    var configFile = path.join(__dirname, "dist", "lib", "config", "config.js");

    (function() {
        fs.readdirSync(path.join(__dirname, "src")).forEach(function(file) {
            filesystem.copySync(path.join(__dirname, "src", file), path.join(__dirname, "dist"));
        });
    }());

    grunt.registerMultiTask("cleanDist", "clean dist", function() {
        var self = this;

        var options = self.options({
            paths: [
                path.join(__dirname, "dist")
            ],
            includes: [
                ".js",
                ".css",
                ".png",
                ".gif",
                ".jpg",
                ".jpeg",
                ".swf",
                ".json",
                ".xml"
            ]
        });
        options.paths.forEach(function(p) {
            filesystem.listTreeSync(p).forEach(function(file) {
                var extName = path.extname(file);
                if (!_.contains(options.includes, extName)) {
                    fs.unlinkSync(file);
                }
            });
        });
    });

    var readyTransportFiles = function() {
        var rulers = [
            // js/lib
            {
                path: path.normalize(path.join(__dirname, "dist", "apps")),
                extName: '.js'
            },
            {
                path: path.normalize(path.join(__dirname, "dist", "js")),
                extName: '.handlebars'
            },
            {
                path: path.normalize(path.join(__dirname, "dist", "js")),
                extName: '.tpl'
            },
            {
                path: path.normalize(path.join(__dirname, "dist", "widgets")),
                extName: '.js'
            },
            {
                path: path.normalize(path.join(__dirname, "dist", "widgets")),
                extName: '.handlebars'
            },
            {
                path: path.normalize(path.join(__dirname, "dist", "widgets")),
                extName: '.tpl'
            }
        ];
        var results = [];
        filesystem.listTreeSync(path.join(__dirname, "dist")).forEach(function(file) {
            var extName = path.extname(file);
            rulers.forEach(function(ruler) {
                if (file.indexOf(ruler.path) >= 0 && extName === ruler.extName && !/\.handlebars\.js/.test(file) && !/\.tpl\.js/.test(file)) {
                    results.push({
                        src: file,
                        dest: file
                    });
                }
            });
        });
        return results;
    };

    var getPathsFromConfigFile = function() {
        var config = fs.readFileSync(configFile, "utf-8");
        config = eval(config);
        return config.paths;
    };

    var getAliasFromConfigFile = function() {
        var config = fs.readFileSync(configFile, "utf-8");
        config = eval(config);
        // TODO release?
        return config.alias;
    };

    var getDistAllScript = function() {
        var results = {};
        filesystem.listTreeSync(path.join(__dirname, "dist")).forEach(function(file) {
            var extName = path.extname(file);
            if (extName === ".js") {
                results[file] = file;
            }
        });
        return results;
    };

     var config = {};

    // 对less编译成CSS的配置
    config.less = {
        release: {
            options: {
                paths: []
            },
            files: {
                "src/styles/test.css": "src/styles/test.less"
            }
        }
    };

    config.transport = {
        release: {
            options: {
                debug: false,
                underscore: {
                    id: getAliasFromConfigFile().underscore
                },
                handlebars: {
                    id: getAliasFromConfigFile().handlebars,
                    knownHelpers: [
                        "if",
                        "else",
                        "unless",
                        "each"
                    ]
                },
                paths: [
                    __dirname,
                    path.join(__dirname, "dist")
                ],
                alias: getAliasFromConfigFile(),
                extraName: function(src) {
                    var name = path.relative("", src);
                    if (/^dist/.test(name)) {
                        name = StringUtils.lstrip(name, {source: 'dist'})
                    }
                    if (os.platform() === "win32") {
                        name = StringUtils.lstrip(name, path.sep)
                    }
                    else {
                        name = StringUtils.lstrip(name, {source: path.sep})
                    }
                    return name;
                }
            },
            files: readyTransportFiles()
        }
    };
    config.cleanDist = {
        release: {
            options: {
                paths: [
                    path.join(__dirname, "dist")
                ]
            }
        }
    };
    config.uglify = {
        release: {
            options: {
                beautify: false,
                compress: true
            },
            files: getDistAllScript()
        }
    };

    // watch
    config.watch = {
        release: {
            options: {
            },
            files: ["**/*.less"],
            tasks: ["less"]
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks("grunt-cmd-transport");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", [
        "transport",
        "less",
        "clean"
    ]);

    grunt.registerTask("clean", ["cleanDist"]);

};