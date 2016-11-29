/**
 * Created by Kobe on 11/28/2016.
 */
$( document ).ready(function() {
	var dc = new DateConstruct();//required

	loadMonth();//load months with selectable classes and ids first
	getCalendar();//load information into calendar

	var getEvents    = document.querySelector(".get-events");
	var createEvents = document.querySelector(".create-events");
	var overlay      = document.querySelector(".overlay");
		overlay.addEventListener('click',function(){
		getEvents.classList.remove('sidebar-show');
		createEvents.classList.remove('sidebar-show');
		overlay.classList.add('hide');
	});
	var createBtn    = document.querySelector(".create-event-btn");
		createBtn.addEventListener('click', function(){
		createEvents.classList.add('sidebar-show');
		overlay.classList.remove('hide');
	});
	var nextMonthBtn = document.querySelector('#nextbtn');
		nextMonthBtn.addEventListener('click',function(){
		getCalendar('next');
	});
	var prevMonthBtn = document.querySelector('#prevbtn');
		prevMonthBtn.addEventListener('click',function(){
		getCalendar('prev');
	});
	var monthDates 	 = document.querySelectorAll(".month_dates");//each day box
	var eventDate    = document.querySelector(".event-date");//inside sidebar text
		monthDates.forEach(function(day){
		day.addEventListener('click',function(e){
			var _date = e.target.dataset._date;
			getEvents.classList.add('sidebar-show');
			overlay.classList.remove('hide');
			eventDate.innerHTML = _date;
			eventData(_date)
		});
	});

	function DateConstruct(){
		var d = ['sun','mon','tue','wed','thu','fri','sat'];
		var m  = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
		this.months = {
			jan : [0,'January','Jan',31],
			feb : [1,'February ','Feb',28,29],
			mar : [2,'March ','Mar',31],
			apr : [3,'April','Apr',30],
			may : [4,'May','May',31],
			jun : [5,'June','Jun',30],
			jul : [6,'July','Jul',31],
			aug : [7,'August','Aug',31],
			sep : [8,'September','Sep',30],
			oct : [9,'October','Oct',31],
			nov : [10,'November','Nov',30],
			dec : [11,'December','Dec',31]
		};
		this.days = {
			sun : [0,'Sunday','sun'],
			mon : [1,'Monday','mon'],
			tue : [2,'Tuesday','tues'],
			wed : [3,'Wednesday','wed'],
			thu : [4,'Thursday','thur'],
			fri : [5,'Friday','fri'],
			sat : [6,'Saturday','sat']
		};
		this.date = new Date();
		this.year  = this.date.getFullYear();
		this.month = this.date.getMonth();
		this.day   = this.date.getDate();
		this.currdate = null;
		this.setdate = function(yyyy,mm,dd){
			if(!dd){dd = 1}
			this.currdate  = new Date(yyyy,mm,dd);
			this.year  = this.currdate.getFullYear();
			this.month = this.currdate.getMonth();
			this.day   = this.currdate.getDate();
		};
		this.getday = function(year, month){
			var day;
			if (arguments.length == 2){

				day = new Date(year, month).getDay();
			}
			else{
				day = new Date(this.year,this.month).getDay();
			}
			return this.days[d[day]];
		};
		this.getmonth = function(year, month){
			var mon;
			if (arguments.length == 2){
				mon = m[new Date(year, month).getMonth()];
			}
			else{
				mon = m[this.month];
			}
			return this.months[mon];
		};
		this.ymd = function(y,m,d){
			if(arguments.length === 0){
				return (this.year + '-' +
				((this.month + 1) <= 9 ? "0" + m : m) + '-' +
				(this.day <= 9 ? "0" + d : d));
			}
			else{
				return (y + '-' +
				(m <= 9 ? "0" + m : m) + '-' +
				(d <= 9 ? "0" + d : d));
			}
		};
		this.yyyymmdd = function(date){
			return (new Date(date)).toISOString().slice(0,10).replace(/-/g,"-")
		};
		this.jqformat = function(date){

			var d = new Date(date);
				return ("00" + (d.getMonth() + 1)).slice(-2) + "/" +
				("00" + d.getDate()).slice(-2) + "/" +
				d.getFullYear() + " " +
				("00" + d.getHours()).slice(-2) + ":" +
				("00" + d.getMinutes()).slice(-2) + ":" +
				("00" + d.getSeconds()).slice(-2)
		};
	}
	function loadMonth(){
		for (var i = 0; i <= 5; i++){
			if(i === 5){
				$('#month_body').append(
					"<tr id='extra_row' class='month_body_row'></tr>"
				)
			}
			else{
				$('#month_body').append(
					"<tr class='month_body_row'></tr>"
				)
			}
		}
		for (d in dc.days){
			$('#month_days').append(
				`<td class="text-center"> ${dc.days[d][1]} </td>`
			)
		}
		for (var j = 0; j < 7; j++){
			$('.month_body_row').append(
				"<td class='month_dates'></td>"
			)
		}
	}
	function getCalendar(month){

		var calendar  = $('.month_dates');//place to inject month days
		var monthName = $('#month_name');//place to inject month name
		var extraRow  = $('#extra_row');//class set on the last rows of the month

		var m = dc.getmonth();

		var numOfDays = m[3];
		var skipDays = dc.getday()[0];

		if(month){
			if(month === 'next'){
				dc.setdate(dc.year,dc.month + 1)
			}
			else if(month === 'prev'){
				dc.setdate(dc.year,dc.month - 1)
			}
			numOfDays = m[3];
			skipDays = dc.getday()[0];
			m = dc.getmonth();
		}

		monthName.empty().append(`${m[1]} ${dc.year}`);

		$.each(calendar, function(index, day){

			day.innerHTML = '';

			if(numOfDays + skipDays < 36){
				extraRow.hide();
			}
			else{
				extraRow.show();
			}
			if(index < skipDays){
				// console.log('skipped');
			}
			else if(index >= numOfDays + skipDays){
				// console.log('skipped');
			}
			else{
				day.dataset._date = dc.ymd(dc.year,dc.month + 1,index - skipDays + 1);
				day.innerHTML = index - skipDays + 1;
			}
		});
	}
	function eventData(_date){
		var events       = $(".events");
		var eventData = [];
		events.empty();
		$.ajax({
			method: "GET",
			url: "/events",
			success: function() {console.log('Success');},
			error: function(err) {console.log(err);}
		}).done(function(eventData) {
			if(eventData){
				for (var i = 0; i < eventData.length; i++){
					if(_date == dc.yyyymmdd(eventData[i].startDate)) {
						events.append(`<div class='event'>
											<div class='event-name'>
												${eventData[i].title}
											</div>
											<div class='event-name'>
												${eventData[i].desc}
											</div>
											<div class='event-name'>
												${dc.jqformat(eventData[i].startDate)}
											</div>
											<div class='event-name'>
												${dc.jqformat(eventData[i].endDate)}
											</div>
											<button class='remove-event' id='${eventData[i]._id}'>Remove</button>
										</div>`)
					}
				}
			}
		});
	}
});
