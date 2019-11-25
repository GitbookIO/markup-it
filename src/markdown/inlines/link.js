import { Map } from 'immutable';
import { Inline, Text } from '@gitbook/slate';
import { INLINES } from '../../constants';
import { Serializer, Deserializer } from '../../models';
import reInline from '../re/inline';
import * as utils from '../utils';

/**
 * Serialize a link to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.LINK)
    .then(state => {
        const node = state.peek();
        const { data, nodes } = node;
        const inner = state.use('inline').serialize(nodes);

        // Escape the href
        const href = utils.escapeURL(data.get('href', ''));

        // Escape the title
        let title = utils.escape(data.get('title', ''));

        if (title) {
            title = title ? ` "${title}"` : '';
        }

        const output = `[${inner}](${href}${title})`;

        return state.shift().write(output);
    });

/**
 * Deserialize a classic image like:
 *  ![Hello](test.png)
 * @type {Deserializer}
 */
const deserializeNormal = Deserializer().matchRegExp(
    reInline.link,
    (state, match) => {
        const inner = match[1];
        const nodes = state
            .use('inline')
            // Signal to children that we are in a link
            .setProp('link', state.depth)
            .deserialize(inner);

        const data = Map({
            href: utils.unescapeURL(match[2]),
            title: match[3] ? utils.unescape(match[3]) : undefined
        }).filter(Boolean);

        const node = Inline.create({
            type: INLINES.LINK,
            nodes,
            data
        });

        return state.push(node);
    }
);

/**
 * Deserialize an url:
 *  https://www.google.fr
 * @type {Deserializer}
 */
const deserializeUrl = Deserializer().matchRegExp(
    reInline.url,
    (state, match) => {
        // Already inside a link?
        if (state.getProp('link')) {
            return undefined;
        }

        const href = utils.unescapeURL(match[1]);

        const node = Inline.create({
            type: INLINES.LINK,
            nodes: [Text.create(href)],
            data: { href }
        });

        return state.push(node);
    }
);

/**
 * Deserialize an url with < and >:
 *  <samy@gitbook.com>
 * @type {Deserializer}
 */
const deserializeAutolink = Deserializer().matchRegExp(
    reInline.autolink,
    (state, match) => {
        // Already inside a link?
        if (state.getProp('link')) {
            return undefined;
        }

        const text = match[1];
        let href;

        if (match[2] === '@') {
            href = `mailto:${text}`;
        } else {
            href = text;
        }

        const node = Inline.create({
            type: INLINES.LINK,
            nodes: [Text.create(text)],
            data: { href }
        });

        return state.push(node);
    }
);

/**
 * Deserialize a reference link:
 *  nolink: [1]
 * @type {Deserializer}
 */
const deserializeRef = Deserializer().matchRegExp(
    [reInline.reflink, reInline.nolink],
    (state, match) => {
        // Already inside a link?
        if (state.getProp('link')) {
            return undefined;
        }

        const refID = match[2] || match[1];
        const inner = match[1];
        const data = utils.resolveRef(state, refID);

        if (!data) {
            return undefined;
        }

        const nodes = state
            .use('inline')
            .setProp('link', state.depth)
            .deserialize(inner);

        const node = Inline.create({
            type: INLINES.LINK,
            nodes,
            data
        });

        return state.push(node);
    }
);

/**
 * Deserialize a reference.
 * @type {Deserializer}
 */
const deserializeReffn = Deserializer().matchRegExp(
    reInline.reffn,
    (state, match) => {
        // Already inside a link?
        if (state.getProp('link')) {
            return undefined;
        }

        const refID = match[1];
        const data = utils.resolveRef(state, refID);

        if (!data) {
            return undefined;
        }

        const node = Inline.create({
            type: INLINES.LINK,
            nodes: [Text.createFromString(refID)],
            data
        });

        return state.push(node);
    }
);

const deserialize = Deserializer().use([
    deserializeNormal,
    deserializeUrl,
    deserializeAutolink,
    deserializeReffn,
    deserializeRef
]);

export default { serialize, deserialize };
