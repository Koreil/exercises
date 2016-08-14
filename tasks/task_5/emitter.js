/**
 * Creates a new Emitter
 * @returns {Object} - emitter
 */
module.exports = function () {
    return {
        /**
         * Subscribes student on event
         * @param {String} eventName - event we're subscribing studend on
         * @param {Object} student - student we're subscribing on event
         * @param {requestCallback} callback - student's reaction on event
         */
        on: function (eventName, student, callback) {
            this[eventName] = this[eventName] || [];
            this[eventName].push(student);
            student[eventName] = {
                eventName: eventName,
                callback: callback.bind(student),
                counter: 0,
                limit: Infinity,
                divider: 1
            };

            if (arguments.length > 3) {
                var restraint = arguments[3];
                if (restraint.isLimited) {
                    student[eventName].limit = restraint.lim;
                } else {
                    student[eventName].divider = restraint.div;
                }
            }
        },
        /**
         * Unsubscribes student from event
         * @param {String} eventName - event we're unsubscribing studend from
         * @param {Object} student - student we're unsubscribing
         */
        off: function (eventName, student) {
            var that = this;
            if (eventName.indexOf('.') === -1) {
                var emitterProps = Object.keys(that);
                var studentProps = Object.keys(student);

                studentProps.forEach(prop => {
                    if (prop.indexOf(eventName) !== -1) {
                        delete student[prop];
                    }
                });

                emitterProps.forEach(prop => {
                    if (prop.indexOf(eventName) !== -1) {
                        that[prop].splice(that[prop].indexOf(student), 1);
                    }
                });
            } else {
                delete student[eventName];
                that[eventName].splice(that[eventName].indexOf(student), 1);
            }
        },
        /**
         * Emits event and provokes appropriate reaction
         * @param {String} eventName - event we're emitting
         */
        emit: function (eventName) {
            var that = this;
            if (that[eventName] && that[eventName].length) {
                var students = that[eventName];
                students.forEach(student => {
                    student[eventName].counter++;
                    if (student[eventName].counter > student[eventName].limit) {
                        that.off(eventName, student);
                        return;
                    }
                    if (student[eventName].counter % student[eventName].divider !== 0) {
                        return;
                    }
                    student[eventName].callback();
                });

            }

            if (eventName.split('.').length > 1) {
                this.emit(eventName.split('.')[0]);
            }

        },
        /**
         * Subscribes student on event
         * @param {String} eventName - event we're subscribing studend on
         * @param {Object} student - student we're subscribing on event
         * @param {requestCallback} callback - student's reaction on event
         * @param {Number} n - how many times the event can be emitted
         */
        several: function (eventName, student, callback, n) {
            var args = [].slice.call(arguments);
            args[3] = {
                isLimited: true,
                lim: n
            };
            this.on.apply(null, args);
        },
        /**
         * Subscribes student on event
         * @param {String} eventName - event we're subscribing studend on
         * @param {Object} student - student we're subscribing on event
         * @param {requestCallback} callback - student's reaction on event
         * @param {Number} n - after how many times the event can be emitted
         */
        through: function (eventName, student, callback, n) {
            var args = [].slice.call(arguments);
            args[3] = {
                isLimited: false,
                div: n
            };
            this.on.apply(this, args);
        }
    };
};
