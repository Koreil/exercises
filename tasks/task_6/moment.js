'use strict';

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        date: null,

        // А здесь часовой пояс
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
        }
    };
};
