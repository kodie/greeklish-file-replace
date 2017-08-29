#!/usr/bin/env node
'use strict'

const argv = require('yargs').argv
const diff = require('diff')
const fs = require('fs-extra')
const glob = require('glob-promise')

const defaults = {
  encoding: 'utf-8',
  files: null,
  ignoreChars: null,
  ignoreFiles: [],
  output: '',
  prefix: '',
  suffix: '',
  silent: false,
  test: false,
  unique: false
}

const map = [
  {find: 'ΓΧ', replace: 'GX'},
  {find: 'γχ', replace: 'gx'},
  {find: 'ΤΘ', replace: 'T8'},
  {find: 'τθ', replace: 't8'},
  {find: '(θη|Θη)', replace: '8h'},
  {find: 'ΘΗ', replace: '8H'},
  {find: 'αυ', replace: 'au'},
  {find: 'Αυ', replace: 'Au'},
  {find: 'ΑΥ', replace: 'AY'},
  {find: 'ευ', replace: 'eu'},
  {find: 'εύ', replace: 'eu'},
  {find: 'εϋ', replace: 'ey'},
  {find: 'εΰ', replace: 'ey'},
  {find: 'Ευ', replace: 'Eu'},
  {find: 'Εύ', replace: 'Eu'},
  {find: 'Εϋ', replace: 'Ey'},
  {find: 'Εΰ', replace: 'Ey'},
  {find: 'ΕΥ', replace: 'EY'},
  {find: 'ου', replace: 'ou'},
  {find: 'ού', replace: 'ou'},
  {find: 'οϋ', replace: 'oy'},
  {find: 'οΰ', replace: 'oy'},
  {find: 'Ου', replace: 'Ou'},
  {find: 'Ού', replace: 'Ou'},
  {find: 'Οϋ', replace: 'Oy'},
  {find: 'Οΰ', replace: 'Oy'},
  {find: 'ΟΥ', replace: 'OY'},
  {find: 'Α', replace: 'A'},
  {find: 'Ά', replace: 'A'},
  {find: 'α', replace: 'a'},
  {find: 'ά', replace: 'a'},
  {find: 'Β', replace: 'B'},
  {find: 'β', replace: 'b'},
  {find: 'Γ', replace: 'G'},
  {find: 'γ', replace: 'g'},
  {find: 'Δ', replace: 'D'},
  {find: 'δ', replace: 'd'},
  {find: 'Ε', replace: 'E'},
  {find: 'Έ', replace: 'E'},
  {find: 'ε', replace: 'e'},
  {find: 'έ', replace: 'e'},
  {find: 'Ζ', replace: 'Z'},
  {find: 'ζ', replace: 'z'},
  {find: 'Η', replace: 'H'},
  {find: 'Ή', replace: 'H'},
  {find: 'η', replace: 'h'},
  {find: 'ή', replace: 'h'},
  {find: 'Θ', replace: 'TH'},
  {find: 'θ', replace: 'th'},
  {find: 'Ι', replace: 'I'},
  {find: 'Ϊ', replace: 'I'},
  {find: 'Ί', replace: 'I'},
  {find: 'ι', replace: 'i'},
  {find: 'ί', replace: 'i'},
  {find: 'ΐ', replace: 'i'},
  {find: 'ϊ', replace: 'i'},
  {find: 'Κ', replace: 'K'},
  {find: 'κ', replace: 'k'},
  {find: 'Λ', replace: 'L'},
  {find: 'λ', replace: 'l'},
  {find: 'Μ', replace: 'M'},
  {find: 'μ', replace: 'm'},
  {find: 'Ν', replace: 'N'},
  {find: 'ν', replace: 'n'},
  {find: 'Ξ', replace: 'KS'},
  {find: 'ξ', replace: 'ks'},
  {find: 'Ο', replace: 'O'},
  {find: 'Ό', replace: 'O'},
  {find: 'ο', replace: 'o'},
  {find: 'ό', replace: 'o'},
  {find: 'Π', replace: 'p'},
  {find: 'π', replace: 'p'},
  {find: 'Ρ', replace: 'R'},
  {find: 'ρ', replace: 'r'},
  {find: 'Σ', replace: 'S'},
  {find: 'σ', replace: 's'},
  {find: 'Τ', replace: 'T'},
  {find: 'τ', replace: 't'},
  {find: 'Υ', replace: 'Y'},
  {find: 'Ύ', replace: 'Y'},
  {find: 'Ϋ', replace: 'Y'},
  {find: 'ΰ', replace: 'y'},
  {find: 'ύ', replace: 'y'},
  {find: 'ϋ', replace: 'y'},
  {find: 'υ', replace: 'y'},
  {find: 'Φ', replace: 'F'},
  {find: 'φ', replace: 'f'},
  {find: 'Χ', replace: 'X'},
  {find: 'χ', replace: 'x'},
  {find: 'Ψ', replace: 'Ps'},
  {find: 'ψ', replace: 'ps'},
  {find: 'Ω', replace: 'w'},
  {find: 'ω', replace: 'w'},
  {find: 'Ώ', replace: 'w'},
  {find: 'ώ', replace: 'w'},
  {find: 'ς', replace: 's'},
  {find: ';', replace: '?'}
]

function compare (a, b) {
  return diff
    .diffChars(a, b)
    .filter(c => c.removed)
    .reduce((d, e) => d + e.count, 0)
}

function config (files, options) {
  if (!options) { options = {} }
  if (!files && !options.files) { throw new Error('`files` parameter/option is required.') }
  if (options.unique && typeof options.unique === 'string' && options.unique.length < 4) {
    throw new Error('`unique` option must be at least 4 characters long when using a string.')
  }
  if (files) { options.files = files }

  for (var key in options) {
    if (typeof options[key] === 'undefined') { delete options[key] }
  }

  options = Object.assign({}, defaults, options)
  options.files = Array.isArray(options.files) ? options.files : options.files.split(',')
  options.ignoreFiles = Array.isArray(options.ignoreFiles) ? options.ignoreFiles : options.ignoreFiles.split(',')

  if (options.output && options.output.substr(-1) !== '/') { options.output += '/' }

  return options
}

function replace (text, options) {
  var counter
  var last
  var regex
  var replace

  for (var char of map) {
    regex = char.find
    replace = char.replace

    if (options.ignoreChars) { regex = '(?![' + options.ignoreChars + '])' + regex }

    regex = new RegExp(regex, 'g')

    if (options.unique) {
      if (text.match(regex)) {
        if (replace === last) {
          if (typeof options.unique === 'string') {
            replace += options.unique[counter]
          } else {
            replace += counter
          }

          counter += 1
        } else {
          counter = 0
          last = replace
        }
      }
    }

    text = text.replace(regex, options.prefix + replace + options.suffix)
  }

  return text
}

function greeklishReplace (files, options, cb) {
  options = config(files, options)

  return Promise
    .all(options.files.map(pattern => glob(pattern, { ignore: options.ignoreFiles, nodir: true })))

    .then(files => [].concat.apply([], files))

    .then(files => {
      return Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
          fs.readFile(file, options.encoding, (error, contents) => {
            if (error) { return reject(error) }

            var newContents = replace(contents, options)
            var changes = compare(contents, newContents)

            if (!changes || options.test) { return resolve({file, changes}) }

            fs.outputFile(options.output + file, newContents, options.encoding, error => {
              if (error) { return reject(error) }
              return resolve({file, changes})
            })
          })
        })
      }))
    })

    .then(results => {
      return results
        .filter(r => r.changes)
    })

    .then(changed => {
      if (cb) { cb(null, changed) }
      return changed
    })

    .catch(e => {
      if (cb) {
        cb(e)
      } else {
        throw e
      }
    })
}

greeklishReplace.sync = function (files, options, cb) {
  options = config(files, options)
  var changed = []

  options.files.forEach(pattern => {
    glob
      .sync(pattern, { ignore: options.ignoreFiles, nodir: true })
      .forEach(file => {
        var contents = fs.readFileSync(file, options.encoding)
        var newContents = replace(contents, options)
        var changes = compare(contents, newContents)

        if (changes) {
          if (!options.test) {
            fs.outputFileSync(options.output + file, newContents, options.encoding)
          }

          if (cb) { cb(file, changes) }

          changed.push({file, changes})
        }
      })
  })

  return changed
}

if (require.main === module) {
  var files = argv._.reduce((files, file) => {
    return files.concat(file.split(','))
  }, null)

  var options = {
    encoding: argv.encoding,
    files: argv.files,
    ignoreChars: argv.ignoreChars,
    ignoreFiles: argv.ignoreFiles,
    output: argv.output,
    prefix: argv.prefix,
    suffix: argv.suffix,
    silent: argv.silent,
    test: argv.test,
    unique: argv.unique
  }

  var changes = greeklishReplace.sync(files, options, (file, changes) => {
    if (changes && !options.silent) {
      console.log('Replaced ' + changes + ' character' + (changes > 1 ? 's' : '') + ' in ' + file)
    }
  })

  var count = changes.reduce((a, b) => a + b.changes, 0)

  if (changes.length && !options.silent) {
    console.log('Successfully made ' + count + ' replacement' + (count > 1 ? 's' : '') + ' in ' + changes.length + ' file' + (changes.length > 1 ? 's' : '') + '.')
  }
}

module.exports = greeklishReplace
