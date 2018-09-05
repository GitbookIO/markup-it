
# Release notes
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

### Unreleased

### 9.0.0

- Rename table aligns data from `align` to `aligns`

### 8.1.3

- Remove warnings when using Slate 0.34.x

### 8.1.2

- Rename math block to `math_block`
- Fix spacing around math blocks in markdown

### 8.1.1

- Rename `tex` data to `formula` on math blocks/inlines

### 8.1.0

- Parse Math blocks as true block, instead of inline maths.

### 8.0.3

- Fix serialization and deserialization for JSON strings containing escaped characters

### 8.0.2

- Fix serialization of bold or italic to not wrap spaces (`**bold** text` instead of `**bold **text`)

### 8.0.1

- Fix parsing of `[def]` for code blocks in list

### 8.0.0

- Remove Asciidoc support
- Limit size of the package by publishing only the `dist` folder

### 7.0.4

- Fix parsing of HTML entities like emojis (ex: `&#128268;`)

### 7.0.3

Import fixes from 6.0.6:

- Fix empty custom block serialization
- Fix invalid custom block parsing

### 7.0.2

Import fixes from 6.0.2, 6.0.3, 6.0.4 and 6.0.5:

- Fix empty custom block parsing
- Fix newlines and whitespace collapsing in paragraph. #99
- Fix link reference parsing when mixed with HTML
- Fix bold parsed as list inside a text

### 7.0.1

- Paragraph now correctly stop at {% custom-blocks %} found in the text.

### 7.0.0

- Upgrade Slate to 0.33

### 6.0.6

- Fix empty custom block serialization
- Fix invalid custom block parsing

### 6.0.5

- Fix empty custom block tag parsing

### 6.0.4

- Fix newlines and whitespace collapsing in paragraph. #99

### 6.0.3

- Fix link reference parsing when mixed with HTML

### 6.0.2

- Fix bold parsed as list inside a text

### 6.0.1

- Paragraph now correctly stop at {% custom-blocks %} found in the text.

### 6.0.0

- Parse HTML blocks as `html_block`

### 5.1.2

- Support parenthesis in links title
- Prevent paragraphs from swallowing tables

### 5.1.1

- Escape whitespaces when writing Markdown links

### 5.1.0

- Add support for unending custom tags

### 5.0.2

- Move react and immutable as peer dependencies

### 5.0.1

- Fix parsing of HTML when the inner HTML of a tag is empty

### 5.0.0

- Inline HTML nodes have a new format. https://github.com/GitbookIO/markup-it/pull/87
- Fix parsing of HTML when the inner HTML of a tag existed in an attribute

### 4.0.2

- Fix parsing of Markdown empty headings

### 4.0.1

- Parse Markdown horizontal rules before parsing lists, to avoid misdetection.

### 4.0.0

- **Breaking Change**: Templating is now parsed as `variable`, `comment` and `x-<tag>`.
    `comment` and `x-<tag>` are blocks, while `variable` is inline.
- Parse YAML frontmatter as `document`'s data

### 3.6.0

- **Upgrade slate^0.22.0**

### 3.5.2

- Fix HTML deserialization of non-breaking spaces

### 3.5.1

- Fix HTML deserialization of code blocks containing spans (usually from syntax highlighting)

### 3.5.0

- Improve HTML deserialization by reusing nodes wrappers instead of wrapping invalid nodes individually,

### 3.4.2

- Fix parsing of ill-encoded URIs

### 3.4.1

- Fix parsing of empty fences block

### 3.4.0

- Improve Asciidoc and HTML deserialization by applying basic normalization (with Slate's core schema).

### 3.3.7

- Now supporting deserialization of URI encoded links.
- Serialization of links now URI encodes parenthesis, instead of escaping them.

### 3.3.6

- Fix parsing of links not separated by whitespaces.

### 3.3.5

- Whitespaces non-escaped are supported again during deserialization
- Whitespaces in urls are not escaped during serialization

### 3.3.3

- Fix parsing of images and links with parenthesis
- Fix parsing of escaped code block syntax
- **Important:** whitespace non-escaped are no longer supported in images and links.

### 3.3.2

- Fix crash during serialization of HTML nodes to markdown
- Prevent conflict between first HR and frontmatter

### 3.3.1

- Fix parsing of code blocks starting with an indent, now being preserved

### 3.3.0

- **New syntax:** Asciidoc (basic support)
- Improvements for HTML parser

### 3.2.0

- Serialize and deserialize GitHub GFM task lists

### 3.1.2

- Fix error for node < v6

### 3.1.1

- Fix parsing of nested lists in markdown
- Fix markdown serialization for lists followed by a block

### 3.1.0

- Changed the structure for code blocks: code blocks are now made of code lines

### 3.0.2

- Fix parsing of math when at beginning and end of a paragraph
- Fix parsing of inline code

### 3.0.1

- Fix whitespace normalization in HTML parsing
- Fix invalid structure when parsing HTML

### 3.0.0

- Rewrite of the internal engine
- Use `slate` for data modeling of the document
- Deserialized document can't be empty anymore
- Markdown
    - Follow GFM (GitHub) for slashes escaping

### 2.4.0

- Add `SlateUtils` to decode/encode for [Slate](https://github.com/ianstormtaylor/slate)
- Markdown lists are indented to the bullet size

### 2.3.0

- Add support for named images ([#17](https://github.com/GitbookIO/markup-it/issues/17))
- Fix empty tables
- Don't add `style` attribute to table cells when alignment is not defined
