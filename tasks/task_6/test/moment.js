'use strict';

var expect = require('chai').expect;
var robbery = require('../robbery');

describe('Базовое тестирование объекта moment', function () {
    it('format()', function () {
        var gang = require('fs').readFileSync('gang.json', 'utf-8');
        var robberyMoment = robbery.getAppropriateMoment(gang, 90, {
            from: '09:00+5',
            to: '21:00+5'
        });

        var actual = robberyMoment.format(
            'Ограбление должно состоятся в %DD. Всем быть готовыми к %HH:%MM!'
        );

        expect(actual).to.be.equal(
            'Ограбление должно состоятся в ВТ. Всем быть готовыми к 16:00!'
        );
    });
});
