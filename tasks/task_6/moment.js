'use strict';

module.exports = function () {
    return {
        week: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        daysLeft: ['ПН', 'ВТ', 'СР'],
        formattedDate: null,
        timezone: null,
        set date(value) {
            if (typeof value === 'string') {
                this.formattedDate = this.recoverDate(value);
            } else {
                this.formattedDate = value;
            }
        },

        get date() {
            if (this.timezone) {
                var UTCHours = new Date(this.formattedDate).getUTCHours();
                return new Date(this.formattedDate).setUTCHours(UTCHours - this.timezone);
            }
            return this.formattedDate;
        },

        // Выводит дату в переданном формате
        format: function (pattern) {
            var date = new Date(this.date);
            var day = this.week[new Date(this.date).getUTCDay()];
            var hours = date.getUTCHours();
            var minutes = date.getUTCMinutes();

            hours = (hours > 9) ? hours : '0' + hours;
            minutes = (minutes > 9) ? minutes : '0' + minutes;

            pattern = pattern.replace('%DD', day);
            pattern = pattern.replace('%HH:%MM', hours + ':' + minutes);

            return pattern;
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            var timeRemains = this.date - moment.date;
            timeRemains = Math.round(timeRemains / 60000);
            var minutes = Math.floor(timeRemains % 60);
            timeRemains = timeRemains / 60;
            var hours = Math.floor(timeRemains % 24);
            timeRemains = timeRemains - hours;
            var days = Math.floor(timeRemains / 24);

            days = this.returnDaysCollocation(days);
            hours = this.returnHoursCollocation(hours);
            minutes = this.returnMinutesCollocation(minutes);

            var alarm = 'До ограбления ' + days + hours + minutes;
            return alarm;
        },

        recoverDate: function (dateString) {
            // FIX: week постоянно объявляется
            var week = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            var datePartsRegExp = /^([А-Я]{0,2})\s?(\d{2}):(\d{2})([+-]\d{1,2})$/;
            var dateParts = datePartsRegExp.exec(dateString);
            var parsedDate = new Date();

            var day = week.indexOf(dateParts[1]);

            // получаем ближайший соответвующий день (например, ближайший понедельник)
            if (parsedDate.getDay()) {
                day = parsedDate.getDate() + 7 - parsedDate.getDay() + day;
            } else {
                day = parsedDate.getDate() + day;
            }

            var timezone = dateParts[4];
            var hours = parseInt(dateParts[2]) - timezone;
            var minutes = parseInt(dateParts[3]);


            parsedDate.setUTCDate(day);
            parsedDate.setUTCHours(hours, minutes, 0);

            return parsedDate.getTime();
        },

        reviver: function () {
            var that = this;
            return function (key, value) {
                if (key === 'from' || key === 'to') {
                    return that.recoverDate(value);
                }
                return value;
            };
        },

        returnDaysCollocation: function (days) {
            switch (days.toString().slice(-1)) {
                case '0':
                    days = '';
                    break;
                case '1':
                    days = days + ' день ';
                    break;

                case '2':
                case '3':
                case '4':
                    days = days + ' дня ';
                    break;

                default:
                    days = days + ' дней ';
                    break;
            }
            return days;
        },

        returnHoursCollocation: function (hours) {
            if (hours < 20 && hours > 10) {
                return hours + ' часов ';
            }

            switch (hours.toString().slice(-1)) {
                case '1':
                    hours = hours + ' час ';
                    break;

                case '2':
                case '3':
                case '4':
                    hours = hours + ' часа ';
                    break;

                default:
                    hours = hours + ' часов ';
                    break;
            }
            return hours;
        },

        returnMinutesCollocation: function (minutes) {
            if (minutes < 20 && minutes > 10) {
                return minutes + ' минут ';
            }

            switch (minutes.toString().slice(-1)) {
                case '1':
                    minutes = minutes + ' минута ';
                    break;

                case '2':
                case '3':
                case '4':
                    minutes = minutes + ' минуты ';
                    break;

                default:
                    minutes = minutes + ' минут ';
                    break;
            }
            return minutes;
        }
    };
};
