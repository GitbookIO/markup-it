const { Map } = require('immutable');
const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');
const utils = require('../utils');


/**
 * Resolve an image reference
 * @param  {State} state
 * @param  {String} refID
 * @return {Map} data?
 */
function resolveImageRef(state, refID) {
    const data = utils.resolveRef(state, refID);

    if (!data) {
        return;
    }

    return data
        .set('src', data.get('href'))
        .remove('href');
}


/**
 * Test if a link input is an image
 * @param {String} raw
 * @return {Boolean}
 */
function isImage(raw) {
    return raw.charAt(0) === '!';
}

/**
 * Serialize a image to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.IMAGE)
    .then((state) => {
        const node = state.peek();
        const { data } = node;

        // Escape the url
        const src = utils.escapeURL(data.get('src') || '');

        const alt = utils.escape(data.get('alt') || '');
        const title = utils.escape(data.get('title') || '');

        let output;

        if (title) {
            output = `![${alt}](${src} "${title}")`;
        } else {
            output = `![${alt}](${src})`;
        }

        return state
            .shift()
            .write(output);
    });

/**
 * Deserialize a classic image like:
 *  ![Hello](test.png)
 * @type {Deserializer}
 */
const deserializeNormal = Deserializer()
    .matchRegExp(reInline.link, (state, match) => {
        if (!isImage(match[0])) {
            return;
        }

        const data = Map({
            alt:   match[1] ? utils.unescape(match[1]) : undefined,
            src:   utils.unescapeURL(match[2]),
            title: match[3] ? utils.unescape(match[3]) : undefined
        }).filter(Boolean);

        const node = Inline.create({
            type: INLINES.IMAGE,
            isVoid: true,
            data
        });

        return state.push(node);
    });


/**
 * Deserialize a reference image:
 *  nolink: ![1]
 * @type {Deserializer}
 */
const deserializeRef = Deserializer()
    .matchRegExp([
        reInline.reflink,
        reInline.nolink
    ], (state, match) => {
        if (!isImage(match[0])) {
            return;
        }

        const refID = (match[2] || match[1]);
        const data = resolveImageRef(state, refID);

        if (!data) {
            return;
        }

        const node = Inline.create({
            type: INLINES.IMAGE,
            isVoid: true,
            data
        });

        return state.push(node);
    });

const deserialize = Deserializer()
    .use([
        deserializeNormal,
        deserializeRef
    ]);

module.exports = { serialize, deserialize };
