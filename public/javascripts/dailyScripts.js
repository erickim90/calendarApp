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
        var form_data = $(this).serialize(); //Encode form elements for submission
        $.ajax({//CREATE
            url: '/events',
            method: 'POST',
            data: form_data
        }).done(function (res) {
            alert(res.data.message);
            eventData(moment(queryDate).format("YYYY-MM-DD"));
        }).fail(function (xhr) {
            alert(xhr.responseJSON.data.message)
        })
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
    		    <input class="form-element" type="datetime-local" name="startDate" id="startDate"/>
    		  </div>
    		</div>

    		<div class="margin-top-20 text-center">
    		  <div class="inline-block">
    		    <label for="endDate">End Time: </label>
    		    <input class="form-element" type="datetime-local" name="endDate" id="endDate">
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
        $('#edit-form').submit(function (event) {
            event.preventDefault(); //prevent default action
            var form_data = $(this).serialize(); //Encode form elements for submission

            $.ajax({//CREATE
                url: `events/${event_id}`,
                method: 'patch',
                data: form_data
            }).done(function (res) {
                alert(res.data.message);
                eventData(moment(queryDate).format("YYYY-MM-DD"));
            }).fail(function (xhr) {
                alert(xhr.responseJSON.data.message)
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
            dayEvents = data.data;

            dayEvents.forEach(function(event){
                var startDate = moment(event.startDate);
                var endDate = moment(event.endDate);

                for(var i = 0; i < moment(endDate).diff(moment(startDate), 'hours'); i++){
                    $('[data-time="'+moment(startDate).add(i, 'hours').format('hh a')+'"]')
                        .siblings()
                        .addClass('day_event')
                }
            });
        }).fail(function(xhr){
            console.log(xhr);
            var res = JSON.parse(xhr.responseText);
            alert(res.error.message || res.error.errmsg)
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
            url: `/events/${_date}`
        }).done(function(event) {
            if(event.data){
                for (var i = 0; i < event.data.length; i++){
                    //see if passed in date are equal to any of the DBs event dates
                    //format mongo date into yyyy-mm-dd
                    console.log(moment(_date).isBetween(
                        moment(event.data[i].startDate).startOf('day'),
                        moment(event.data[i].startDate).endOf('day')
                    ))

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