/**
 * Created by Kobe on 11/20/2016.
 */
$( document ).ready(function() {
	(function(){
		var sidebarGet      = document.querySelector(".sidebar-get-events");
		var sidebarOverlay  = document.querySelector(".sidebar-overlay");
		var dayOfMonth      = document.querySelectorAll(".month_dates");
		var sidebarDate     = document.querySelector(".get-event-date");
		var events          = $('.get-events');
		var calEvents       = [];


		$.ajax({
			method: "GET",
			url: "/events",
			success: function() {
				console.log('Success');
			},
			error: function() {
				console.log('Something went horribly wrong');
			}
		}).done(function() {
			});

		// events.on('click',".sidebar-remove-event", function(e){
		//
		// 	var remove = $(this).parent().attr("id");
		// 	console.log(remove)
		// 	var filterArr = calEvents.filter(myfunc);
		//
		// 	$(this).parent().remove();
		//
		// 	calEvents = filterArr;
		//
		// 	function myfunc(value){
		// 		return value._id !== remove
		// 	}
		// 	console.log(calEvents)
		// });

		dayOfMonth.forEach(function(day){
			day.addEventListener('click',function(e){

				var e_date = e.target.dataset._date;

				if(calEvents){

					for (var i = 0; i < calEvents.data.length; i++){
						console.log(e_date, calEvents.data[i].startDate);

						if(e_date == calEvents.data[i].startDate)
						{
							console.log(calEvents[i])

							events.append('<div class="sidebar-events" id="' + calEvents.data[i]._id + '">'+
								'<p class="sidebar-event-name margin-0">'+calEvents.data[i].title+'</p>'+
								'<button class="sidebar-remove-event">Remove</button>'+
								'</div>')

						}
					}

				}

				sidebarGet.classList.add('sidebar-show');
				sidebarOverlay.classList.remove('hide');
				sidebarDate.innerHTML = e_date || null;
			});
		});

		sidebarOverlay.addEventListener('click',function(){
			sidebarGet.classList.remove('sidebar-show');
			sidebarOverlay.classList.add('hide');
		});
	}());

});
