/**
 * Created by Kobe on 11/29/2016.
 */
/**
 * Created by Kobe on 11/28/2016.
 */
$( document ).ready(function() {
	//Required on all pages
	var getEvents    = $(".get-events");
	var createEvents = $(".create-events");
	var overlay      = $(".overlay");
	var createBtn    = $(".create-event-btn");

	overlay.on('click',function(){
		getEvents.removeClass('sidebar-show');
		createEvents.removeClass('sidebar-show');
		overlay.addClass('hide');
	});
	createBtn.on('click', function(){
		createEvents.addClass('sidebar-show');
		overlay.removeClass('hide');
	});
	$('#createEventForm').submit(function (event) {
		event.preventDefault();
		var form_data = $(this).serialize();
		$.ajax({
			url: '/events',
			method: 'POST',
			data: form_data
		}).done(function (res) {
			console.log(res);
			refreshData();
		}).fail(function (xhr) {
			console.log(xhr);
			alert(xhr.responseJSON.error.message);
		})
	});
	getEvents.on( "click", ".delete-event", function(e) {
		var event_id = e.currentTarget.id;
		$.ajax({
			url : `events/${event_id}`,
			method: 'delete'
		}).done(function(res){
			console.log(res);
			refreshData();
		}).fail(function(xhr){
			console.log(xhr);
			alert(xhr.responseJSON.error.message);
		})
	});
	getEvents.on( "click", ".patch-event", function(e) {
		var event_id = e.currentTarget.id;
		var title = e.currentTarget.dataset.title;
		var startDate = e.currentTarget.dataset.startdate;
		var endDate = e.currentTarget.dataset.enddate;
		var desc = e.currentTarget.dataset.desc;
		$(this).parent().empty().append(`<form id="edit-form"">
    		<h4 class="margin-0">Edit Event</h4>

    		<div class="margin-top-20 text-center">
    		  <label for="evtName">Event Name: </label>
    		  <input class="form-element" type="text" name="title" placeholder="Name of Event" id="evtName" value="${title}"/>
    		</div>

    		<div class="margin-top-20 text-center">
    		  <div class="inline-block">
    		    <label for="startDate">Start Time: </label>
    		    <input class="form-element" type="datetime-local" name="startDate" id="startDate" value="2016-12-12T08:00"/>
    		  </div>
    		</div>

    		<div class="margin-top-20 text-center">
    		  <div class="inline-block">
    		    <label for="endDate">End Time: </label>
    		    <input class="form-element" type="datetime-local" name="endDate" id="endDate" value="2016-12-12T12:00">
    		  </div>
    		</div>
    		<div class="margin-top-20 text-center">
    		  <label for="description">Description: </label>
    		  <textarea class="form-element" name="desc" placeholder="Description of event" id="description">${desc}</textarea>
    		</div>
		    <button type="submit">Submit</button>
  		</form>`);
		$('#edit-form').submit(function (event) {
			event.preventDefault(); //prevent default action
			var form_data = $(this).serialize(); //Encode form elements for submission

			$.ajax({
				url: `events/${event_id}`,
				method: 'patch',
				data: form_data
			}).done(function (res) {
				console.log(res);
				refreshData();
			}).fail(function (xhr) {
				console.log(xhr);
				alert(xhr.responseJSON.error.message);
			})
		})
	});
	//weekly only
	//'<%= queryDate %>'
	var nextWeekBtn  = $('#nextbtn');
	var prevWeekBtn  = $('#prevbtn');
	var weeklyEvents = [];
	loadWeek();
	weeklyCalendar();
	loadEvents();
	weekDateListeners();
	nextWeekBtn.on('click',function(){
		weeklyCalendar('next');
	});
	prevWeekBtn.on('click',function(){
		weeklyCalendar('prev');
	});
	function loadWeek(){
		var currDate = queryDate;
		for (var x = 0; x < 24; x++){
			// var time = x <= 12 ? x + ":00 am" : (x-12)+":00 pm";
			var time = moment().set('hour', x).set('minutes',0).format('hh a');
			var displayTime = moment().set('hour', x).set('minutes',0).format('hh:mm a');


			$('#week_body').append(
				`<tr class='week_body_row'>
					<td class="color-white text-center time-row" data-time="${time}"> ${ displayTime } </td>
				</tr>`
			);

		}
		for(var y = 0; y <= 6; y++){
			switch (y) {
				case 0:
					$('.week_body_row').append(
						`<td class='week_times' data-index='${moment(currDate).subtract(3, 'days').format("YYYY-MM-DD")}'></td>`
					);
					break;
				case 1:
					$('.week_body_row').append(
						`<td class='week_times' data-index='${moment(currDate).subtract(2, 'days').format("YYYY-MM-DD")}'></td>`
					);
					break;
				case 2:
					$('.week_body_row').append(
						`<td class='week_times' data-index='${moment(currDate).subtract(1, 'days').format("YYYY-MM-DD")}'></td>`
					);
					break;
				case 3:
					$('.week_body_row').append(
						`<td class='week_times' data-index='${moment(currDate).format("YYYY-MM-DD")}'></td>`
					);
					break;
				case 4:
					$('.week_body_row').append(
						`<td class='week_times' data-index='${moment(currDate).add(1, 'days').format("YYYY-MM-DD")}'></td>`
					);
					break;
				case 5:
					$('.week_body_row').append(
						`<td class='week_times' data-index='${moment(currDate).add(2, 'days').format("YYYY-MM-DD")}'></td>`
					);
					break;
				case 6:
					$('.week_body_row').append(
						`<td class='week_times' data-index='${moment(currDate).add(3, 'days').format("YYYY-MM-DD")}'></td>`
					);
					break;
			}
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
	function loadEvents(){
		$.ajax({//GET
			method: "GET",
			url: `/events?date=${queryDate}`
		}).done(function(data) {
			weeklyEvents = data.data;

			weeklyEvents.forEach(function(event){
				var startDate = moment(event.startDate);
				var endDate = moment(event.endDate);

				for(var i = 0; i < moment(endDate).diff(moment(startDate), 'hours'); i++){
					$('[data-time="'+moment(startDate).add(i, 'hours').format('hh a')+'"]')
						.siblings('[data-index="'+ moment(startDate).format("YYYY-MM-DD") +'"]')
						.addClass('week_event')
				}
			});
		}).fail(function(xhr){
			var res = JSON.parse(xhr.responseText);
			alert(res.error.message || res.error.errmsg)
		});
	}
	function weekDateListeners(){
		var weekDates = document.querySelectorAll(".week_times");//each day box

		weekDates.forEach(function(day){
			day.addEventListener('click',function(e){
				var _date = e.target.dataset.index;
				getEvents.addClass('sidebar-show');
				overlay.removeClass('hide');
				eventData(_date)
			});
		});

	}
	function eventData(_date){
		var events = $(".events");
		events.empty();
		$.ajax({//GET
			method: "GET",
			url: `/events/${_date}`,
			success: function() {},
		}).done(function(event) {
			if(event.data){
				for (var i = 0; i < event.data.length; i++){
					//see if passed in date are equal to any of the DBs event dates
					//format mongo date into yyyy-mm-dd
					if(_date == moment(event.data[i].startDate).format("YYYY-MM-DD")) {
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
													${moment(event.data[i].startDate).format('hh:mm a')} to
												</div>
												<div class='event-name' data-endDate="${event.data[i].endDate}">
													${moment(event.data[i].endDate).format('hh:mm a')}
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
	function refreshData(){
		$( ".week_event" ).each(function() {
			$( this ).removeClass("week_event");
		});
		weeklyCalendar();
		loadEvents();
		getEvents.removeClass('sidebar-show');
		createEvents.removeClass('sidebar-show');
		overlay.addClass('hide');
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
