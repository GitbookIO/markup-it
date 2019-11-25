/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <block
            type="x-embed"
            isVoid
            data={{
                json: '{"html":"<div style=\\"background-color: red;\\" />"}'
            }}
        />
    </document>
);
