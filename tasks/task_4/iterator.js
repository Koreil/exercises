'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

/**
 * Creates a new Iterator
 * @class
 * @param {Object} collection - our faceBook
 * @param {String} startPoing - name of person we start by
 * @param {Number} depth - search depth
 */
function Iterator(collection, startPoint, depth) {
    this._collection = collection;
    this._depth = depth || Infinity;
    this._start = startPoint;
    this._currentFriend;
};

Iterator.prototype.next = searchIn('next');
Iterator.prototype.prev = searchIn('prev');
Iterator.prototype.nextMale = searchIn('next', 1);
Iterator.prototype.prevMale = searchIn('prev', 1);

/**
 * Returns contact's name and phone
 * @param {Object} collection - our faceBook
 * @param {String} name - name of contact
 * @returns {Object}
 */
function formatContact(collection, name) {
    var contact = {
        name: name,
        phone: collection[name].phone
    };

    return contact;
}

/**
 * Checks if person is present in faceBook
 * @param {Object} collection - our faceBook
 * @param {String} name - person
 * @returns {Boolean}
 */
function isInFacebook(collection, name) {
    return Boolean(collection[name]);
}

/**
 * Checks if person has friends
 * @param {Object} collection - our faceBook
 * @param {String} name - person
 * @returns {Boolean}
 */
function hasFriends(collection, name) {
    var friends = collection[name].friends;
    return Boolean(friends.length);
}

/**
 * Checks if we can go back of forward in our search
 * @param {Number} index - index of current friend
 * @param {Number} step - step defines our direction, 1 - forward, -1 - back
 * @param {Object} collection - list of friends we want invite
 * @returns {Boolean}
 */
function isEdge(index, step, collection) {
    var isFirst = Boolean(step === -1 && index === 0);
    var isLast = Boolean(step === 1 && index === (collection.length - 1));
    return Boolean(isLast || isFirst);
}

/**
 * Looks for next or previous friend
 * @param {String} direction - we need next or previous friend
 * @param {Number} gender - 1 is for male
 * @returns {JSON}
 */
function searchIn(direction, gender) {

    var step = (direction === 'next') ? 1 : -1;


    return function walkInside(name) {
        if (name && isInFacebook(this._collection, name)) {
            this._currentFriend = name;
            return formatContact(this._collection, name);
        }

        var index;
        var friendsList = sortCollection(this._collection, this._start, this._depth);

        if (!friendsList) {
            return null;
        }

        if (gender) {
            friendslist = friendsList.filter(friend => {
                return this._collection[friend].gender === 'Мужской';
            });
        }

        if (this._currentFriend) {

            index = friendsList.indexOf(this._currentFriend);

            if (isEdge(index, step, friendsList)) {
                return null;
            }

            this._currentFriend = friendsList[index + step];

        } else {
            this._currentFriend = friendsList[0];
        }

        return formatContact(this._collection, this._currentFriend);
    };
}

/**
 * Looks for next or previous friend
 * @param {String} direction - we need next or previous friend
 * @param {Number} gender - 1 is for male
 * @returns {JSON}
 */
function sortCollection(collection, start, depth) {
    if (!isInFacebook(collection, start) || !hasFriends(collection, start)) {
        return null;
    }
    var sortedFriends = []; // this array is for sorted collection
    var currentNode = [start]; // our current node (we start by first person)

    //  ...and here hides my worst nightmare, be prepared... TODO: do something with this =\

    (function addNodes(length, oldLength) {
        oldLength = oldLength || 0; // we need this values because of possible infinity as depth
        depth -= 1; // next level of our search

        currentNode = currentNode
        .filter((friend) => collection[friend]) // we know, that some friend may disappear...
        .map((friend) => collection[friend].friends.sort())
        .reduce((array, friends) => array.concat(friends), []);

        sortedFriends.push(currentNode);

        sortedFriends = sortedFriends.reduce((array, friends) => array.concat(friends), [])
        .reduce(function (array, friend) {
            // we need to filter again, cause deleted friends may stay in someone's friendslist
            if (array.indexOf(friend) === -1 && friend !== start && collection[friend]) {
                return array.concat(friend);
            } else {
                return array;
            }
        }, []);

        length = sortedFriends.length;
        // if length doesn't change, all possible friends are present... I guess...
        (length === oldLength) ? depth = 0 : oldLength = length;


        if (!depth) {
            return;
        } else {
            addNodes(length, oldLength);
        }
    })();

    return sortedFriends;
}
