'use strict';
/**
* Возвращает объект с методами для работы с датой в заданном формате
* @returns {Object}
*/
module.exports = function () {
    return {
        week: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        daysLeft: ['ПН', 'ВТ', 'СР'],
        // здесь хранится UTC-дата
        UTCDateMs: null,
        timezone: null,
        /**
         * Сеттер свойства date
         * предполагается, что дата приходит либо в виде строки вида 'ПН 09:01+5'
         * либо в виде количества миллисекунд (число)
         * @param {String} || {Number} value - дата в виде строки или числа
        */
        set date(value) {
            if (typeof value === 'string') {
                this.UTCDateMs = this.dateParser(value);
            } else {
                this.UTCDateMs = value;
            }
        },
        get date() {
            if (this.timezone) {
                var UTCHours = new Date(this.UTCDateMs).getUTCHours();
                return new Date(this.UTCDateMs).setUTCHours(UTCHours - this.timezone).getTime();
            }
            return this.UTCDateMs;
        },
        /**
         * Сеттер свойства date
         * если задан часовой пояс, возвращает дату в этом часовом поясе
         * при этом UTCDateMs остается в UTC
         * @returns {Number} - дата в числа в ms
        */
        get date() {
            if (this.timezone) {
                var currentUTChours = new Date(this.UTCDateMs).getUTCHours();
                return new Date(this.UTCDateMs).setUTCHours(currentUTChours - this.timezone);
            }
            return this.UTCDateMs;
        },
        /**
         * Выводит дату в переданном формате
         * @param {String} pattern - строка, которую необходимо вернуть с нужными даннными
         * @returns {String} - строка с нужными данными
        */
        format: function (pattern) {
            var date = new Date(this.date);
            var day = this.week[date.getUTCDay()];
            var hours = date.getUTCHours();
            var minutes = date.getUTCMinutes();

            hours = (hours > 9) ? hours : '0' + hours;
            minutes = (minutes > 9) ? minutes : '0' + minutes;

            pattern = pattern.replace('%DD', day);
            pattern = pattern.replace('%HH:%MM', hours + ':' + minutes);

            return pattern;
        },
        /**
         * Возвращает кол-во времени между текущей датой и переданной `moment`
         * в человекопонятном виде
         * @param {Object} moment - объект, хранящий дату
         * @returns {String} - строка, содержит оставшееся до ограбления время
        */
        fromMoment: function (moment) {
            var timeRemains = this.UTCDateMs - moment.date;
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
        /**
         * Преобразует строку вида 'ПН 12:59+5' и возвращает дату в ms
         * @param {String} dateString - дата в виде строки
         * @returns {Number} - дата в ms
         */
        dateParser: function (dateString) {
            var datePartsRegExp = /^([А-Я]{0,2})\s?(\d{2}):(\d{2})([+-]\d{1,2})$/;
            var dateParts = datePartsRegExp.exec(dateString);
            var parsedDate = new Date();

            var day = this.week.indexOf(dateParts[1]);

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
        /**
         * Применяет функцию dateParser к строкам, обозначающим начало и конец интервала
         * @param {String} key
         * @param {String} value
         * @returns {Number} - дата в ms
         */
        reviver: function (key, value) {
            if (key === 'from' || key === 'to') {
                return this.dateParser(value);
            }
            return value;
        },
        /**
        * Создает грамматически верное (надеюсь)) словосочетание
        * в зависимости от количества часов
        * @param {Number} hours
        * @returns {String} - словосочетание
        */
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
            };
            return hours;
        },
        /**
        * Создает грамматически верное словосочетание
        * в зависимости от количества дней
        * @param {Number} days
        * @returns {String} - словосочетание
        */
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
            };
            return days;
        },
        /**
        * Создает грамматически верное словосочетание
        * в зависимости от количества минут
        * @param {Number} minutes
        * @returns {String} - словосочетание
        */
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
