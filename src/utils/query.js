import {hasOwn, isArray} from './validator';

export default {
    decode(queryString) {
        queryString = queryString.replace(/^&|&$/, '');
        let pattern = new RegExp('(.*?)=(.*?)(&|$)', 'g');
        let result;
        let query = {};
        result = pattern.exec(queryString);
        while (result) {
            query[result[1]] = decodeURIComponent(decodeURIComponent(result[2]));
            result = pattern.exec(queryString);
        }
        return query;
    },
    encode(queryObj) {
        queryObj = queryObj || {};
        let queryString = '';
        for (let key in queryObj) {
            if (hasOwn(queryObj, key)) {
                if (isArray(queryObj[key])) {
                    queryObj[key] = queryObj[key].join(',');
                }
                queryString += `${key}=${encodeURI(encodeURI(queryObj[key]))}&`;
            }
        }
        return queryString.slice(0, -1);
    }
}
