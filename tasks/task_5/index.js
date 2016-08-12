'use strict';

var getEmitter = require('./emitter');
var lecturer = getEmitter();

var daria = {
    focus: 5,
    wisdom: 1
};

lecturer.on('begin', daria, function () {
    this.focus += 2;
});

lecturer.on('slide', daria, function () {
    this.wisdom += this.focus * 0.25;
    this.focus += 1;
});

var iakov = {
    focus: 5,
    wisdom: 1
};

lecturer.on('begin', iakov, function () {
    this.wisdom = 0;
});

lecturer.on('slide', iakov, function () {
    this.wisdom += this.focus * 0.5;
    this.focus -= 2;
});

lecturer.on('slide.funny', iakov, function () {
    this.focus += 5;
});

var pyotr = {
    focus: 5,
    wisdom: 1
};

lecturer.on('begin', pyotr, function () {
    this.wisdom = 3;
    this.focus = 10;
});

lecturer.on('slide', pyotr, function () {
    this.wisdom += this.focus * 0.1;
});

lecturer.through('slide.text', pyotr, function () {
    this.focus -= 3;
}, 2);

var roma = {
    focus: 5,
    wisdom: 1
};

lecturer.on('slide', roma, function () {
    this.wisdom += 1 + this.focus * 0.5;
    this.focus -= 2;
});

lecturer.several('slide.funny', roma, function () {
    this.focus += 1;
}, 5);

// начинаем лекцию

lecturer.emit('begin');

lecturer.emit('slide.text');
lecturer.emit('slide.text');
lecturer.emit('slide.text');
lecturer.emit('slide.funny');

lecturer.emit('slide.text');
lecturer.emit('slide.funny');

lecturer.off('slide.funny', iakov);

lecturer.emit('slide.text');
lecturer.emit('slide.funny');

lecturer.emit('slide.text');
lecturer.emit('slide.funny');

lecturer.off('slide', roma);

lecturer.emit('slide.text');
lecturer.emit('slide.text');

lecturer.emit('end');
