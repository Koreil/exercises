'use strict';

var moment = require('./moment');

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var reviver = appropriateMoment.reviver();
    // 1. Читаем json
    // 2. Находим подходящий ближайший момент начала ограбления
    // 3. И записываем в appropriateMoment

    var busyTimeShedule = JSON.parse(json, reviver);
    var badGuys = Object.keys(busyTimeShedule);
    var possibleDays = appropriateMoment.daysLeft;
    // перевожу интервалы в миллисекунды и сортирую по возрастанию (см. sortBusyIntervalsMs)

    var busyIntervalsMs = sortBusyIntervals(badGuys, busyTimeShedule);

    var bankSheduleByDays = getBankSheduleByDays(possibleDays, workingHours);
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
            if (isLongEnough(prevBusyInt.to, nextBusyInt.to, minDuration)) {
                // тогда это может быть подходящим моментом
                robberyMoment = {
                    from: prevBusyInt.to,
                    to: nextBusyInt.to
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

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};

function isLongEnough(begin, end, duration) {
    return Boolean(end - begin >= duration);
}

// Собирает интервалы воедино, переводит в ms и сортирует
function sortBusyIntervals(badGuys, shedule) {
    return badGuys
            .reduce((intervals, guy) => intervals.concat(shedule[guy]), [])
            .sort((prevInt, nextInt) => prevInt.from - nextInt.from);
}

// Проверяет интервалы на пересечения
function hasCrossing(int0, int1) {
    if (int0.from > int1.to) {
        return false;
    }
    if (int0.to < int1.from) {
        return false;
    }

    return true;
}

// Возвращает для каждого дня интервал, когда банк открыт
function getBankSheduleByDays(days, workingHours) {
    return days.map(day => {
        return {
            from: day + ' ' + workingHours.from,
            to: day + ' ' + workingHours.to
        };
    });
}



