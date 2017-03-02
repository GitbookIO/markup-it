# Release notes
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

### 4.0.0

- **Breaking Change**: Templating is now parsed as `variable`, `comment` and `x-<tag>`.
    `comment` and `x-<tag>` are blocks, while `variable` is inline.

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
