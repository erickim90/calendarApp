/**
 * Created by Kobe on 11/17/2016.
 */
//MONTHLY CALENDAR
function DateConstruct(){
	this.days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
	this.currDate = new Date();
	this.currYear  = this.currDate.getUTCFullYear();
	this.currMonth = this.currDate.getMonth();
	this.currDay   = this.currDate.getDate();
	this.setYear = null;
	this.setMonth = null;
	this.setDay = null;
	this.setNumOfDays = null;
	this.setFirstDay = null;
	this.setDate = function(year, month, day){
		var newDate = new Date(year, month - 1, day);
		this.setYear  = newDate.getUTCFullYear();
		this.setMonth = newDate.getMonth();
		this.setDay  = newDate.getDate();
		return newDate;
	};
	this.numOfDays = function(year, month, offset){
		month = offset === true ? month + 1 : month;
		return new Date(year, month, 0).getDate();
	};
	this.firstDayString = function(year, month){
		var dayNumber = new Date(year, month).getDay();
		return this.days[dayNumber];
	};
	this.firstDayNumber = function(year, month){
		return new Date(year, month).getDay();
	};
	this.dateFormatted = function(y,m,d){
		return (y + '-' +
		(m <= 9 ? "0" + m : m) + '-' +
		(d <= 9 ? "0" + d : d));};
}
(function(){
	var newDC = function(){
		return new DateConstruct();
	};
	var calendar = document.querySelectorAll('.month_dates') || null;

	function getCalendar(){
		var dc = newDC();
		calendar.forEach(function(day, index){
			var skipDays  = dc.firstDayNumber(dc.currYear, dc.currMonth);
			var numOfDays = dc.numOfDays(dc.currYear, dc.currMonth, true);

			if(index <= skipDays){
				// console.log('skipped');
			}
			else if(index > numOfDays + skipDays){
				// console.log('skipped');
			}
			else{
				day.dataset.date = dc.dateFormatted(dc.currYear, dc.currMonth, index - skipDays);
				day.innerHTML = index - skipDays;
			}
		})
	}
	getCalendar();
}());
