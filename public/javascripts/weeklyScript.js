/**
 * Created by Kobe on 11/29/2016.
 */
/**
 * Created by Kobe on 11/28/2016.
 */
$( document ).ready(function() {
	//Required on all pages
	var dc = new DateConstruct();//required
	var getEvents    = document.querySelector(".get-events");
	var eventActions = $(".get-events" );
	var createEvents = document.querySelector(".create-events");
	var overlay      = document.querySelector(".overlay");
	var createBtn    = document.querySelector(".create-event-btn");

	overlay.addEventListener('click',function(){
		getEvents.classList.remove('sidebar-show');
		createEvents.classList.remove('sidebar-show');
		overlay.classList.add('hide');
	});
	createBtn.addEventListener('click', function(){
		createEvents.classList.add('sidebar-show');
		overlay.classList.remove('hide');
	});
	$('#createEventForm').submit(function(event){
		event.preventDefault(); //prevent default action

		var post_url       = $(this).attr("action"); //get form action url
		var request_method = $(this).attr("method"); //get form GET/POST method
		var form_data      = $(this).serialize(); //Encode form elements for submission
		// var form_data = {"title": "herpderp",  _id:"583debef0aedb4039849cd4c"};//ERROR THROWING FORM DATA

		$.ajax({//CREATE
			url : post_url,
			method: request_method,
			data : form_data
		}).done(function(res){
			console.log(res)
		}).fail(function(xhr){
			var res = JSON.parse(xhr.responseText);
			alert(res.error.message || res.error.errmsg)
		})
	});
	eventActions.on( "click", ".delete-event", function(e) {
		var self = this;
		var event_id = e.currentTarget.id;
		$.ajax({//DELETE
			url : `events/${event_id}`,
			method: 'delete'
		}).done(function(res){
			$( self ).parent().remove()
		}).fail(function(xhr){
			var res = JSON.parse(xhr.responseText);
			alert(res.error.message || res.error.errmsg)
		})
	});
	eventActions.on( "click", ".patch-event", function(e) {
		var event_id = e.currentTarget.id;
		var event_date = e.currentTarget.dataset._date;
		var title = e.currentTarget.dataset.title;
		var startDate = e.currentTarget.dataset.startdate;
		var endDate = e.currentTarget.dataset.enddate;
		var desc = e.currentTarget.dataset.desc;
		$(this).parent().empty().append(`<form id="edit-form" method="patch" action="/events/${event_id}">
    		<h4 class="margin-0">Edit Event</h4>

    		<div class="margin-top-20 text-center">
    		  <label for="evtName">Event Name: </label>
    		  <input class="form-element" type="text" name="title" placeholder="Name of Event" id="evtName" value="${title}"/>
    		</div>

    		<div class="margin-top-20 text-center">
    		  <div class="inline-block">
    		    <label for="startDate">Start Time: </label>
    		    <input class="form-element" type="datetime-local" name="startDate" id="startDate" value="${startDate.slice(0, -1)}"/>
    		  </div>
    		</div>

    		<div class="margin-top-20 text-center">
    		  <div class="inline-block">
    		    <label for="endDate">End Time: </label>
    		    <input class="form-element" type="datetime-local" name="endDate" id="endDate" value="${endDate.slice(0, -1)}"/>
    		  </div>
    		</div>
    		<div class="margin-top-20 text-center">
    		  <label for="description">Description: </label>
    		  <textarea class="form-element" name="desc" placeholder="Description of event" id="description">${desc}</textarea>
    		</div>

    		<!--<div class="margin-top-20 text-center">-->
    		  <!--<label for="color">Color: </label>-->
    		  <!--<select class="form-element" name="color" id="color">-->
    		    <!--<option value="red">Red</option>-->
    		    <!--<option value="blue">Blue</option>-->
    		    <!--<option value="green">Green</option>-->
    		  <!--</select>-->
   			<!--</div>-->

		    <!--<h5>Repeat</h5>-->
		    <!--<div class="margin-top-20">-->
		      <!--<input class="form-element" type="radio" name="repeat" value="None" checked>None-->
		      <!--<input class="form-element" type="radio" name="repeat" value="Weekly">Weekly-->
		      <!--<input class="form-element" type="radio" name="repeat" value="Monthly">Monthly-->
		    <!--</div>-->

		    <!--<div class="margin-top-20">-->
		      <!--<input class="form-element" type="checkbox" name="repeat_days" value="sun">Sun-->
		      <!--<input class="form-element" type="checkbox" name="repeat_days" value="mon">Mon-->
		      <!--<input class="form-element" type="checkbox" name="repeat_days" value="tue">Tue-->
		      <!--<input class="form-element" type="checkbox" name="repeat_days" value="wed">Wed-->
		      <!--<input class="form-element" type="checkbox" name="repeat_days" value="thur">Thu-->
		      <!--<input class="form-element" type="checkbox" name="repeat_days" value="fri">Fri-->
		      <!--<input class="form-element" type="checkbox" name="repeat_days" value="sat">Sat-->
		    <!--</div>-->
			<!---->
		    <!--<div class="margin-top-20">-->
		      <!--<h4>This event will repeat on the {date} of each month</h4>-->
		    <!--</div>-->
		
		    <button type="submit">Submit</button>

  		</form>`);
		//spawn a modal
		$('#edit-form').submit(function(event){
			event.preventDefault(); //prevent default action

			var post_url       = $(this).attr("action"); //get form action url
			var request_method = $(this).attr("method"); //get form GET/POST method
			var form_data      = $(this).serialize(); //Encode form elements for submission
			// var form_data = {"title": "herpderp",  _id:"583debef0aedb4039849cd4c"};//ERROR THROWING FORM DATA

			$.ajax({//CREATE
				url : post_url,
				method: request_method,
				data : form_data
			}).done(function(res){
				console.log(res);
				eventData(event_date);
			}).fail(function(xhr){
				var res = JSON.parse(xhr.responseText);
				alert(res.error.message || res.error.errmsg)
			})
		})


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
			if (arguments.length == 2){this.currdate  = new Date(yyyy,mm);}
			else if(arguments.length === 3){this.currdate  = new Date(yyyy,mm,dd);}
			else{this.currdate  = new Date();}
			this.year  = this.currdate.getFullYear();
			this.month = this.currdate.getMonth();
			this.day   = this.currdate.getDate();
		};
		this.getday = function(year, month, day){
			var getday;
			if (arguments.length == 2){

				getday = new Date(year, month).getDay();
			}
			if (arguments.length === 3){
				getday = new Date(year, month, day).getDay();
			}
			else{
				getday = new Date(this.year,this.month).getDay();
			}
			return this.days[d[getday]];
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
	}//dc is a date formatting and constructing object that stores dates
	//weekly only
	var nextWeekBtn = document.querySelector('#nextbtn');
	var prevWeekBtn = document.querySelector('#prevbtn');

	loadWeek();
	weeklyCalendar();

	nextWeekBtn.addEventListener('click',function(){
		weeklyCalendar('next');
	});
	prevWeekBtn.addEventListener('click',function(){
		weeklyCalendar('prev');
	});

	function loadWeek(){
		for (var x = 1; x <= 24; x++){
			var time = x <= 12 ? x + ":00 am" : (x-12)+":00 pm";

			$('#week_body').append(
				`<tr class='week_body_row'>
					<td class="color-white text-center"> ${ time } </td>
				</tr>`
			);

		}
		for(var y = 1; y <= 7; y++){

			$('.week_body_row').append(
				"<td class='week_times'></td>"
			)

		}
	}

	function weeklyCalendar(next){
		var calendar = $('.week_dates');//place to inject month days
		var currDate = queryDate;//from ejs <script>


		if(next){
				if(next === 'prev'){
					window.location.replace(window.location.origin +
						window.location.pathname + '?date=' +
						moment(queryDate).subtract(7,'days').format('YYYY-MM-DD'))
				}
				else if(next === 'next'){
					// $(location).attr('href', 'http://stackoverflow.com') //the
					window.location.replace(window.location.origin +
						window.location.pathname + '?date=' +
						moment(queryDate).add(7,'days').format('YYYY-MM-DD'))

				}

			}
		$.each(calendar, function(index, day){
			day.innerHTML = '';
			//TODO remove switch statement, make better
			//append numbers to calendar based on index + days to skip + number of days
			switch (index) {
				case 0:
					day.innerHTML = `${moment(currDate).subtract(3, 'days').format('dddd Do')}`;
					break;
				case 1:
					day.innerHTML = `${moment(currDate).subtract(2, 'days').format('dddd Do')}`;
					break;
				case 2:
					day.innerHTML = `${moment(currDate).subtract(1, 'days').format('dddd Do')}`;
					break;
				case 3:
					console.log(moment(currDate))
					day.innerHTML = `${moment(currDate).format('dddd Do')}`;
					break;
				case 4:
					day.innerHTML = `${moment(currDate).add(1, 'days').format('dddd Do')}`;
					break;
				case 5:
					day.innerHTML = `${moment(currDate).add(2, 'days').format('dddd Do')}`;
					break;
				case 6:
					day.innerHTML = `${moment(currDate).add(3, 'days').format('dddd Do')}`;
					break;
			}
		});
	}









	//old
	// function weeklyCalendar(next){
	//
	// 	var calendar  = $('.week_dates');//place to inject month days
	// 	var weekTitle = $('#week');//place to inject month name
	// 	var extraRow  = $('#extra_row');
	// 	//class set on the last rows of the month
	// 	//get current month
	// 	var m = dc.getmonth();
	// 	//get number of days in month and the first day of the month
	// 	var todaysDate = dc.day;
	// 	var today      = dc.getday(dc.year,dc.month, dc.day);
	//
	// 	if(next){
	// 		//if a button is pressed
	// 		if(next === 'next'){
	// 			dc.setdate(dc.year,dc.month, dc.day + 7);
	// 		}
	// 		else if(next === 'prev'){
	// 			console.log(dc.day - 7);
	// 			dc.setdate(dc.year,dc.month, dc.day - 7);
	// 		}
	// 		//set new date variables
	// 		m = dc.getmonth();
	// 		todaysDate = dc.day;
	// 		today      = dc.getday(dc.year,dc.month, dc.day);
	// 	}
	// 	//append name to calendar
	// 	weekTitle.empty().append(`${m[1]} ${dc.year}`);
	//
	// 	$.each(calendar, function(index, day){
	// 		day.innerHTML = '';
	// 		//append numbers to calendar based on index + days to skip + number of days
	// 		switch (true) {
	// 			case (index === 0):
	// 				day.innerHTML = `${dc.getday(dc.year,dc.month, dc.day - 3)[1]} ${new Date(dc.year,dc.month, todaysDate - 3).getDate()}`;
	// 				break;
	// 			case (index === 1):
	// 				day.innerHTML = `${dc.getday(dc.year,dc.month, dc.day - 2)[1]} ${new Date(dc.year,dc.month, todaysDate - 2).getDate()}`;
	// 				break;
	// 			case (index === 2):
	// 				day.innerHTML = `${dc.getday(dc.year,dc.month, dc.day - 1)[1]} ${new Date(dc.year,dc.month, todaysDate - 1).getDate()}`;
	// 				break;
	// 			case (index === 3):
	// 				day.innerHTML =  `${today[1]} ${todaysDate}`;
	// 				break;
	// 			case (index === 4):
	// 				day.innerHTML = `${dc.getday(dc.year,dc.month, dc.day + 1)[1]} ${todaysDate + 1 >= m[3] ? 1 : todaysDate + 1}`;
	// 				break;
	// 			case (index === 5):
	// 				day.innerHTML = `${dc.getday(dc.year,dc.month, dc.day + 2)[1]} ${todaysDate + 1 >= m[3] ? 2 : todaysDate + 2}`;
	// 				break;
	// 			case (index === 6):
	// 				day.innerHTML = `${dc.getday(dc.year,dc.month, dc.day + 3)[1]} ${todaysDate + 1 >= m[3] ? 3 : todaysDate + 3}`;
	// 				break;
	// 		}
	// 	});
	// }
});
