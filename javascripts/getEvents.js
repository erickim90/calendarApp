/**
 * Created by Kobe on 11/20/2016.
 */
(function(){
	var sidebarGet      = document.querySelector(".sidebar-get-events");
	var sidebarOverlay  = document.querySelector(".sidebar-overlay");
	var dayOfMonth      = document.querySelectorAll(".month_dates");
	var sidebarDate     = document.querySelector(".get-event-date");

	dayOfMonth.forEach(function(day){
		day.addEventListener('click',function(e){
			sidebarGet.classList.add('sidebar-show');
			sidebarOverlay.classList.remove('hide');
			sidebarDate.innerHTML = e.target.dataset._date || null;
		});
	});

	sidebarOverlay.addEventListener('click',function(){
		sidebarGet.classList.remove('sidebar-show');
		sidebarOverlay.classList.add('hide');
	});
}());
