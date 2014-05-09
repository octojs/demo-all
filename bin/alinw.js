#!/usr/bin/env node
/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 2014/05/08
 * Time: 22:57
 *
 */

var prompt = require('prompt');
var path = require("path");
var fs = require("fs");
var _ = require("underscore");
var shutils = require("shutils");
var filesystem = shutils.filesystem;

var schema = {
    properties: {
        // 项目名称
        name: {
            message: "Project name",
            required: true
        },
        // module family
        family: {
            message: "Your CMD family",
            required: true
        },
        author: {
            message: "Author",
            required: true
        },
        version: {
            pattern: /\d+\.\d+.\d+/,
            message: "version",
            required: true
        },
        description: {
            message: "Description",
            required: false
        },
        repository: {
            message: "Project git repository",
            required: false
        },
        homepage: {
            message: "Project homepage",
            required: false
        }
    }
};

console.log('This task will create one or more files in the current directory, based on the environment and the answers to a few questions. Note that answering "?" to any question will show question-specific help and answering "none" to most questions will leave its value blank.');
console.log("");
console.log("Please answer the following:");
prompt.message = "[?] ".rainbow;
prompt.delimiter = "";
prompt.start();

prompt.get(schema, function(error, result) {
    var defaultValue = {
        name: "",
        version: "",
        description: "",
        homepage: "",
        repository: {
            type: "git",
            url: ""
        },
        keywords: "",
        author: "",
        license: "MIT",
        bugs: {},
        dependencies: {
            "grunt": "^0.4.4",
            "grunt-contrib-uglify": "^0.4.0",
            "grunt-contrib-less": "^0.11.0",
            "shutils": "0.0.0",
            "underscore": "^1.6.0",
            "underscore.string": "^2.3.3",
            "chalk": "^0.4.0",
            "makeerror": "^1.0.8",
            "grunt-contrib-cssmin": "^0.9.0",
            "grunt-contrib-watch": "^0.6.1",
            "grunt-cmd-transport": "git://github.com/magicsky/grunt-cmd-transport"
        }
    };
    if (result.repository) {
        result.repository = {
            type: 'git',
            url: result.repository
        };
    }
    _.extend(defaultValue, result);
    fs.writeFileSync(path.join(process.cwd(), "package.json"),
        JSON.stringify(defaultValue, null, 4),
        "utf-8"
    );

    filesystem.copySync(path.join(__dirname, "grunt-file.js"), path.join(process.cwd(), "Gruntfile.js"));

    _.each(["src", "dist"], function(name) {
        filesystem.makedirsSync(path.join(process.cwd(), name));
    });
    _.each(["apps", "lib", "widgets", "styles", "data", "pages"], function(name) {
        filesystem.makedirsSync(path.join(process.cwd(), "src", name));
    });
    _.each(["config"], function(name) {
        filesystem.makedirsSync(path.join(process.cwd(), "src", "lib", name));
    });
    filesystem.copySync(path.join(__dirname, "config.js"), path.join(process.cwd(), "src", "lib", "config", "config.js"));

    filesystem.copySync(path.join(__dirname, "examples", "demo"), path.join(process.cwd(), "src", "apps"));
    filesystem.copySync(path.join(__dirname, "examples", "test.less"), path.join(process.cwd(), "src", "styles"));
    filesystem.copySync(path.join(__dirname, "examples", "demo.html"), path.join(process.cwd(), "src", "pages"));

});

