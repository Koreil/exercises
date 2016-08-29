/**
 * Примеры для обязательного задания
 */

var check = require('../src/check');

check.init();

var person = { name: 'John', age: 20 };
var numbers = [1, 2, 3];
var func = function (a, b) {};
var str = 'some string';

console.log(
    person.checkHasKeys(['name', 'age']), // true
    person.checkHasValueType('name', String), // true

    numbers.checkHasKeys(['0', '1', '2']), // true
    numbers.checkHasLength(3), // true

    numbers.checkContainsValues([2, 1]), // true

    func.checkHasParamsCount(2), // true

    str.checkHasWordsCount(2) // true
);
