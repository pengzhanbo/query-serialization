var querySerialization = new QuerySerialization.default({
    'common': [

    ],
    'hotel/list': [
        {
            key: 'cityCode',
            alias: 'cc',
            values: 'AR00000',
            type: 'padRight',
        },
        {
            key: 'cityName',
            alias: 'cn',
            values: '',
            type: 'normal'
        },
        {
            key: 'from',
            alias: 'f',
            values: {
                'a': 'activity',
                'b': 'brand',
                'c': 'coupon'
            },
            type: 'alias'
        }
    ],
    'hotel/detail': [
        {
            key: 'checkInDate',
            alias: 'ci',
            values: '',
            type: 'normal'
        },
        {
            key: 'checkOutDate',
            alias: 'co',
            values: '',
            type: 'normal'
        }
    ]
});
// querySerialization.create();
console.log(
    'querySerialization encode\n',
    'cityCode=AR00252&from=activity,brand',
    'cityCode=AR00252&from=activity,brand'.length,
    '\n',
    querySerialization.encode('hotel/list', 'cityCode=AR00252&from=activity,brand'),
    '\ncc=252&f=a,b',
    'cc=252&f=a,b'.length);
console.log('querySerialization decode', 'cc=252&f=a,b', querySerialization.decode('hotel/list', 'cc=252&f=a,b'));

