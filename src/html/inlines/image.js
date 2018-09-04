const { Serializer, INLINES } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize an image to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.IMAGE)
    .then(
        serializeTag('img', {
            isSingleTag: true,
            getAttrs: node => ({
                src: node.data.get('src'),
                alt: node.data.get('alt')
            })
        })
    );

module.exports = { serialize };
