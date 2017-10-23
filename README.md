# greeklish-file-replace
[![npm package version](https://img.shields.io/npm/v/greeklish-file-replace.svg?style=flat-square)](https://www.npmjs.com/package/greeklish-file-replace) [![Travis build status](https://img.shields.io/travis/kodie/greeklish-file-replace.svg?style=flat-square)](https://travis-ci.org/kodie/greeklish-file-replace) [![npm package downloads](https://img.shields.io/npm/dt/greeklish-file-replace.svg?style=flat-square)](https://www.npmjs.com/package/greeklish-file-replace) [![index.js file size](https://img.shields.io/github/size/kodie/greeklish-file-replace/index.js.svg?style=flat-square)](index.js) [![code style](https://img.shields.io/badge/code_style-standard-yellow.svg?style=flat-square)](https://github.com/standard/standard) [![license](https://img.shields.io/github/license/kodie/greeklish-file-replace.svg?style=flat-square)](LICENSE.md)

Search files for Greek characters and replace them with their [greeklish](https://en.wikipedia.org/wiki/Greeklish) equivalents.

## Installation
```
npm install [-g] [-S] greeklish-file-replace
```

## Usage
### Parameters
#### Files
The files parameter can accept an array of strings or a single comma-separated string that contains file paths or [globs](https://en.wikipedia.org/wiki/Glob_(programming)) for the files you would like to do the replacements in.

Example:
```javascript
// A single file path
files = 'path/to/a/file.txt'

// A single glob
files = 'path/to/files/**/*.txt'

// A comma-separated string with both a file path and a glob
files = 'files/replace.txt,files/**/*.js'

// An array of file paths and globs
files = [
  'replace/files/*.txt',
  'file/to/replace.js',
  'more/**/files/*.*'
]
```

#### Options
The following options are all optional:

```javascript
options = {

  // Character encoding for reading/writing files (defaults to utf-8)
  encoding: 'utf-8',

  // Files to replace (only used if `files` parameter is left blank)
  files: 'replace/**/files/*.txt',

  // Characters to ignore during the replacement process (defaults to blank)
  ignoreChars: ';',

  // Files to ignore (works the exact same as `files` parameter)
  ignoreFiles: '**/node_modules/**/*',

  // The directory to save the changed files to (original files will be overwritten if left blank) (defaults to blank)
  output: 'output_directory',

  // Text to add to the beginning of all replacements (defaults to blank)
  prefix: '_[',

  // Text to add to the end of all replacements (defaults to blank)
  suffix: ']_',

  // Set to true to silent all console output (only used in command line) (defaults to false)
  silent: true,

  // Set to true to find out what files are going to be changed without actually changing them (defaults to false)
  test: true,

  // Set to true to add an index number to the end of all repeated replacements or provide a string to use letters instead of numbers (defaults to false)
  unique: 'abcd'

}
```

### Node
#### Async Promises
```javascript
const greeklishReplace = require('greeklish-file-replace')

greeklishReplace(files, options)
  .then(results => console.log(results))
  .catch(error => console.log(error))
```

#### Async Callbacks
```javascript
const greeklishReplace = require('greeklish-file-replace')

greeklishReplace(files, options, (error, results) => {
  if (!error) {
    console.log(results)
  } else {
    console.log(error)
  }
})
```

#### Sync Function
```javascript
const greeklishReplace = require('greeklish-file-replace')

var results = greeklishReplace.sync(files, options, cb)

console.log(results)
```

##### Sync Callback
The synchronous function accepts a function as an optional third parameter. This function will be called after every replacement with the file name and number of replacements made passed as parameters.

Example:
```javascript
var results = greeklishReplace.sync(files, options, (file, changes) => {
  if (changes && !options.silent) {
    console.log('Made ' + changes + ' changes in ' + file)
  }
})
```

### Command Line
```
greeklish-file-replace files/to/replace/*.txt
  [--files=files/to/replace/**/*.txt]
  [--ignoreChars=";"]
  [--ignoreFiles=files/to/ignore/**/*]
  [--output=output_directory]
  [--prefix="_["]
  [--suffix="]_"]
  [--silent]
  [--test]
  [--unique="abcd"]
```

*Note: When using the `files` parameter in the command line, your system will take care of expanding your single star globs for us, however it probably won't expand double stars. To get around this, you can use the `files` option instead (eg. `greeklish-files-replace --files=replace/**/*.*`).*

## License
MIT. See the [License file](LICENSE.md) for more info.
