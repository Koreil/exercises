'use strict';

var moment = require('./moment');

/**
* Выбирает подходящий ближайший момент начала ограбления
* @param {Object[]} json - расписание членов банды =)
* @param {Number} minDuration - минимальное количество времени, требуемого для ограбления
* @param {Object} workingHours - рабочие часы банка, от и до
*/
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var reviver = appropriateMoment.reviver.bind(appropriateMoment);
    var possibleDays = appropriateMoment.daysLeft;
    // 1. Читаем json
    // 2. Находим подходящий ближайший момент начала ограбления
    // 3. И записываем в appropriateMoment
    // С помощью reviver превращаю строки начала и конца интервалов в число ms
    var busyTimeShedule = JSON.parse(json, reviver);
    var badGuys = Object.keys(busyTimeShedule);
    // создаю массив интервалов и сортирую интервалы в нем по возрастанию
    var busyIntervalsMs = sortBusyIntervals(badGuys, busyTimeShedule);
    // мне нужны часы работы банка в конкретные дни
    var bankSheduleByDays = getBankSheduleByDays(possibleDays, workingHours);
    // мне нужен reviver, чтобы представить интервалы, когда банк открыт, тоже в ms
    // поэтому сначала приходится превращать расписание в JSON
    bankSheduleByDays = JSON.stringify(bankSheduleByDays);
    bankSheduleByDays = JSON.parse(bankSheduleByDays, reviver);

    var robberyMoment;
    bankSheduleByDays.forEach(workingDay => {
        // перебираем все занятые интервалы и потом проверяем время между ними (т.е. свободное)
        for (var i = 0; i < busyIntervalsMs.length - 1; i++) {
            // для краткости записываем в переменные интервалы занятости
            var prevBusyInt = busyIntervalsMs[i];
            var nextBusyInt = busyIntervalsMs[i + 1];
            // если между концом первого интервала и началом следующего достаточно времени
            if (isLongEnough(prevBusyInt.to, nextBusyInt.from, minDuration)) {
                // тогда это может быть подходящим моментом
                robberyMoment = {
                    from: prevBusyInt.to,
                    to: nextBusyInt.from
                };
                // но необходимо, чтобы это было после открытия банка и в его рабочие часы
                // (я исходила из мысли, что ограбление может начаться и за минуту до закрытия,
                // ведь двери должны быть открыты, чтобы войти)
                if (hasCrossing(robberyMoment, workingDay) &&
                    workingDay.from <= robberyMoment.from) {
                    return robberyMoment;
                }
            }
        }
    });

    appropriateMoment.date = robberyMoment.from;
    return appropriateMoment;
};

/**
* Возвращает статус ограбления (этот метод уже готов!)
* @param {Object} moment
* @param {Object} robberMoment
* @returns {Number} || {String}
*/
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};

/** Проверяет, соответствует ли интервал минимальной длительности
* @param {Number} begin - начало интервала в ms
* @param {Number} end - конец интервала в ms
* @param {Number} duration - минимальная длительность
* @returns {Boolean} - соответствует или нет
*/
function isLongEnough(begin, end, duration) {
    return Boolean(end - begin >= duration);
}

/** Собирает интервалы воедино, переводит в ms и сортирует
* @param {Array} badGuys - участники ограбления
* @param {Object[]} shedule - расписание занятости участников
* @returns {Array} - одномерный массив отсортированных по порядку интервалов
*/
function sortBusyIntervals(badGuys, shedule) {
    return badGuys
            .reduce((intervals, guy) => intervals.concat(shedule[guy]), [])
            .sort((prevInt, nextInt) => prevInt.from - nextInt.from);
}

/** Проверяет интервалы на пересечения
* @param {Object} int0
* @param {Object} int1
* @returns {Boolean} - есть пересечения или нет
*/
function hasCrossing(int0, int1) {
    if (int0.from > int1.to) {
        return false;
    }
    if (int0.to < int1.from) {
        return false;
    }

    return true;
}

/** Возвращает для каждого дня интервал, когда банк открыт
* @param {Array} days - массив дней, которые нас интересуют
* @param {Object} workingHours - рабочие часы банка
* @returns {Object[]} - интревал рабочих часов банка в конкретные дни,
* начало и конце интревала - строки
*/
function getBankSheduleByDays(days, workingHours) {
    return days.map(day => {
        return {
            from: day + ' ' + workingHours.from,
            to: day + ' ' + workingHours.to
        };
    });
}



