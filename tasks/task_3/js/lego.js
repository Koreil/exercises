'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
/**
 * Performs given operations on phoneBook one after one.
 * @param {Array} collection - our phoneBook
 * @returns {Array} - ???
 */
module.exports.query = function (collection) {
    var args = Array.from(arguments);
    return args.reduce(function (param, func) {
        return func(param);
    });
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
/**
 * Returns given number of contacts.
 * @param {Number} n - Number of contacts we need
 * @returns {Array}
 */
module.exports.limit = function (n) {
    return function (phoneBook) {
        return phoneBook.slice(0, n);
    };
    // Магия
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
/**
 * Returns phoneBook contacts only with selected properties.
 * @param {(String|String[])} properties - List of needed properties
 * @returns {Array}
 */
module.exports.select = function (properties) {
    var args = Array.from(arguments);
    return function (phoneBook) {
        return phoneBook.map(function (contact) {
            for (var prop in contact) {
                if (args.indexOf(prop) === -1) {
                    delete contact[prop];
                }
            }
            return contact;
        });
    };
};

/**
 * Returns phoneBook which contacts chosen properties correspond with given values.
 * @param {String} propName - Name of the property we are selecting by
 * @param {String[]} values - Possible values of the property we are selecting by
 * @returns {Array}
 */
module.exports.filterIn = function (propName, values) {
    return function (phoneBook) {
        return phoneBook.filter(function (contact) {
            return values.indexOf(contact[propName]) !== -1;
        });
    };
};

/**
 * Returns phoneBook which contact's given property correspond with given value.
 * @param {String} propName - Name of the property we are selecting by
 * @param {String} propValue - Value of the property we are selecting by
 * @returns {Array}
 */
module.exports.filterEqual = function (propName, propValue) {
    return function (phoneBook) {
        return phoneBook.filter(function (contact) {
            return contact[propName] === propValue;
        });
    };
};

/**
 * Returns phoneBook sorted according given params.
 * @param {String} prop - Name of the property we are sorting by
 * @param {String} dir - Sort direction
 * @returns {Array}
 */
module.exports.sortBy = function (prop, dir) {
    return function (phoneBook) {
        phoneBook.sort(function (a, b) {
            if (a[prop] < b[prop]) {
                return 1;
            }
            if (a[prop] > b[prop]) {
                return -1;
            }
        });
        if (dir === 'desc') {
            return phoneBook;
        } else {
            return phoneBook.reverse();
        }
    };
};

/**
 * Formats selected property and returns phoneBook.
 * @param {String} property - Name of the property we are formatting
 * @param {requestCallback} callback - Callback function that formats selected property
 * @returns {Array}
 */
module.exports.format = function (property, callback) {
    return function (phoneBook) {
        return phoneBook.map(function (contact) {
            for (var key in contact) {
                if (key === property) {
                    contact[key] = callback(contact[key]);
                }
            }
            return contact;
        });
    };
};

// Будет круто, если реализуете операторы:
// or и and
/**
 * Returns two-dimentional array with two filtered collections.
 * @returns {Array}
 */
module.exports.or = function (filterResults) {
    var args = Array.from(arguments);
    var neededGroups = [];
    return function (phoneBook) {
        args.forEach(function (func) {
            neededGroups.push(func(phoneBook));
        });
        return neededGroups;
    };
};

module.exports.and = function () {
    var args = Array.from(arguments);
    return function (phoneBook) {
        return args.reduce(function (param, func) {
            return func(param);
        }, phoneBook);
    };
};
