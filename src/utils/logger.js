let logger = {};

['info', 'warn', 'error'].forEach(key => {
    logger[key] = (...args) => {
        console[key].apply(null, ['query-serialization:  ', ...args]);
    };
});

export default logger;
