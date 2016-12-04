/**
 * Created by kobe on 12/3/2016.
 */
$( document ).ready(function() {
    //Required on all pages
    var getEvents = document.querySelector(".get-events");
    var eventActions = $(".get-events");
    var createEvents = document.querySelector(".create-events");
    var overlay = document.querySelector(".overlay");
    var createBtn = document.querySelector(".create-event-btn");

    overlay.addEventListener('click', function () {
        getEvents.classList.remove('sidebar-show');
        createEvents.classList.remove('sidebar-show');
        overlay.classList.add('hide');
    });
    createBtn.addEventListener('click', function () {
        createEvents.classList.add('sidebar-show');
        overlay.classList.remove('hide');
    });
    $('#createEventForm').submit(function (event) {
        event.preventDefault(); //prevent default action

        var post_url = $(this).attr("action"); //get form action url
        var request_method = $(this).attr("method"); //get form GET/POST method
        var form_data = $(this).serialize(); //Encode form elements for submission
        // var form_data = {"title": "herpderp",  _id:"583debef0aedb4039849cd4c"};//ERROR THROWING FORM DATA

        $.ajax({//CREATE
            url: post_url,
            method: request_method,
            data: form_data
        }).done(function (res) {
            alert('event created')
        }).fail(function (xhr) {
            var res = JSON.parse(xhr.responseText);
            alert(res.error.message || res.error.errmsg)
        });

    });
    eventActions.on("click", ".delete-event", function (e) {
        var self = this;
        var event_id = e.currentTarget.id;
        $.ajax({//DELETE
            url: `events/${event_id}`,
            method: 'delete'
        }).done(function (res) {
            $(self).parent().remove()
        }).fail(function (xhr) {
            var res = JSON.parse(xhr.responseText);
            alert(res.error.message || res.error.errmsg)
        })
    });
    eventActions.on("click", ".patch-event", function (e) {
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
        $('#edit-form').submit(function (event) {
            event.preventDefault(); //prevent default action

            var post_url = $(this).attr("action"); //get form action url
            var request_method = $(this).attr("method"); //get form GET/POST method
            var form_data = $(this).serialize(); //Encode form elements for submission
            // var form_data = {"title": "herpderp",  _id:"583debef0aedb4039849cd4c"};//ERROR THROWING FORM DATA

            $.ajax({//CREATE
                url: post_url,
                method: request_method,
                data: form_data
            }).done(function (res) {
                console.log(res);
                eventData(event_date);
            }).fail(function (xhr) {
                var res = JSON.parse(xhr.responseText);
                alert(res.error.message || res.error.errmsg)
            })
        })


    });

    //daily
    //'<%= queryDate %>'
    var nextDayBtn  = document.querySelector('#nextbtn');
    var prevDayBtn  = document.querySelector('#prevbtn');
    nextDayBtn.addEventListener('click',function(){
        dailyCalendar('next');
    });
    prevDayBtn.addEventListener('click',function(){
        dailyCalendar('prev');
    });
    loadDay();
    dailyCalendar();
    loadEvents();
    DateListeners();

    function loadDay(){
        var currDate = queryDate;
        for (var x = 0; x < 24; x++){
            var time = moment().set('hour', x).set('minutes',0).format('hh a');
            var displayTime = moment().set('hour', x).set('minutes',0).format('hh:mm a');
            $('#day_body').append(
                `<tr class='day_body_row'>
					<td class="color-white text-center time-row day_time" data-time="${time}"> ${ displayTime } </td>
				    <td class='day_hours' data-index='${moment(currDate).format("YYYY-MM-DD")}'></td>
				</tr>`
            );

        }
    }
    function dailyCalendar(next){
        var currDate = queryDate;//from ejs <script>
        if(next){
            if(next === 'prev'){
                window.location.replace(window.location.origin +
                    window.location.pathname + '?date=' +
                    moment(queryDate).subtract(1,'days').format('YYYY-MM-DD'))
            }
            else if(next === 'next'){
                // $(location).attr('href', 'http://stackoverflow.com') //the
                window.location.replace(window.location.origin +
                    window.location.pathname + '?date=' +
                    moment(queryDate).add(1,'days').format('YYYY-MM-DD'))
            }
        }
        $('.day_date')[0].innerHTML = `${moment(queryDate).format('dddd MMMM Do YYYY')}`;
    }
    function loadEvents(){
        $.ajax({//GET
            method: "GET",
            url: `/events/oneday?date=${queryDate}`
        }).done(function(data) {
            console.log(data)
            dayEvents = data.data;

            // console.log(moment('2016-12-01T21:00:00.000Z').format('hh a'))
            // console.log(moment('2016-12-01T21:00:00.000Z').add(0, 'hours').format('hh a'))
            // console.log(moment('2016-12-01T21:00:00.000Z').add(1, 'hours').format('hh a'))

            dayEvents.forEach(function(event){
                var startDate = moment(event.startDate).utcOffset(0);
                var endDate = moment(event.endDate).utcOffset(0);

                for(var i = 0; i < moment(endDate).diff(moment(startDate), 'hours'); i++){
                    $('[data-time="'+moment(startDate).add(i, 'hours').format('hh a')+'"]')
                        .siblings()
                        .addClass('day_event')
                }
            });
        }).fail(function(xhr){
            console.log(xhr);
            // var res = JSON.parse(xhr.responseText);
            // alert(res.error.message || res.error.errmsg)
        });
    }
    function DateListeners(){
        var dayHours = document.querySelectorAll(".day_hours");//each day box

        dayHours.forEach(function(day){
            day.addEventListener('click',function(e){
                var _date = e.target.dataset.index;
                getEvents.classList.add('sidebar-show');
                overlay.classList.remove('hide');
                console.log(_date)
                eventData(_date);
            });
        });

    }
    function eventData(_date){
        var events = $(".events");
        events.empty();
        $.ajax({//GET
            method: "GET",
            url: `/events/${_date}`,
            success: function() {console.log('Success');},
        }).done(function(event) {
            console.log(event)
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
});