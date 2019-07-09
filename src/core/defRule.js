const defaultRuleList = [
    {
        name: 'normal'
    },
    {
        name: 'alias',
        encode: (values, value) => {
            values = values || {};
            Object.keys(values).forEach(key => {
                let reg = new RegExp(`(?:^|,)(${values[key]})(?:,|$)`);
                value = value.replace(reg, (match, subMatch) => {
                    return match.replace(subMatch, key);
                });
            });
            return value;
        },
        decode: (values, value) => {
            values = values || {};
            Object.keys(values).forEach(key => {
                let reg = new RegExp(`(?:^|,)(${key})(?:,|$)`);
                value = value.replace(reg, (match, subMatch) => {
                    return match.replace(subMatch, values[key]);
                });
            });
            return value;
        }
    },
    {
        name: 'padRight',
        encode: (values, value) => {
            value = value || '';
            values = values || '';
            if (value.length !== values.length) {
                return value;
            }
            let res = '', lock = false;
            values = values.split('');
            value = value.split('');
            for (let i = 0, l = values.length; i < l; i++) {
                if (values[i] === value[i] && !lock) {
                    continue;
                } else {
                    lock = true;
                    res += value[i];
                }
            }
            return res;
        },
        decode: (values, value) => {
            value = value || '';
            values = values || '';
            if (typeof values !== 'string') {
                return value;
            }
            return values.replace(new RegExp(`.{${value.length}}$`), value);
        }
    },
    {
        name: 'padLeft',
        encode: (values, value) => {
            value = value || '';
            values = values || '';
            if (value.length !== values.length) {
                return value;
            }
            let res = '', lock = false;
            values = values.split('').reverse();
            value = value.split('').reverse();
            for (let i = 0, l = values.length; i < l; i++) {
                if (values[i] === value[i] && !lock) {
                    continue;
                } else {
                    lock = true;
                    res += value[i];
                }
            }
            return res.split('').reverse().join('');
        },
        decode: (values, value) => {
            value = value || '';
            values = values || '';
            if (typeof values !== 'string') {
                return value;
            }
            return values.replace(new RegExp(`^.{${value.length}}`), value);
        }
    }
];

export default defaultRuleList;
