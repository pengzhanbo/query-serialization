import logger from '../utils/logger';
import defaultRuleList from './defRule';

export default class Rules {
    constructor() {
        this._ruleList = {};
        this.__init();
    }
    /**
     * 初始化默认规则
     */
    __init() {
        defaultRuleList.forEach(rule => this.add(rule));
    }
    /**
     * 添加自定义规则
     * @param {object} option
     * @param {string} option.name
     * @param {function(any, string):string} option.encode
     * @param {function(any, string):string} option.decode
     */
    add(option) {
        const {name, encode, decode} = option || {};
        if (!name) {
            logger.warn('The Rule name is empty');
            return;
        }
        if (this._ruleList[name]) {
            logger.warn(`The rule < ${name} > already exists.`);
            return;
        }
        this._ruleList[name] = {
            encode: encode || defEncode,
            decode: decode || defDecode
        };
    }
    /**
     * 删除规则
     * @param {string} name 规则名称
     */
    del(name) {
        if (this._ruleList[name]) {
            this._ruleList = null;
            delete this._ruleList[name];
            return true;
        }
        return false;
    }
    /**
     * @param {string} name 规则名称
     * @param {string} values 规则配置
     * @param {string} value 参数值
     * @return {string}
     */
    encode(name, values, value) {
        return this.__format(name, values, value, 'encode');
    }
    /**
     * @param {string} name 规则名称
     * @param {string} values 规则配置
     * @param {string} value 参数值
     * @return {string}
     */
    decode(name, values, value) {
        return this.__format(name, values, value, 'decode');
    }
    /**
     * 格式化
     * @param {string} name 规则名称
     * @param {string} values 规则配置
     * @param {string} value 参数值
     * @param {string} type 编码类型
     * @return {string}
     */
    __format(name, values, value, type) {
        if (!name) {
            logger.warn('The Rule name is empty');
            return value;
        }
        if (!this._ruleList[name]) {
            logger.warn(`The rule < ${name} > not found.`);
            return value;
        }
        if (type === 'encode') {
            return this._ruleList[name].encode(values, value);
        } else {
            return this._ruleList[name].decode(values, value);
        }
    }
}

function defEncode(values, value) {
    return value;
}

function defDecode(values, value) {
    return value;
}
