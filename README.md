# markup-it

[![Build Status](https://travis-ci.org/GitbookIO/markup-it.svg?branch=master)](https://travis-ci.org/GitbookIO/markup-it)
[![NPM version](https://badge.fury.io/js/markup-it.svg)](http://badge.fury.io/js/markup-it)

`markup-it` is a JavaScript library to serialize/deserialize markdown content using an intermediate format backed by an immutable model.


### Installation

```
$ npm i markup-it --save
```

or

```
$ yarn add markup-it
```

### Usage

#### Parse markdown

```js
const { State, MarkdownParser } = require('markup-it');

const state = State.create(MarkdownParser);
const document = state.deserializeToDocument('Hello **World**');
```

#### Render document to HTML

```js
const { State, HTMLParser } = require('markup-it');

const state = State.create(HTMLParser);
const str = state.serializeDocument(document);
```

#### Render document to Markdown

```js
const { State, MarkdownParser } = require('markup-it');

const state = State.create(MarkdownParser);
const str = state.serializeDocument(document);
```

### ES6

`markup-it` is [ESM](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) compliant through the package.json `module` field, so you can safely use it with ES6 syntax for tree-shaking.

```js
import { State, HTMLParser } from 'markup-it';

const state = State.create(HTMLParser);
const str = state.serializeDocument(document);
```

### Testing

There are many scripts available in the `/bin` folder to output an HTML or Markdown file to multiple formats (HTML, Hyperscript, JSON, Markdown, YAML).

These scripts can be called with `babel-node`, for example:

```
babel-node bin/toJSON.js ./page.md
```
