# jsonutil - Convenience functions for working with JSON

Working with JSON in Node.js is pretty straightforward, but there are a couple
of things that could be a bit more convenient. Examples are copying objects, as
well as reading them from, and writing them to, files. The jsonutil package
addresses just those scenarios with a few handy utility functions.

## Installation

Just use npm:

    npm install jsonutil

## Copying JSON objects

### deepCopy(obj)

Makes a deep copy (a.k.a. clone) of the supplied object. This function reliably
copies only what is valid for a JSON object, array, or other element.

__Arguments__

* _obj_, the object of which a copy is to be made.

### shallowCopy(obj)

Makes a shallow (i.e. top level only) copy of the supplied object. This function
reliably copies only what is valid for a JSON object, array, or other element.

__Arguments__

* _obj_, the object of which a copy is to be made.

### copy(obj, shallow)

Makes a copy of the supplied object, either shallow or deep, according to the
second argument. This function reliably copies only what is valid for a JSON
object, array, or other element.

__Arguments__

* _obj_, the object of which a copy is to be made.
* _shallow_, a boolean indicating whether the copy should be shallow or deep.

## Working with JSON files

### readFile(file, cb)

Reads a JSON file and parses it, calling the callback with the resulting object.

__Arguments__

* _file_, the file from which to read and parse JSON.
* _cb(err, obj)_, a callback function that will be called with either the object
read from the file, or an error.

### readFileSync(file)

A synchronous version of `readFile` (see above) that returns the parsed object
or throws an error.

### writeFile(file, obj, [indent], cb)

Writes a JSON file with the specified data. Serializing the data will fail if
the data contains a cyclic structure.

* _file_, the file to which the object will be written.
* _obj_, the object to be written as JSON.
* _indent_, the indentation level, in spaces, of the JSON output. [Default: no
indentation]
* _cb(err)_, a callback function that will be called with either null on
success, or an error.

### writeFileSync(file, data, [indent])

A synchronous version of `writeFile` (see above) that throws any error.

## License

jsonutil is licensed under the [MIT License](http://github.com/mfncooper/jsonutil/raw/master/LICENSE).
