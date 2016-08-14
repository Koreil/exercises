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
Iterator.prototype.nextMale = searchIn('next', true);
Iterator.prototype.prevMale = searchIn('prev', true);

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
 * @param {Boolean} isMale - if we neew only guys
 * @returns {Object}
 */
function searchIn(direction, isMale) {

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

        if (isMale) {
            friendsList = friendsList.filter(friendName => {
                return this._collection[friendName].gender === 'Мужской';
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
        console.log(formatContact(this._collection, this._currentFriend));
        return formatContact(this._collection, this._currentFriend);
    };
}

/**
 * Return sorted collection
 * @param {Object} collection - our faceBook
 * @param {String} start - person we're starting by
 * @param {Number} depth - search depth
 * @returns {String[]} - friends names in assigned order
 */
function sortCollection(collection, start, depth) {
    if (!isInFacebook(collection, start) || !hasFriends(collection, start)) {
        return null;
    }
    var sortedFriends = []; // this array is for sorted collection
    var currentNode = [start]; // currentNode represents friends of this level of depth

    (function addNodes(currentLength, lastLength) {
        // our sorted collection length before we go to the next depth level
        // (0, if we have just begun)
        lastLength = lastLength || 0;
        depth -= 1; // we have begun the next level of our search

        currentNode = currentNode
            // we leave only those friends who are present in our faceBook
            .filter((friend) => collection[friend])
            // we need to return friends friends (new level)
            // sorted by alphabet
            .map((friend) => collection[friend].friends.sort())
            // concat array to one-dimentional
            .reduce((array, friends) => array.concat(friends), []);

        sortedFriends = sortedFriends // we add current node to final collection
            .concat(currentNode)
            // we don't need repeats
            // and we don't need to invite ourselves (compare friend with startPoint)
            // we don't need friends who was deleted from faceBook (if is in collection)
            .reduce(function (array, friend) {
                if (array.indexOf(friend) === -1 && friend !== start && collection[friend]) {
                    return array.concat(friend);
                } else {
                    return array;
                }
            }, []);
        // sorted collection length after next depth level
        currentLength = sortedFriends.length;
        // if length doesn't change, that means that all possible friends
        // are already added (any new friends), so we can stop our search
        // by setting depth = 0 (provokes return)
        // if lenght still increasing, we rewrite oldLength with the last result
        (currentLength === lastLength) ? depth = 0 : lastLength = currentLength;


        if (!depth) {
            return;
        } else {
            addNodes(currentLength, lastLength);
        }
    })();

    return sortedFriends; // {String[]}, sorted friends names
}
