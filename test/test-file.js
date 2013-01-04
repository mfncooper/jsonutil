/*
 Copyrights for code authored by Yahoo! Inc. is licensed under the following
 terms:

 MIT License

 Copyright (c) 2012 Yahoo! Inc. All Rights Reserved.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.
*/

"use strict";

var fs = require('fs'),
    fsReadFile = fs.readFile,
    fsReadFileSync = fs.readFileSync,
    fsWriteFile = fs.writeFile,
    fsWriteFileSync = fs.writeFileSync,
    jsonfile = require('../jsonutil.js');

function stubReadFile(test, file, err, data) {
    fs.readFile = function (f, enc, cb) {
        test.equal(f, file);
        test.equal(enc, "utf8");
        test.ok(typeof cb === 'function');
        cb(err, data);
    };
}

function stubReadFileSync(test, file, err, data) {
    fs.readFileSync = function (f, enc) {
        test.equal(f, file);
        test.equal(enc, "utf8");
        if (err) {
            throw err;
        }
        return data;
    };
}

function stubWriteFile(test, file, data, err) {
    fs.writeFile = function (f, d, enc, cb) {
        test.equal(f, file);
        test.equal(d, data);
        test.equal(enc, "utf8");
        test.ok(typeof cb === 'function');
        cb(err);
    };
}

function stubWriteFileSync(test, file, data, err) {
    fs.writeFileSync = function (f, d, enc) {
        test.equal(f, file);
        test.equal(d, data);
        test.equal(enc, "utf8");
        if (err) {
            throw err;
        }
    };
}

exports.readTests = {

    setUp: function (callback) {
        callback();
    },

    tearDown: function (callback) {
        fs.readFile = fsReadFile;
        callback();
    },

    testSuccess: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = '{ "key": "value" }';

        stubReadFile(test, test_file, test_error, test_data);
        jsonfile.readFile(test_file, function (err, data) {
            test.ok(!err);
            test.ok(typeof data === 'object');
            test.equal(Object.keys(data).length, 1);
            test.equal(data.key, JSON.parse(test_data).key);
            test.done();
        });
    },

    testFileError: function (test) {
        var test_file = 'test_file.json',
            test_error = new Error("EPERM"),
            test_data = null;

        stubReadFile(test, test_file, test_error, test_data);
        jsonfile.readFile(test_file, function (err) {
            test.ok(err instanceof Error);
            test.equal(err.message, "EPERM");
            test.done();
        });
    },

    testDataError: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = 'not json';

        stubReadFile(test, test_file, test_error, test_data);
        jsonfile.readFile(test_file, function (err) {
            test.ok(err instanceof SyntaxError);
            test.ok(/^Unexpected token/.test(err.message));
            test.done();
        });
    }
};

exports.readSyncTests = {

    setUp: function (callback) {
        callback();
    },

    tearDown: function (callback) {
        fs.readFileSync = fsReadFileSync;
        callback();
    },

    testSuccess: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = '{ "key": "value" }',
            data;

        stubReadFileSync(test, test_file, test_error, test_data);
        data = jsonfile.readFileSync(test_file);
        test.ok(typeof data === 'object');
        test.equal(Object.keys(data).length, 1);
        test.equal(data.key, JSON.parse(test_data).key);
        test.done();
    },

    testFileError: function (test) {
        var test_file = 'test_file.json',
            test_error = new Error("EPERM"),
            test_data = null;

        stubReadFileSync(test, test_file, test_error, test_data);
        test.throws(function () {
            jsonfile.readFileSync(test_file);
        }, "EPERM");
        test.done();
    },

    testDataError: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = 'not json';

        stubReadFileSync(test, test_file, test_error, test_data);
        test.throws(function () {
            jsonfile.readFileSync(test_file);
        }, /^Unexpected token/);
        test.done();
    }
};

exports.writeTests = {

    setUp: function (callback) {
        callback();
    },

    tearDown: function (callback) {
        fs.writeFile = fsWriteFile;
        callback();
    },

    testSuccess: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = { key: "value" },
            test_data_out = JSON.stringify(test_data);

        stubWriteFile(test, test_file, test_data_out, test_error);
        jsonfile.writeFile(test_file, test_data, function (err) {
            test.ok(!err);
            test.done();
        });
    },

    testSuccessIndent: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = { key: "value" },
            test_indent = 2,
            test_data_out = JSON.stringify(test_data, null, test_indent);

        stubWriteFile(test, test_file, test_data_out, test_error);
        jsonfile.writeFile(test_file, test_data, test_indent, function (err) {
            test.ok(!err);
            test.done();
        });
    },

    testFileError: function (test) {
        var test_file = 'test_file.json',
            test_error = new Error("EPERM"),
            test_data = { key: "value" },
            test_data_out = JSON.stringify(test_data);

        stubWriteFile(test, test_file, test_data_out, test_error);
        jsonfile.writeFile(test_file, test_data, function (err) {
            test.ok(err instanceof Error);
            test.equal(err.message, "EPERM");
            test.done();
        });
    },

    testDataError: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = {};

        test_data.loop = test_data;
        stubWriteFile(test, test_file, test_data, test_error);
        jsonfile.writeFile(test_file, test_data, function (err) {
            test.ok(err instanceof TypeError);
            test.equal("Converting circular structure to JSON", err.message);
            test.done();
        });
    }
};

exports.writeSyncTests = {

    setUp: function (callback) {
        callback();
    },

    tearDown: function (callback) {
        fs.writeFileSync = fsWriteFileSync;
        callback();
    },

    testSuccess: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = { key: "value" },
            test_data_out = JSON.stringify(test_data);

        stubWriteFileSync(test, test_file, test_data_out, test_error);
        jsonfile.writeFileSync(test_file, test_data);
        test.done();
    },

    testSuccessIndent: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = { key: "value" },
            test_indent = 2,
            test_data_out = JSON.stringify(test_data, null, test_indent);

        stubWriteFileSync(test, test_file, test_data_out, test_error);
        jsonfile.writeFileSync(test_file, test_data, test_indent);
        test.done();
    },

    testFileError: function (test) {
        var test_file = 'test_file.json',
            test_error = new Error("EPERM"),
            test_data = { key: "value" },
            test_data_out = JSON.stringify(test_data);

        stubWriteFileSync(test, test_file, test_data_out, test_error);
        test.throws(function () {
            jsonfile.writeFileSync(test_file, test_data);
        }, "EPERM");
        test.done();
    },

    testDataError: function (test) {
        var test_file = 'test_file.json',
            test_error = null,
            test_data = {};

        test_data.loop = test_data;
        stubWriteFileSync(test, test_file, test_data, test_error);
        test.throws(function () {
            jsonfile.writeFileSync(test_file, test_data);
        }, "Converting circular structure to JSON");
        test.done();
    }
};
