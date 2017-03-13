const fs = require('fs');
const path = require('path');
const expect = require('expect');
const yaml = require('js-yaml');
const Slate = require('slate');
const trimTrailingLines = require('trim-trailing-lines');

const MarkupIt = require('../src/');
const markdown = require('../src/markdown');
const html = require('../src/html');
const asciidoc = require('../src/asciidoc');

/**
 * Read a file input to a state.
 * @param  {String} filePath
 * @return {RawState} state
 */
function readFileInput(filePath) {
    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });

    function deserializeWith(syntax) {
        const parser = MarkupIt.State.create(syntax);
        const document = parser.deserializeToDocument(content);
        const state = Slate.State.create({ document });
        return Slate.Raw.serialize(state, { terse: true });
    }

    switch (ext) {
    case '.md':
        return deserializeWith(markdown);
    case '.html':
        return deserializeWith(html);
    case '.adoc':
        return deserializeWith(asciidoc);
    case '.yaml':
        return readYaml(filePath);
    }
}

/**
 * Convert an input state to an output
 * @param  {RawState} input
 * @param  {String} outputExt
 * @return {Mixed}
 */
function convertFor(input, outputExt) {

    function serializeWith(syntax) {
        const parser = MarkupIt.State.create(syntax);
        const inputDocument = Slate.Raw.deserialize(input, { terse: true }).document;
        const out = parser.serializeDocument(inputDocument);

        // Trim to avoid newlines being compared at the end
        return trimTrailingLines(out);
    }

    switch (outputExt) {
    case '.md':
        return serializeWith(markdown);
    case '.html':
        return serializeWith(html);
    case '.adoc':
        return serializeWith(asciidoc);
    case '.yaml':
        return input;
    }
}

/**
 * Read an output file
 * @param  {String} filePath
 * @return {Mixed}
 */
function readFileOutput(fileName) {
    const ext = path.extname(fileName);
    const content = fs.readFileSync(fileName, { encoding: 'utf8' });

    switch (ext) {
    case '.md':
    case '.adoc':
    case '.html':
        // We trim to avoid newlines being compared at the end
        return trimTrailingLines(content);
    case '.yaml':
        return readYaml(fileName);
    }
}

/**
 * Run test in a directory
 * @param  {String} folder
 */
function runTest(folder) {
    const files = fs.readdirSync(folder);
    const inputName = files.find(file => file.split('.')[0] === 'input');
    const outputName = files.find(file => file.split('.')[0] === 'output');

    // Read the input
    const inputFile = path.resolve(folder, inputName);
    const input = readFileInput(inputFile);

    // Read the expected output
    const outputFile = path.resolve(folder, outputName);
    const outputExt = path.extname(outputName);
    const expectedOutput = readFileOutput(outputFile);

    // Convert the input
    const output = convertFor(input, outputExt);

    expect(output).toEqual(expectedOutput);
}

/**
 * Return true if a folder is a leaf test folder
 * @param  {String} folder
 * @return {Boolean}
 */
function isTestFolder(folder) {
    const files = fs.readdirSync(folder);
    const inputName = files.find(file => file.split('.')[0] === 'input');
    const outputName = files.find(file => file.split('.')[0] === 'output');

    const input = Boolean(inputName);
    const output = Boolean(outputName);

    if (input && !output) {
        throw new Error(`It looks like the test '${folder}' has an ${inputName} file, but is missing an output file.`);
    } else if (!input && output) {
        throw new Error(`It looks like the test '${folder}' has an ${outputName} file, but is missing an output file.`);
    }

    return input && output;
}

/**
 * Test a folder
 * @param {String} folder
 */
function runTests(seriePath) {
    if (!fs.lstatSync(seriePath).isDirectory()) {
        return;
    }

    const tests = fs.readdirSync(seriePath);
    tests.forEach(test => {
        const testPath = path.resolve(seriePath, test);

        if (!fs.lstatSync(testPath).isDirectory()) {
            return;
        }

        if (isTestFolder(testPath)) {
            it(test, () => {
                runTest(testPath);
            });
        } else {
            describe(test, () => {
                runTests(testPath);
            });
        }
    });
}

/**
 * Read a YAML file.
 * @param  {String} filePath
 * @return {Object}
 */
function readYaml(filePath) {
    const content = fs.readFileSync(filePath);
    return yaml.safeLoad(content);
}

describe('MarkupIt', () => {
    runTests(__dirname);
});
