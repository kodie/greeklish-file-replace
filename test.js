import test from 'ava'

const fs = require('fs-extra')
const replace = require('.')

test('Async replace with callback', t => {
  fs.outputFileSync('test/1/test1.txt', 'Εύηχο: αυτό που ακούγεται ωραία.', 'utf-8')
  fs.outputFileSync('test/1/nested/test2.txt', 'καλημερα, πως ειστε;', 'utf-8')
  fs.outputFileSync('test/1/test3.txt', 'Αρνακι ασπρο και παχυ', 'utf-8')
  fs.outputFileSync('test/1/4.txt', 'Εξ ου και δηλον οτι ουδεμια των ηθικων αρετων φυσει ημιν εγγινεται', 'utf-8')

  return replace(['test/1/**/test*.txt', 'test/1/4.txt'], {
    ignoreChars: ';',
    ignoreFiles: '**/test3.txt',
    output: 'test/changed'
  }, (error, results) => {
    if (error) { t.fail(error) }

    t.is(results.length, 3)
    t.is(fs.readFileSync('test/changed/test/1/test1.txt', 'utf-8'), 'Euhxo: auto pou akougetai wraia.')
    t.is(fs.readFileSync('test/changed/test/1/nested/test2.txt', 'utf-8'), 'kalhmera, pws eiste;')
    t.false(fs.existsSync('test/changed/test/1/test3.txt'))
    t.is(fs.readFileSync('test/changed/test/1/4.txt', 'utf-8'), 'Eks ou kai dhlon oti oudemia twn hthikwn aretwn fysei hmin egginetai')
  })
})

test('Async replace with callback should throw error when files parameter is left blank', t => {
  t.throws(() => replace(null, null, () => {}))
})

test('Async replace as a promise', t => {
  fs.outputFileSync('test/2/test1.txt', 'Εύηχο: αυτό που ακούγεται ωραία.', 'utf-8')
  fs.outputFileSync('test/2/nested/test2.txt', 'καλημερα, πως ειστε;', 'utf-8')
  fs.outputFileSync('test/2/test3.txt', 'Αρνακι ασπρο και παχυ', 'utf-8')
  fs.outputFileSync('test/2/4.txt', 'Εξ ου και δηλον οτι ουδεμια των ηθικων αρετων φυσει ημιν εγγινεται', 'utf-8')

  return replace(['test/2/**/test*.txt', 'test/2/4.txt'], {
    ignoreChars: ';',
    ignoreFiles: '**/test3.txt',
    output: 'test/changed'
  })
    .then(results => {
      t.is(results.length, 3)
      t.is(fs.readFileSync('test/changed/test/2/test1.txt', 'utf-8'), 'Euhxo: auto pou akougetai wraia.')
      t.is(fs.readFileSync('test/changed/test/2/nested/test2.txt', 'utf-8'), 'kalhmera, pws eiste;')
      t.false(fs.existsSync('test/changed/test/2/test3.txt'))
      t.is(fs.readFileSync('test/changed/test/2/4.txt', 'utf-8'), 'Eks ou kai dhlon oti oudemia twn hthikwn aretwn fysei hmin egginetai')
    })

    .catch(error => {
      t.fail(error)
    })
})

test('Async replace as a promise should throw error when files parameter is left blank', async t => {
  await t.throws(() => replace())
})

test('Sync replace', t => {
  fs.outputFileSync('test/3/test1.txt', 'Εύηχο: αυτό που ακούγεται ωραία.', 'utf-8')
  fs.outputFileSync('test/3/nested/test2.txt', 'καλημερα, πως ειστε;', 'utf-8')
  fs.outputFileSync('test/3/test3.txt', 'Αρνακι ασπρο και παχυ', 'utf-8')
  fs.outputFileSync('test/3/4.txt', 'Εξ ου και δηλον οτι ουδεμια των ηθικων αρετων φυσει ημιν εγγινεται', 'utf-8')

  var results = replace.sync(['test/3/**/test*.txt', 'test/3/4.txt'], {
    ignoreChars: ';',
    ignoreFiles: '**/test3.txt',
    output: 'test/changed'
  })

  t.is(results.length, 3)
  t.is(fs.readFileSync('test/changed/test/3/test1.txt', 'utf-8'), 'Euhxo: auto pou akougetai wraia.')
  t.is(fs.readFileSync('test/changed/test/3/nested/test2.txt', 'utf-8'), 'kalhmera, pws eiste;')
  t.false(fs.existsSync('test/changed/test/3/test3.txt'))
  t.is(fs.readFileSync('test/changed/test/3/4.txt', 'utf-8'), 'Eks ou kai dhlon oti oudemia twn hthikwn aretwn fysei hmin egginetai')
})

test('Sync replace should throw error when files parameter is left blank', t => {
  t.throws(() => replace.sync())
})

test('Function should index repeated replacments when `unique` option is set to true', t => {
  fs.outputFileSync('test/4/test1.txt', 'Εύηχο: αυτό που ακούγεται ωραία.', 'utf-8')

  return replace('test/4/test1.txt', {
    output: 'test/changed',
    unique: true
  })
    .then(results => {
      t.is(results.length, 1)
      t.is(fs.readFileSync('test/changed/test/4/test1.txt', 'utf-8'), 'Euhxo: auto0 pou akou0getai wrai0a.')
    })
})

test('Function should index repeated replacments with supplied map when `unique` option is set to a string', t => {
  fs.outputFileSync('test/5/test1.txt', 'ΰύϋυΦΩΏώ', 'utf-8')

  return replace('test/5/test1.txt', {
    output: 'test/changed',
    unique: 'abcd'
  })
    .then(results => {
      t.is(results.length, 1)
      t.is(fs.readFileSync('test/changed/test/5/test1.txt', 'utf-8'), 'yyaybycFwwawb')
    })
})

test('Function should prefix and suffix each replacment when `prefix` and `suffix` options are set', t => {
  fs.outputFileSync('test/6/test1.txt', 'A miχture of latϊn and greek chάracters.', 'utf-8')

  return replace('test/6/test1.txt', {
    output: 'test/changed',
    prefix: '_g[',
    suffix: ']_'
  })
    .then(results => {
      t.is(results.length, 1)
      t.is(fs.readFileSync('test/changed/test/6/test1.txt', 'utf-8'), 'A mi_g[x]_ture of lat_g[i]_n and greek ch_g[a]_racters.')
    })
})
