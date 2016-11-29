/**
 * Created by Kobe on 11/21/2016.
 */
$( document ).ready(function() {
	monthlyTableCells();
	var dc = new DateConstruct();
	var calendar = $('.month_dates');
	var nextMonth = document.querySelector('#nextbtn');
	var prevMonth = document.querySelector('#prevbtn');

	getCalendar(null, dc.firstDayNumber(dc.currYear, dc.currMonth), dc.daysInMonth[dc.currMonth]);

	nextMonth.addEventListener('click',function(){
		getCalendar('next');
	});

	prevMonth.addEventListener('click',function(){
		getCalendar('prev');
	});
	function DateConstruct(){
		this.currDate = new Date();
		this.currYear  = this.currDate.getUTCFullYear();
		this.currMonth = this.currDate.getMonth();
		this.currDay   = this.currDate.getDate();

		this.firstDayString = function(year, month){
			var dayNumber = new Date(year, month).getDay();
			return this.days[dayNumber];
		};
		this.firstDayNumber = function(year, month){
			return new Date(year, month).getDay();
		};
		this.dateFormatted = function(y,m,d){
			if(m === this.currMonth){
				m++
			}
			return (y + '-' +
			(m <= 9 ? "0" + m : m) + '-' +
			(d <= 9 ? "0" + d : d));};
		this.monthNames  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		this.days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
		this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	}

	function getCalendar(month, skipDays, numOfDays){

		if(month){
			if(month === 'next'){
				dc.currDate = new Date(dc.currYear, dc.currMonth + 1);
				console.log(dc.currDate);
				dc.currYear  = dc.currDate.getUTCFullYear();
				dc.currMonth = dc.currDate.getMonth();
				dc.currDay   = dc.currDate.getDate();
			}
			else if(month === 'prev'){
				dc.currDate = new Date(dc.currYear, dc.currMonth - 1);
				console.log(dc.currDate);
				dc.currYear  = dc.currDate.getUTCFullYear();
				dc.currMonth = dc.currDate.getMonth();
				dc.currDay   = dc.currDate.getDate();
			}
			skipDays = dc.firstDayNumber(dc.currYear, dc.currMonth);
			numOfDays = dc.daysInMonth[dc.currMonth];
		}
		$('#month_title').empty().append(dc.monthNames[dc.currMonth]);
		$.each(calendar, function(index, day){

			day.innerHTML = '';
			if(numOfDays + skipDays < 36){
				$('#extra_row').hide();
			}
			else{
				$('#extra_row').show();
			}
			if(index < skipDays){
				// console.log('skipped');
			}
			else if(index >= numOfDays + skipDays){
				// console.log('skipped');
			}
			else{
				day.dataset._date = dc.dateFormatted(dc.currYear,dc.currMonth,index - skipDays + 1);
				console.log(day.dataset._date)
				day.innerHTML = index - skipDays + 1;
			}
		})
	}
});
