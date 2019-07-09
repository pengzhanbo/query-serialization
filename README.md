# query-serialization

缩短链接参数，使整个链接长度更短。

## Intro

在前端一些场景中，存在链接过长而导致一些意料之外的情况发生，其中一个主要的原因是链接中带的参数过多过长而导致。<br/>
`query-serialization`尝试通过一些可配置的规则，根据已有的链接参数，进行压缩，生成新的链接参数，并提供可还原的方法。<br/>

## Feature
1. 基于页面：可以在不同页面配置不同的参数规则，提供命名空间的方式管理多个页面的参数。
2. `key`别名：参数`key`使用自定义别名的方式进行缩短。
3. 基于规则：参数`value`使用规则进行缩短，提供了默认规则，且可方便的新增自定义规则，以满足不同需求。

## Usage
``` bash
npm i -S query-serialization
```

``` js
import QuerySerialization from 'query-serialization';

let querySerialization = new QuerySerialization.default({
    'name1': [
        {
            key: 'key1',
            alias: 'a',
            type: 'alias',
            values: {
                a: 'aaa',
                b: 'bbb',
                c: 'ccc'
            }
        },
        {
            key: 'key2',
            alias: 'b',
            type: 'padRight',
            values: 'AR00000'
        }
    ],
    'name2': [
        {
            key: 'key3',
            alias: 'a',
            type: 'alias',
            values: {
                a: 'aaa',
                b: 'bbb',
                c: 'ccc'
            }
        },
        {
            key: 'key4',
            alias: 'b',
            type: 'padLeft',
            values: '0000HR'
        }
    ]
});

querySerialization.encode('name1', 'key1=aaa&key2=AR00123');
// output: {a:'a','b':'123'}

querySerialization.decode('name1', 'a=a&b=123');
// output: {key1:: 'aaa', key2: 'AR00123'}
```

## API

* **实例化**

  ``` js
  QuerySerialization.default(option: object|array);
  ```


* **链接参数编码：`encode(name: string, query: object|string): object`**

* **链接参数解码：`decode(name: string, query: object|string): object`**

* **添加参数配置`push(name, option)`**

* **删除参数配置`delete(name, key)`**

* **添加规则`addRule(option)`**
  ``` js
  // option
  {
      name: 'custom',
      encode: function (values, value) {
          return value;
      },
      decode: function (values. value) {
          return value;
      }
  }
  ```

* **删除规则`delRule(name)`**


### Default Rule

1. `normal`: 默认，不做任何处理，直接返回；
2. `alias`: 别名，`values` 为别名配置。根据配置返回别名；
3. `padRight`: 右填充;
4. `padLeft`: 左填充
