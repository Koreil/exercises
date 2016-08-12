/*jscs:disable maximumLineLength*/

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

chai.use(require('sinon-chai'));

var getEmitter = require('../emitter');

describe('Emitter', function () {
    var ee;

    beforeEach(function () {
        ee = getEmitter();
    });

    it('Должен подписывать на события и рассылать сообщения подписчикам при вызове этого события', function () {
        var user = {};
        var cb = sinon.spy();

        ee.on('name', user, cb);
        ee.emit('name');

        expect(cb).to.have.been.calledOnce;
        expect(cb).to.have.been.calledOn(user);
    });

    it('Должен уметь отписывать от события. Не должен рассылать сообщения отписавшимся', function () {
        var user = {};
        var cb = sinon.spy();

        ee.on('name', user, cb);
        ee.off('name', user);
        ee.emit('name');

        expect(cb).to.not.have.been.called;
    });

    it('Должен рассылать сообщения всем подписчикам', function () {
        var user1 = {};
        var user2 = {};
        var cb1 = sinon.spy();
        var cb2 = sinon.spy();

        ee.on('name', user1, cb1);
        ee.on('name', user2, cb2);
        ee.emit('name');

        expect(cb1).to.have.been.calledOnce;
        expect(cb1).to.have.been.calledOn(user1);

        expect(cb2).to.have.been.calledOnce;
        expect(cb2).to.have.been.calledOn(user2);
    });

    it('Должен рассылать сообщения по событию 1 уровня при вызове события 2 уровня', function () {
        var user = {};
        var cb = sinon.spy();

        ee.on('name', user, cb);
        ee.on('name.subname', user, cb);
        ee.emit('name.subname');

        expect(cb).to.have.been.calledTwice;
    });

    it('Не должен рассылать сообщения по событию 2 уровня при вызове события 1 уровня', function () {
        var user = {};
        var cb = sinon.spy();

        ee.on('name', user, cb);
        ee.on('name.subname', user, cb);
        ee.emit('name');

        expect(cb).to.have.been.calledOnce;
    });

    it('Должен отписывать от событий 2 уровня при отписке от события 1 уровня', function () {
        var user = {};
        var cb = sinon.spy();

        ee.on('name', user, cb);
        ee.on('name.subname', user, cb);
        ee.off('name', user);
        ee.emit('name');
        ee.emit('name.subname');

        expect(cb).to.not.have.been.called;
    });

    it('Должен отписывать только от 2 уровня', function () {
        var user = {};
        var cb = sinon.spy();

        ee.on('name', user, cb);
        ee.on('name.subname', user, cb);
        ee.off('name.subname', user);
        ee.emit('name');

        expect(cb).to.have.been.calledOnce;
    });
});
