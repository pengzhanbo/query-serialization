import Rules from './rules';
import logger from '../utils/logger';
import {isArray} from '../utils/validator';
import qs from '../utils/query';
import encode from './encode';
import decode from './decode';

const COMMON = 'common';

export default class QuerySerialization {
    constructor(option) {
        option = option || {};
        if (typeof option !== 'object' || option === null) {
            logger.warn('The type of option must be array or object.');
            return;
        }
        // 传进来的是一个数组，没有命名空间，则归类到 common 中
        if (isArray(option)) {
            const _common = option;
            option = {
                [COMMON]: _common
            };
        }
        this.__option = option;
        this.rules = new Rules();
    }
    encode(name, query) {
        const option = this.__option;
        name = name || COMMON;
        if (!option[name]) {
            logger.warn(`encode < ${name} >, but not found>`);
            // 对于未定义的，同样返回编码后的字符串，如果本身就是字符串，则直接返回，不做解析
            return query && typeof query === 'object' ? qs.encode(query) : query;
        }
        if (typeof query === 'string') {
            query = qs.decode(query);
        }
        if (name === COMMON) {
            return encode(query, this.__option[COMMON]);
        }
        return Object.assign(
            {},
            encode(query, this.__option[COMMON], this.rules),
            encode(query, this.__option[name], this.rules, true)
        );
    }
    decode(name, query) {
        const option = this.__option;
        name = name || COMMON;
        if (!option[name]) {
            logger.warn(`decode < ${name} >, but not found>`);
            return query && typeof query === 'string' ? qs.decode(query) : query;
        }
        if (typeof query === 'string') {
            query = qs.decode(query);
        }
        if (name === COMMON) {
            return decode(query, this.__option[COMMON]);
        }
        return Object.assign(
            {},
            decode(query, this.__option[COMMON], this.rules),
            decode(query, this.__option[name], this.rules, true)
        );
    }
    push(name, option) {
        if (arguments.length === 1 && typeof name === 'object') {
            option = name;
            name = COMMON;
        }
        option = option || {};
        if (isArray(option)) {
            option.forEach(opt => this.push(name, opt));
        } else {
            if (!option.key) {
                logger.warn(`Push query option < ${name} >, but < key > was not fond. `);
                return;
            }
            if (!this.__option[name]) {
                this.__option[name] = [];
            }
            const index = this.__option[name].map(opt => opt.key).indexOf(option.key);
            if (index !== -1) {
                logger.warn(`Push query option < ${name} >, but < ${option.key} already exists.>`)
            } else {
                this.__option[name].push(option);
            }
        }
    }
    delete(name, key) {
        if (!name || !this.__option[name]) {
            logger.warn(`Pop query option, but name < ${name} > not found.`);
            return;
        }
        const index = this.__option[name].map(opt => opt.key).indexOf(key);
        index !== -1 && this.__option[name][index].splice(index, 1);
    }
    addRule(option) {
        this.rules.add(option);
    }
    delRule(name) { 
        return this.rules.del(name);
    }
};
