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

	this.setDate = function(year, month, day){
		var newDate = new Date(year, month);
		this.setYear  = newDate.getUTCFullYear();
		this.setMonth = newDate.getMonth();
		this.setDay  = newDate.getDate();
		return newDate;
	};
	this.numOfDays = function(year, month){
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
	var nextMonth = document.querySelector('#nextbtn');
	var prevMonth = document.querySelector('#prevbtn');
	var calendar  = document.querySelectorAll('.month_dates') || null;
	var counter   = 0;

	var newDC = function(){
		return new DateConstruct();
	};

	nextMonth.addEventListener('click',function(){
		getCalendar('next');
	});

	prevMonth.addEventListener('click',function(){
		getCalendar('prev');
	});

	function getCalendar(month){
		var dc = newDC();
		var skipDays;
		var numOfDays;

		if(month){
			if(month === 'next'){
				counter++;
				dc.setDate(dc.currYear, dc.currMonth + counter)
			}
			else if(month === 'prev'){
				counter--;
				dc.setDate(dc.currYear, dc.currMonth + counter)
			}
			skipDays = dc.firstDayNumber(dc.setYear, dc.setMonth);
			numOfDays = dc.numOfDays(dc.setYear, dc.setMonth);
		}
		else{
			skipDays = dc.firstDayNumber(dc.currYear, dc.currMonth);
			numOfDays = dc.numOfDays(dc.currYear, dc.currMonth);
		}

		calendar.forEach(function(day, index){
			day.innerHTML = '';

			if(index < skipDays){
				// console.log('skipped');
			}
			else if(index > numOfDays){
				// console.log('skipped');
			}
			else{
				if(month){
					day.dataset._date = dc.dateFormatted()
				}
				else{

				}
				day.innerHTML = index - skipDays + 1;
			}
		})
	}
	getCalendar();




}());
