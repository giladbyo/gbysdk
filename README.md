# gbysdk

If you love The Lord of the Rings, use our SDK to easily query [The One API to rule them all](https://the-one-api.dev/documentation).

## Features

This module is the lightweight wrapper around the RESTful - The One API including these features:

- robust query function to quickly retrieve data
- uses the popular [got](https://www.npmjs.com/package/got) package
- supports a limit on a per call basis or max records returned
- utilizes caching from got and internal data sets

## Install

```
npm install gbysdk
```

## Usage

### Initialize

Pass in a token and options, options allow for minimizing chunks of records per call, or max number of records returned.

```js
// Node.js REPL
let { default: GBYSDK} = await import('./gbysdk.js')

// Normal init
import GBYSDK from 'gbysdk'

// Token from The One API
let token = 'abcdefghi'
let gbysdk = new GBYSDK(token, {chunk: 10, max: 10})
```

### Sample usage

You can return all records, or use filtering

```js
// Get all books
let books = await gbysdk.books
// or
let books = await gbysdk.getBooks()

// Get all movies WITHOUT ring or king
let movies = await gbysdk.getMovies({'name!': [
  /ring/i,
  /king/i,
]})

// Get all characters who are BOTH Human and Female
let characters = await gbysdk.getCharacters({
  race: 'Human',
  gender: 'Female',
})

// Get all quotes with 'Deagol!' using exact match
let quotes = await gbysdk.getQuotes({dialog: 'Deagol!'})

// Get all quotes with 'birthday' using regex
let quotes = await gbysdk.getQuotes({dialog: /birthday/i})

// Get all quotes with either 'Deagol!' or birthday
let quotes = await gbysdk.getQuotes({dialog: [
  'Deagol!',
  /birthday/i
]})

```

## License

MIT. Copyright (c)