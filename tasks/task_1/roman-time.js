'use strict';
var figlet = require('figlet'); // require 'figlet' module for ACSII-art

var roman = [ //correspondence between Arabic and Roman numerals
   { value: 1000, sign: 'M'},
   { value: 900, sign: 'CM'},
   { value: 500, sign: 'D'},
   { value: 400, sign: 'CD'},
   { value: 100, sign: 'C'},
   { value: 90, sign: 'XC'},
   { value: 50, sign: 'L'},
   { value: 40, sign: 'XL'},
   { value: 10, sign: 'X'},
   { value: 9, sign: 'IX'},
   { value: 5, sign: 'V'},
   { value: 4, sign: 'IV'},
   { value: 1, sign: 'I'},
]

function convertToRoman(num) {
  if (num == 0) {
    return "zero"; // no zero in Roman numerals
  }
  var converted = [];
  roman.forEach(function(numeral) {
    if (num >= numeral.value) {
      for (var i = 0; i < Math.floor(num / numeral.value); i++) {
        converted.push(numeral.sign);
      };
    }
    num = num % numeral.value;
  });
  return converted.join('');
}

function getRomanTime(hours, minutes) {
  var checkHours = (hours <= 23 && hours >= 0);
  var checkMin = (minutes <= 59 && minutes >= 0);
  var checkMidnight = (hours == 0 && minutes == 0);
  var romanTime;

  if (checkMidnight) {
    console.log(figlet.textSync('Midnight', 'Standard')); // no zero in Roman numerals
    return;
  }
  if (checkMin && checkHours) {
    romanTime = convertToRoman(hours) + ' : ' + convertToRoman(minutes);
    console.log(figlet.textSync(romanTime, 'Standard'));
  } else {
    console.log('Время указано неверно');
  }
}

var hours = process.argv[2];
var minutes = process.argv[3];

getRomanTime(hours, minutes);
