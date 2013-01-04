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

"use strict";

var jsoncopy = require('../jsonutil.js');

var testThing1,
    testThing2 = null,
    testThing3 = "A string",
    testThing4 = 42,
    testThing5 = [ "one", 2, true ],
    testThing6 = { one: 1, two: "two", three: false },
    testThing7 = [
        { one1: 1, one2: "two", one3: false },
        [ "two1", 22, true ]
    ],
    testThing8 = {
        one: { one1: 1, one2: "two", one3: false },
        two: [ "two1", 22, true ]
    };

exports.shallowCopyTests = {

    testSimpleTypes: function (test) {
        test.strictEqual(jsoncopy.shallowCopy(testThing1), undefined);
        test.strictEqual(jsoncopy.shallowCopy(testThing2), null);
        test.strictEqual(jsoncopy.shallowCopy(testThing3), testThing3);
        test.strictEqual(jsoncopy.shallowCopy(testThing4), testThing4);
        test.done();
    },

    testSimpleArray: function (test) {
        var actual = jsoncopy.shallowCopy(testThing5),
            i;

        test.ok(Array.isArray(actual));
        test.notEqual(actual, testThing5);
        test.strictEqual(actual.length, testThing5.length);
        for (i = 0; i < actual.length; i += 1) {
            test.strictEqual(actual[i], testThing5[i]);
        }
        test.done();
    },

    testSimpleObject: function (test) {
        var actual = jsoncopy.shallowCopy(testThing6);

        test.equal(typeof actual, 'object');
        test.ok(!Array.isArray(actual));
        test.notEqual(actual, testThing6);
        test.strictEqual(Object.keys(actual).length, Object.keys(testThing6).length);
        Object.keys(actual).forEach(function (key) {
            test.strictEqual(actual[key], testThing6[key]);
        });
        test.done();
    },

    testComplexArray: function (test) {
        var actual = jsoncopy.shallowCopy(testThing7);

        test.ok(Array.isArray(actual));
        test.notEqual(actual, testThing7);
        test.strictEqual(actual.length, testThing7.length);
        test.strictEqual(actual[0], testThing7[0]);
        test.strictEqual(actual[1], testThing7[1]);
        test.done();
    },

    testComplexObject: function (test) {
        var actual = jsoncopy.shallowCopy(testThing8);

        test.equal(typeof actual, 'object');
        test.ok(!Array.isArray(actual));
        test.notEqual(actual, testThing8);
        test.strictEqual(Object.keys(actual).length, Object.keys(testThing8).length);
        test.strictEqual(actual.one, testThing8.one);
        test.strictEqual(actual.two, testThing8.two);
        test.done();
    }
};

exports.deepCopyTests = {

    testSimpleTypes: function (test) {
        test.strictEqual(jsoncopy.deepCopy(testThing1), undefined);
        test.strictEqual(jsoncopy.deepCopy(testThing2), null);
        test.strictEqual(jsoncopy.deepCopy(testThing3), testThing3);
        test.strictEqual(jsoncopy.deepCopy(testThing4), testThing4);
        test.done();
    },

    testSimpleArray: function (test) {
        var actual = jsoncopy.deepCopy(testThing5),
            i;

        test.ok(Array.isArray(actual));
        test.notEqual(actual, testThing5);
        test.strictEqual(actual.length, testThing5.length);
        for (i = 0; i < actual.length; i += 1) {
            test.strictEqual(actual[i], testThing5[i]);
        }
        test.done();
    },

    testSimpleObject: function (test) {
        var actual = jsoncopy.deepCopy(testThing6);

        test.equal(typeof actual, 'object');
        test.ok(!Array.isArray(actual));
        test.notEqual(actual, testThing6);
        test.strictEqual(Object.keys(actual).length, Object.keys(testThing6).length);
        Object.keys(actual).forEach(function (key) {
            test.strictEqual(actual[key], testThing6[key]);
        });
        test.done();
    },

    testComplexArray: function (test) {
        var actual = jsoncopy.deepCopy(testThing7),
            i;

        test.ok(Array.isArray(actual));
        test.notEqual(actual, testThing7);
        test.strictEqual(actual.length, testThing7.length);
        test.notStrictEqual(actual[0], testThing7[0]);
        Object.keys(actual[0]).forEach(function (key) {
            test.strictEqual(actual[0][key], testThing7[0][key]);
        });
        test.notStrictEqual(actual[1], testThing7[1]);
        for (i = 0; i < actual[1].length; i += 1) {
            test.strictEqual(actual[1][i], testThing7[1][i]);
        }
        test.done();
    },

    testComplexObject: function (test) {
        var actual = jsoncopy.deepCopy(testThing8),
            i;

        test.equal(typeof actual, 'object');
        test.ok(!Array.isArray(actual));
        test.notEqual(testThing8, actual);
        test.strictEqual(Object.keys(actual).length, Object.keys(testThing8).length);
        test.notStrictEqual(actual.one, testThing8.one);
        Object.keys(actual.one).forEach(function (key) {
            test.strictEqual(actual.one[key], testThing8.one[key]);
        });
        test.notStrictEqual(actual.two, testThing8.two);
        for (i = 0; i < actual.two.length; i += 1) {
            test.strictEqual(actual.two[i], testThing8.two[i]);
        }
        test.done();
    }
};

exports.parameterizedCopyTests = {

    testSimpleTypes: function (test) {
        test.strictEqual(jsoncopy.copy(testThing1, false), undefined);
        test.strictEqual(jsoncopy.copy(testThing2, false), null);
        test.strictEqual(jsoncopy.copy(testThing3, false), testThing3);
        test.strictEqual(jsoncopy.copy(testThing4, false), testThing4);

        test.strictEqual(jsoncopy.copy(testThing1, true), undefined);
        test.strictEqual(jsoncopy.copy(testThing2, true), null);
        test.strictEqual(jsoncopy.copy(testThing3, true), testThing3);
        test.strictEqual(jsoncopy.copy(testThing4, true), testThing4);

        test.done();
    }
};
