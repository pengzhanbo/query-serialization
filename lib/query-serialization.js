(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.QuerySerialization = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var logger = {};
  ['info', 'warn', 'error'].forEach(function (key) {
    logger[key] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      console[key].apply(null, ['query-serialization:  '].concat(args));
    };
  });

  var defaultRuleList = [{
    name: 'normal'
  }, {
    name: 'alias',
    encode: function encode(values, value) {
      values = values || {};
      Object.keys(values).forEach(function (key) {
        var reg = new RegExp("(?:^|,)(".concat(values[key], ")(?:,|$)"));
        value = value.replace(reg, function (match, subMatch) {
          return match.replace(subMatch, key);
        });
      });
      return value;
    },
    decode: function decode(values, value) {
      values = values || {};
      Object.keys(values).forEach(function (key) {
        var reg = new RegExp("(?:^|,)(".concat(key, ")(?:,|$)"));
        value = value.replace(reg, function (match, subMatch) {
          return match.replace(subMatch, values[key]);
        });
      });
      return value;
    }
  }, {
    name: 'padRight',
    encode: function encode(values, value) {
      value = value || '';
      values = values || '';

      if (value.length !== values.length) {
        return value;
      }

      var res = '',
          lock = false;
      values = values.split('');
      value = value.split('');

      for (var i = 0, l = values.length; i < l; i++) {
        if (values[i] === value[i] && !lock) {
          continue;
        } else {
          lock = true;
          res += value[i];
        }
      }

      return res;
    },
    decode: function decode(values, value) {
      value = value || '';
      values = values || '';

      if (typeof values !== 'string') {
        return value;
      }

      return values.replace(new RegExp(".{".concat(value.length, "}$")), value);
    }
  }, {
    name: 'padLeft',
    encode: function encode(values, value) {
      value = value || '';
      values = values || '';

      if (value.length !== values.length) {
        return value;
      }

      var res = '',
          lock = false;
      values = values.split('').reverse();
      value = value.split('').reverse();

      for (var i = 0, l = values.length; i < l; i++) {
        if (values[i] === value[i] && !lock) {
          continue;
        } else {
          lock = true;
          res += value[i];
        }
      }

      return res.split('').reverse().join('');
    },
    decode: function decode(values, value) {
      value = value || '';
      values = values || '';

      if (typeof values !== 'string') {
        return value;
      }

      return values.replace(new RegExp("^.{".concat(value.length, "}")), value);
    }
  }];

  var Rules =
  /*#__PURE__*/
  function () {
    function Rules() {
      _classCallCheck(this, Rules);

      this._ruleList = {};

      this.__init();
    }
    /**
     * 初始化默认规则
     */


    _createClass(Rules, [{
      key: "__init",
      value: function __init() {
        var _this = this;

        defaultRuleList.forEach(function (rule) {
          return _this.add(rule);
        });
      }
      /**
       * 添加自定义规则
       * @param {object} option
       * @param {string} option.name
       * @param {function(any, string):string} option.encode
       * @param {function(any, string):string} option.decode
       */

    }, {
      key: "add",
      value: function add(option) {
        var _ref = option || {},
            name = _ref.name,
            encode = _ref.encode,
            decode = _ref.decode;

        if (!name) {
          logger.warn('The Rule name is empty');
          return;
        }

        if (this._ruleList[name]) {
          logger.warn("The rule < ".concat(name, " > already exists."));
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

    }, {
      key: "del",
      value: function del(name) {
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

    }, {
      key: "encode",
      value: function encode(name, values, value) {
        return this.__format(name, values, value, 'encode');
      }
      /**
       * @param {string} name 规则名称
       * @param {string} values 规则配置
       * @param {string} value 参数值
       * @return {string}
       */

    }, {
      key: "decode",
      value: function decode(name, values, value) {
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

    }, {
      key: "__format",
      value: function __format(name, values, value, type) {
        if (!name) {
          logger.warn('The Rule name is empty');
          return value;
        }

        if (!this._ruleList[name]) {
          logger.warn("The rule < ".concat(name, " > not found."));
          return value;
        }

        if (type === 'encode') {
          return this._ruleList[name].encode(values, value);
        } else {
          return this._ruleList[name].decode(values, value);
        }
      }
    }]);

    return Rules;
  }();

  function defEncode(values, value) {
    return value;
  }

  function defDecode(values, value) {
    return value;
  }

  function isType(type, value) {
    return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
  }

  function isArray(value) {
    return isType('Array', value);
  }
  function hasOwn(obj, key) {
    return !!Object.prototype.hasOwnProperty.call(obj, key);
  }

  var qs = {
    decode: function decode(queryString) {
      queryString = queryString.replace(/^&|&$/, '');
      var pattern = new RegExp('(.*?)=(.*?)(&|$)', 'g');
      var result;
      var query = {};
      result = pattern.exec(queryString);

      while (result) {
        query[result[1]] = decodeURIComponent(decodeURIComponent(result[2]));
        result = pattern.exec(queryString);
      }

      return query;
    },
    encode: function encode(queryObj) {
      queryObj = queryObj || {};
      var queryString = '';

      for (var key in queryObj) {
        if (hasOwn(queryObj, key)) {
          if (isArray(queryObj[key])) {
            queryObj[key] = queryObj[key].join(',');
          }

          queryString += "".concat(key, "=").concat(encodeURI(encodeURI(queryObj[key])), "&");
        }
      }

      return queryString.slice(0, -1);
    }
  };

  function encode(query, option, rule, lasted) {
    query = query || {};
    option = option || [];
    var result = {};
    Object.keys(query).forEach(function (key) {
      var index = option.map(function (opt) {
        return opt.key;
      }).indexOf(key); // 参数未配置规则，不处理

      if (index === -1) {
        lasted && (result[key] = query[key]);
      } else {
        var opt = option[index];
        result[opt.alias || key] = rule.encode(opt.type || 'normal', opt.values, query[key]);
      }
    });
    return result;
  }

  function decode(query, option, rule, lasted) {
    query = query || {};
    option = option || [];
    var result = {};
    Object.keys(query).forEach(function (key) {
      var index = option.map(function (opt) {
        return opt.alias;
      }).indexOf(key); // 参数未配置规则，不处理

      if (index === -1) {
        lasted && (result[key] = query[key]);
      } else {
        var opt = option[index];
        result[opt.key] = rule.decode(opt.type || 'normal', opt.values, query[key]);
      }
    });
    return result;
  }

  var COMMON = 'common';

  var QuerySerialization =
  /*#__PURE__*/
  function () {
    function QuerySerialization(option) {
      _classCallCheck(this, QuerySerialization);

      option = option || {};

      if (_typeof(option) !== 'object' || option === null) {
        logger.warn('The type of option must be array or object.');
        return;
      } // 传进来的是一个数组，没有命名空间，则归类到 common 中


      if (isArray(option)) {
        var _common = option;
        option = _defineProperty({}, COMMON, _common);
      }

      this.__option = option;
      this.rules = new Rules();
    }

    _createClass(QuerySerialization, [{
      key: "encode",
      value: function encode$1(name, query) {
        var option = this.__option;
        name = name || COMMON;

        if (!option[name]) {
          logger.warn("encode < ".concat(name, " >, but not found>")); // 对于未定义的，同样返回编码后的字符串，如果本身就是字符串，则直接返回，不做解析

          return query && _typeof(query) === 'object' ? qs.encode(query) : query;
        }

        if (typeof query === 'string') {
          query = qs.decode(query);
        }

        if (name === COMMON) {
          return encode(query, this.__option[COMMON]);
        }

        return Object.assign({}, encode(query, this.__option[COMMON], this.rules), encode(query, this.__option[name], this.rules, true));
      }
    }, {
      key: "decode",
      value: function decode$1(name, query) {
        var option = this.__option;
        name = name || COMMON;

        if (!option[name]) {
          logger.warn("decode < ".concat(name, " >, but not found>"));
          return query && typeof query === 'string' ? qs.decode(query) : query;
        }

        if (typeof query === 'string') {
          query = qs.decode(query);
        }

        if (name === COMMON) {
          return decode(query, this.__option[COMMON]);
        }

        return Object.assign({}, decode(query, this.__option[COMMON], this.rules), decode(query, this.__option[name], this.rules, true));
      }
    }, {
      key: "push",
      value: function push(name, option) {
        var _this = this;

        if (arguments.length === 1 && _typeof(name) === 'object') {
          option = name;
          name = COMMON;
        }

        option = option || {};

        if (isArray(option)) {
          option.forEach(function (opt) {
            return _this.push(name, opt);
          });
        } else {
          if (!option.key) {
            logger.warn("Push query option < ".concat(name, " >, but < key > was not fond. "));
            return;
          }

          if (!this.__option[name]) {
            this.__option[name] = [];
          }

          var index = this.__option[name].map(function (opt) {
            return opt.key;
          }).indexOf(option.key);

          if (index !== -1) {
            logger.warn("Push query option < ".concat(name, " >, but < ").concat(option.key, " already exists.>"));
          } else {
            this.__option[name].push(option);
          }
        }
      }
    }, {
      key: "delete",
      value: function _delete(name, key) {
        if (!name || !this.__option[name]) {
          logger.warn("Pop query option, but name < ".concat(name, " > not found."));
          return;
        }

        var index = this.__option[name].map(function (opt) {
          return opt.key;
        }).indexOf(key);

        index !== -1 && this.__option[name][index].splice(index, 1);
      }
    }, {
      key: "addRule",
      value: function addRule(option) {
        this.rules.add(option);
      }
    }, {
      key: "delRule",
      value: function delRule(name) {
        return this.rules.del(name);
      }
    }]);

    return QuerySerialization;
  }();

  exports.default = QuerySerialization;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
