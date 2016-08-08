'use strict';

var fs = require('fs');
var phoneBook = [];

/**
 * Creates new Contact.
 * @class
 * @param {String} name
 * @param {String} phone
 * @param {String} email
 */
function Contact(name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
}

/**
 * Validates a string using regExp.
 * @class
 * @param {String} str
 * @param {Object} reg
 */
function validateStr(str, reg) {
    return reg.test(str);
}

/**
 * Checks if string matches query or not.
 * @param {String} str
 * @param {String} query
 * @returns {Boolean}
 */
function isMatch(str, query) {
    return str.toLowerCase().indexOf(query.toLowerCase()) !== -1;
}

/**
 * Finds or removes Contacts according to query.
 * @param {Array} arr
 * @param {String} query
 * @param {Boolean} remove
 * @returns {Array}
 */
function findOrRemove(arr, query, remove) {
    if (remove) {
        return arr.filter(function (contact) {
            return !isMatch(contact.name, query) &&
                !isMatch(contact.phone, query) &&
                !isMatch(contact.email, query); // returns contacts which don't match query (so we can remove others)
        });
    } else {
        return arr.filter(function (contact) {
            return isMatch(contact.name, query) ||
                isMatch(contact.phone, query) ||
                isMatch(contact.email, query); // returns contacts, in which one+ field matches query
        });
    }
}

/**
 * Looks for repeats in phoneBook.
 * @param {string} name
 * @returns {Boolean}
 */
function findRepeat(str) {
    var counter = 0;
    phoneBook.forEach(function (contact) {
        if (contact.name == str) {
            counter++;
        }
    });

    if (counter) {
        return true;
    }
}

/**
 * Adds new Contact to phoneBook.
 * @param {string} name
 * @param {string} phone
 * @param {string} email
 */
function add(name, phone, email) {
    var phoneReg = /^\+?[0-9]{0,2}\s?(?:\({1}[0-9]{3}\){1}|[0-9]{3})\s?[0-9- ]{6,10}$/;
    var emailReg = /^[-a-zA-Z0-9_.]{2,10}\@{1}[a-zA-ZА-Яа-я-_]{2,20}\.{1}[a-zА-Яа-яёЕ]{2,3}\.?[a-z]{0,3}$/;
    var nameReg = /[-А-ЯA-Z 0-9]+$/i;

    // check if every string is valid
    if (validateStr(name, nameReg) && validateStr(phone, phoneReg) && validateStr(email, emailReg)) {
        if (findRepeat(name)) {
            console.log('Contact "' + name + '" already exists');
        } else {
            phoneBook.push(new Contact(name, phone, email));
        }
    }
};


/**
 * Searchs Contact in phoneBook.
 * @param {string} query
 */
function find(query) {
    var found = findOrRemove(phoneBook, query, false);
    if (found.length) {
        console.log('Found: ');
        found.forEach(function (contact) {
            var contactString = [];
            for (var key in contact) {
                contactString.push(contact[key]);
            }
            console.log(contactString.join(', '));
        });
    }
};


/**
 * Removes contact from phoneBook.
 * @param {string} query
 */
function remove(query) {
    phoneBook = findOrRemove(phoneBook, query, true);
};

/**
 * Shows contacts in Phonebook as table.
 */
function showTable() {
    var strLens = [];
    phoneBook.forEach(function (contact) {
        for (var key in contact) {
            strLens.push(contact[key].length);
        }
    });

    var maxLen = Math.max.apply(null, strLens);
    phoneBook.unshift(new Contact('Имя', 'Телефон', 'Email'));
    phoneBook.forEach(function (contact) {
        var name = contact.name;
        var phone = contact.phone;
        var email = contact.email;
        var str;
        for (var i = 0; i < (maxLen - contact.name.length); i++) {
            name += ' ';
        }
        for (var i = 0; i < (maxLen - contact.phone.length); i++) {
            phone += ' ';
        }
        for (var i = 0; i < (maxLen - contact.email.length); i++) {
            email += ' ';
        }

        str = '| ' + name + ' | ' + phone + ' | ' + email + ' |';
        console.log(str);
    });

    phoneBook.shift();
}

/**
 * Imports contacts from cvs-file.
 * @param {string} filename
 */
function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    data.split('\n').forEach(function (contact) {
        var props = contact.split(';');
        add(props[0], props[1], props[2]);
    });

    showTable();
}


module.exports.add = add;
module.exports.find = find;
module.exports.remove = remove;
module.exports.showTable = showTable;
module.exports.importFromCsv = importFromCsv;
