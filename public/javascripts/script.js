$(document).ready(function(){
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
				console.log(res)
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
	}//dc is a date formatting and constructing object that stores dates

	//Monthly view only
	var nextMonthBtn = document.querySelector('#nextbtn');
	var prevMonthBtn = document.querySelector('#prevbtn');
	loadMonth(monthlyCalendar);
	monthDateListeners();
	loadEvents();

	nextMonthBtn.addEventListener('click',function(){
		monthlyCalendar('next');
		loadEvents();
	});
	prevMonthBtn.addEventListener('click',function(){
		monthlyCalendar('prev');
		loadEvents();
	});

	function loadMonth(monthlyCalendar){
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

		monthlyCalendar();
	}
	function monthlyCalendar(month){

		var calendar  = $('.month_dates');//place to inject month days
		var monthName = $('#month_name');//place to inject month name
		var extraRow  = $('#extra_row');//class set on the last rows of the month
		//get current month
		var m = dc.getmonth();
		//get number of days in month and the first day of the month
		var numOfDays = m[3];
		var skipDays = dc.getday()[0];

		if(month){
			//if a button is pressed
			if(month === 'next'){
				dc.setdate(dc.year,dc.month + 1)
			}
			else if(month === 'prev'){
				dc.setdate(dc.year,dc.month - 1)
			}
			//set new date variables
			m = dc.getmonth();
			numOfDays = m[3];
			skipDays = dc.getday()[0];
		}
		//append name to calendar
		monthName.empty().append(`${m[1]} ${dc.year}`);
		$.each(calendar, function(index, day){
			day.innerHTML = '';
			day.dataset._date = '';
			//append numbers to calendar based on index + days to skip + number of days
			if(numOfDays + skipDays < 36){
				extraRow.hide();
			}
			else{
				extraRow.show();
			}
			if(index < skipDays){
				// load last days of the previous month
			}
			else if(index >= numOfDays + skipDays) {
				// load first days of the next month
			}
			else{
				day.dataset._date = dc.ymd(dc.year,dc.month + 1,index - skipDays + 1);
				day.innerHTML = index - skipDays + 1;
			}
		});
	}
	//REQUIRES loadMonth
	function monthDateListeners(){
		var monthDates 	 = document.querySelectorAll(".month_dates");//each day box

		monthDates.forEach(function(day){
			day.addEventListener('click',function(e){
				var _date = e.target.dataset._date;
				getEvents.classList.add('sidebar-show');
				overlay.classList.remove('hide');
				eventData(_date)
			});
		});
	}
	function eventData(_date){
		var events = $(".events");
		events.empty();
		//get events and load to sidebar
		$.ajax({//GET
			method: "GET",
			url: "/events",
			success: function() {console.log('Success');},
		}).done(function(event) {
			if(event.data){
				for (var i = 0; i < event.data.length; i++){
					//see if passed in date are equal to any of the DBs event dates
					//format mongo date into yyyy-mm-dd
					if(_date == dc.yyyymmdd(event.data[i].startDate)) {
						//append to sidebar
						events.append(`<div class='event'>
											<div class="editable"  >
												<div class='event-name'>
													${event.data[i].title}
												</div>
												<div class='event-desc'>
													${event.data[i].desc}
												</div>
												<div class='event-name'">
													${dc.jqformat(event.data[i].startDate)}
												</div>
												<div class='event-name' data-endDate="${event.data[i].endDate}">
													${dc.jqformat(event.data[i].endDate)}
												</div>
												<button class='delete-event' id='${event.data[i]._id}'>Remove</button>
												<button class='patch-event' 
													id='${event.data[i]._id}' 
													data-_date='${_date}'
													data-title="${event.data[i].title}"
													data-desc="${event.data[i].desc}"
													data-startdate="${event.data[i].startDate}"
													data-enddate="${event.data[i].endDate}">Update
												</button>
											</div>
										</div>`)
					}
				}
			}
		}).fail(function(xhr){
			var res = JSON.parse(xhr.responseText);
			alert(res.error.message || res.error.errmsg)
		})
	}
	function loadEvents(){
		$.ajax({//GET
			method: "GET",
			url: "/events",
			success: function() {console.log('Success');},
		}).done(function(event) {
			for (var i = 0; i < event.data.length; i++){
				var eventDate = dc.yyyymmdd(event.data[i].startDate);
				var month = $('.month_dates');
				month.each(function(day){
					if($(this).attr('data-_date') == eventDate){
						$(this).append(`<p style="font-size:10px;">${event.data[i].title}</p>`)
					}
				});
			}
		}).fail(function(xhr){
			var res = JSON.parse(xhr.responseText);
			alert(res.error.message || res.error.errmsg)
		});
	}

});