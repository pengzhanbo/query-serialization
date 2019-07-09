import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
export default {
    input: './src/index.js',
    output: {
        format: 'umd',
        name: 'QuerySerialization',
        exports: 'named',
        file: 'lib/query-serialization.js'
    },
    plugins: [
        json(),
        replace({
            isDev: false,
        }),
        babel({
            exclude: 'node_modules/*'
        })
    ]
}
