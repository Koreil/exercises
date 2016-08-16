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
            // in this emitter property we will save students, who will react on event
            this[eventName] = this[eventName] || [];
            this[eventName].push(student);
            // we assign appropriate reaction to mentioned student
            student[eventName] = {
                reaction: callback.bind(student),
                counter: 0,
                limit: Infinity,
                divider: 1
            };
            // there can possibly be some restrictions in extra-argument
            if (arguments.length > 3) {
                var restriction = arguments[3];
                if (restriction.isLimit) {
                    student[eventName].limit = restriction.limit;
                } else {
                    student[eventName].divider = restriction.divider;
                }
            }
        },
        /**
         * Unsubscribes student from event
         * @param {String} eventName - event we're unsubscribing studend from
         * @param {Object} student - student we're unsubscribing
         */
        off: function (eventName, student) {
            var emitter = this;
            // if there is no dot in eventName, that's the first level event
            // so we must unsubscribe student from all related events
            if (eventName.indexOf('.') === -1) {
                var emitterPropsList = Object.keys(emitter);
                var studentPropsList = Object.keys(student);

                studentPropsList.forEach(prop => {
                    if (prop.indexOf(eventName) !== -1) {
                        delete student[prop];
                    }
                });

                emitterPropsList.forEach(prop => {
                    if (prop.indexOf(eventName) !== -1) {
                        emitter[prop].splice(emitter[prop].indexOf(student), 1);
                    }
                });
            } else {
                delete student[eventName];
                emitter[eventName].splice(emitter[eventName].indexOf(student), 1);
            }
        },
        /**
         * Emits event and provokes appropriate reaction
         * @param {String} eventName - event we're emitting
         */
        emit: function (eventName) {
            var emitter = this;
            if (emitter[eventName] && emitter[eventName].length) {
                var students = emitter[eventName];
                students.forEach(student => {
                    student[eventName].counter++;
                    if (student[eventName].counter > student[eventName].limit) {
                        emitter.off(eventName, student);
                        return;
                    }
                    if (student[eventName].counter % student[eventName].divider !== 0) {
                        return;
                    }
                    student[eventName].reaction();
                });

            }

            if (eventName.split('.').length > 1) {
                this.emit(eventName.split('.')[0]);
            }

        },
        /**
         * Subscribes student on event which can be emitted only several times
         * @param {String} eventName - event we're subscribing studend on
         * @param {Object} student - student we're subscribing on event
         * @param {requestCallback} callback - student's reaction on event
         * @param {Number} n - how many times the event can be emitted
         */
        several: function (eventName, student, callback, n) {
            var args = [].slice.call(arguments);
            args[3] = {
                isLimit: true,
                limit: n
            };
            this.on.apply(null, args);
        },
        /**
         * Subscribes student on event which can be emitted only through several times
         * @param {String} eventName - event we're subscribing studend on
         * @param {Object} student - student we're subscribing on event
         * @param {requestCallback} callback - student's reaction on event
         * @param {Number} n - after how many times the event can be emitted
         */
        through: function (eventName, student, callback, n) {
            var args = [].slice.call(arguments);
            args[3] = {
                isLimit: false,
                divider: n
            };
            this.on.apply(null, args);
        }
    };
};
