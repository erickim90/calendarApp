/**
 * Created by Kobe on 11/17/2016.
 */
//MONTHLY CALENDAR
var calendar       = document.querySelectorAll('.month_dates');
var currDate       = new Date();
var currMonth      = currDate.getMonth(); //0 base, add a 1
var currYear       = currDate.getUTCFullYear(); //Current Year
var firstDay       = new Date(currYear, currMonth).getDay(); //(0-6) 0=sunday 1=monday
var daysInMonth    = new Date(currYear, currMonth + 1, 0).getDate(); //gets first day of last month, add a +1

// console.log(currDate);
// console.log(currMonth);
// console.log(currYear);
// console.log(firstDay);
// console.log(daysInMonth);

calendar.forEach(function(day, i){
    var index    = i + 1;
    var skipDays = firstDay;
    var lastDay  = daysInMonth;


    var formatted= (currYear + '-' +
                    (currMonth <= 9 ? "0" + currMonth : currMonth) + '-' +
                    ((index - skipDays) <= 9 ? "0" + (index - skipDays) : (index - skipDays))
                    );

    if(index <= skipDays){
        // console.log('skipped')
    }
    else if(index > lastDay + skipDays){
        // console.log('skipped')
    }
    else{
        day.dataset.date = formatted;
        day.innerHTML = index - skipDays;
    }
});
// //MONTHLY CALENDAR
// var currDate       = new Date();
// var currMonth      = currDate.getMonth(); //0 base
// var currYear       = currDate.getUTCFullYear(); //0 base
//
// var lastMonth      = new Date(currYear,currMonth - 1); //curr month minus 1 for last month
// var daysLastMonth  = new Date(currYear,currMonth, 0).getDate();
// //gets the last day of last month, so currMonth is technicaly last month
// // console.log(lastMonth,daysLastMonth);
// var thisMonth      = new Date(currYear, currMonth); //curr month
// var daysThisMonth  = new Date(currYear, currMonth + 1, 0).getDate();
// //gets the last day of last month, so currMonth + 1 is technicaly this month
// // console.log(thisMonth,daysThisMonth);
// var nextMonth      = new Date(currYear,currMonth + 1);
// var daysNextMonth  = new Date(currYear,currMonth + 2, 0).getDate();
// //gets the last day of last month, so currMonth + 2 is technicaly next month
// // console.log(nextMonth, daysNextMonth);