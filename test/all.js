/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import expect from 'expect';
import Slate from '@gitbook/slate';
import hyperprint from '@gitbook/slate-hyperprint';
import trimTrailingLines from 'trim-trailing-lines';
import { State } from '../src/';
import markdown from '../src/markdown';
import html from '../src/html';
import unendingTags from './unendingTags';

/**
 * Read a file input to a value.
 * @param  {String} filePath
 * @return {RawValue} value
 */
function readFileInput(filePath) {
    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });

    function deserializeWith(syntax, props = {}) {
        const parser = State.create(syntax, props);
        const document = parser.deserializeToDocument(content);
        const value = Slate.Value.create({ document });
        return value.document;
    }

    switch (ext) {
        case '.md':
            return deserializeWith(markdown, {
                unendingTags
            });
        case '.html':
            return deserializeWith(html);
        case '.js':
            return require(filePath).default;
        default:
            throw new Error(`Unknown extension ${ext}`);
    }
}

/**
 * Convert an input value to an output
 * @param  {RawValue} value
 * @param  {String} outputExt
 * @return {Mixed}
 */
function convertFor(inputDocument, outputExt) {
    function serializeWith(syntax, props) {
        const parser = State.create(syntax, props);
        const out = parser.serializeDocument(inputDocument);

        // Trim to avoid newlines being compared at the end
        return trimTrailingLines(out);
    }

    switch (outputExt) {
        case '.md':
            return serializeWith(markdown, {
                unendingTags
            });
        case '.html':
            return serializeWith(html);
        case '.js':
            return inputDocument;
        default:
            throw new Error(`Unknown extension ${outputExt}`);
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
        case '.js':
            return Slate.Value.create({
                document: require(fileName).default
            }).document;
        default:
            throw new Error(`Unknown extension ${ext}`);
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

    if (typeof output === 'string') {
        expect(output).toEqual(expectedOutput);
    } else {
        expect(hyperprint(output, { strict: true })).toEqual(
            hyperprint(expectedOutput, { strict: true })
        );
    }
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
        throw new Error(
            `It looks like the test '${folder}' has an ${inputName} file, but is missing an output file.`
        );
    } else if (!input && output) {
        throw new Error(
            `It looks like the test '${folder}' has an ${outputName} file, but is missing an output file.`
        );
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

describe('MarkupIt', () => {
    runTests(__dirname);
});
