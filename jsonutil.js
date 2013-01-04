/*
 Copyrights for code authored by Yahoo! Inc. is licensed under the following
 terms:

 MIT License

 Copyright (c) 2011-2012 Yahoo! Inc. All Rights Reserved.

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

/*
 * Convenience functions for copying JSON-compliant objects, and reading and
 * writing JSON files. Hides the messy bits like dealing with exceptions,
 * encodings, etc.
 */

"use strict";

var fs = require('fs');

/*
 * Read a JSON file and parse it, calling the callback with the resulting object
 * or an error.
 */
function readFile(file, cb) {
    fs.readFile(file, "utf8", function (err, json) {
        if (err) {
            cb(err);
            return;
        }

        var data;

        try {
            data = JSON.parse(json); // May throw SyntaxError
        } catch (e) {
            cb(e);
            return;
        }

        cb(null, data);
    });
}

/*
 * Read a JSON file and parse it, calling the callback with the resulting object
 * or an error. A synchronous version of readFile.
 */
function readFileSync(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

/*
 * Write a JSON file with the specified data. Serializing the data will fail
 * if the data contains a cyclic structure.
 */
function writeFile(file, data, indent, cb) {
    if (typeof cb !== 'function') {
        cb = indent;
        indent = 0;
    }

    var json;

    try {
        json = JSON.stringify(data, null, indent); // May throw TypeError
    } catch (e) {
        cb(e);
        return;
    }

    fs.writeFile(file, json, "utf8", cb);
}

/*
 * Write a JSON file with the specified data. Serializing the data will fail
 * if the data contains a cyclic structure. A synchronous version of writeFile.
 */
function writeFileSync(file, data, indent) {
    if (typeof indent !== 'number') {
        indent = 0;
    }
    fs.writeFileSync(file, JSON.stringify(data, null, indent), "utf8");
}

/*
 * Make a deep copy of the supplied object. This function reliably copies only
 * what is valid for a JSON object, array, or other element.
 */
var deepCopy = function (o) {
    var newObj;

    if (!o || typeof o !== 'object') {
        return o;
    }
    if (Array.isArray(o)) {
        return o.map(function (it) {
            return deepCopy(it);
        });
    }
    newObj = {};
    Object.keys(o).forEach(function (prop) {
        newObj[prop] = deepCopy(o[prop]);
    });
    return newObj;
};

/*
 * Make a shallow (i.e. top level only) copy of the supplied object. This
 * function reliably copies only what is valid for a JSON object, array, or
 * other element.
 */
var shallowCopy = function (o) {
    var newObj;

    if (!o || typeof o !== 'object') {
        return o;
    }
    if (Array.isArray(o)) {
        return o.slice(0);
    }
    newObj = {};
    Object.keys(o).forEach(function (prop) {
        newObj[prop] = o[prop];
    });
    return newObj;
};

/*
 * Make a copy of the supplied object, either shallow or deep, according to the
 * second argument. This function reliably copies only what is valid for a JSON
 * object, array, or other element.
 */
var copy = function (o, shallow) {
    var copyfn = shallow ? shallowCopy : deepCopy;

    return copyfn(o);
};

// Exported functions
exports.readFile = readFile;
exports.readFileSync = readFileSync;
exports.writeFile = writeFile;
exports.writeFileSync = writeFileSync;
exports.deepCopy = deepCopy;
exports.shallowCopy = shallowCopy;
exports.copy = copy;
