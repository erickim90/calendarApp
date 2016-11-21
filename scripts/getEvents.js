/**
 * Created by Kobe on 11/20/2016.
 */
(function(){
	var sidebarGet      = document.querySelector(".sidebar-get-events");
	var sidebarOverlay  = document.querySelector(".sidebar-overlay");
	var dayOfMonth      = document.querySelectorAll(".month_dates");

	dayOfMonth.forEach(function(day){
		day.addEventListener('click',function(){
			sidebarGet.classList.add('sidebar-show');
			sidebarOverlay.classList.remove('hide');
			console.log(day)
		});
	});

	sidebarOverlay.addEventListener('click',function(){
		sidebarGet.classList.remove('sidebar-show');
		sidebarOverlay.classList.add('hide');
	});
}());
