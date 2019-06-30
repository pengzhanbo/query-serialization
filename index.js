class QuerySerialization {
    constructor(option) {
        this.rules = {};
        this.namespace = {};
    }
    /**
     * 创建规则
     * @param {string} namespace 命名空间 支持多个页面间创建不同的规则
     * @param {array<object>|object} paramOption 规则配置
     */
    create(namespace, paramOption) {
        if (!this.namespace[namespace]) {
            this.namespace[namespace] = [];
        }
        namespace = this.namespace[namespace];
    }
    /**
     * 添加规则
     * @param {string} namespace 命名空间 支持多个页面间创建不同的规则
     * @param {array<object>|object} paramOption 规则配置
     */
    push(namespace, paramOption) {

    }
    /**
     * 删除规则
     * @param {string} namespace 命名空间
     * @param {string} key 规则参数名
     */
    delete(namespace, key) {

    }
    /**
     * 添加参数编码规则
     * @param {string} name 
     * @param {function} encode 
     * @param {function} decode 
     */
    addRule(name, encode, decode) {

    }
    encode(namespace, query) {

    }
    decode(namespace, queryString) {

    }
}
