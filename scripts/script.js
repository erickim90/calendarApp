/**
 * Created by Kobe on 11/15/2016.
 */
//SIDEBAR
var sidebarGet      = document.querySelector(".sidebar-get-events");
var sliderGetBtn    = document.querySelector('#slider-get-btn');
var sidebarCreate   = document.querySelector(".sidebar-create-event");
var sliderCreateBtn = document.querySelector('#slider-create-btn');
var sidebarOverlay  = document.querySelector(".sidebar-overlay");

sliderGetBtn.addEventListener('click',function(){
    sidebarGet.classList.add('sidebar-show');
    sidebarOverlay.classList.remove('hide');
});

sliderCreateBtn.addEventListener('click',function(){
    sidebarCreate.classList.add('sidebar-show');
    sidebarOverlay.classList.remove('hide');
});

sidebarOverlay.addEventListener('click',function(){
    sidebarGet.classList.remove('sidebar-show');
    sidebarCreate.classList.remove('sidebar-show');
    sidebarOverlay.classList.add('hide');
});

//MONTHLY CALENDAR
var currDate       = new Date();
var currMonth      = currDate.getMonth(); //0 base
var currYear       = currDate.getUTCFullYear(); //0 base

var lastMonth      = new Date(currYear,currMonth - 1); //curr month minus 1 for last month
var daysLastMonth  = new Date(currYear,currMonth, 0).getDate();
//gets the last day of last month, so currMonth is technicaly last month
// console.log(lastMonth,daysLastMonth);
var thisMonth      = new Date(currYear, currMonth); //curr month
var daysThisMonth  = new Date(currYear, currMonth + 1, 0).getDate();
//gets the last day of last month, so currMonth + 1 is technicaly this month
// console.log(thisMonth,daysThisMonth);
var nextMonth      = new Date(currYear,currMonth + 1);
var daysNextMonth  = new Date(currYear,currMonth + 2, 0).getDate();
//gets the last day of last month, so currMonth + 2 is technicaly next month
// console.log(nextMonth, daysNextMonth);

var calendar       = document.querySelectorAll('.month_dates'); //grab every calendar element (35 table items)
//iterate through the 35 table items
calendar.forEach(function(x, i){
    var index = i + 1;
    var skipDays = thisMonth.getDay();

    if(index <= skipDays || index - skipDays > daysThisMonth){
        console.log('skipped')
    }
    else{
        x.innerHTML = index - skipDays;
    }
    //index is the number of tiles (42) add + 1 for zero index
    //skipDays is the first day of the month (0-6): 0 = sunday, 1 = monday
    //lastDay is the last day of the month
    //if index is less than skipDays (skip X days of the first week)
    //or index minus skipdays is > than the last day of the month (Oct 32nd)
    //do nothing
    //else set innerHTML of current element to the current index minus the skipDays offset
    //
});