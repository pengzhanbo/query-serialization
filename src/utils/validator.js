function isType(type, value) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isArray(value) {
    return isType('Array', value);
}

export function hasOwn(obj, key) {
    return !!Object.prototype.hasOwnProperty.call(obj, key);
}
